import React from 'react';
import HeroSection from '../../components/showcase/HeroSection';
import ServicesSection from '../../components/showcase/ServicesSection';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <ServicesSection />
    </div>
  );
};

export default HomePage;
