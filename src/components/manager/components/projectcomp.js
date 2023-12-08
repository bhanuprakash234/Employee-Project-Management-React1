import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ManagerSideBar from "./sidebar";

function ProjectEmployeeComponent() {
  const [project, setProject] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const uid = localStorage.getItem('id');
    const mid = parseInt(uid, 10) + 1;

    axios.get(`http://localhost:5050/employeeproject/manager/${mid}`)
      .then(response => setProject(response.data))
      .catch(error => setMsg('Error in Fetching projects'));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Employee Projects</h2>
      {project.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Project Title</th>
              <th>Employee</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {project.map((p, index) => (
              <tr key={index}>
                <td>{p.project.title}</td>
                <td>{p.employee.name}</td>
                <td>{p.project.longDesc}</td>
                <td>{p.project.startDate}</td>
                <td>{p.project.endDate}</td>
              </tr>
            ))}
          </tbody>
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