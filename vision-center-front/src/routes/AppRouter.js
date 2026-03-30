import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import MemberLogin from "../pages/auth/MemberLogin";
import AdminLogin from "../pages/auth/AdminLogin";
import CodeVerification from "../pages/auth/CodeVerification";
import Home from "../pages/public/Home";
import Inscription from "../pages/public/Inscription";
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

// ✅ AJOUT ICI
import AccueilVitrineSimple from "../layouts/vitrine/AccueilVitrineSimple";
import AccueilVitrine from "../layouts/vitrine/SiteVitrine";

// Pages non-membre
import AccesNonMembre from "../pages/non-member/AccesNonMembre";
import MesReservations from "../pages/non-member/MesReservations";
import NonMemberDashboard from "../pages/non-member/NonMemberDashboard";
import PaymentPage from "../pages/non-member/PaymentPage";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import MemberLayout from "../layouts/MemberLayout";
import AdminLayout from "../layouts/AdminLayout";
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
        
        <Route path="/signup" element={
          <AuthLayout>
            <SignUp />
          </AuthLayout>
        } />
        
        <Route path="/admin/login" element={
          <AuthLayout>
            <AdminLogin />
          </AuthLayout>
        } />
        
        <Route path="/admin/code" element={
          <AuthLayout>
            <CodeVerification />
          </AuthLayout>
        } />

        {/* NON-MEMBRES */}
        <Route path="/acces-non-membre" element={
          <AuthLayout>
            <AccesNonMembre />
          </AuthLayout>
        } />
        
        <Route path="/mes-reservations" element={
          <AuthLayout>
            <MesReservations />
          </AuthLayout>
        } />

        <Route path="/non-member/dashboard" element={
          <ProtectedRoute>
            <NonMemberDashboard />
          </ProtectedRoute>
        } />

        <Route path="/payment/:id" element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } />

        <Route path="/paiement" element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } />

        {/* PAGE D'ACCUEIL */}
        <Route path="/" element={
          <AccueilVitrine />
        } />
        
        {/* PAGE ACCUEIL SIMPLE */}
        <Route path="/accueil" element={
          <AccueilVitrineSimple />
        } />
      
        {/* GALERIE */}
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

        {/* MAP */}
        <Route path="/map" element={
          <ProtectedRoute>
            <MainLayout>
              <MapSearch />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* ACTIVITES */}
        <Route path="/activites" element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* MEMBER */}
        <Route path="/member/dashboard" element={
          <ProtectedRoute>
            <MemberLayout activeNav="dashboard">
              <Home />
            </MemberLayout>
          </ProtectedRoute>
        } />

        <Route path="/member/messages" element={
          <ProtectedRoute>
            <MemberLayout activeNav="messages">
              <Messages />
            </MemberLayout>
          </ProtectedRoute>
        } />

        <Route path="/location-salle" element={
          <ProtectedRoute>
            <LocationSalle />
          </ProtectedRoute>
        } />

        <Route path="/reservation-validation" element={
          <ProtectedRoute>
            <ReservationValidation />
          </ProtectedRoute>
        } />

        <Route path="/reservation-success" element={
          <ProtectedRoute>
            <ReservationSuccess />
          </ProtectedRoute>
        } />

        <Route path="/member/account" element={
          <ProtectedRoute>
            <ProfileMembre />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileMembre />
          </ProtectedRoute>
        } />

        {/* DETAILS ACTIVITE */}
        <Route path="/activite/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <ActiviteDetails />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* INSCRIPTION */}
        <Route path="/inscription/:activiteId" element={
          <ProtectedRoute>
            <MainLayout>
              <Inscription />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* ADMIN */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout activeNav="dashboard">
              <AdminStatistics />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminLayout activeNav="dashboard">
              <AdminStatistics />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/statistics" element={
          <ProtectedRoute>
            <AdminLayout activeNav="statistics">
              <AdminStatistics />
            </AdminLayout>
          </ProtectedRoute>
        } />

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