import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import bg from '../assets/images/FAQs Background.png';

export default function SpringFestFAQ() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "What are the dates For Spring Fest 2026?",
      answer: "The 65th Edition of Spring Fest will be from 23rd to 25th January 2026."
    },
    {
      question: "What is the duration of registration process during the fest?",
      answer: "The registration process typically takes 15–30 minutes. You can register online before the fest or at the venue during the event."
    },
    {
      question: "Would any transportation services be provided to reach the campus?",
      answer: "Yes, shuttle services will be available from major points in the city including railway station and bus stands."
    },
    {
      question: "Where should I report first in IIT Kharagpur when reaching inside the Campus?",
      answer: "Please report to the Main Registration Desk located at Netaji Auditorium."
    },
    {
      question: "How can I participate in Spring Fest 2026?",
      answer: "Register on the official website, select events, complete payment, and receive confirmation via email."
    },
    {
      question: "Who are the celebrities performing at the star nights?",
      answer: "The celebrity lineup will be announced soon. Stay tuned to official Spring Fest platforms."
    }
  ];

  return (
    <div className="relative overflow-hidden px-3 sm:px-4 md:px-10 py-10 min-h-[100svh]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto pt-8 sm:pt-12 md:pt-20 pb-8 sm:pb-12">
        {/* Heading */}
        <h1
          className="
            text-3xl xs:text-4xl sm:text-5xl md:text-6xl
            text-center mb-10 sm:mb-14
            text-cyan-400 tracking-widest
          "
          style={{ fontFamily: 'Vampire Wars' }}
        >
          FAQs
        </h1>

        {/* FAQ Cards */}
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {faqs.map((faq, index) => {
            const isOpen = openFAQ === index;

            return (
              <div
                key={index}
                onClick={() => setOpenFAQ(isOpen ? null : index)}
                className="
                  bg-white/10 backdrop-blur-md rounded-xl
                  border border-white/20 cursor-pointer
                  transition-all duration-300 hover:bg-white/20
                  
                  w-[88%] xs:w-[90%] sm:w-full
                  mx-auto

                  p-2.5 xs:p-3 sm:p-5 md:p-6
                "
              >
                {/* Question */}
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className="
                      text-white
                      text-xs xs:text-sm sm:text-base md:text-lg
                      leading-snug
                    "
                    style={{ fontFamily: 'Vampire Wars', fontWeight: 300 }}
                  >
                    {faq.question}
                  </h3>

                  <ChevronDown
                    size={16}
                    className={`text-cyan-400 mt-1 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </div>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isOpen
                      ? 'max-h-[320px] xs:max-h-[380px] sm:max-h-[500px] mt-2 sm:mt-3 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <p
                    className="
                      text-white/70
                      text-xs xs:text-sm sm:text-base md:text-lg
                      leading-relaxed
                    "
                    style={{ fontFamily: 'Vampire Wars', fontWeight: 400 }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
