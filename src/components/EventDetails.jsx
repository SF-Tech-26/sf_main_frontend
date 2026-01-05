import { useParams, useNavigate } from 'react-router-dom';
import { eventData } from './Eventdata.js';
import './EventDetails.css';

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = eventData[eventId];

  if (!event) return null;

  return (
    <div className="event-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ←
      </button>

      <div className="event-card">
        <div className="left">
          <span className="badge">{event.category}</span>
          <h1>{event.title}</h1>
          <p className="tagline">{event.tagline}</p>

          <button className="cta">
            REGISTER NOW →
          </button>

          <p className="prize">PRIZE POOL<br />{event.prize}</p>
        </div>

        <div className="right">
          <section>
            <h3>✨ The Stage</h3>
            <p>{event.description}</p>
          </section>

          <section>
            <h3>📜 Protocols</h3>
            <ul>
              {event.protocols.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
