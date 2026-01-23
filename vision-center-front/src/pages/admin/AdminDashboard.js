import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState({
    totalActivities: 0,
    totalMembers: 0,
    averageParticipation: 0,
    popularActivities: [],
    monthlyEvolution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Charger les statistiques depuis l'API
    const loadStatistics = async () => {
      try {
        setLoading(true);
        
        // Appel simple à l'API
        const response = await fetch('http://localhost:8000/api/public/dashboard/statistics');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Données API:', data);
        
        setStatistics({
          totalActivities: data.total_activites || 0,
          totalMembers: data.total_participants || 0,
          averageParticipation: parseFloat(data.taux_participation_global) || 0,
          popularActivities: data.activites_populaires || [],
          monthlyEvolution: data.evolution_mensuelle || []
        });
        
        setError(null);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur de chargement: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">
          <h2>📊 Chargement des statistiques...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error">
          <h2>❌ Erreur</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>📊 Tableau de bord et statistiques décisionnelles</h1>
        <p>Vision Center Madagascar - Vue d'ensemble des performances</p>
      </div>

      {/* Cartes statistiques principales */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{statistics.totalActivities}</h3>
            <p>Nombre total d'activités</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{statistics.totalMembers}</h3>
            <p>Nombre total de participants</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{statistics.averageParticipation.toFixed(1)}%</h3>
            <p>Taux de participation moyen</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>{statistics.popularActivities.length}</h3>
            <p>Activités populaires</p>
          </div>
        </div>
      </div>

      {/* Activités populaires */}
      <div className="section">
        <h2>🏆 Activités les plus populaires</h2>
        <div className="activities-list">
          {statistics.popularActivities.map((activity, index) => (
            <div key={activity.id_activite} className="activity-item">
              <div className="activity-rank">#{index + 1}</div>
              <div className="activity-info">
                <h4>{activity.titre_activite}</h4>
                <p>📍 {activity.lieu_activite}</p>
                <p>👥 {activity.nb_participants} participants</p>
                <p>📊 {activity.taux_participation}% taux</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Évolution mensuelle */}
      <div className="section">
        <h2>📅 Évolution mensuelle des activités</h2>
        <div className="evolution-list">
          {statistics.monthlyEvolution.map((month, index) => (
            <div key={index} className="evolution-item">
              <h4>{month.nom_mois} {month.annee}</h4>
              <p>📊 {month.nb_activites} activités</p>
              <p>👥 {month.total_participants} participants</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
