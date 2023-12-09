import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import ManagerNavbar from "./mNavbar";

function CreateBacklog() {
  const [name, setName] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const { pid } = useParams();
  const [backlog, setBacklog] = useState("");
  const navigate = useNavigate();

  const handleCreateBacklog = () => {
    const projId = pid.split("=")[1];
    // Implement logic to send data to the API
    // Use axios or your preferred HTTP library
    let backlogObj = {
      name: name,
      targetDate: targetDate,
    };

    // Example using axios
    axios
      .post("http://localhost:5050/backlog/add/" + projId, backlogObj)
      .then((response) => {
        // Log success or handle as needed
        setBacklog(response.data);

        console.log("Backlog created successfully:", response.data);

        // Navigate back to the previous page
        // You might need to import the 'useNavigate' hook from 'react-router-dom'
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error creating backlog:", error);
      });
  };

  return (
    <div>
      <ManagerNavbar />
    <div style={styles.container} className="mt-4">
      <h2>Create Backlog</h2>
      <form style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Target Date:</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div>
          <button type="button" onClick={handleCreateBacklog} style={styles.button}>
            Create Backlog
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default CreateBacklog;
