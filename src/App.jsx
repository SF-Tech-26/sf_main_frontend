import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/authContext';
import { EventProvider } from './context/eventContext';
import Contingent from './pages/contingent';

// Page imports
import EventsPage from './pages/EventsPage';
import SubEventsPage from './pages/SubEventsPage';
import EventDetailPage from './pages/EventDetailPage';
import MyRegistrations from './pages/MyRegistrations';
import Accommodation from './pages/accommodation';
import Dashboard from './components/Dashboard';
import Report from './pages/Report';
import RegisterEvent from './pages/RegisterEvents';
import Profile from './pages/Profile';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import FAQ from './pages/FAQ';
import AftermoviePage from './pages/AftermoviePage';
import Gallery from './pages/Gallery';
import Merch from './pages/Merch';
import Navbar from './components/Navbar';
import ForgotPassword from './pages/ForgetPassword.jsx';
// import Profile from './pages/Profile';


function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Navbar />
        <Toaster position="top-center" />
        <Routes>
          {/* Events Routes */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:genre" element={<SubEventsPage />} />
          <Route path="/events/:genre/:eventId" element={<EventDetailPage />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<RegisterEvent />} />
          <Route path="/report" element={<Report />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Accommodation Routes */}
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/Contingent" element={<Contingent />} />

          {/* Auth Routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* FAQ Routes */}
          <Route path="/faq" element={<FAQ />} />

          {/* Aftermovie Route */}
          <Route path="/aftermovie" element={<AftermoviePage />} />

          {/* Gallery Route */}
          <Route path="/gallery" element={<Gallery />} />

          {/* Merch Route */}
          <Route path="/merch" element={<Merch />} />

          {/* Homepage Route */}
          <Route path="/" element={<HomePage />} />
        </Routes>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
