import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import faqBG from '../assets/faqBG.png';
import faqCON from '../assets/faqCON.png';
import faqHEAD from '../assets/faqHEAD.PNG';
import wood from '../assets/wood.PNG';

const faqData = [
  {
    category: "General",
    questions: [
      {
        q: "What is Spring Fest?",
        a: "Spring Fest is the annual socio-cultural festival of IIT Kharagpur, one of the largest college festivals in Asia. It features a diverse range of events including music, dance, drama, literary arts, and much more."
      },
      {
        q: "When and where is Spring Fest held?",
        a: "Spring Fest is held annually at the IIT Kharagpur campus. The exact dates are announced each year on our official website and social media channels."
      },
      {
        q: "Who can participate in Spring Fest?",
        a: "Spring Fest is open to students from colleges and universities across India. Some events may have specific eligibility criteria which will be mentioned in the event details."
      }
    ]
  },
  {
    category: "Registration",
    questions: [
      {
        q: "How do I register for Spring Fest?",
        a: "You can register by creating an account on our website. Click on 'Sign Up', fill in your details, and you're ready to participate in various events."
      },
      {
        q: "Is there a registration fee?",
        a: "Basic registration is free. However, some premium events or accommodation may have separate charges. Check the specific event or accommodation page for details."
      },
      {
        q: "Can I register as a team?",
        a: "Yes! For group events, you can register as a team. The team leader should register first and then add team members through the dashboard."
      }
    ]
  },
  {
    category: "Events",
    questions: [
      {
        q: "What types of events are available?",
        a: "We have a wide variety of events including music competitions, dance battles, drama performances, literary events, art exhibitions, gaming tournaments, and many more."
      },
      {
        q: "How do I register for specific events?",
        a: "After logging in, go to the Events page, browse through the categories, select your desired event, and click 'Register'. Make sure to read the rules and eligibility criteria."
      },
      {
        q: "Can I participate in multiple events?",
        a: "Yes, you can participate in multiple events as long as there are no scheduling conflicts. Check the event timings carefully before registering."
      }
    ]
  },
  {
    category: "Accommodation",
    questions: [
      {
        q: "Is accommodation provided for outstation participants?",
        a: "Yes, we provide accommodation for outstation participants on a first-come-first-served basis. You can book accommodation through your dashboard after registration."
      },
      {
        q: "What are the accommodation charges?",
        a: "Accommodation charges vary based on the type and duration. Please check the Accommodation page on our website for detailed pricing."
      },
      {
        q: "What facilities are included in accommodation?",
        a: "Basic accommodation includes a bed, mattress, and access to common facilities. Meals can be purchased separately from the food stalls on campus."
      }
    ]
  },
  {
    category: "Support",
    questions: [
      {
        q: "How can I contact the organizers?",
        a: "You can reach us through the Contact page on our website, email us at support@springfest.in, or reach out on our social media handles."
      },
      {
        q: "I have a complaint. How do I report it?",
        a: "You can submit a complaint through the Complaints section in your dashboard. Our team will address it as soon as possible."
      },
      {
        q: "I forgot my password. What should I do?",
        a: "Click on 'Forgot Password' on the Sign In page. Enter your email address and follow the instructions sent to your email to reset your password."
      }
    ]
  }
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={onClick}>
        <span>{question}</span>
        <motion.span
          className="faq-icon"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredData = activeCategory ? faqData.filter(cat => cat.category === activeCategory) : [];

  return (
    <div className="faq-page">
      <div className="faq-container">
        <motion.div
          className="faq-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="faq-title">FAQ</h1>
        </motion.div>

        <div className="faq-categories">
          {faqData.map((cat, idx) => (
            <div key={idx} className="scroll-wrapper">
              {/* Scroll with category name */}
              <button
                className={`scroll-btn ${activeCategory === cat.category ? 'active' : ''}`}
                onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <div className="scroll-header">{cat.category}</div>
              </button>

              {/* Unfurling paper */}
              <AnimatePresence>
                {activeCategory === cat.category && (
                  <motion.div
                    className="paper-unfurl"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    exit={{ scaleY: 0, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.4, 0.0, 0.2, 1]
                    }}
                    style={{ transformOrigin: 'top' }}
                  >
                    <button
                      className="close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCategory(null);
                      }}
                    >
                      ✕
                    </button>
                    {filteredData.map((category, catIdx) => (
                      <div key={catIdx} className="faq-category-section">
                        {category.questions.map((item, qIdx) => (
                          <FAQItem
                            key={qIdx}
                            question={item.q}
                            answer={item.a}
                            isOpen={openItems[`${catIdx}-${qIdx}`]}
                            onClick={() => toggleItem(catIdx, qIdx)}
                          />
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600&family=Lora:wght@400;500&display=swap');

        .faq-page {
          min-height: 100vh;
          background-image: url(${faqBG});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          padding: 6rem 1rem 2rem 1rem;
          font-family: 'Cinzel', serif;
        }

        .faq-container {
          max-width: 550px;
          margin: 0 auto;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .faq-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          font-family: 'Cinzel Decorative', serif;
          letter-spacing: 3px;
          background: linear-gradient(to right,
            #fff 20%,
            #7dd3fc 50%,
            #fff 80%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 3s linear infinite;
          text-shadow: none;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .faq-subtitle {
          color: #94a3b8;
          font-size: 0.8rem;
          margin: 0;
          font-weight: 400;
          letter-spacing: 1px;
        }

        .faq-categories {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 2rem;
        }

        .scroll-wrapper {
          position: relative;
        }

        .scroll-btn {
          width: 100%;
          height: 100px;
          border: none;
          background-image: url(${faqHEAD});
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          margin-bottom: 0;
          animation: float 4s ease-in-out infinite;
        }

        .scroll-btn:hover {
          transform: translateY(-2px);
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
        }

        .scroll-btn.active {
          filter: drop-shadow(0 8px 16px rgba(168, 196, 160, 0.3));
          margin-bottom: 0;
        }

        .scroll-header {
          font-family: 'Cinzel', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 1.5px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
          padding: 0 2rem;
        }

        .paper-unfurl {
          margin-top: 0;
          background-image: url(${faqCON});
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 0 0 8px 8px;
          padding: 2.5rem 2rem 2rem 2rem;
          position: relative;
          filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4));
          min-height: 200px;
        }

        .close-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #f1f5f9;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          font-weight: 300;
          line-height: 1;
          z-index: 10;
        }

        .close-btn:hover {
          background: rgba(56, 189, 248, 0.2);
          transform: rotate(90deg);
        }

        .faq-item {
          border-bottom: 1px solid rgba(56, 189, 248, 0.1);
          margin-bottom: 0.5rem;
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          width: 100%;
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          font-family: 'Papyrus', 'Cinzel', serif;
          border-radius: 4px;
        }

        .faq-question:hover {
          background: rgba(56, 189, 248, 0.1);
        }

        .faq-icon {
          color: #64748b;
          font-size: 0.7rem;
          margin-left: 1rem;
          flex-shrink: 0;
        }

        .faq-answer {
          overflow: hidden;
        }

        .faq-answer p {
          padding: 0 1.25rem 1rem 1.25rem;
          margin: 0;
          color: #64748b;
          line-height: 1.7;
          font-size: 1rem;
          font-family: 'Papyrus', 'Cinzel', serif;
          font-weight: 500;
        }


        @media (max-width: 640px) {
          .faq-page {
            padding: 5rem 0.75rem 1rem 0.75rem;
          }

          .faq-container {
            max-width: 100%;
          }

          .faq-title {
            font-size: 1.35rem;
            margin-top: 1rem;
          }


          .scroll-btn {
            height: 80px;
          }

          .scroll-header {
            font-size: 1rem;
            padding: 0 1.5rem;
          }

          .paper-unfurl {
            padding: 2rem 1.25rem 1.25rem 1.25rem;
          }

          .faq-question {
            font-size: 0.9rem;
            padding: 0.9rem 1rem;
          }

          .faq-answer p {
            padding: 0 1rem 0.9rem 1rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}