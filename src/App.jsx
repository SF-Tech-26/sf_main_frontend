import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/authContext';

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

function App() {
  return (
    <AuthProvider>
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

        {/* Other Routes */}
        <Route path="/accommodation" element={<Accommodation />} />

        {/* Auth Routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        

        {/* Default Route */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
