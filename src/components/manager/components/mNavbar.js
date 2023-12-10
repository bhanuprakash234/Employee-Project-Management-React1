import React, { useState } from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router";

function ManagerNavbar({ func }) {
  const [show, setShow] = useState('');
  const navigate = useNavigate();

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#"></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link onClick={() => navigate('/manager/dashboard?page=home')}>Home</Nav.Link>
              <Nav.Link onClick={() => navigate('/manager/dashboard?page=employees')}>Employees</Nav.Link>
              <Nav.Link onClick={() => navigate('/manager/dashboard?page=project')}>Project</Nav.Link>
              
            </Nav>
            <Nav className="d-flex align-items-center">
              <Navbar.Text className="me-3">
                Signed in as: <span style={{ color: "white" }}>{localStorage.getItem('username')}</span>
              </Navbar.Text>
              <Nav.Link onClick={() => navigate('/manager/dashboard?page=your_profile')}>Your Profile</Nav.Link>&nbsp;&nbsp;

              
              <Button
                variant="outline-light"
                onClick={() => {
                  localStorage.clear();
                  navigate('/auth/login?msg=you have logged out..');
                }}
                className="btn-logout"
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default ManagerNavbar;
