import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const ProtectedRoute = ({ children }) => {
  // Tout le monde a accès à toutes les pages
  console.log('✅ ProtectedRoute - Accès autorisé à toutes les routes');
  return children;
};

export default ProtectedRoute;
