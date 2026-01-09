import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

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
    const [activeCategory, setActiveCategory] = useState("General");

    const toggleItem = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const filteredData = faqData.filter(cat => cat.category === activeCategory);

    return (
        <div className="faq-page">
            <div className="faq-container">
                <motion.div
                    className="faq-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/" className="faq-back-btn">← Back</Link>
                    <h1 className="faq-title">Frequently Asked Questions</h1>
                    <p className="faq-subtitle">Find answers to common questions about Spring Fest</p>
                </motion.div>

                <div className="faq-categories">
                    {faqData.map((cat, idx) => (
                        <button
                            key={idx}
                            className={`faq-category-btn ${activeCategory === cat.category ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.category)}
                        >
                            {cat.category}
                        </button>
                    ))}
                </div>

                <motion.div
                    className="faq-content"
                    key={activeCategory}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
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

                <div className="faq-contact">
                    <p>Still have questions?</p>
                    <Link to="/signin" className="faq-contact-btn">Contact Support</Link>
                </div>
            </div>

            <style>{`
        .faq-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%);
          padding: 2rem;
        }

        .faq-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .faq-back-btn {
          position: absolute;
          left: 0;
          top: 0;
          color: #a1a1aa;
          text-decoration: none;
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          background: rgba(39, 39, 42, 0.6);
          border: 1px solid rgba(161, 161, 170, 0.2);
          transition: all 0.2s;
        }

        .faq-back-btn:hover {
          color: #fafafa;
          border-color: rgba(161, 161, 170, 0.4);
        }

        .faq-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #10b981, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.5rem 0;
        }

        .faq-subtitle {
          color: #a1a1aa;
          font-size: 1.1rem;
          margin: 0;
        }

        .faq-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .faq-category-btn {
          padding: 0.6rem 1.25rem;
          border-radius: 20px;
          border: 1px solid rgba(161, 161, 170, 0.2);
          background: rgba(39, 39, 42, 0.4);
          color: #a1a1aa;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .faq-category-btn:hover {
          border-color: rgba(16, 185, 129, 0.4);
          color: #fafafa;
        }

        .faq-category-btn.active {
          background: linear-gradient(135deg, #10b981, #059669);
          border-color: transparent;
          color: #fff;
        }

        .faq-content {
          background: rgba(39, 39, 42, 0.6);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          border: 1px solid rgba(161, 161, 170, 0.1);
          overflow: hidden;
        }

        .faq-item {
          border-bottom: 1px solid rgba(161, 161, 170, 0.1);
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          width: 100%;
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
          border: none;
          color: #fafafa;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s;
        }

        .faq-question:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .faq-icon {
          color: #10b981;
          font-size: 0.75rem;
          margin-left: 1rem;
          flex-shrink: 0;
        }

        .faq-answer {
          overflow: hidden;
        }

        .faq-answer p {
          padding: 0 1.5rem 1.25rem 1.5rem;
          margin: 0;
          color: #a1a1aa;
          line-height: 1.6;
        }

        .faq-contact {
          text-align: center;
          margin-top: 2rem;
          padding: 2rem;
          background: rgba(39, 39, 42, 0.4);
          border-radius: 16px;
          border: 1px solid rgba(161, 161, 170, 0.1);
        }

        .faq-contact p {
          color: #a1a1aa;
          margin: 0 0 1rem 0;
        }

        .faq-contact-btn {
          display: inline-block;
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .faq-contact-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        }

        @media (max-width: 640px) {
          .faq-page {
            padding: 1rem;
          }

          .faq-title {
            font-size: 1.75rem;
            margin-top: 2.5rem;
          }

          .faq-subtitle {
            font-size: 0.95rem;
          }

          .faq-back-btn {
            position: static;
            display: inline-block;
            margin-bottom: 1rem;
          }

          .faq-question {
            font-size: 0.95rem;
            padding: 1rem;
          }

          .faq-answer p {
            padding: 0 1rem 1rem 1rem;
            font-size: 0.9rem;
          }

          .faq-category-btn {
            font-size: 0.8rem;
            padding: 0.5rem 1rem;
          }
        }
      `}</style>
        </div>
    );
}
