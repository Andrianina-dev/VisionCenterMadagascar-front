import React from "react";
import AppRouter from "./routes/AppRouter";
import './pages/messageContact'; // Importer les bulles flottantes IA

function App() {
  return (
    <>
      <AppRouter />
      {/* Les bulles flottantes IA s'affichent automatiquement sur toutes les pages */}
    </>
  );
}

export default App;
