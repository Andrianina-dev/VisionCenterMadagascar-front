import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const ProtectedRoute = ({ children }) => {
  return AuthService.isLoggedIn() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
