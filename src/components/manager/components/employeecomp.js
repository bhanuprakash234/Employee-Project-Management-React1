import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Nav } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

function ManagerEmployeeComponent() {
  const [param] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size,] = useState(12);

  useEffect(() => {
    const uid = localStorage.getItem('id');
    const mid = parseInt(uid, 10) + 1;
  
    axios.get(`http://localhost:5050/employee/manager/${mid}?page=${page}&size=${size}`)
      .then(response => {
        console.log(response.data);
        // Use response.data.content instead of response.data.data
        const responseData = response.data.content || [];
        setEmployees(responseData);
      })
      .catch(error => {
        setMsg('Error in Fetching employees');
      });
  }, [page, size]);

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
              <Card style={{ backgroundColor: '#f0f0f0' }}>
                <Card.Body>
                  <Card.Title>{employee.name}</Card.Title>
                  <Card.Text>{employee.jobTitle}</Card.Text>
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
    </div>
  );
}

export default ManagerEmployeeComponent;
