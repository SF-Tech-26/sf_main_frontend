import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/authContext';
import EventsPage from './pages/EventsPage';
import SubEventsPage from './pages/SubEventsPage';
import EventDetailPage from './pages/EventDetailPage';
import MyRegistrations from './pages/MyRegistrations';
import Accommodation from './pages/accommodation';


import Dashboard from './components/Dashboard'
import { Routes, Route, Navigate } from "react-router-dom";
import Report from './pages/Report'
import RegisterEvent from './pages/RegisterEvents'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          {/* Events Routes */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:genre" element={<SubEventsPage />} />
          <Route path="/events/:genre/:eventId" element={<EventDetailPage />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />

          {/* Other Routes */}
          <Route path="/accommodation" element={<Accommodation />} />

          {/* Default Route */}
          <Route path="/" element={<EventsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
    <>
      
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aman" element={<Accommodation />} />
        <Route path="/register" element={<RegisterEvent />} />
        <Route path="/report" element={<Report />} />
        <Route path='/profile' element={<Profile />} />

         {/* 🔹 Default route */}
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* 🔹 Auth routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

      </Routes>


    </>
  )
}

export default App;
