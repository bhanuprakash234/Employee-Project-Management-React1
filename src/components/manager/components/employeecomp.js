import React, { useState } from "react";
import { Card, Container, Row, Col, Button, Nav, Modal } from "react-bootstrap";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ManagerEmployeeComponent() {
  const [param] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size,] = useState(9);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const uid = localStorage.getItem('id');
    const mid = parseInt(uid, 10) + 1;

    axios.get(`http://localhost:5050/employee/manager/${mid}?page=${page}&size=${size}`)
      .then(response => {
        console.log(response.data);
        const responseData = response.data.content || [];
        setEmployees(responseData);
      })
      .catch(error => {
        setMsg('Error in Fetching employees');
      });
  }, [page, size]);

  const handleEmployeeClick = (employee) => {
    const employeeId = employee.id;

    axios.get(`http://localhost:5050/employee/one/${employeeId}`)
      .then(response => {
        console.log('Employee details:', response.data);
        setEmployeeDetails(response.data);
        setShowModal(true);
      })
      .catch(error => {
        console.error('Error fetching employee details', error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteEmployee = () => {
    if (employeeDetails) {
      const employeeId = employeeDetails.id;

      axios.delete(`http://localhost:5050/employee/delete/${employeeId}`)
        .then(response => {
          console.log('Employee deleted successfully');
          setShowModal(false);
        })
        .catch(error => {
          console.error('Error deleting employee', error);
        });
    }
  };

  const getEmployees = (direction) => {
    let temp = page;
    if (direction === 'prev') {
      setPage(--temp);
    } else {
      setPage(++temp);
    }
  }

  return (
    <div>
      <Container fluid className="mt-4">
        <Row>
          {employees.map((employee, index) => (
            <Col key={index} lg={4} md={6} sm={12} className="mb-3">
              <Card style={{ backgroundColor: '#f0f0f0' }} onClick={() => handleEmployeeClick(employee)}>
                <Card.Body>
                  <Card.Title><strong>{employee.name}</strong></Card.Title>
                  <Card.Text>
                    <p><strong>{employee.jobTitle}</strong></p>
                    <p>{employee.user.email}</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row className="mt-3">
          <Col>
            <Button variant="primary" onClick={() => navigate('/employee/post')}>
              Add Employee
            </Button>
          </Col>
        </Row>
      </Container>

      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className="page-item ">
            {page === 0 ?
              <Nav.Link className="page-link disabled" onClick={() => getEmployees('prev')}>
                Previous
              </Nav.Link> :
              <Nav.Link className="page-link" onClick={() => getEmployees('prev')}>
                Previous
              </Nav.Link>
            }
          </li>
          <li className="page-item">
            {employees.length === 0 ?
              <Nav.Link className="page-link disabled" onClick={() => getEmployees('next')}>
                Next
              </Nav.Link>
              :
              <Nav.Link className="page-link" onClick={() => getEmployees('next')}>
                Next
              </Nav.Link>
            }
          </li>
        </ul>
      </nav>

      {/* Employee Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{employeeDetails?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Job Title: {employeeDetails?.jobTitle}</p>
          <p>Email: {employeeDetails?.user.email}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteEmployee}>
            Delete Employee
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManagerEmployeeComponent;
