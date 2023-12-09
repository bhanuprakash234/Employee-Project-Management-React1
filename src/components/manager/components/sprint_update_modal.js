// SprintUpdateModal.jsx

import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const SprintUpdateModal = ({ show, onHide, onUpdate, sprint }) => {
  // State to track the duration input value
  const [duration, setDuration] = useState(sprint.duration || "");

  // State to track the title input value
  const [title, setTitle] = useState(sprint.title || "");

  // Function to handle the update button click
  const handleUpdate = () => {
    // Perform validation if needed

    // Call the onUpdate function with the updated data
    onUpdate({
      id: sprint.id,
      duration,
      title,
    });

    // Close the modal
    onHide();
  };

  // JSX for the modal content
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Sprint</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Input for updating duration */}
          <Form.Group className="mb-3" controlId="formDuration">
            <Form.Label>Update Duration</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Form.Group>
         
          {/* Input for updating title */}
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Update Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* Button to close the modal */}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        
        {/* Button to trigger the update process */}
        <Button variant="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SprintUpdateModal;
