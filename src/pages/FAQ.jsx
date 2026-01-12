import { useState } from 'react';
import { ChevronDown, Triangle, Sparkles, Eye, Lightbulb, Zap, ChevronRight } from 'lucide-react';
import bg from '../assets/images/FAQs Background.png'; 

export default function SpringFestFAQ() {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      question: "What are the dates For Spring Fest 2026?",
      answer: "The 65th Edition of Spring Fest will be from 23rd to 25th January 2026.",
      icon: Triangle
    },
    {
      question: "What is the duration of registration process during the fest",
      answer: "Registration process will start from 22nd and will be open during all the time of fest except for 6pm to 11pm during the time of star nights. Entry to the star nights will only be allowed after the completion of registration.",
      icon: Sparkles
    },
    {
      question: "Would any transportation services be provided to reach the campus?",
      answer:"Yes, Transportation services(Buses and Cargo) would be provided by Spring Fest from Kharagpur Railway Station to inside the Campus without any charges.",
      icon: Eye
    },
    {
      question: "Where should I report first in IIT Kharagpur when reaching inside the Campus?",
      answer: "Reaching inside the campus, participants have to first report to the Registration Desk of Spring Fest situated near the Department of Computer Science and Engineering and the Main Building.",
      icon: Lightbulb
    },
    {
      question: "How can I participate in Spring Fest 2026?",
      answer: "You can register on the site, after which you'd come across the dashboard, from their you can choose to register for multiple events fulfilling their respective criteria. The payment portal of Spring Fest would soon be released and you may pay the fees after that inside the site itself. You can participate in events after registering and paying the registration fees of Spring Fest only. Paying the registration fees provides you with accomodation and starnights passes",
      icon: Zap
    },
    {
      question: "Who are the celebrities which are going to perform at the star nights of Spring Fest 2026?",
      answer: "The celebrities performing at the star nights of Spring Fest 2026 will be announced soon from the facebook,instagram page of Spring Fest, IIT Kharagpur.",
      icon: ChevronRight
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      ></div>

      {/* Optional overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <h1 className="text-6xl md:text-7xl font-bold mb-12 text-center tracking-wider text-cyan-400">
          FAQs
        </h1>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openFAQ === index;

            return (
              <div
                key={index}
                className={`relative backdrop-blur-md bg-white/5 rounded-3xl p-6 border border-white/10 transition-all duration-300 cursor-pointer hover:bg-white/10 ${
                  isOpen ? 'bg-white/10' : ''
                }`}
                onClick={() => setOpenFAQ(isOpen ? -1 : index)}
              >
                {/* Icon */}
                <div className="absolute top-6 right-6 text-cyan-400 opacity-50">
                  <Icon size={24} />
                </div>

                {/* Question */}
                <h3 className="text-white text-lg font-medium pr-12 mb-4">
                  {faq.question}
                </h3>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="bg-cyan-100 text-indigo-900 rounded-2xl p-4 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </div>

                {/* Expand indicator */}
                {!isOpen && (
                  <div className="absolute bottom-4 right-4">
                    <ChevronDown className="text-cyan-400 animate-bounce" size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
