import axios from "axios";
import { useState } from "react";
import { Container, Navbar, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

function SignUp() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [manager, setManager] = useState('');
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const isSignUpDisabled = !name || !username || !password || !email || msg !== '';

    const doSignUp = () => {
        // Basic validations
        if (!name || !username || !password || !email) {
            setMsg("Please fill in all fields");
            return;
        }

        // Email validation using a simple regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMsg("Please enter a valid email address");
            return;
        }

        // Password validation
        // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one digit, and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setMsg("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
            return;
        }

        let managerObj = {
            "name": name,
            "user": {
                "username": username,
                "password": password,
                "email": email
            }
        };

        axios.post('http://localhost:5050/manager/add', managerObj)
            .then(response => {
                setManager(response.data);
                navigate('/auth/login?msg="signup success"');
            })
            .catch(function (error) {
                setMsg("Issue in processing in signup");
            });
    };

    return (
      <div>
      <Navbar bg="dark" data-bs-theme="dark" style={{ height: '50px' }}>
          <Navbar.Brand href="#home">&nbsp;&nbsp;&nbsp;&nbsp;MyApp</Navbar.Brand>
      </Navbar>

      <Container className="mt-4">
          <Row>
              <Col md={{ span: 6, offset: 3 }} className="ml-auto">
                  {/* Add ml-auto class to move the card to the right */}
                  <Card>
                      <Card.Header>
                          <h3 style={{ textAlign: "center" }}>Sign Up</h3>
                      </Card.Header>
                      <Card.Body>
                          {msg !== "" ? (
                              <div className="alert alert-danger" role="alert">
                                  {msg}
                              </div>
                          ) : null}
                                <Form>
                                    <Form.Group as={Row} controlId="formName">
                                        <Form.Label column md={6} style={{textAlign:"center"}}>Enter Name:</Form.Label>
                                        <Col md={6}>
                                            <Form.Control type="text" onChange={(e) => setName(e.target.value)} />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="formEmail">
                                        <Form.Label column md={6} style={{textAlign:"center"}}>Enter Email:</Form.Label>
                                        <Col md={6}>
                                            <Form.Control type="email" onChange={(e) => setEmail(e.target.value)} />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="formUsername">
                                        <Form.Label column md={6} style={{textAlign:"center"}}>Enter Username:</Form.Label>
                                        <Col md={6}>
                                            <Form.Control type="text" onChange={(e) => setUsername(e.target.value)} />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="formPassword">
                                        <Form.Label column md={6} style={{textAlign:"center"}}>Enter Password:</Form.Label>
                                        <Col md={6}>
                                            <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} />
                                        </Col>
                                    </Form.Group>
                                </Form>
                                </Card.Body>
                            <Card.Footer style={{ textAlign: "center" }}>
                                <Button variant="primary" onClick={doSignUp} disabled={isSignUpDisabled}>SignUp</Button>
                            </Card.Footer>
                        </Card>
                        <div className="mt-4" style={{ textAlign: "left" }}>
                            <span>
                                Have an Account?
                                <Button variant="link" onClick={() => navigate("/auth/login")}>
                                    Login
                                </Button>
                            </span>
                        </div>
                    </Col>
                </Row>
            </Container>
            <br /><br /><br /><br /><br />
        </div>
    );
}

export default SignUp;
