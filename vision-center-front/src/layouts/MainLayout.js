import React from "react";

const MainLayout = ({ children }) => {
  return (
    <>
      <header className="header">
      </header>

      <main>
        {children}
      </main>
    </>
  );
};
export default MainLayout;
