import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Bubble } from "react-chartjs-2";

function Reports() {
  const [projects, setProjects] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const uid = localStorage.getItem('id');
    const mid = parseInt(uid, 10) + 1;

    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5050/project/getAll/manager/' + mid);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setMsg('Error in Fetching employees');
      }
    };

    fetchProjects();
  }, []);

  // Function to format project data for bubble chart
  const prepareBubbleChartData = () => {
    return projects.map((project) => ({
      label: project.name,
      data: [{
        x: project.tasksCompleted,
        y: project.remainingTasks,
        r: 10, // Bubble size, you can adjust this as needed
      }],
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bubble color
      borderColor: 'rgba(75, 192, 192, 1)', // Bubble border color
      borderWidth: 1, // Bubble border width
    }));
  };

  const bubbleChartData = {
    datasets: prepareBubbleChartData(),
  };

  const bubbleChartOptions = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Tasks Completed',
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Remaining Tasks',
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend for better display
      },
    },
  };

  return (
    <Container>
      <h2 className="mt-3">Project Reports</h2>
      {projects.map((project) => (
        <Card key={project.id} className="mt-3">
          <Card.Header>{project.name}</Card.Header>
          <Card.Body>
            <Row>
              <Col>
                <p>Status: {project.status}</p>
              </Col>
              <Col>
                <Bubble data={bubbleChartData} options={bubbleChartOptions} />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
      {msg && <p>{msg}</p>}
    </Container>
  );
}

export default Reports;
