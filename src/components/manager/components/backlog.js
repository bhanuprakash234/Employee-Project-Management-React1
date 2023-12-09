import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Backlog.css";
import ManagerNavbar from "./mNavbar";

function Backlog() {
  const [project, setProject] = useState({});
  const [backlog, setBacklog] = useState([]);
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

  const handleUpdateProject = async (status) => {
    let updateProject = {
      "id": extractedPid,
      "status": status,
    };
    try {
      await axios.put(`http://localhost:5050/update/project`, updateProject);
      await fetchData();
    } catch (error) {
      console.error("Error in updating project status:", error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await axios.delete(`http://localhost:5050/project/delete/${extractedPid}`);
      // Navigate to the previous page
      navigate(-1);
    } catch (error) {
      console.error("Error in deleting project:", error);
    }
  };

  const handleCreateBacklog = async () => {
    try {
      // Implement logic for creating a new backlog
      console.log("Creating a new backlog...");

      // After creating the backlog, refetch the data
      await fetchData();
    } catch (error) {
      console.error("Error in creating a new backlog:", error);
    }
  };

  const handleCreateSprint = async () => {
    try {
      // Implement logic for creating a new sprint
      console.log("Creating a new sprint...");

      // After creating the sprint, refetch the data
      await fetchData();
    } catch (error) {
      console.error("Error in creating a new sprint:", error);
    }
  };
  const handleUpdateSprintStatus = async (sprintId, status) => {
    try {
      let updateSprint = {
        "id": sprintId,
        "status": status,
      };
      await axios.put(`http://localhost:5050/update/sprint`, updateSprint);
      await fetchData(); // Refetch data after updating sprint status
    } catch (error) {
      console.error("Error in updating sprint status:", error);
    }
  };
  
  // Function expression for handling deleting a sprint
  const handleDeleteSprint = async (sprintId) => {
    try {
      await axios.delete(`http://localhost:5050/sprint/delete/${sprintId}`);
      await fetchData(); // Refetch data after deleting sprint
    } catch (error) {
      console.error("Error in deleting sprint:", error);
    }
  };

  // Rest of the code...

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
            <button className="btn btn-primary" onClick={()=>navigate('/create/backlog/&pid=' +project.id)}>
              Create Backlog
            </button>
          </div>
        )}

{Object.keys(tasksBySprint).map((sprintTitle) => (
  <div key={sprintTitle} className="card mt-4">
    <div className="card-header bg-primary text-white d-flex justify-content-between">
      <h3 style={{ color: "white" }}>{sprintTitle}</h3>
      <div className="d-flex">
        {/* Sprint Status Dropdown */}
        <div className="me-2">
          <select
            className="form-select"
            value={tasksBySprint[sprintTitle]?.[0]?.sprint.status || "TO_DO"}
            onChange={(e) => handleUpdateSprintStatus(tasksBySprint[sprintTitle]?.[0]?.sprint.id, e.target.value)}
          >
            <option value="TO_DO">TO-DO</option>
            <option value="IN_PROGRESS">IN-PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>

        {/* Delete Sprint Button */}
        <div>
          <button
            className="btn btn-danger"
            onClick={() => handleDeleteSprint(tasksBySprint[sprintTitle]?.[0]?.sprint.id)}
          >
            Delete Sprint
          </button>
        </div>
      </div>
    </div>
            <div className="card-body">
              {(tasksBySprint[sprintTitle] || []).map((task, taskIndex) => (
                <div key={taskIndex} className="card mb-3">
                  <div
                    className="card-body d-flex justify-content-between"
                    onClick={() => navigate('/task&tid=' + task.id)}
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
              ))}
              {tasksBySprint[sprintTitle]?.length === 0 && (
                <p>No tasks in this sprint</p>
              )}
            </div>

            <div className="card-footer">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/create/task&sid='+ (tasksBySprint[sprintTitle]?.[0]?.sprint.id || ''))}
              >
                Create Task
              </button>
            </div>
          </div>
        ))}

        {/* Render all sprints, including those without tasks */}
        {Object.keys(tasksBySprint).length === 0 && (
          <p>No sprints in this project</p>
        )}

        <br />
        <button
          className="btn btn-primary"
          onClick={() => navigate('/create/sprint&bid=' + (backlog[0]?.id || ''))}
        >
          Create Sprint
        </button>
      </div>
    </div>
  );
}

export default Backlog;
