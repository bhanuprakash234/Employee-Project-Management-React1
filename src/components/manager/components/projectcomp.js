import React, { useEffect, useState } from "react";
import { Button, Card, Container, FormControl, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProjectEmployeeComponent() {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const uid = localStorage.getItem('id');
    const mid = parseInt(uid, 10) + 1;

    axios.get(`http://localhost:5050/employeeproject/manager/${mid}`)
      .then(response => setProjects(response.data))
      .catch(error => setMsg('Error in Fetching projects'));
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      axios.get(`http://localhost:5050/search/project/${searchQuery}`)
        .then(response => setSearchResults(response.data))
        .catch(error => {
          console.error("Error in searching projects:", error);
          setMsg('Error in searching projects');
        });
    } else {
      setSearchResults([]);
    }
  };

  const renderProjects = (projectsToRender) => {
    const groupedProjects = {};

    projectsToRender.forEach(p => {
      if (p.project && p.employee) {
        const projectId = p.project.id;

        if (groupedProjects[projectId]) {
          groupedProjects[projectId].employees.push(p.employee.name);
        } else {
          groupedProjects[projectId] = {
            ...p.project,
            employees: [p.employee.name],
          };
        }
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
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by project name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline-secondary" onClick={handleSearch}>Search</Button>
      </InputGroup>
      {msg && <p className="text-danger">{msg}</p>}
      {searchResults.length > 0 ? (
        <div>{renderProjects(searchResults)}</div>
      ) : (
        projects.length > 0 ? (
          <div>{renderProjects(projects)}</div>
        ) : (
          <div className="text-center mt-4">
            <p>No projects found for the manager.</p>
          </div>
        )
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
