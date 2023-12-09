import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Card, ListGroup, Nav } from "react-bootstrap";

function EmployeeHomeComponent(props) {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const uid = localStorage.getItem("id");
  const eid = parseInt(uid, 10) + 1;
  

  useEffect(() => {
   

  

    axios.get(`http://localhost:5050/project/getAll/employee/${eid}`)
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Error in Fetching projects:", error));
  }, [eid]);

  

  return (
    <div className="container mt-4">
    <Card>
      <Card.Header className="bg-primary text-white">Projects</Card.Header>
      <ListGroup variant="flush">
        {projects.map((p, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
            <Nav.Link onClick={() => navigate("/employee/backlog/sprint/tasks&pid=" + p.id)}>
              {p.title}
            </Nav.Link>
            <span className="text-muted"><strong>Status:  </strong>{p.status}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
    <div className="mt-4"></div>
  </div>
  );
}

export default EmployeeHomeComponent;