import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDonors from "./pages/AdminDonors";
import AdminHospitals from "./pages/AdminHospitals";
import AdminBloodBanks from "./pages/AdminBloodBanks";



import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-donors" element={<AdminDonors />} />
        <Route path="/admin-hospitals" element={<AdminHospitals />} />
        <Route path="/admin-bloodbanks" element={<AdminBloodBanks />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
