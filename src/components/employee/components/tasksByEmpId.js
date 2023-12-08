import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { useNavigate } from "react-router";
import { Form, FormControl, Row, Col } from "react-bootstrap";

function TasksByEmployee() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const uid = localStorage.getItem('id');
  const eid = parseInt(uid, 10) + 1;
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      // Check if the search query is long enough before making the API call
      if (searchQuery.trim().length >= 3) {
        const response = await axios.get(`http://localhost:5050/search/task/${searchQuery}`);
        setTasks(response.data);

        if (response.data.length === 0) {
          setSearchMessage('No results found based on your search.');
        } else {
          setSearchMessage('');
        }
      } else {
        // Fetch all tasks if the search query is too short
        const response = await axios.get(`http://localhost:5050/task/employee/${eid}`);
        setTasks(response.data);
        setSearchMessage('');
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    // Fetch tasks when the component mounts
    fetchTasks();
  }, [eid, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission

    // Trigger search when pressing Enter
    fetchTasks();
  };

  return (
    <div className="container mt-4">
      <Row className="mb-3">
        <Col>
          <h2>Tasks Assigned to You</h2>
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-end">
          {/* Search bar */}
          <Form onSubmit={handleSearch} className="w-100">
            <FormControl
              type="text"
              placeholder="Search"
              className="search-input small-input"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>
        </Col>
      </Row>

      {searchMessage && <p className="text-muted">{searchMessage}</p>}

      {tasks.map((task) => (
        <Card key={task.id} className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between" onClick={() => navigate('/employee/task&tid=' + task.id)}>
              <div>
                <strong>Title:</strong> {task.title}
              </div>
              <div>
                <strong>Assigned to:</strong> {task.employee.name}
              </div>
              <div className={task.status === 'red' ? 'red-text' : ''}>
                <strong>Status:</strong> {task.status}
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default TasksByEmployee;
