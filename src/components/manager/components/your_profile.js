import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './YourProfile.css';

function YourProfile1() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const userId = localStorage.getItem('id');

  useEffect(() => {
    

    if (userId) {
      fetchUserDetails(userId);
    }
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5050/user/one/${userId}`);
      setUserDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      // Make the API call to update user details
      // Replace 'yourApiEndpoint' with your actual API endpoint
      await axios.put(`http://localhost:5050/user/update/${userId}`, {
        username: newUsername,
        email: newEmail,
      });

      // Close the modal and reset the input fields
      setIsModalOpen(false);
      setNewUsername('');
      setNewEmail('');

      // Refetch user details to display updated information
      fetchUserDetails(userDetails.id);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <div className="profile-container mt-4">
      {loading ? (
        <p className="loading-text">Loading user details...</p>
      ) : (
        userDetails && (
          <div>
            <h2 className="profile-heading">Profile Details</h2>
            <div className="profile-info">
              <p>
                <strong>Username:</strong> {userDetails.username}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Role:</strong> {userDetails.role}
              </p>
            </div>
            <button className='btn btn-primary' onClick={() => setIsModalOpen(true)}>
              Update Your Details
            </button>

            {/* Modal for updating user details */}
            {isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <span className="close-button" onClick={() => setIsModalOpen(false)}>
        &times;
      </span>
      <label>
        Enter your new username:
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </label>
      <label>
        Enter your new email:
        <input
          type="text"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
      </label>
      <br />
      <button className="btn btn-primary" onClick={handleUpdate}>
        Update
      </button>
      <br />
      <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
        Cancel
      </button>
    </div>
  </div>
)}     </div>
        )
      )}
    </div>
  );
}

export default YourProfile1;
