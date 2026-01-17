import React from "react";
import AppRouter from "./routes/AppRouter";
import FloatingMessenger from "./component/FloatingMessenger/FloatingMessenger";

function App() {
  return (
    <>
      <AppRouter />
      <FloatingMessenger />
    </>
  );
}

export default App;
