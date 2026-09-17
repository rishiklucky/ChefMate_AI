import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RecipeProvider } from './context/RecipeContext';
import { TimerProvider } from './context/TimerContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingTimerCard from './components/cooking/FloatingTimerCard';

import LandingPage from './pages/LandingPage';
import RecipeGuidePage from './pages/RecipeGuidePage';
import SavedRecipesPage from './pages/SavedRecipesPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <RecipeProvider>
        <TimerProvider>
          <Router>
            <div className="d-flex flex-column min-vh-100 bg-surface">
              <Navbar />
              <main className="flex-grow-1 pt-5">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/guide" element={<RecipeGuidePage />} />
                  <Route path="/saved" element={<SavedRecipesPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <FloatingTimerCard />
            </div>
          </Router>
        </TimerProvider>
      </RecipeProvider>
    </AuthProvider>
  );
}
