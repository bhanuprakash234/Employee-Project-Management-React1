import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar, Toast } from "react-bootstrap";
import { useNavigate } from "react-router";

function EmployeeNavbar() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notifications when the component mounts
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Replace 'employeeId' with the actual employee ID from your application
      const uid = localStorage.getItem("id");
      const eid = parseInt(uid, 10) + 1;

      const response = await axios.get('http://localhost:5050/receiveNotification/'+eid);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const handleToastClick = () => {
    // Fetch notifications when the toast is clicked
    fetchNotifications();
    setShow(false); // Close the toast after clicking
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#"></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link onClick={() => navigate('/employee/dashboard?page=home')}>Home</Nav.Link>
              <Nav.Link onClick={() => navigate('/employee/dashboard?page=your_work')}>Your Work</Nav.Link>
            </Nav>
            <Nav className="d-flex align-items-center">
              <Navbar.Text className="me-3">
                Signed in as: <span style={{ color: "white" }}>{localStorage.getItem('username')}</span>
              </Navbar.Text>
              {/* Notification Toast */}
              <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide onClick={handleToastClick}>
                <Toast.Header></Toast.Header>
                <Toast.Body>
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notification, index) => (
                      <div key={index}>
                        <div>{notification.message}</div>
                        <div style={{ color: "gray", fontSize: "12px" }}>{notification.date}
                        <hr /> 
                        </div>
                      </div>
                    ))
                  ) : (
                    "No new notifications"
                  )}
                </Toast.Body>
              </Toast>
              <Button onClick={() => setShow(true)} className="btn-sm">
                Notifications
              </Button>
              &nbsp;&nbsp;&nbsp;
              
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

export default EmployeeNavbar;