import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import MemberSidebar from '../../components/MemberSidebar';
import '../../styles/pages/MemberProfile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('profile');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    date_naissance: '',
    genre: '',
    lieu_naissance: '',
    profession: '', 
    bio: '',
    avatar: null
  });

  useEffect(() => {
    const member = AuthService.getCurrentMember();
    if (!member) {
      navigate('/login');
      return;
    }
    setCurrentUser(member);
    
    // Initialiser le formulaire avec les données du membre
    setFormData({
      prenom: member.prenom || '',
      nom: member.nom || '',
      email: member.email || '',
      telephone: member.telephone || '',
      adresse: member.adresse || '',
      date_naissance: member.date_naissance || '',
      genre: member.genre || '',
      lieu_naissance: member.lieu_naissance || '',
      profession: member.profession || '',
      bio: member.bio || '',
      avatar: member.avatar || null
    });
    
    setLoading(false);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/api/member/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedMember = await response.json();
        setCurrentUser(updatedMember);
        
        // Mettre à jour le localStorage
        localStorage.setItem('member', JSON.stringify(updatedMember));
        sessionStorage.setItem('member', JSON.stringify(updatedMember));
        
        setEditing(false);
        alert('Profil mis à jour avec succès!');
      } else {
        throw new Error('Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Réinitialiser le formulaire avec les données actuelles
    const member = AuthService.getCurrentMember();
    setFormData({
      prenom: member.prenom || '',
      nom: member.nom || '',
      email: member.email || '',
      telephone: member.telephone || '',
      adresse: member.adresse || '',
      date_naissance: member.date_naissance || '',
      genre: member.genre || '',
      lieu_naissance: member.lieu_naissance || '',
      profession: member.profession || '',
      bio: member.bio || '',
      avatar: member.avatar || null
    });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <MemberSidebar activeNav={activeNav} />
        <main className="main-content">
          <div className="loading-container">
            <div className="loading-spinner">Chargement du profil...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <MemberSidebar activeNav={activeNav} />
      <main className="main-content">
        <div className="profile-container">
          <div className="profile-header">
            <h1>Mon Profil</h1>
            <button 
              className={`edit-btn ${editing ? 'cancel' : 'edit'}`}
              onClick={editing ? handleCancel : () => setEditing(true)}
            >
              {editing ? '✕ Annuler' : '✏️ Modifier'}
            </button>
          </div>

          <div className="profile-content">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <div className="avatar">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      <span className="avatar-icon">👤</span>
                    </div>
                  )}
                </div>
                
                {editing && (
                  <div className="avatar-upload">
                    <label htmlFor="avatar-upload">
                      <span className="upload-icon">📷</span>
                      Changer l'avatar
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prenom">Prénom</label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    disabled={!editing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nom">Nom</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    disabled={!editing}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telephone">Téléphone</label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="adresse">Adresse</label>
                  <textarea
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    disabled={!editing}
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="genre">Genre</label>
                  <select
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    disabled={!editing}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="lieu_naissance">Lieu de Naissance</label>
                  <input
                    type="text"
                    id="lieu_naissance"
                    name="lieu_naissance"
                    value={formData.lieu_naissance}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="Ex: Antananarivo, Madagascar"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profession">Profession</label>
                  <input
                    type="text"
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="Ex: Développeur, Enseignant..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="bio">Biographie</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!editing}
                    rows={4}
                    placeholder="Parlez-nous de vous-même..."
                  />
                </div>
              </div>

              {editing && (
                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={loading}>
                    {loading ? 'Sauvegarde...' : '💾 Sauvegarder'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
