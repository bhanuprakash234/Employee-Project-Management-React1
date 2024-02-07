import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./CreateSprint.css"; // Import your CSS file
import ManagerNavbar from "./mNavbar";

function CreateSprint() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [sprint, setSprint] = useState("");
  const [msg, setMsg] = useState("");
  const { bid } = useParams();
  const navigate = useNavigate();

  // Title suggestions
  const [titleSuggestions, setTitleSuggestions] = useState([]);

  useEffect(() => {
    // Fetch title suggestions from API endpoint
    // Example: axios.get("http://localhost:5050/suggestions/titles")
    //   .then(response => setTitleSuggestions(response.data));
  }, []);

  const handleCreateSprint = () => {
    if (!title || !duration) {
      // Check if title or duration is empty
      setMsg("Please fill in both fields.");
      return;
    }
    const backlogId = bid.split("=")[1];
    let sprintObj = {
      title: title,
      duration: duration,
    };
    axios
      .post("http://localhost:5050/sprint/add/" + backlogId, sprintObj)
      .then((response) => {
        setSprint(response.data);
        navigate(-1);
      })
      .catch(function (error) {
        setMsg("Issue in processing in signup");
      });
  };

  // Duration format validation
  const handleDurationChange = (e) => {
    const value = e.target.value;
    // Validate duration format (e.g., numeric input only)
    // Example: if (!(/^\d+$/.test(value))) { setMsg("Duration should be a number."); }
    setDuration(value);
  };

  return (
    <div>
      <ManagerNavbar />
      <div className="create-sprint-container mt-4">
        <h2>Create Sprint</h2>
        <div className="form-group">
          <label htmlFor="title">Enter Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            // Suggestions for title
            // Example: <datalist id="titleSuggestions">
            //             {titleSuggestions.map((suggestion, index) => (
            //               <option key={index} value={suggestion} />
            //             ))}
            //           </datalist>
            // <input list="titleSuggestions" />
          />
        </div>
        <div className="form-group">
          <label htmlFor="duration">Enter Duration:</label>
          <input
            type="text"
            id="duration"
            value={duration}
            onChange={handleDurationChange}
          />
          {/* Duration format hint */}
          {/* Example: <p style={{ color: 'gray', fontSize: '0.8rem' }}>Enter duration in days</p> */}
        </div>
        <button className="create-btn" onClick={handleCreateSprint}>
          Create Sprint
        </button>
        {msg && <p className="error-message">{msg}</p>}
      </div>
    </div>
  );
}

export default CreateSprint;
