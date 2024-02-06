import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ManagerNavbar from './mNavbar';

function CreateTask() {
  const { sid } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [task, setTask] = useState('');
  const [msg, setMsg] = useState('');

  const [details, setDetails] = useState('');
  const [days, setDays] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const uid = localStorage.getItem('id');
    const mid = parseInt(uid, 10) + 1;
    // Fetch the list of employees from your API
    axios.get('http://localhost:5050/employee/list/manager/' + mid)
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => console.error('Error in fetching employees:', error));
  }, []);

  const handleCreateTask = () => {
    const sprintId = sid.split('=')[1];

    // Validate that all required fields are filled
    if (!title.trim()) {
      setMsg('Please enter a title');
      return;
    }

    if (!days.trim() || isNaN(days)) {
      setMsg('Please enter a valid number of days');
      return;
    }

    if (!details.trim()) {
      setMsg('Please enter task details');
      return;
    }

    if (!employeeId.trim()) {
      setMsg('Please select an employee');
      return;
    }

    const taskId = `${sprintId}/${employeeId}`;

    let taskObj = {
      title: title,
      details: details,
      noOfDays: days,
      employeeId: employeeId, // Include employeeId in the task object
    };

    axios
      .post(`http://localhost:5050/task/add/${taskId}`, taskObj)
      .then((response) => {
        setTask(response.data);

        // Send a notification to the selected employee
        const notificationData = {
          message: 'You have been assigned a task. Check Your Work Section to view your added tasks',
        };

        axios
          .post('http://localhost:5050/sendNotification/' + employeeId, notificationData)
          .then((response) => {
            setNotification(response.data);
          })
          .catch((notificationError) => {
            console.error('Error sending notification:', notificationError);
          });

        navigate(-1);
      })
      .catch(function (error) {
        setMsg('Issue in processing in signup');
      });
  };

  return (
    <div>
      <ManagerNavbar />
      <div className="container mt-5">
        <h1 className="text-primary">Create Task</h1>
        {msg && <div className="alert alert-danger">{msg}</div>}
        <form>
          <div className="form-group mt-4">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="days">Number of Days:</label>
            <input
              type="text"
              id="days"
              className="form-control"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="details">Enter Details:</label>
            <textarea
              id="details"
              className="form-control"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="employee">Select Employee:</label>
            <select
              id="employee"
              className="form-control"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <br />

          <button type="button" className="btn btn-primary" onClick={handleCreateTask}>
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
