import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, ListGroup, Nav, Form, FormControl, Row, Col, Modal, Button } from "react-bootstrap";

function ManagerHome(props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateStartDate, setUpdateStartDate] = useState("");
  const [updateEndDate, setUpdateEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [projectsByStatus, setProjectsByStatus] = useState({
    TO_DO: [],
    IN_PROGRESS: [],
    DONE: [],
  });
  const navigate = useNavigate();
  const uid = localStorage.getItem("id");
  const mid = parseInt(uid, 10) + 1;

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      axios.get(`http://localhost:5050/search/project/${searchQuery}`)
        .then((response) => setSearchResults(response.data))
        .catch((error) => console.error("Error in Fetching search results:", error));
    } else {
      axios.get(`http://localhost:5050/project/getAll/manager/${mid}`)
        .then((response) => {
          const organizedProjects = organizeProjectsByStatus(response.data);
          setProjectsByStatus(organizedProjects);
        })
        .catch((error) => console.error("Error in Fetching projects:", error));
    }
  }, [mid, searchQuery]);

  const organizeProjectsByStatus = (projects) => {
    const organizedProjects = {
      TO_DO: [],
      IN_PROGRESS: [],
      DONE: [],
    };

    projects.forEach((project) => {
      organizedProjects[project.status].push(project);
    });

    return organizedProjects;
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim().length > 0) {
      axios.get(`http://localhost:5050/search/project/${searchQuery}`)
        .then((response) => setSearchResults(response.data))
        .catch((error) => console.error("Error in Fetching search results:", error));
    } else {
      axios.get(`http://localhost:5050/project/getAll/manager/${mid}`)
        .then((response) => {
          const organizedProjects = organizeProjectsByStatus(response.data);
          setProjectsByStatus(organizedProjects);
        })
        .catch((error) => console.error("Error in Fetching projects:", error));
    }
  };

  const handleShowModal = (project) => {
    setSelectedProject(project);
    setUpdateTitle(project.title);
    setUpdateDescription(project.description);
    setUpdateStartDate(project.startDate);
    setUpdateEndDate(project.endDate);
    setSelectedStatus(project.status);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdateProject = () => {
    const updatedProject = {
      title: updateTitle,
      description: updateDescription,
      startDate: updateStartDate,
      endDate: updateEndDate,
      status: selectedStatus,
    };

    axios.put(`http://localhost:5050/project/update/${selectedProject.id}`, updatedProject)
      .then((response) => {
        handleCloseModal();
        axios.get(`http://localhost:5050/project/getAll/manager/${mid}`)
          .then((response) => {
            const organizedProjects = organizeProjectsByStatus(response.data);
            setProjectsByStatus(organizedProjects);
          })
          .catch((error) => console.error("Error in Fetching projects:", error));
      })
      .catch((error) => console.error("Error updating project:", error));
  };

  return (
    <div className="container mt-4">
      <Row className="mb-3">
        <Col>
          <h2>Projects</h2>
        </Col>
        
      </Row>

      <Card>
        <Card.Header className="bg-primary text-white">Projects</Card.Header>
        <ListGroup variant="flush">
          {Object.keys(projectsByStatus).map((status) => (
            <React.Fragment key={status}>
              <ListGroup.Item className="bg-light">
                <h5>{status}</h5>
              </ListGroup.Item>
              {projectsByStatus[status].map((p, index) => (
                <Card key={index} className="mb-3">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Nav.Link onClick={() => navigate("/backlog/sprint/tasks&pid=" + p.id)}>
                        {p.title}
                      </Nav.Link>
                    </div>
                    <div className="d-flex align-items-center">
                      <Button variant="info" size="sm" onClick={() => handleShowModal(p)}>
                        Update
                      </Button>
                    </div>
                  </ListGroup.Item>
                </Card>
              ))}
            </React.Fragment>
          ))}
        </ListGroup>
      </Card>

      <div className="mt-4">
        <button className="btn btn-primary" onClick={() => navigate("/post/project")}>
          Add Project
        </button>
      </div>
      
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
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
            <Form.Group controlId="updateStatus">
              <Form.Label>Update Status:</Form.Label>
              <Form.Control as="select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="TO_DO">TO-DO</option>
                <option value="IN_PROGRESS">IN-PROGRESS</option>
                <option value="DONE">DONE</option>
              </Form.Control>
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
