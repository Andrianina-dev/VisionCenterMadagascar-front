import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Home from "../pages/public/Home";
import MapSearch from "../pages/public/MapSearch";
import ActiviteDetails from "../pages/public/ActiviteDetails";
import Profile from "../pages/public/Profile";
import AccountProfile from "../pages/public/AccountProfile";

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

        {/* ACTIVITY DETAILS PAGE */}
        <Route path="/activite/:id" element={
          <ProtectedRoute>
            <ActiviteDetails />
          </ProtectedRoute>
        } />

        {/* PROFILE PAGE */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* ACCOUNT PROFILE PAGE */}
        <Route path="/account" element={
          <ProtectedRoute>
            <AccountProfile />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppRouter;
