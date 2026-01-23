import React from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  const services = [
    {
      icon: '👁️',
      title: 'Examens de Vue',
      description: 'Examens complets de la vue avec équipement moderne pour un diagnostic précis.',
      features: ['Test d\'acuité visuelle', 'Mesure de la pression oculaire', 'Examen du fond d\'œil']
    },
    {
      icon: '👓',
      title: 'Lunettes sur Mesure',
      description: 'Large sélection de montures et verres adaptés à votre style et votre vision.',
      features: ['Verres progressifs', 'Traitement anti-reflet', 'Montures designer']
    },
    {
      icon: '🔮',
      title: 'Lentilles de Contact',
      description: 'Solutions de lentilles confortables pour toutes les corrections visuelles.',
      features: ['Lentilles journalières', 'Lentilles mensuelles', 'Lentilles colorées']
    },
    {
      icon: '🏥',
      title: 'Traitement Médical',
      description: 'Prise en charge des maladies oculaires et suivi personnalisé.',
      features: ['Glaucome', 'Cataracte', 'Conjonctivite']
    },
    {
      icon: '🔬',
      title: 'Chirurgie Réfractive',
      description: 'Solutions chirurgicales pour corriger définitivement votre vision.',
      features: ['LASIK', 'PKR', 'Implants intra-oculaires']
    },
    {
      icon: '👶',
      title: 'Ophtalmologie Pédiatrique',
      description: 'Soins spécialisés pour la santé visuelle des enfants.',
      features: ['Dépistage précoce', 'Strabisme', 'Amblyopie']
    }
  ];

  return (
    <section id="services" className="services-section">
      <div className="section-container">
        <div className="section-title">
          <h2>Nos Services</h2>
          <p>
            Une gamme complète de soins oculaires pour répondre à tous vos besoins 
            avec la technologie la plus avancée.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <span>{service.icon}</span>
              </div>
              <div className="service-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="services-cta">
          <h3>Besoin d'un conseil personnalisé ?</h3>
          <p>Notre équipe est là pour vous aider à choisir la solution adaptée à vos besoins.</p>
          <button className="btn-consultation">Prendre rendez-vous</button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
