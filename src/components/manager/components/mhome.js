import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, ListGroup, Nav, Form, FormControl, Row, Col } from "react-bootstrap";

function ManagerHome(props) {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const uid = localStorage.getItem("id");
  const mid = parseInt(uid, 10) + 1;

  useEffect(() => {
    // Fetch projects based on the search query
    if (searchQuery.trim().length > 0) {
      axios.get(`http://localhost:5050/search/project/${searchQuery}`)
        .then((response) => setSearchResults(response.data))
        .catch((error) => console.error("Error in Fetching search results:", error));
    } else {
      // Fetch all projects if the search query is empty
      axios.get(`http://localhost:5050/project/getAll/manager/${mid}`)
        .then((response) => setProjects(response.data))
        .catch((error) => console.error("Error in Fetching projects:", error));
    }
  }, [mid, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission

    // Trigger search when pressing Enter
    if (searchQuery.trim().length > 0) {
      axios.get(`http://localhost:5050/search/project/${searchQuery}`)
        .then((response) => setSearchResults(response.data))
        .catch((error) => console.error("Error in Fetching search results:", error));
    } else {
      // Fetch all projects if the search query is empty
      axios.get(`http://localhost:5050/project/getAll/manager/${mid}`)
        .then((response) => setProjects(response.data))
        .catch((error) => console.error("Error in Fetching projects:", error));
    }
  };

  return (
    <div className="container mt-4">
      <Row className="mb-3">
        <Col>
          <h2>Projects</h2>
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-end">
          {/* Search bar */}
          <Form onSubmit={handleSearch} className="w-100">
            <FormControl
              type="text"
              placeholder="Search by project name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>
        </Col>
      </Row>

      {/* Display search results or all projects based on the search query */}
      <Card>
  <Card.Header className="bg-primary text-white">Projects</Card.Header>
  <ListGroup variant="flush">
    {searchQuery.trim().length > 0 ? (
      // Display search results
      searchResults.map((p, index) => (
        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
          <div>
            <Nav.Link onClick={() => navigate("/backlog/sprint/tasks&pid=" + p.id)}>{p.title}</Nav.Link>
          </div>
          <div className="text-right">
            {/* Display the project status here */}
            Status: {p.status}
          </div>
        </ListGroup.Item>
      ))
    ) : (
      // Display all projects
      projects.map((p, index) => (
        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
          <div>
            <Nav.Link onClick={() => navigate("/backlog/sprint/tasks&pid=" + p.id)}>{p.title}</Nav.Link>
          </div>
          <div className="text-right">
            {/* Display the project status here */}
            Status: {p.status}
          </div>
        </ListGroup.Item>
      ))
    )}
  </ListGroup>
</Card>

      <div className="mt-4">
        <button className="btn btn-primary" onClick={() => navigate("/post/project")}>
          Add Project
        </button>
      </div>
    </div>
  );
}

export default ManagerHome;
