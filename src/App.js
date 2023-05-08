import React from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Menu from "./components/Menu";
import BluePage from "./pages/BluePage";
import RedPage from "./pages/RedPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/" element={<hr />} />
      <Route path="/red" element={<RedPage />} />
      <Route path="/blue" element={<BluePage />} />
    </Routes>
  );
};

export default App;
