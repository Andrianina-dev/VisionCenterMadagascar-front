// useMessages.js - Hook React pour gérer les messages
import { useState, useEffect, useCallback } from 'react';
import MessageService from '../services/MessageService';

export const useMessages = () => {
  const [senders, setSenders] = useState([]);
  const [selectedSender, setSelectedSender] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger la liste des expéditeurs
  const loadSenders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await MessageService.getSenders();
    
    if (result.success) {
      const formattedSenders = result.data.map(sender => 
        MessageService.formatSender(sender)
      );
      setSenders(formattedSenders);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, []);

  // Charger les messages d'un expéditeur
  const loadMessages = useCallback(async (senderId) => {
    setLoading(true);
    setError(null);
    
    const result = await MessageService.getMessagesBySender(senderId);
    
    if (result.success) {
      const formattedMessages = MessageService.formatMessages(result.data);
      setMessages(formattedMessages);
      
      // Mettre à jour l'expéditeur sélectionné
      const sender = senders.find(s => s.id === senderId);
      setSelectedSender(sender);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, [senders]);

  // Envoyer un message
  const sendMessage = useCallback(async (messageData) => {
    setLoading(true);
    setError(null);
    
    const result = await MessageService.sendMessage(messageData);
    
    if (result.success) {
      // Ajouter le message à la conversation
      const newMessage = {
        id: Date.now(),
        text: messageData.message,
        sender: 'user',
        time: new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        read: false,
        senderName: messageData.sender_name || 'Utilisateur'
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Réinitialiser le formulaire
      return { success: true, message: result.message };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
    
    setLoading(false);
  }, []);

  // Effacer l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Sélectionner un expéditeur
  const selectSender = useCallback((sender) => {
    setSelectedSender(sender);
    loadMessages(sender.id);
  }, [loadMessages]);

  // Initialiser au chargement du composant
  useEffect(() => {
    loadSenders();
  }, [loadSenders]);

  return {
    // État
    senders,
    selectedSender,
    messages,
    loading,
    error,
    
    // Actions
    loadSenders,
    loadMessages,
    sendMessage,
    selectSender,
    clearError
  };
};
