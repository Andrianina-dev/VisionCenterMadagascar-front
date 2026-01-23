import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import MemberLogin from "../pages/auth/MemberLogin";
import AdminLogin from "../pages/auth/AdminLogin";
import Home from "../pages/public/Home";
import ShowcaseHomePage from "../pages/showcase/HomePage";
import SimpleHomePage from "../pages/showcase/SimpleHomePage";
import MapSearch from "../pages/public/MapSearch";
import ActiviteDetails from "../pages/public/ActiviteDetails";
import Profile from "../pages/public/Profile";
import AccountProfile from "../pages/public/AccountProfile";
import AdminStatistics from "../pages/admin/AdminStatistics";
import FloatingMessenger from "../component/FloatingMessenger/FloatingMessenger";
import { MessengerProvider, useMessenger } from "../contexts/MessengerContext";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import MemberLayout from "../layouts/MemberLayout";
import AdminLayout from "../layouts/AdminLayout";
import ShowcaseLayout from "../layouts/vitrine/ShowcaseLayout";
import AccueilVitrine from "../layouts/vitrine/AcceuilVitrine";
import ProtectedRoute from "../component/ProtectedRoute";

const AppRouterContent = () => {
  const { showMessenger } = useMessenger();

  return (
    <>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={
          <AuthLayout>
            <MemberLogin />
          </AuthLayout>
        } />
        
        <Route path="/admin/login" element={
          <AuthLayout>
            <AdminLogin />
          </AuthLayout>
        } />

        {/* SITE VITRINE - PUBLIC */}
        <Route path="/showcase" element={
          <ShowcaseLayout>
            <SimpleHomePage />
          </ShowcaseLayout>
        } />

        {/* PAGE D'ACCUEIL PAR DÉFAUT - VITRINE */}
        <Route path="/" element={
          <AccueilVitrine />
        } />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* MAP SEARCH PAGE */}
        <Route path="/map" element={
          <ProtectedRoute>
            <MainLayout>
              <MapSearch />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* ACTIVITIES LIST PAGE */}
        <Route path="/activites" element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* ACTIVITY DETAILS PAGE */}
        <Route path="/activite/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <ActiviteDetails />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* PROFILE PAGE - AVEC SIDEBAR */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <MemberLayout activeNav="profile">
              <Profile />
            </MemberLayout>
          </ProtectedRoute>
        } />

        {/* ACCOUNT PROFILE PAGE - AVEC SIDEBAR */}
        <Route path="/account" element={
          <ProtectedRoute>
            <MemberLayout activeNav="account">
              <AccountProfile />
            </MemberLayout>
          </ProtectedRoute>
        } />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout activeNav="dashboard">
              <AdminStatistics />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* ADMIN DASHBOARD SÉPARÉ */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminLayout activeNav="dashboard">
              <AdminStatistics />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* ADMIN STATISTICS */}
        <Route path="/admin/statistics" element={
          <ProtectedRoute>
            <AdminLayout activeNav="statistics">
              <AdminStatistics />
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
      {showMessenger && <FloatingMessenger />}
    </>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <MessengerProvider>
        <AppRouterContent />
      </MessengerProvider>
    </Router>
  );
};

export default AppRouter;
