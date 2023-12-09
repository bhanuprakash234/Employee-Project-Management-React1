// ViewTask.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import EmployeeNavbar from "./eNavbar";

function EmployeeTask() {
  const [taskDetails, setTaskDetails] = useState({});
  const [worklogs, setWorklogs] = useState([]);
  const [newWorklog, setNewWorklog] = useState("");
  const [workLogInput, setWorkLogInput] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [name, setName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const { tid } = useParams();
  const taskId = tid.split("=")[1];

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    setName(storedName);

    axios
      .get(`http://localhost:5050/task/one/${taskId}`)
      .then((response) => setTaskDetails(response.data))
      .catch((error) =>
        console.error("Error in fetching task details:", error)
      );

    axios
      .get(`http://localhost:5050/worklog/task/${taskId}`)
      .then((response) => setWorklogs(response.data))
      .catch((error) =>
        console.error("Error in fetching worklogs for the task:", error)
      );

    setCurrentUser(localStorage.getItem("userRole"));
  }, [taskId]);

  const handleInputChange = (e) => {
    setWorkLogInput(e.target.value);
  };

  const handleAddWorklog = () => {
    let worklogObj = {
      log: workLogInput,
      name: name,
    };

    axios
      .post(`http://localhost:5050/worklog/add/${taskId}`, worklogObj)
      .then((response) => {
        setWorklogs((prevWorklogs) => [...prevWorklogs, response.data]);
        setWorkLogInput("");
      })
      .catch((error) =>
        console.error("Error in adding worklog for the task:", error)
      );
  };

  const handleStatusChange = () => {
    axios
      .put('http://localhost:5050/update/'+taskId, {
        status: selectedStatus,
      })
      .then((response) => {
        setTaskDetails((prevTaskDetails) => ({
          ...prevTaskDetails,
          status: selectedStatus,
        }));
      })
      .catch((error) =>
        console.error("Error in updating task status:", error)
      );
  };

  return (
    <div>
      <EmployeeNavbar />
    <div className="container mt-5">
      <div className="row">
        {/* Task Details and Status Section */}
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

              {/* Status Section */}
              <div className="mt-4">
                <h5>Status</h5>
                <div className="mt-2">
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="TO_DO">TO-DO</option>
                    <option value="IN_PROGRESS">IN-PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                  <button
                    type="button"
                    className="btn btn-primary mt-2"
                    onClick={handleStatusChange}
                  >
                    Update Status
                  </button>
                </div>
              </div>
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
                      <strong>{worklog.name}</strong>
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
    </div>
  );
}

export default EmployeeTask;
