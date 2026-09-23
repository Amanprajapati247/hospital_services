import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BottomNav } from './components/common/BottomNav';
import { CompareDrawer } from './components/common/CompareDrawer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { SearchPage } from './pages/public/SearchPage';
import { HospitalDetailPage } from './pages/public/HospitalDetailPage';
import { DoctorDetailPage } from './pages/public/DoctorDetailPage';
import { ComparePage } from './pages/public/ComparePage';
import { EmergencyPage } from './pages/public/EmergencyPage';
import { InsurancePage } from './pages/public/InsurancePage';
import { SchemesPage } from './pages/public/SchemesPage';
import { CostExplorerPage } from './pages/public/CostExplorerPage';
import { HealthLibraryPage } from './pages/public/HealthLibraryPage';
import { HealthArticleDetailPage } from './pages/public/HealthArticleDetailPage';
import { AiAssistantPage } from './pages/public/AiAssistantPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { DesignSystemPage } from './pages/public/DesignSystemPage';
import { JoinHospitalPage } from './pages/public/JoinHospitalPage';
import { HospitalLoginPage } from './pages/public/HospitalLoginPage';

// Dashboards
import { PatientDashboard } from './pages/dashboards/PatientDashboard';
import { HospitalDashboard } from './pages/dashboards/HospitalDashboard';
import { DoctorDashboard } from './pages/dashboards/DoctorDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/hospitals" element={<SearchPage />} />
          <Route path="/hospitals/:id" element={<HospitalDetailPage />} />
          <Route path="/doctors" element={<SearchPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/insurance" element={<InsurancePage />} />
          <Route path="/government-schemes" element={<SchemesPage />} />
          <Route path="/cost-explorer" element={<CostExplorerPage />} />
          <Route path="/health" element={<HealthLibraryPage />} />
          <Route path="/health/:slug" element={<HealthArticleDetailPage />} />
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          <Route path="/join-hospital" element={<JoinHospitalPage />} />
          <Route path="/hospital/login" element={<HospitalLoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Role-Based Dashboards */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/appointments" element={<PatientDashboard />} />
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>

      <CompareDrawer />
      <BottomNav />
      <Footer />
    </div>
  );
};
export default App;
