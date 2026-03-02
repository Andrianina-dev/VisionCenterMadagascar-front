import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import MemberLogin from "../pages/auth/MemberLogin";
import AdminLogin from "../pages/auth/AdminLogin";
import Home from "../pages/public/Home";
import Inscription from "../pages/public/Inscription";
import ShowcaseHomePage from "../pages/showcase/HomePage";
import Galerie from "../layouts/vitrine/Galerie";
import MapSearch from "../pages/public/MapSearch";
import ActiviteDetails from "../pages/public/ActiviteDetails";
import Messages from "../pages/member/Messages";
import ProfileMembre from "../pages/member/profileMembre";
import LocationSalle from "../pages/member/LocationSalle";
import ReservationValidation from "../pages/ReservationValidation";
import ReservationSuccess from "../pages/ReservationSuccess";
import AdminStatistics from "../pages/admin/AdminStatistics";
import AdminMessages from "../pages/admin/AdminMessages";
import FloatingMessenger from "../component/FloatingMessenger/FloatingMessenger";
import { MessengerProvider, useMessenger } from "../contexts/MessengerContext";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import MemberLayout from "../layouts/MemberLayout";
import AdminLayout from "../layouts/AdminLayout";
import ShowcaseLayout from "../layouts/vitrine/ShowcaseLayout";
import AccueilVitrine from "../layouts/vitrine/AccueilVitrine";
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
            <ShowcaseHomePage />
          </ShowcaseLayout>
        } />

        {/* PAGE D'ACCUEIL PAR DÉFAUT - VITRINE */}
        <Route path="/" element={
          <AccueilVitrine />
        } />

        {/* PAGE GALERIE */}
        <Route path="/galerie" element={
          <Galerie />
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

        
        {/* MEMBER MESSAGES PAGE */}
        <Route path="/member/messages" element={
          <ProtectedRoute>
            <MemberLayout activeNav="messages">
              <Messages />
            </MemberLayout>
          </ProtectedRoute>
        } />

        {/* MEMBER LOCATION SALLE PAGE */}
        <Route path="/location-salle" element={
          <ProtectedRoute>
            <LocationSalle />
          </ProtectedRoute>
        } />

        {/* RESERVATION VALIDATION PAGE */}
        <Route path="/reservation-validation" element={
          <ProtectedRoute>
            <ReservationValidation />
          </ProtectedRoute>
        } />

        {/* RESERVATION SUCCESS PAGE */}
        <Route path="/reservation-success" element={
          <ProtectedRoute>
            <ReservationSuccess />
          </ProtectedRoute>
        } />

        {/* MEMBER ACCOUNT PAGE */}
        <Route path="/member/account" element={
          <ProtectedRoute>
            <ProfileMembre />
          </ProtectedRoute>
        } />

        {/* PROFILE PAGE */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileMembre />
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

        {/* INSCRIPTION PAGE */}
        <Route path="/inscription/:activiteId" element={
          <ProtectedRoute>
            <MainLayout>
              <Inscription />
            </MainLayout>
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

        {/* ADMIN MESSAGES */}
        <Route path="/admin/messages" element={
          <ProtectedRoute>
            <AdminLayout activeNav="messages">
              <AdminMessages />
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
