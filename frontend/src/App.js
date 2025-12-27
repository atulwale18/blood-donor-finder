import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/hospital" element={<HospitalDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
