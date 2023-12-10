import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, ListGroup, Nav, Form, FormControl, Row, Col, Modal, Button } from "react-bootstrap";

function ManagerHome(props) {
  // State for storing projects, search query, and search results
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // State for managing the project update modal
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateStartDate, setUpdateStartDate] = useState("");
  const [updateEndDate, setUpdateEndDate] = useState("");

  // Navigate function for handling redirection
  const navigate = useNavigate();

  // Get manager ID from local storage
  const uid = localStorage.getItem("id");
  const mid = parseInt(uid, 10) + 1;

  // useEffect to fetch projects based on search query or all projects
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      axios.get(`http://localhost:5050/search/project/${searchQuery}`)
        .then((response) => setSearchResults(response.data))
        .catch((error) => console.error("Error in Fetching search results:", error));
    } else {
      axios.get(`http://localhost:5050/project/getAll/manager/${mid}`)
        .then((response) => setProjects(response.data))
        .catch((error) => console.error("Error in Fetching projects:", error));
    }
  }, [mid, searchQuery]);

  // Function to handle form submission for searching
  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim().length > 0) {
      axios.get(`http://localhost:5050/search/project/${searchQuery}`)
        .then((response) => setSearchResults(response.data))
        .catch((error) => console.error("Error in Fetching search results:", error));
    } else {
      axios.get(`http://localhost:5050/project/getAll/manager/${mid}`)
        .then((response) => setProjects(response.data))
        .catch((error) => console.error("Error in Fetching projects:", error));
    }
  };

  // Function to handle opening the project update modal
  const handleShowModal = (project) => {
    setSelectedProject(project);
    setUpdateTitle(project.title);
    setUpdateDescription(project.description);
    setUpdateStartDate(project.startDate);
    setUpdateEndDate(project.endDate);
    setShowModal(true);
  };

  // Function to handle closing the project update modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Function to handle updating the project
  const handleUpdateProject = () => {
    const updatedProject = {
      
      title: updateTitle,
      description: updateDescription,
      startDate: updateStartDate,
      endDate: updateEndDate,
      // Add other fields as needed
    };

    axios.put("http://localhost:5050/project/update/"+selectedProject.id, updatedProject)
      .then((response) => {
        handleCloseModal();
        axios.get(`http://localhost:5050/project/getAll/manager/${mid}`)
          .then((response) => setProjects(response.data))
          .catch((error) => console.error("Error in Fetching projects:", error));
      })
      .catch((error) => console.error("Error updating project:", error));
  };

  return (
    
    
    <div className="container mt-4 ">
      {/* Header Row */}
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
            {/* Display the project title and status in the same line */}
            <div className="d-flex align-items-center">
              <Nav.Link onClick={() => navigate("/backlog/sprint/tasks&pid=" + p.id)}>{p.title}</Nav.Link>
              <span className="ml-3" style={{ marginLeft: 'auto' }}>{/* Move status to the right */}Status: {p.status}</span>
            </div>
          </div>
          <div>
            {/* Move the "Update" button to the right side */}
            <Button variant="info" size="sm" onClick={() => handleShowModal(p)}>Update</Button>
          </div>
        </ListGroup.Item>
      ))
    ) : (
      // Display all projects
      projects.map((p, index) => (
        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
          <div>
            {/* Display the project title and status in the same line */}
            <div className="d-flex align-items-center">
              <Nav.Link onClick={() => navigate("/backlog/sprint/tasks&pid=" + p.id)}>{p.title}</Nav.Link>

              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="ml-3" style={{ textAlign:"center" }}>{/* Move status to the right */}Status: {p.status}</span>
            </div>
          </div>
          <div>
            {/* Move the "Update" button to the right side */}
            <Button variant="info" size="sm" onClick={() => handleShowModal(p)}>Update</Button>
          </div>
        </ListGroup.Item>
      ))
    )}
  </ListGroup>
</Card>
      {/* Add Project Button */}
      <div className="mt-4">
        <button className="btn btn-primary" onClick={() => navigate("/post/project")}>
          Add Project
        </button>
      </div>

      {/* Project Update Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" >
  <Modal.Header closeButton>
    <Modal.Title>Update Project</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="updateTitle">
        <Form.Label>Update Title:</Form.Label>
        <Form.Control type="text" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="updateDescription">
        <Form.Label>Update Long Description:</Form.Label>
        <Form.Control as="textarea" rows={3} value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="updateStartDate">
        <Form.Label>Update Start Date:</Form.Label>
        <Form.Control type="date" value={updateStartDate} onChange={(e) => setUpdateStartDate(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="updateEndDate">
        <Form.Label>Update End Date:</Form.Label>
        <Form.Control type="date" value={updateEndDate} onChange={(e) => setUpdateEndDate(e.target.value)} />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Close
    </Button>
    <Button variant="primary" onClick={handleUpdateProject}>
      Update
    </Button>
  </Modal.Footer>
</Modal>
    </div>
    
    
  );
}

export default ManagerHome;
