import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/authContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="homepage">
      <div className="homepage-content">
        <motion.div
          className="homepage-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="homepage-title">
            {isAuthenticated ? `Welcome, ${user?.name || 'User'}!` : 'Welcome'}
          </h1>
          <p className="homepage-subtitle">Your journey starts here</p>

          <div className="homepage-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="homepage-btn homepage-btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signin" className="homepage-btn homepage-btn-primary">
                  Sign In
                </Link>
                <Link to="/signup" className="homepage-btn homepage-btn-secondary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        .homepage {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%);
          padding: 2rem;
        }

        .homepage-content {
          text-align: center;
          max-width: 600px;
        }

        .homepage-hero {
          padding: 3rem;
          background: rgba(39, 39, 42, 0.6);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          border: 1px solid rgba(161, 161, 170, 0.1);
        }

        .homepage-title {
          font-size: 3.5rem;
          font-weight: 700;
          color: #fafafa;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #10b981, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .homepage-subtitle {
          font-size: 1.25rem;
          color: #a1a1aa;
          margin: 0 0 2rem 0;
        }

        .homepage-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .homepage-btn {
          padding: 0.875rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .homepage-btn-primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          border: none;
        }

        .homepage-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        }

        .homepage-btn-secondary {
          background: transparent;
          color: #fafafa;
          border: 1px solid rgba(161, 161, 170, 0.3);
        }

        .homepage-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(161, 161, 170, 0.5);
        }

        @media (max-width: 480px) {
          .homepage-title {
            font-size: 2.5rem;
          }

          .homepage-subtitle {
            font-size: 1rem;
          }

          .homepage-hero {
            padding: 2rem 1.5rem;
          }

          .homepage-actions {
            flex-direction: column;
          }

          .homepage-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
