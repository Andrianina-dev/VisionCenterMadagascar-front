// Service pour gérer les messages de statut des réservations
const ReservationStatusService = {
  // Récupérer les messages de statut depuis le backend
  getStatusMessages: async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/status-messages/${reservationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.messages;
      } else {
        console.error('Erreur:', data.message);
        return {};
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      return {};
    }
  },

  // Obtenir le message approprié selon le statut
  getMessage: (messages, type) => {
    return messages[type] || null;
  }
};

export default ReservationStatusService;
