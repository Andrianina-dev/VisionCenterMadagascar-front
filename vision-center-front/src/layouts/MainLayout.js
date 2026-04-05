import React from "react";
import Header from '../components/layout/Header';
import Content from '../components/layout/Content';
import Footer from '../components/layout/Footer';

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <Content>
        {children}
      </Content>
      <Footer />
    </>
  );
};

export default MainLayout;

