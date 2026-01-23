import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './Profile.css';

const Profile = () => {
  const [activeNav, setActiveNav] = React.useState('bookings');
  
  // Données de réservation - vous pouvez les remplacer par des données dynamiques
  const bookings = [
    {
      id: "5234521436",
      status: "pending",
      cancelTimer: "24:59:00",
      total: 1231,
      action: "pay"
    },
    {
      id: "5234521437",
      status: "canceled",
      total: 2352,
      action: "rebook"
    },
    {
      id: "5234521438",
      status: "pending",
      cancelTimer: "12:30:15",
      total: 890,
      action: "pay"
    },
    {
      id: "5234521439",
      status: "canceled",
      total: 1567,
      action: "rebook"
    }
  ];

  const [activeTab, setActiveTab] = React.useState("all");
  const [selectedBooking, setSelectedBooking] = React.useState(null);

  return (
    <div className="booking-page">
      {/* Main Content */}
      <main className="main-content">
        <div className="booking-container">
          {/* Header */}
          <header className="booking-header">
            <div className="header-content">
              <button className="back-btn" onClick={() => window.history.back()}>
                ← Back
              </button>
              <h1>My Booking</h1>
            </div>
          </header>

          {/* Description Section */}
          <section className="description-section">
            <p className="description">
              List of your bookings within the last 90 days.<br />
              Go to the "Order History" page to view order history over 90 days.
            </p>
          </section>

        {/* Order History Section */}
        <section className="order-history-section">
          <h2>Order History</h2>
          
          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Bookings
            </button>
            <button 
              className={`tab ${activeTab === "waiting" ? "active" : ""}`}
              onClick={() => setActiveTab("waiting")}
            >
              Waiting For Payment
            </button>
            <button 
              className={`tab ${activeTab === "paid" ? "active" : ""}`}
              onClick={() => setActiveTab("paid")}
            >
              Paid
            </button>
          </div>

          {/* Bookings List */}
          <div className="bookings-list">
            {bookings.map((booking, index) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header-row">
                  <span className="order-id">Order ID: {booking.id}</span>
                  {booking.status === "pending" && booking.cancelTimer && (
                    <span className="cancel-timer">
                      Booking will be canceled in {booking.cancelTimer}
                    </span>
                  )}
                  {booking.status === "canceled" && (
                    <span className="canceled-badge">Booking has been canceled</span>
                  )}
                </div>

                <div className="divider"></div>

                <div className="booking-details">
                  <div className="total-section">
                    <div className="total-label">Total</div>
                    <div className="total-amount">USD {booking.total.toLocaleString()}</div>
                  </div>

                  <div className="action-buttons">
                    {booking.action === "pay" ? (
                      <>
                        <button className="email-btn">
                          Send payment detail to email
                        </button>
                        <button className="pay-btn">
                          Continue to payment
                        </button>
                      </>
                    ) : (
                      <button className="rebook-btn">
                        Book this tour again?
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Section */}
        <footer className="booking-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Company</h3>
              <p>France</p>
              <p>96 Avenue du Général de Gaulle</p>
              <p>92130, Paris - France</p>
              <p>+33 (0)6 42 23 32 32</p>
            </div>

            <div className="footer-section">
              <h3>Mediagenc</h3>
              <p>NG 261, Arrasienne</p>
              <p>301, Arrasienne</p>
            </div>

            <div className="footer-section">
              <h3>Legal</h3>
              <ul className="legal-links">
                <li><a href="#">Mentions légales</a></li>
                <li><a href="#">Data Charter</a></li>
                <li><a href="#">Cookies</a></li>
                <li><a href="#">Sitemap</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Get an application</h3>
              <button className="app-download-btn">
                Download App
              </button>
            </div>
          </div>
        </footer>
        </div>
      </main>
    </div>
  );
};

export default Profile;