import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class MessageService {
  // Récupérer tous les messages envoyés par l'admin pour le membre connecté
  async getAdminMessages() {
    try {
      const member = AuthService.getCurrentMember();
      if (!member) {
        throw new Error('Membre non connecté');
      }

      const response = await fetch(`${API_URL}/public/messages/admin?member_id=${member.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des messages');
      }

      return response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des messages admin:', error);
      throw error;
    }
  }

  // Marquer un message comme lu
  async markAsRead(messageId) {
    try {
      const member = AuthService.getCurrentMember();
      if (!member) {
        throw new Error('Membre non connecté');
      }

      const response = await fetch(`${API_URL}/public/messages/${messageId}/read?member_id=${member.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error('Erreur lors du marquage du message comme lu');
      }

      return response.json();
    } catch (error) {
      console.error('Erreur lors du marquage du message comme lu:', error);
      throw error;
    }
  }

  // Récupérer le nombre de messages non lus
  async getUnreadCount() {
    try {
      const member = AuthService.getCurrentMember();
      if (!member) {
        throw new Error('Membre non connecté');
      }

      const response = await fetch(`${API_URL}/public/messages/unread/count?member_id=${member.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error('Erreur lors du comptage des messages non lus');
      }

      return response.json();
    } catch (error) {
      console.error('Erreur lors du comptage des messages non lus:', error);
      throw error;
    }
  }

  // Pour l'admin: envoyer un message à un membre
  async sendToMember(memberId, messageData) {
    try {
      const admin = AuthService.getCurrentAdmin();
      if (!admin) {
        throw new Error('Admin non connecté');
      }

      const response = await fetch(`${API_URL}/api/admin/messages/send/${memberId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include', // Important pour les cookies de session admin
        body: JSON.stringify({
            message: message,
            recipient_id: memberId,  // Corrigé: utiliser recipient_id au lieu de membre_id
            recipient_email: recipientEmail
          })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message au membre');
      }

      return response.json();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message au membre:', error);
      throw error;
    }
  }

  // Pour l'admin: récupérer tous les messages envoyés
  async getSentMessages() {
    try {
      const admin = AuthService.getCurrentAdmin();
      if (!admin) {
        throw new Error('Admin non connecté');
      }

      const response = await fetch(`${API_URL}/api/admin/messages`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include' // Important pour les cookies de session admin
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des messages envoyés');
      }

      return response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des messages envoyés:', error);
      throw error;
    }
  }
}

export default new MessageService();
