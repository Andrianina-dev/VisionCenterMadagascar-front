import React from "react";

const MainLayout = ({ children }) => {
  return (
    <>
      <header className="header">
        Vision Center Madagascar
      </header>

      <main>
        {children}
      </main>
    </>
  );
};
export default MainLayout;
