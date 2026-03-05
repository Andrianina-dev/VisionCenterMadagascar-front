import React from 'react';
import '../styles/components/MemberLayout.css';

const MemberLayout = ({ children }) => {
  return (
    <div className="member-layout">
      {/* Main Content */}
      <main className="member-main">
        {children}
      </main>
    </div>
  );
};

export default MemberLayout;
