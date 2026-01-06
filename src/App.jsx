import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/authContext';
import EventsPage from './pages/EventsPage';
import SubEventsPage from './pages/SubEventsPage';
import EventDetailPage from './pages/EventDetailPage';
import MyRegistrations from './pages/MyRegistrations';
import Accommodation from './pages/accommodation';

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
}

export default App;
