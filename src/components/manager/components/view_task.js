// ViewTask.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import ManagerNavbar from "./mNavbar";

function ViewTask() {
  const [taskDetails, setTaskDetails] = useState({});
  const [worklogs, setWorklogs] = useState([]);
  const [workLogInput, setWorkLogInput] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedTaskDetails, setUpdatedTaskDetails] = useState({
    title: '',
    details: '',
    numberOfDays: '',
  });

  const { tid } = useParams();
  const taskId = tid.split("=")[1];

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    setName(storedName);

    axios
      .get("http://localhost:5050/task/one/" + taskId)
      .then((response) => setTaskDetails(response.data))
      .catch((error) =>
        console.error("Error in fetching task details:", error)
      );

    axios
      .get("http://localhost:5050/worklog/task/" + taskId)
      .then((response) => setWorklogs(response.data))
      .catch((error) =>
        console.error("Error in fetching worklogs for the task:", error)
      );

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

    axios
      .post('http://localhost:5050/worklog/add/' + taskId, worklogObj)
      .then((response) => {
        setWorklogs((prevWorklogs) => [...prevWorklogs, response.data]);
        setWorkLogInput("");
      })
      .catch((error) =>
        console.error("Error in adding worklog for the task:", error)
      );
  };

  const openModal = () => {
    setIsModalOpen(true);
    setUpdatedTaskDetails({
      title: taskDetails.title || "",
      details: taskDetails.details || "",
      numberOfDays: taskDetails.numberOfDays || "",
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateTaskDetails = () => {
    axios
      .put("http://localhost:5050/update/" + taskId, updatedTaskDetails)
      .then((response) => {
        closeModal();
        setTaskDetails(response.data);
      })
      .catch((error) =>
        console.error("Error in updating task details:", error)
      );
  };

  const handleDeleteTask = () => {
    axios
      .delete(`http://localhost:5050/task/delete/${taskId}`)
      .then(() => {
        navigate(-1);
      })
      .catch((error) =>
        console.error("Error in deleting the task:", error)
      );
  };

  return (
    <div>
      <ManagerNavbar />
      <div className="container mt-5">
        <button className="btn btn-primary mb-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
        <div className="row">
          <div className="col-md-6">
            <h1 style={{ color: "black" }}>Task Details</h1>
            <div className="card mt-4">
              <div className="card-header bg-primary text-white">
                <h3 style={{ color: "white" }}>{taskDetails.title}</h3>
              </div>

              <div className="card-body">
                <p className="card-text">
                  <strong>Assigned Employee:</strong>{" "}
                  {taskDetails.employee?.name || "N/A"}
                </p>
                <p className="card-text">
                  <strong>Task Details:</strong> {taskDetails.details}
                </p>
                <p className="card-text">
                  <strong>Status:</strong> {taskDetails.status}
                </p>
                <p className="card-text">
                  <strong>Project Title:{" "}</strong>
                  {taskDetails.sprint?.backlog?.project?.title || "N/A"}
                </p>
                <p className="card-text">
                  <strong>Start Date:{" "}</strong>
                  {taskDetails.sprint?.backlog?.project?.startDate || "N/A"}
                </p>
                <p className="card-text">
                  <strong>End Date:</strong>{" "}
                  {taskDetails.sprint?.backlog?.project?.endDate || "N/A"}
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openModal}
                >
                  Update Task Details
                </button>

                {/* Button to delete the task */}
                <button
                  type="button"
                  className="btn btn-danger ml-2"
                  onClick={handleDeleteTask}
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>

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
                      <div>
                        <small>{worklog.logDate}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No worklogs available for this task.</p>
              )}
            </div>

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

      <div
        className={`modal ${isModalOpen ? "show" : ""}`}
        style={{ display: isModalOpen ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Task Details</h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Task Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={updatedTaskDetails.title}
                    onChange={handleModalInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="details" className="form-label">
                    Task Details
                  </label>
                  <textarea
                    className="form-control"
                    id="details"
                    name="details"
                    value={updatedTaskDetails.details}
                    onChange={handleModalInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="numberOfDays" className="form-label">
                    Number of Days
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="numberOfDays"
                    name="numberOfDays"
                    value={updatedTaskDetails.numberOfDays}
                    onChange={handleModalInputChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateTaskDetails}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTask;
