import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Backlog.css";
import EmployeeNavbar from "./eNavbar";
function EmployeeBacklog(){
    const [project, setProject] = useState({});
    const [backlog, setBacklog] = useState([]);
    const [tasksBySprint, setTasksBySprint] = useState({});
    const { pid } = useParams();
    const extractedPid = pid.split("=")[1];
    const navigate = useNavigate();
    useEffect(() => {
        axios
          .get(`http://localhost:5050/project/one/${extractedPid}`)
          .then((response) => setProject(response.data))
          .catch((error) => console.error("Error in fetching project details:", error));
    
        axios
          .get(`http://localhost:5050/backlog/${extractedPid}`)
          .then((response) => setBacklog(response.data))
          .catch((error) => console.error("Error in fetching backlog details:", error));
    
        axios
          .get(`http://localhost:5050/task/project/${extractedPid}`)
          .then((response) => {
            const tasksGroupedBySprint = response.data.reduce((acc, task) => {
              const sprintTitle = task.sprint.title;
    
              if (!acc[sprintTitle]) {
                acc[sprintTitle] = [];
              }
    
              acc[sprintTitle].push(task);
              return acc;
            }, {});
    
            setTasksBySprint(tasksGroupedBySprint);
          })
          .catch((error) => console.error("Error in fetching sprints:", error));
      }, [extractedPid]);
    
      const handleCreateBacklog = () => {
        // Implement logic for creating a new backlog
        console.log("Creating a new backlog...");
      };
    return(
      <div>
        <EmployeeNavbar />
        <div className="container mt-5">
      <h1 style={{ color: "black" }}>{project.title}</h1>

      {backlog.length > 0 ? (
        <div className="mt-4">
          <h2 style={{ color: "black" }}>{backlog[0].name}</h2>
        </div>
      ) : (
        <div className="mt-4">
          <button className="btn btn-primary" onClick={()=>navigate('/create/backlog/&pid=' +project.id)}>
            Create Backlog
          </button>
        </div>
      )}

{Object.entries(tasksBySprint).map(([sprintTitle, tasks]) => (
  <div key={sprintTitle} className="card mt-4">
    <div className="card-header bg-primary text-white">
      <h3 style={{ color: "white" }}>{sprintTitle}</h3>
    </div>

    <div className="card-body">
      {tasks && tasks.length > 0 ? (
        tasks.map((task, taskIndex) => (
          <div key={taskIndex} className="card mb-3">
            <div
              className="card-body d-flex justify-content-between"
             
            >
              <div>
                <h5 className="card-title">{task.title}</h5>
              </div>
              <div>
                <p className="card-text">Employee: {task.employee.name}</p>
              </div>
              <div>
                <p className="card-text">
                  Status:{" "}
                  <small className={`text-${task.status === "completed" ? "success" : "danger"}`}>
                    {task.status}
                  </small>
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No tasks in this sprint</p>
      )}
    </div>

    
  </div>
))}

      <br />
      
    </div>
    </div>
    )
}
export default EmployeeBacklog;