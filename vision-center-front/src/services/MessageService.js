// MessageService.js - Service pour gérer les messages API
import axios from 'axios';

// Configuration d'axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adapter selon votre config
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

class MessageService {
  // Obtenir tous les expéditeurs (liste des conversations)
  async getSenders() {
    try {
      const response = await api.get('/messages/senders');
      return {
        success: response.data.success,
        data: response.data.data || [],
        count: response.data.count || 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des expéditeurs:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        data: []
      };
    }
  }

  // Obtenir les messages d'un expéditeur spécifique
  async getMessagesBySender(senderId) {
    try {
      const response = await api.get(`/messages/sender/${senderId}`);
      return {
        success: response.data.success,
        data: response.data.data || [],
        count: response.data.count || 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        data: []
      };
    }
  }

  // Envoyer un message (contact admin depuis React)
  async sendMessage(messageData) {
    try {
      const response = await api.post('/messages/contact', messageData);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Répondre à un message (pour l'admin depuis React)
  async replyToMessage(messageData) {
    try {
      const response = await api.post('/messages/reply', messageData);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Obtenir les messages de l'utilisateur courant
  async getCurrentUserMessages(userId) {
    try {
      const response = await api.get(`/messages/current/${userId}`);
      return {
        success: response.data.success,
        data: response.data.data || [],
        error: response.data.error
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des messages de l\'utilisateur:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        data: []
      };
    }
  }

  // Formatter les données pour l'affichage
  formatSender(sender) {
    return {
      id: sender.id_utilisateur,
      name: sender.utilisateur?.nom_utilisateur || 'Utilisateur inconnu',
      email: sender.utilisateur?.email_utilisateur || '',
      lastMessage: sender.message || 'Aucun message',
      time: new Date(sender.date_envoi).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      date: new Date(sender.date_envoi).toLocaleDateString('fr-FR'),
      unread: sender.lu === false ? 1 : 0,
      avatar: this.getInitials(sender.utilisateur?.nom_utilisateur || 'UN')
    };
  }

  // Formatter les messages pour l'affichage
  formatMessages(messages) {
    return messages.map(msg => ({
      id: msg.id_message,
      text: msg.message,
      sender: msg.reponse_admin ? 'admin' : 'user',
      time: new Date(msg.date_envoi).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      read: msg.lu,
      senderName: msg.reponse_admin ? 'Admin' : (msg.utilisateur?.nom_utilisateur || 'Utilisateur')
    }));
  }

  // Obtenir les initiales pour l'avatar
  getInitials(name) {
    if (!name) return 'UN';
    const parts = name.toUpperCase().split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return parts[0].substring(0, 2);
  }

  // Obtenir une couleur aléatoire pour l'avatar
  getAvatarColor(name) {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FECA57', '#48C9B0', '#9B59B6', '#E74C3C', 
      '#3498DB', '#2ECC71'
    ];
    
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
}

export default new MessageService();
