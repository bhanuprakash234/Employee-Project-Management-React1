// ViewTask.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import ManagerNavbar from "./mNavbar";

function ViewTask() {
  const [taskDetails, setTaskDetails] = useState({});
  const [worklogs, setWorklogs] = useState([]);
  const [newWorklog, setNewWorklog] = useState('');
  const [workLogInput, setWorkLogInput] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [name, setName] = useState('');

  const { tid } = useParams();
  const taskId = tid.split("=")[1];

  useEffect(() => {
    // Fetch task details
    const storedName = localStorage.getItem('username');
    setName(storedName);

    axios
      .get("http://localhost:5050/task/one/" + taskId)
      .then((response) => setTaskDetails(response.data))
      .catch((error) =>
        console.error("Error in fetching task details:", error)
      );

    // Fetch worklogs for the task
    axios
      .get("http://localhost:5050/worklog/task/" + taskId)
      .then((response) => setWorklogs(response.data))
      .catch((error) =>
        console.error("Error in fetching worklogs for the task:", error)
      );

    // Fetch current user information (assuming it's stored in localStorage)
    setCurrentUser(localStorage.getItem('userRole'));
  }, [taskId]);

  const handleInputChange = (e) => {
    setWorkLogInput(e.target.value);
  };

  const handleAddWorklog = () => {
    let worklogObj = {
      "log": workLogInput,
      "name": name,
    };
    // Make an API call to add worklog
    axios
      .post('http://localhost:5050/worklog/add/' + taskId, worklogObj)
      .then((response) => {
        // Refresh worklogs after adding a new one
        setWorklogs((prevWorklogs) => [...prevWorklogs, response.data]);
        // Clear the new worklog form
        setWorkLogInput("");
      })
      .catch((error) =>
        console.error("Error in adding worklog for the task:", error)
      );
  };

  return (
    <div>
      <ManagerNavbar />
    <div className="container mt-5">
      <div className="row">
        {/* Task Details Section */}
        <div className="col-md-6">
          <h1 style={{ color: "black" }}>Task Details</h1>
          <div className="card mt-4">
            <div className="card-header bg-primary text-white">
              <h3 style={{ color: "white" }}>{taskDetails.title}</h3>
            </div>

            <div className="card-body">
              <p className="card-text">
                Assigned Employee: {taskDetails.employee?.name || "N/A"}
              </p>
              <p className="card-text">Status: {taskDetails.status}</p>
              <p className="card-text">
                Project Title:{" "}
                {taskDetails.sprint?.backlog?.project?.title || "N/A"}
              </p>
              <p className="card-text">
                Start Date:{" "}
                {taskDetails.sprint?.backlog?.project?.startDate || "N/A"}
              </p>
              <p className="card-text">
                End Date: {taskDetails.sprint?.backlog?.project?.endDate || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Worklog Section */}
        <div className="col-md-6">
          <div className="mt-4">
            <h5>Worklogs</h5>
            {worklogs.length > 0 ? (
              <ul className="list-group">
                {worklogs.map((worklog) => (
                  <li
                    key={worklog.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>
                        {worklog.name}
                      </strong>
                      <br />
                      {worklog.log}
                    </div>
                    <div><small>{worklog.logDate}</small></div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No worklogs available for this task.</p>
            )}
          </div>

          {/* Add Worklog Form */}
          <div className="mt-4">
            <h5>Add Worklog</h5>
            <form>
              <div className="mb-3">
                <label htmlFor="log" className="form-label">
                  Worklog Description
                </label>
                <textarea
                  className="form-control"
                  id="log"
                  name="log"
                  value={workLogInput}
                  onChange={handleInputChange}
                />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddWorklog}
              >
                Add Worklog
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default ViewTask;
