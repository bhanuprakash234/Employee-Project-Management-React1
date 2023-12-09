import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ManagerSideBar from "./sidebar";

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
      <tr key={index}>
        <td>{p.title}</td>
        <td>{p.employees.join(', ')}</td>
        <td>{p.longDesc}</td>
        <td>{p.startDate}</td>
        <td>{p.endDate}</td>
      </tr>
    ));
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Employee Projects</h2>
      {projects.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Project Title</th>
              <th>Employees</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>{renderProjects()}</tbody>
        </Table>
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
