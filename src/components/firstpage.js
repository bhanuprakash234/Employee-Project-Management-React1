import React from "react";
import Login from "./auth/login";
import MainNavbar from "./mainNavbar";
import "./FirstPage.css"; // Import your custom styling

function FirstPage() {
  return (
    <div className="first-page-container">
      <MainNavbar />
      <div className="login-background-image"></div>
      <div className="login-container">
        <Login />
      </div>
    </div>
  );
}

export default FirstPage;
