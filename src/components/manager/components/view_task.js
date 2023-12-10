// ViewTask.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import ManagerNavbar from "./mNavbar";

function ViewTask() {
  // State for storing task details
  const [taskDetails, setTaskDetails] = useState({});
  // State for storing worklogs
  const [worklogs, setWorklogs] = useState([]);
  // State for storing the input for adding a new worklog
  const [workLogInput, setWorkLogInput] = useState('');
  // State for storing the current user
  const [currentUser, setCurrentUser] = useState('');
  // State for storing the name
  const [name, setName] = useState('');

  const navigate=useNavigate();

  // New state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for storing updated task details in the modal
  const [updatedTaskDetails, setUpdatedTaskDetails] = useState({
    title: '',
    details: '',
    numberOfDays: '',
  });

  // Extracting taskId from the URL params
  const { tid } = useParams();
  const taskId = tid.split("=")[1];

  // useEffect to fetch task details, worklogs, and current user on component mount
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

  // Function to handle input change in the worklog form
  const handleInputChange = (e) => {
    setWorkLogInput(e.target.value);
  };

  // Function to handle adding a new worklog
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

  // Functions for modal
  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
    // Pre-fill modal with current task details
    setUpdatedTaskDetails({
      title: taskDetails.title || "",
      details: taskDetails.details || "",
      numberOfDays: taskDetails.numberOfDays || "",
    });
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle input change in the modal
  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Function to handle updating task details in the modal
  const handleUpdateTaskDetails = () => {
    // Make an API call to update task details
    axios
      .put("http://localhost:5050/update/" + taskId, updatedTaskDetails)
      .then((response) => {
        // Close the modal
        closeModal();
        // Refresh task details after updating
        setTaskDetails(response.data);
      })
      .catch((error) =>
        console.error("Error in updating task details:", error)
      );
  };

  return (
    <div>
      {/* Rendering the navigation bar */}
      <ManagerNavbar />
      <div className="container mt-5">
      <button className="btn btn-primary mb-3" onClick={()=>navigate(-1)}>
          Go Back
        </button>
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
                {/* ... (other task details) */}
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
                {/* Add button to open modal */}

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openModal}
                >
                  Update Task Details
                </button>
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

      {/* Update Task Details Modal */}
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
