import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ActiviteService {
    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Obtenir les activités ouvertes avec images pour l'accueil
    async getActivitesOuvertes() {
        try {
            const response = await this.api.get('/participant/activites/ouvertes');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des activités ouvertes:', error);
            throw error;
        }
    }

    // Obtenir les activités populaires pour l'accueil
    async getActivitesPopulaires() {
        try {
            const response = await this.api.get('/participant/activites/populaires');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des activités populaires:', error);
            throw error;
        }
    }

    // Obtenir les détails d'une activité spécifique
    async getActiviteDetails(id) {
        try {
            const response = await this.api.get(`/participant/activites/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de l\'activité:', error);
            throw error;
        }
    }

    // Obtenir l'URL complète de l'image
    getImageUrl(imagePath) {
        if (!imagePath) {
            return '/images/default-activity.jpg'; // Image par défaut
        }
        
        // Si l'URL est déjà en base64 (commence par data:image)
        if (imagePath.startsWith('data:image/')) {
            return imagePath; // Retourner le base64 tel quel
        }
        
        // Si l'URL est déjà complète (commence par http)
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // Si c'est un chemin relatif qui commence par /
        if (imagePath.startsWith('/')) {
            return `${API_BASE_URL.replace('/api', '')}${imagePath}`;
        }
        
        // Si c'est un chemin storage (format Laravel)
        if (imagePath.includes('storage/')) {
            return `${API_BASE_URL.replace('/api', '')}/${imagePath}`;
        }
        
        // Cas par défaut : ajouter /storage/
        return `${API_BASE_URL.replace('/api', '')}/storage/${imagePath}`;
    }

    // Formater la date pour l'affichage
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Formater la date courte
    formatDateShort(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
        });
    }

    // Vérifier si une activité est complète
    isActivityFull(activity) {
        if (!activity.capacite) return false; // Capacité illimitée
        return activity.nb_participants >= activity.capacite;
    }

    // Calculer le pourcentage de places restantes
    getRemainingPlacesPercentage(activity) {
        if (!activity.capacite) return 100; // Capacité illimitée
        const percentage = ((activity.capacite - activity.nb_participants) / activity.capacite) * 100;
        return Math.max(0, Math.min(100, percentage));
    }

    // Obtenir le statut de l'activité pour l'affichage
    getActivityStatus(activity) {
        if (activity.est_complete) {
            return { text: 'Complet', class: 'bg-red-100 text-red-800', icon: '❌' };
        }
        
        const now = new Date();
        const activityDate = new Date(activity.date_heure_activite);
        
        if (activityDate < now) {
            return { text: 'Terminé', class: 'bg-gray-100 text-gray-800', icon: '✅' };
        }
        
        return { text: 'Ouvert', class: 'bg-green-100 text-green-800', icon: '✅' };
    }

    // Obtenir les activités à venir triées par date
    getUpcomingActivities(activities) {
        return activities
            .filter(activity => new Date(activity.date_heure_activite) > new Date())
            .sort((a, b) => new Date(a.date_heure_activite) - new Date(b.date_heure_activite));
    }

    // Obtenir les activités du jour
    getTodayActivities(activities) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return activities.filter(activity => {
            const activityDate = new Date(activity.date_heure_activite);
            return activityDate >= today && activityDate < tomorrow;
        });
    }

    // Obtenir les activités de cette semaine
    getThisWeekActivities(activities) {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        
        return activities.filter(activity => {
            const activityDate = new Date(activity.date_heure_activite);
            return activityDate >= startOfWeek && activityDate < endOfWeek;
        });
    }
}

export default new ActiviteService();
