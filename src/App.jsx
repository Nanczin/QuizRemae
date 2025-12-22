import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import MemoryGame from './pages/MemoryGame';
import DiagnosisLoading from './pages/DiagnosisLoading';
import Results from './pages/Results';
import VSL from './pages/VSL';
import Checkout from './pages/Checkout';
import PixelTracker from './components/PixelTracker';
import AudioController from './components/AudioController';

function App() {
  return (
    <Router>
      <PixelTracker />
      <AudioController />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/memory-game" element={<MemoryGame />} />
        <Route path="/diagnosis-loading" element={<DiagnosisLoading />} />
        <Route path="/results" element={<Results />} />
        <Route path="/vsl" element={<VSL />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
