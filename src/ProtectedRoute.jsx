import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  // Get the tokens from localStorage for authority, student, and teacher
  const authorityToken = localStorage.getItem("management");
  const studentToken = localStorage.getItem("student");
  const teacherToken = localStorage.getItem("teacher");
  const principalToken=localStorage.getItem('principal')

  // Based on the role, check if the corresponding token exists
  if (role === "authority" && !authorityToken) {
    return <Navigate to="/management-login" replace />;
  }
  if (role === "student" && !studentToken) {
    return <Navigate to="/studentlogin" replace />;
  }
  if (role === "teacher" && !teacherToken) {
    return <Navigate to="/teacherlogin" replace />;
  }
  if (role === "principal" && !principalToken){
    return <Navigate to="/principallogin" replace />;
  }
  // Render the children (protected content) if the token exists
  return children;
};

export default ProtectedRoute;
