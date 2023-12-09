import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Reset() {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleReset = () => {
        let userObj = {
            "newPassword": newPassword
        };

        // Check the username with the database
        axios.get(`http://localhost:5050/check-username/${username}`)
            .then(response => {
                // Username is correct, update the password
                axios.put(`http://localhost:5050/update-password/${username}`, userObj)
                    .then(() => {
                        // Password updated successfully, navigate to login
                        setMsg('');
                        navigate('/auth/login?msg=Password reset successful. Please login with your new password.');
                    })
                    .catch(error => {
                        // Handle error updating password
                        setMsg('Error updating password. Please try again.');
                    });
            })
            .catch(error => {
                // Incorrect username
                setMsg('Incorrect username. Please enter a valid username.');
            });
    };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6"></div>
        <div className="col-md-6">
          <br /><br /><br />
          <div className="card">
            <div className="card-header" style={{ color: "steelblue", textAlign: "center" }}>
              <h3>Reset Password</h3>
            </div>
            <div className="card-body">
              {msg !== '' ?
                <div className="alert alert-danger" role="alert">
                  {msg}
                </div>
                : ''}
              <div className="row" style={{ textAlign: "right" }}>
                <div className="col-md-6" style={{ color: "darkslategray" }} >
                  <label>Enter Username:</label>
                </div>
                <div className="col-md-6 mb-4">
                  <input type="text" className="form-control"
                    onChange={(e) => setUsername(e.target.value)} />
                </div>
              </div>
              <div className="row" style={{ textAlign: "right" }}>
                <div className="col-md-6">
                  <label>Enter New Password:</label>
                </div>
                <div className="col-md-6">
                  <input type="password" className="form-control"
                    onChange={(e) => setNewPassword(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="card-footer" style={{ textAlign: "center" }}>
              <button className="btn btn-primary"
                onClick={() => handleReset()}>Reset Password</button>
            </div>
          </div>
          <div style={{ textAlign: 'left', color: "white" }} className="mt-4" >
            <span style={{ color: "black" }}>Remember your password?
              <button className="btn btn-link"
                onClick={() => navigate("/auth/login")}>Login</button>
            </span>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  );
}

export default Reset;
