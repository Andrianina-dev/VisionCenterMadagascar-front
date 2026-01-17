import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Home from "../pages/public/Home";
import MapSearch from "../pages/public/MapSearch";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../component/ProtectedRoute";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        } />

        {/* PUBLIC / PROTECTED */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* MAP SEARCH PAGE */}
        <Route path="/map" element={
          <ProtectedRoute>
            <MapSearch />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppRouter;
