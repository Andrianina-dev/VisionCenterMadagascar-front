import React from 'react';
import ShowcaseHeader from '../../components/showcase/ShowcaseHeader';
import ShowcaseFooter from '../../components/showcase/ShowcaseFooter';
import './ShowcaseLayout.css';

const ShowcaseLayout = ({ children }) => {
  return (
    <div className="showcase-layout">
      <ShowcaseHeader />
      <main className="showcase-main">
        {children}
      </main>
      <ShowcaseFooter />
    </div>
  );
};

export default ShowcaseLayout;
