import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider, useSession } from "./context/SessionContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ExpertPortal from "./pages/ExpertPortal";
import CitizenPortal from "./pages/CitizenPortal";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSession();
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Header />
      <main className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/expert" element={<ProtectedRoute><ExpertPortal /></ProtectedRoute>} />
          <Route path="/citizen" element={<ProtectedRoute><CitizenPortal /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SessionProvider>
          <AppLayout />
        </SessionProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}