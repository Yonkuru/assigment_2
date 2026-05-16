import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Assignment1 from './pages/Assignment1';
import Assignment2 from './pages/Assignment2';
import Combined from './pages/Combined';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/assignment1"  element={<Assignment1 />} />
        <Route path="/assignment2"  element={<Assignment2 />} />
        <Route path="/combined"     element={<Combined />} />
      </Routes>
    </BrowserRouter>
  );
}
