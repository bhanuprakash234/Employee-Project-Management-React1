import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ProjectEmployeeComponent() {
  const [projects, setProjects] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const uid = localStorage.getItem('id');
    const mid = parseInt(uid, 10) + 1;

    axios.get(`http://localhost:5050/employeeproject/manager/${mid}`)
      .then(response => setProjects(response.data))
      .catch(error => setMsg('Error in Fetching projects'));
  }, []);

  const renderProjects = () => {
    const groupedProjects = {};

    projects.forEach(p => {
      const projectId = p.project.id;

      if (groupedProjects[projectId]) {
        groupedProjects[projectId].employees.push(p.employee.name);
      } else {
        groupedProjects[projectId] = {
          ...p.project,
          employees: [p.employee.name],
        };
      }
    });

    return Object.values(groupedProjects).map((p, index) => (
      <Card key={index} className="mb-3">
        <Card.Body>
          <Card.Title>{p.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{p.startDate} - {p.endDate}</Card.Subtitle>
          <Card.Text>{p.longDesc}</Card.Text>
          <Card.Text><strong>Employees: </strong>{p.employees.join(', ')}</Card.Text>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Employee Projects</h2>
      {projects.length > 0 ? (
        <div>{renderProjects()}</div>
      ) : (
        <div className="text-center mt-4">
          <p>No projects found for the manager.</p>
        </div>
      )}
      <div className="text-center mt-3">
        <Button variant="primary" onClick={() => navigate('/post/employee/project')}>
          Add Employee to Project
        </Button>
      </div>
    </Container>
  );
}

export default ProjectEmployeeComponent;