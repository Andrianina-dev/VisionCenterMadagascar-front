import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignUp from "../pages/auth/SignUp";
import MemberLogin from "../pages/auth/MemberLogin";
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
import FloatingMessenger from "../component/FloatingMessenger/FloatingMessenger";
import { MessengerProvider, useMessenger } from "../contexts/MessengerContext";

// ✅ AJOUT ICI
import AccueilVitrineSimple from "../layouts/vitrine/AccueilVitrineSimple";
import AccueilVitrine from "../layouts/vitrine/SiteVitrine";
import APropos from "../pages/public/APropos";

// Pages non-membre
import NonMemberDashboard from "../pages/non-member/NonMemberDashboard";
import PaymentPage from "../pages/non-member/PaymentPage";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import MemberLayout from "../layouts/MemberLayout";
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
        
        {/* NON-MEMBRES */}
        <Route path="/paiement-reservation-salle" element={
          <ProtectedRoute>
            <NonMemberDashboard />
          </ProtectedRoute>
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
          <AccueilVitrineSimple />
        } />
        
        {/* SITE VITRINE COMPLET */}
        <Route path="/site-vitrine" element={
          <AccueilVitrine />
        } />
        
        {/* PAGE ACCUEIL SIMPLE */}
        <Route path="/accueil" element={
          <AccueilVitrineSimple />
        } />
      
        {/* PAGE À PROPOS */}
        <Route path="/a-propos" element={
          <APropos />
        } />
      
        {/* GALERIE */}
        <Route path="/galerie" element={
          <Galerie />
        } />

        {/* ESPACE MEMBRE */}
        <Route path="/espace-membre" element={
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