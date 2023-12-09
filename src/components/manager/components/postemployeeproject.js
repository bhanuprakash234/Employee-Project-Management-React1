

import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

// Import your custom styles

function PostEmployeeProject() {
  const [param] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [empproj, setEmpproj] = useState([]);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const uid = localStorage.getItem('id');
    const mid = parseInt(uid, 10) + 1;

    axios.get('http://localhost:5050/employee/list/manager/' + mid)
      .then(response => {
        setEmployees(response.data)
      })
      .catch(error => {
        setMsg('Error in Fetching employees');
      });

    axios.get('http://localhost:5050/project/getAll/manager/' + mid)
      .then(response => setProjects(response.data))
      .catch(error => setMsg('Error in Fetching projects'));
  }, []);

  const employeeProject = () => {
    if (!selectedEmployee || !selectedProject) {
      setMsg("Please select both employee and project.");
      return;
    }

    axios.post(`http://localhost:5050/employeeproject/add/${selectedEmployee.id}/${selectedProject.id}`)
      .then(response => {
        setEmpproj(response.data)
        navigate('/manager/dashboard?page=project&msg="signup success"')
      })
      .catch(function (error) {
        setMsg("Issue in processing in signup")
      });
  }

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center custom-container">
        <div className="col-md-6 mt-4">
          <Card className="custom-card">
            <Card.Body>
              {msg !== null ? (
                <div className="alert alert-danger" role="alert">
                  {msg}
                </div>
              ) : (
                ''
              )}
              <DropdownButton id="dropdown-employee" title={selectedEmployee ? selectedEmployee.name : "Select Employee"} className="custom-dropdown">
                {employees.map((e, index) => (
                  <div key={index}>
                    <Dropdown.Item onClick={() => setSelectedEmployee(e)}>{e.name}</Dropdown.Item>
                  </div>
                ))}
              </DropdownButton>
              <br />
              <DropdownButton id="dropdown-project" title={selectedProject ? selectedProject.title : "Select Project"} className="custom-dropdown">
                {projects.map((p, index) => (
                  <div key={index}>
                    <Dropdown.Item onClick={() => setSelectedProject(p)}>{p.title}</Dropdown.Item>
                  </div>
                ))}
              </DropdownButton>
              <br />
              <button className="btn btn-primary custom-button" onClick={() => employeeProject()}>Add Employee to Project</button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PostEmployeeProject;