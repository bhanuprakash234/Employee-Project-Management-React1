// Backlog.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Backlog.css";
import ManagerNavbar from "./mNavbar";
import SprintUpdateModal from "./sprint_update_modal";

function Backlog() {
  const [project, setProject] = useState({});
  const [backlog, setBacklog] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [tasksBySprint, setTasksBySprint] = useState({});
  const { pid } = useParams();
  const extractedPid = pid.split("=")[1];
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState(project.status || "TO_DO");

  const fetchData = async () => {
    try {
      const projectResponse = await axios.get(`http://localhost:5050/project/one/${extractedPid}`);
      setProject(projectResponse.data);

      const backlogResponse = await axios.get(`http://localhost:5050/backlog/${extractedPid}`);
      setBacklog(backlogResponse.data);

      const sprintsResponse = await axios.get(`http://localhost:5050/sprint/project/${extractedPid}`);
      setSprints(sprintsResponse.data);

      const tasksResponse = await axios.get(`http://localhost:5050/task/project/${extractedPid}`);
      const tasksGroupedBySprint = tasksResponse.data.reduce((acc, task) => {
        const sprintTitle = task.sprint.title;

        if (!acc[sprintTitle]) {
          acc[sprintTitle] = [];
        }

        acc[sprintTitle].push(task);
        return acc;
      }, {});

      setTasksBySprint(tasksGroupedBySprint);
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [extractedPid]);

  const handleUpdateProject = async (status) =>{
try {
console.log("Updating project with status:", status);
await axios.put (`http://localhost:5050/project/update/${extractedPid}`,
{status},
{headers:{'Content-Type'  :  'application/json' }}
);
console.log("Project update successful");
await fetchData();
}catch (error) {
console.error ("Error in updating project status:", error);
    }
  };
  
  

  const handleDeleteProject = async () => {
    try {
      await axios.delete(`http://localhost:5050/project/delete/${extractedPid}`);
      navigate(-1);
    } catch (error) {
      console.error("Error in deleting project:", error);
    }
  };

  const handleCreateBacklog = async () => {
    try {
      console.log("Creating a new backlog...");
      await fetchData();
    } catch (error) {
      console.error("Error in creating a new backlog:", error);
    }
  };

  const handleCreateSprint = async () => {
    try {
      console.log("Creating a new sprint...");
      await fetchData();
    } catch (error) {
      console.error("Error in creating a new sprint:", error);
    }
  };

  const handleUpdatesprintstatus = async (sprintId, status) =>{
  try {
  console. log("Updating sprint status:"
  , status);
  await axios.put (`http://localhost:5050/sprint/update/${sprintId}`,
  {status},
  {headers: { 'Content-Type' : 'application/json' }}
  );
  await fetchData();
  }catch (error) {
  console.error ("Error in updating sprint status:", error);
    }
  };
  
  
  

  const handleDeleteSprint = async (sprintId) => {
    try {
      await axios.delete(`http://localhost:5050/sprint/delete/${sprintId}`);
      await fetchData();
    } catch (error) {
      console.error("Error in deleting sprint:", error);
    }
  };

  const [updateSprintModalShow, setUpdateSprintModalShow] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);

  const handleUpdateSprintModalOpen = (sprint) => {
    setSelectedSprint(sprint);
    setUpdateSprintModalShow(true);
  };

  const handleUpdateSprintModalClose = () => {
    setUpdateSprintModalShow(false);
    setSelectedSprint(null);
  };

  const handleUpdateSprint = async (updatedSprintData) => {
    try {
      // Use backticks to include the sprint ID in the API path
      await axios.put(`http://localhost:5050/sprint/update/${selectedSprint.id}`, updatedSprintData);
      await fetchData();
    } catch (error) {
      console.error("Error in updating sprint:", error);
    }
  };

  return (
    <div>
    <ManagerNavbar />
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 style={{ color: "black" }}>{project.title}</h1>
        </div>
        <div className="d-flex align-items-center">
          <div className="me-2">
            <select
              id="projectStatus"
              className="form-select"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                handleUpdateProject(e.target.value);
              }}
            >
              <option value="TO_DO">TO-DO</option>
              <option value="IN_PROGRESS">IN-PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
          <div>
            <button className="btn btn-danger" onClick={handleDeleteProject}>
              Delete Project
            </button>
          </div>
        </div>
      </div>

      {backlog.length > 0 ? (
        <div className="mt-4">
          <h2 style={{ color: "black" }}>{backlog[0].name}</h2>
        </div>
      ) : (
        <div className="mt-4">
          <button className="btn btn-primary" onClick={() => navigate('/create/backlog/&pid=' + project.id)}>
            Create Backlog
          </button>
        </div>
      )}

      {sprints.map((sprint) => (
        <div key={sprint.id} className="card mt-4">
          <div className="card-header bg-primary text-white d-flex justify-content-between">
            <h3 style={{ color: "white" }}>{sprint.title}</h3>
            <div className="d-flex">
              <div className="me-2">
                <select
                  className="form-select"
                  value={tasksBySprint[sprint.title]?.[0]?.sprint.status || "TO_DO"}
                  onChange={(e) =>
                    handleUpdatesprintstatus(tasksBySprint[sprint.title]?.[0]?.sprint.id, e.target.value)
                  }
                >
                  <option value="TO_DO">TO-DO</option>
                  <option value="IN_PROGRESS">IN-PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>
              
              &nbsp;&nbsp;
              {/* Update Sprint Button */}
              <div className="me-2">
                <button
                  className="btn btn-warning" 
                  onClick={() => handleUpdateSprintModalOpen(sprint)}
                >
                  Update
                </button>
              </div>
              <div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteSprint(sprint.id)}
                >
                  Delete Sprint
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            {(tasksBySprint[sprint.title] || []).map((task, taskIndex) => (
              <div key={taskIndex} className="card mb-3">
                <div
                  className="card-body d-flex justify-content-between"
                  onClick={() => navigate('/task&tid=' + task.id)}
                >
                  <div>
                    <h5 className="card-title">{task.title}</h5>
                  </div>
                  <div>
                    <p className="card-text">
                      <strong>Employee: </strong>{task.employee.name}</p>
                  </div>
                  <div>
                    <p className="card-text">
                      <strong>Status:{" "}</strong>
                      <small className={`text-${task.status === "completed" ? "success" : "danger"}`}>
                        {task.status}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {tasksBySprint[sprint.title]?.length === 0 && <p>No tasks in this sprint</p>}
          </div>
          <div className="card-footer">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/create/task&sid=' + sprint.id)}
            >
              Create Task
            </button>
          </div>
        </div>
      ))}

      {sprints.length === 0 && <p>No sprints in this project</p>}

      <br />
      <button
        className="btn btn-primary"
        onClick={() => navigate('/create/sprint&bid=' + (backlog[0]?.id || ''))}
      >
        Create Sprint
      </button>
    </div>

    {/* Update Sprint Modal */}
    <SprintUpdateModal
      show={updateSprintModalShow}
      onHide={handleUpdateSprintModalClose}
      onUpdate={handleUpdateSprint}
      sprint={selectedSprint || {}}
    />
  </div>
  );
}

export default Backlog;