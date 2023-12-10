import React, { useState } from "react";
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

  const handleCreateSprint =()=> {
    const backlogId = bid.split('=')[1];
    let sprintObj={
        "title":title,
        "duration":duration
        
    }
    axios.post('http://localhost:5050/sprint/add/'+backlogId, sprintObj)
    .then(response=>{
        setSprint(response.data)
        navigate(-1);
    })
    .catch(function(error){
        setMsg("Issue in processing in signup")
    });


    
   
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
        />
      </div>
      <div className="form-group">
        <label htmlFor="duration">Enter Duration:</label>
        <input
          type="text"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>
      <button className="create-btn" onClick={handleCreateSprint}>
        Create Sprint
      </button>
    </div>
    </div>
  );
}

export default CreateSprint;