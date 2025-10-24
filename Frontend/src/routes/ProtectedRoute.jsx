// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, role }) => {
  const user = useSelector((state) => state.userReducer.user);
  const location = useLocation(); // Get current route

  // If not logged in
  if (!user) {
    toast.info("Please login first to access this page!");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If role is specified but user doesn't have it
  if (role && user.role !== role) {
    toast.error("You do not have permission to access this page!");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
