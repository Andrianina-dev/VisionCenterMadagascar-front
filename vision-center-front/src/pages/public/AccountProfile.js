import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './AccountProfile.css';

const AccountProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');

  const handleBack = () => {
    navigate('/bookings');
  };

  return (
    <div className="account-page">
      {/* Sidebar Component */}
      <Sidebar activeNav="account" />

      {/* Main Content */}
      <main className="account-main">
        <div className="account-container">
          {/* Profile Section */}
          <section className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format" 
                  alt="Profile"
                />
                <button className="edit-avatar-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
              </div>
              <div className="profile-info">
                <h2>Nasrullah Fath</h2>
                <p className="profile-email">nasrullah.fath@example.com</p>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <div className="account-tabs">
            <button 
              className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Information
            </button>
            <button 
              className={`tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
            <button 
              className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'personal' && (
              <div className="personal-info">
                <div className="info-grid">
                  <div className="info-group">
                    <label>First Name</label>
                    <input type="text" defaultValue="Nasrullah" />
                  </div>
                  <div className="info-group">
                    <label>Last Name</label>
                    <input type="text" defaultValue="Fath" />
                  </div>
                  <div className="info-group">
                    <label>Email</label>
                    <input type="email" defaultValue="nasrullah.fath@example.com" />
                  </div>
                  <div className="info-group">
                    <label>Phone Number</label>
                    <input type="tel" defaultValue="+33 6 42 23 32 32" />
                  </div>
                  <div className="info-group">
                    <label>Date of Birth</label>
                    <input type="date" defaultValue="1990-01-01" />
                  </div>
                  <div className="info-group">
                    <label>Gender</label>
                    <select defaultValue="male">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button className="cancel-btn">Cancel</button>
                  <button className="save-btn">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="security-info">
                <div className="security-section">
                  <h3>Change Password</h3>
                  <div className="info-grid">
                    <div className="info-group">
                      <label>Current Password</label>
                      <input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="info-group">
                      <label>New Password</label>
                      <input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="info-group">
                      <label>Confirm New Password</label>
                      <input type="password" placeholder="Confirm new password" />
                    </div>
                  </div>
                  <button className="save-btn">Update Password</button>
                </div>

                <div className="security-section">
                  <h3>Two-Factor Authentication</h3>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-title">Enable 2FA</span>
                      <span className="toggle-desc">Add an extra layer of security to your account</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="preferences-info">
                <div className="preferences-section">
                  <h3>Notification Settings</h3>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-title">Email Notifications</span>
                      <span className="toggle-desc">Receive booking confirmations and updates via email</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-title">SMS Notifications</span>
                      <span className="toggle-desc">Get important updates via SMS</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-title">Push Notifications</span>
                      <span className="toggle-desc">Receive notifications in your browser</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="preferences-section">
                  <h3>Language & Region</h3>
                  <div className="info-grid">
                    <div className="info-group">
                      <label>Language</label>
                      <select defaultValue="en">
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                    <div className="info-group">
                      <label>Timezone</label>
                      <select defaultValue="utc+1">
                        <option value="utc+1">UTC+1 (Paris)</option>
                        <option value="utc+0">UTC+0 (London)</option>
                        <option value="utc-5">UTC-5 (New York)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountProfile;
