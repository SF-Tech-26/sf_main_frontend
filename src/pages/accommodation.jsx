import React, { StrictMode, useState } from "react";
import "./accommodation.css";
import { useNavigate } from "react-router-dom";

function Accommodation() {
    const info = [
  {
    id: 1,
    heading: "ABOUT US",
    content: "Spring Fest, since its inception in 1960, has stood as a shining example of cultural excellence, growing exponentially in scale, participation, and grandeur. Renowned for its world-class performances, diverse events, and a vibrant atmosphere, the fest attracts massive crowds, creating an unparalleled celebration of art and culture. Amidst this vastness, ensuring hospitality becomes a cornerstone, reflecting the event's commitment to creating a welcoming and memorable experience for all its guests."
  },
  {
    id: 2,
    heading: "\n",
    content: "At SPRING FEST, IIT Kharagpur, we work hard to ensure the utmost satisfaction of every participant and guest. Our team will not leave a single stone unturned to provide secure and comfortable accommodation to you and make you feel at home even away from home. This year, hospitality management is one of the core focuses of TEAM SPRING FEST 2026, so we look forward to making your stay delightful and your experience truly unforgettable. Guests will be provided with accommodation from the date of their arrival to 26th of January, along with free access to all the events that make Spring Fest a celebration like no other."
  },
  {
    id: 3,
    heading: "TIMING",
    content: "Check-In Time - 6:00 A.M. to 10:00 P.M. on Your Check-In Date.\nCheck-Out Time - Anytime on or Before Your Check-Out Date.\n\nThe arena and registration desk will remain closed between 7 PM and 10 PM on the fest dates. All the services will resume after 10 PM during fest dates."
  },
  {
    id: 4,
    heading: "REGISTRATION CHARGES",
    content: "Registration Charges at Spring Fest, IIT Kharagpur, is charged ₹2449 INR only- per head for 3 Days and 4 Nights package with 3 pronites passes, complimentary accommodation and SF Kit. From 22 January 2026 08:00 A.M. to 25 January 2026 10:00 A.M"
  },
  {
    id: 5,
    heading: "CANCELLATION POLICY",
    content: "Any queries regarding Cancellation or Refund shall be emailed to accommodation@springfest.in. The subject of the email should be 'Cancellation of Accommodation'. For any cancellations before the deadline, 75% of the total amount shall be refunded within 10 working days after the festival; there shall be no refunds for cancellations after the deadline. Deadline of cancellation: 20th January 2026."
  },
  {
    id: 6,
    heading: "What is Contingent?",
    content: "A Contingent refers to a group of participants representing a particular college at Spring Fest."
  },
  {
    id: 7,
    heading: "Benefits of a Contingent",
    content: "1. Unified Accommodation: As a part of a contingent, all members will be accommodated together in the same common room, ensuring a seamless and cohesive experience. Separate accommodations will be provided for boys and girls.\n2. Contingent Championship: The contingent with the highest cumulative score at the end of the Fest will be crowned the Contingent Champion, adding a sense of pride and achievement to your college's participation."
  },
  {
    id: 8,
    heading: "What is a Contingent Championship?",
    content: "In the Contingent Championship all the contingent will compete and the Contingent with the highest score in the end will win the trophy."
  },
  {
    id: 9,
    heading: "How do I register my contingent?",
    content: "To discover this information, kindly navigate to our Accommodation Portal, where you'll find a section dedicated specifically to the contingent. Explore the various options in that section to get detailed insights into accommodation details tailored for contingents. If you have any further queries, the portal should provide comprehensive assistance."
  },
  {
    id: 10,
    heading: "See you here at Spring Fest 2026.",
    content: "Regards,\nSpring Fest"
  }
];

const faq = [
  {
    id: 1,
    heading: "What are the dates of Spring Fest 2026?",
    content: "The 67th Edition of Spring Fest will be organised from 22nd to 25th January 2026."
  },
  {
    id: 2,
    heading: "What is the duration of the registration process during the fest?",
    content: "Registration process will start from 22nd and will be open during all the time of fest except for 6pm to 11pm during the time of star nights. Entry to the star nights will only be allowed after the completion of registration."
  },
  {
    id: 3,
    heading: "Would any transportation services be provided to reach the campus?",
    content: "Yes, Transportation services (Buses and Cargo) would be provided by Spring Fest from Kharagpur Railway Station to inside the Campus without any charges."
  },
  {
    id: 4,
    heading: "Where should I report first in IIT Kharagpur when reaching inside the Campus?",
    content: "Reaching inside the campus, participants have to first report to the Registration Desk of Spring Fest situated near the Department of Computer Science and Engineering and the Main Building."
  },
  {
    id: 5,
    heading: "How can I participate in Spring Fest 2026?",
    content: "You can register on the site, after which you'd come across the dashboard. From there, you can choose to register for multiple events. You can participate in events after registering and paying the registration fees. Paying the registration fees provides you with accommodation and star nights passes."
  },
  {
    id: 6,
    heading: "Who are the celebrities performing at the star nights?",
    content: "The celebrities performing at the star nights of Spring Fest 2026 will be announced soon on our Facebook and Instagram pages."
  },
  {
    id: 7,
    heading: "Can I book accommodation for friends from different colleges?",
    content: "Yes, you can book accommodation for your group regardless of college affiliations. Please mention this in your booking form."
  },
  {
    id: 8,
    heading: "Are meals included in the accommodation fee?",
    content: "Basic breakfast is included. Lunch and dinner can be purchased separately at the campus dining halls at nominal rates."
  },
  {
    id: 9,
    heading: "What is the cancellation policy?",
    content: "Cancellations made 7 days before the event are eligible for an 80% refund. No refunds are issued for cancellations within 7 days of the event."
  },
  {
    id: 10,
    heading: "Is parking available?",
    content: "Yes, designated parking areas are available near the hostels for participants arriving by personal vehicles."
  },
  {
    id: 11,
    heading: "Are there separate accommodations for male and female participants?",
    content: "Yes, separate hostels are allocated for male and female participants with adequate security measures."
  },
  {
    id: 12,
    heading: "Can I extend my stay beyond the festival dates?",
    content: "Extension requests are subject to availability. Please contact the accommodation team at least 3 days in advance."
  },
  {
    id: 13,
    heading: "What is the refund policy for Spring Fest 2026?",
    content: "Registrations cancelled after 1st January 2026 are eligible for a 50% refund, while cancellations after 8th January 2026 are non-refundable."
  }
];

const rules = [
  { 
    id: 1, 
    heading: "\n", 
    content: "We care about our campus as much as you care about enjoying it to the fullest in Spring Fest. Let's follow these simple rules to make this SF a memorable one and not a dreadful one just because of something you did wrong." 
  },
  { 
    id: 2, 
    heading: "\n", 
    content: "At a time, the payment of maximum 1 participants can be done with the same transaction ID. The participant/team is requested to note down their transaction ID/ accommodation ID and keep it with them for their convenience." 
  },
  {
    id: 3,
    heading: "\n",
    content: "Participants from a college may have a maximum of 2 professors/faculty with their institute ID card. They will be charged and provided accommodation only on showing the ID card. The organising team will try their best to provide separate rooms to the faculty but it is not promised."
  },
  {
    id: 4,
    heading: "\n",
    content: "The accommodation charges and other necessary details regarding the payment will be available under the tab 'Accommodation Charges'."
  },
  {
    id: 5,
    heading: "\n",
    content: "Accommodation tent will remain closed from 6 pm to 11 pm throughout the Starnights from 22nd to 25th January 2026. Any call/request for accommodation at that time will not be entertained. But in case you do visit the campus at this time, you may sit at Old Badminton Court, Gymkhana"
  },
  {
    id: 6,
    heading: "\n",
    content: "Accommodation will be provided to the participants from the check-in time to the check-out time as mentioned on the Accommodation Portal/Participant Slip. If the participant/team stays for more than the check-out time and refuses to vacate his allotted space, a fine of Rs. 500 per person will be levied on the participant/team."
  },
  {
    id: 7,
    heading: "\n",
    content: "Students are not permitted to eat in the hall mess. However, they are welcome to dine at hall canteens, food stalls, and other eateries available on campus."
  },
  {
    id: 8,
    heading: "\n",
    content: "Participants may be required to share mattresses as per the allotment guidelines."
  },
  {
    id: 9,
    heading: "\n",
    content: "Blankets can be obtained from the Accommodation tent with a security deposit of ₹100 per blanket. The deposit will be refunded upon return of the blanket in good condition."
  },
  {
    id: 10,
    heading: "\n",
    content: "Blankets should be submitted at the Accommodation tent while leaving the campus else the security deposit will not be returned. Refundable amount would be refunded only when the Accommodation slip is produced at the Finance tent along with the blankets on 26th and 29th January from 4pm-6:30pm & 11pm onwards"
  },
  {
    id: 11,
    heading: "\n",
    content: "Blankets should not be exchanged. Additionally, blankets and mattresses are not allowed to be taken outside the hall. If found misplaced or taken outside, the participant will incur a fine of ₹500 per mattress. Please adhere to these guidelines to avoid penalties."
  },
  {
    id: 12,
    heading: "\n",
    content: "Participants found littering anywhere within the Hall Premises shall be penalised as accordingly by Hall Authorities."
  },
  {
    id: 13,
    heading: "\n",
    content: "Smoking, alcoholism, or any form of substance abuse is strictly prohibited inside the hostel premises. The organizing committee reserves the right to fine or deport any participant or team found violating these rules. Such actions will be carried out at the full discretion of the Organizing Committee. Additionally, no refund will be issued in the case of deportation. Please ensure adherence to these rules to avoid any consequences."
  },
  {
    id: 14,
    heading: "\n",
    content: "Frisking of your belongings for security reasons may be conducted at any time if there is suspicion of possession of alcohol, drugs, or any prohibited substances. This will be done by security officials in your presence, and you are kindly requested to cooperate with them during the process."
  },
  {
    id: 15,
    heading: "\n",
    content: "Any form of molestation, theft, harm, or similar offenses will be treated as severe criminal offenses. The case will be immediately reported to the police station, and your college administration will also be informed. Such actions may result in suspension from your college or criminal charges."
  },
  {
    id: 16,
    heading: "\n",
    content: "In case of any complaint made against the behaviour of the participant which causes any discomfort to the hostel boarders or other participants, the Organizing Committee's decision would be final and binding."
  },
  {
    id: 17,
    heading: "\n",
    content: "It is the responsibility of the participants to maintain the hostel property. In case of any damage to the hostel property, participants will be fined or deported based on the extent of the damage, as decided by the organizing committee."
  },
  {
    id: 18,
    heading: "\n",
    content: "Additionally, please ensure that you carry your institute ID card, institute medical book, and library card with you at all times to avoid any inconvenience."
  },
  {
    id: 19,
    heading: "\n",
    content: "All rooms have to be vacated by 25th January 2026 strictly by 2pm."
  }
];

    const map = [
  {
    id: 1,
    heading: "Location Overview",
    content: "Kharagpur is about 140 km west of Kolkata and is well connected to the city by road and rail. Kharagpur can be reached in about 2 hours by train or 3 hours by car from Kolkata's Howrah railway station. Kharagpur is also linked by direct train services to the majority of the country's major cities. The Institute is about a 10-minute drive (5 km) from the Kharagpur railway station and a 5 min walk from Hijli station. To get to the Institute, you can hire a private taxi, autorickshaw, or cycle rickshaw."
  },
  {
    id: 2,
    heading: "By Air",
    content: "The nearest airport to Kharagpur is Netaji Subhas Chandra Bose International Airport, Kolkata (CCU), approximately 120-140 km away from IIT Kharagpur. From Kolkata Airport, take a taxi to Kharagpur from the airport taxi stand. The distance is close to 140 kilometres. Alternatively, take a taxi to Howrah railway station and board regular express or local trains to Kharagpur."
  },
  {
    id: 3,
    heading: "By Train",
    content: "Kharagpur Railway Station is the nearest railhead and is well-connected to major cities across India. There are frequent trains to Kharagpur from most major cities. Alternatively, you can reach the Howrah Railway station and take a local or express train to Kharagpur. The Institute is located 5 kilometres from Kharagpur Railway Station and the nearest railway station to IIT Kharagpur is Hijli Station."
  },
  {
    id: 4,
    heading: "By Road",
    content: "IIT Kharagpur is well-connected by road from Kolkata and other major cities. You can book a cab to reach Kharagpur via road from Howrah. The distance is approximately 140 km. State-run and private buses are also available from these cities to Kharagpur."
  },
  {
    id: 5,
    heading: "Transportation Services",
    content: "Spring Fest provides free transportation services (buses and cargo) from Kharagpur Railway Station to the IIT Kharagpur campus without any charges. Buses will be provided by SPRING FEST at Kharagpur railway station for the guests to reach IIT Kharagpur campus."
  },
  {
    id: 6,
    heading: "Campus Arrival",
    content: "Once inside the campus, participants should first report to the Registration Desk located near the Department of Computer Science and Engineering and the Main Building."
  }
];
   
    const [cards, setCard] = useState(info);
    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [activeTab, setActiveTab] = useState("Information");
    const navigate = useNavigate();

    const handleCategoryChange = (categoryData, tabName) => {
        setCard(categoryData);
        setActiveTab(tabName);
    };

    const handleCardClick = (cardData) => {
        setSelectedCard(cardData);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <StrictMode>
            <div className="acco-main-container">
                <div className="acco-container-1">
                    
                    {/* Separate Container for Heading */}
                    <div className="acco-info-box">
                        <h1 className="acco-head acco-heading">
                            <span>ACCOMMODATIONS</span>
                            <p style={{fontFamily: 'Jolly Lodger', color: '#ff4d4d', fontSize: '1.5rem', marginTop: '5px'}}>{activeTab}</p>
                        </h1>
                    </div>

                    {/* Independent Paragraph */}

                    <div className="acco-container-2">
                        <div className="acco-bnt-con">
                            <button 
                                className={`acco-nav-btn ${activeTab === "Information" ? "acco-active" : ""}`} 
                                onClick={() => handleCategoryChange(info, "Information")}
                            >
                                <i className="fa-solid fa-circle-info"></i> <span>INFO</span>
                            </button>
                            <button 
                                className={`acco-nav-btn ${activeTab === "FAQ's" ? "acco-active" : ""}`} 
                                onClick={() => handleCategoryChange(faq, "FAQ's")}
                            >
                                <i className="fa-solid fa-circle-question"></i> <span>FAQ</span>
                            </button>
                            <button 
                                className={`acco-nav-btn ${activeTab === "Rules" ? "acco-active" : ""}`} 
                                onClick={() => handleCategoryChange(rules, "Rules")}
                            >
                                <i className="fa-solid fa-scroll"></i> <span>RULES</span>
                            </button>
                            <button 
                                className={`acco-nav-btn ${activeTab === "MAP" ? "acco-active" : ""}`} 
                                onClick={() => handleCategoryChange(map, "MAP")}
                            >
                                <i className="fa-solid fa-map-location-dot"></i> <span>MAP</span>
                            </button>
                            
                            <button 
                                className="acco-nav-btn"
                                id="btn-contingent"
                                onClick={() => {navigate("/Contingent")}}
                            >
                                <i className="fa-solid fa-users-rays"></i>
                                <span>Contingent</span>
                            </button>
                        </div>
                    </div>

                    <div className="acco-cards-container">
                        {cards.map((card) => (
                            <div className="acco-card-loader" key={card.id}>
                                <div className="acco-card">
                                    <div className="acco-m-con" onClick={() => handleCardClick(card)}>
                                        <h1 className="acco-head">{card.heading}</h1>
                                        <p className="acco-p">{card.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {activeTab === "MAP" && (
                        <div className="map-wrapper">
                            <h2 className="map-title">IIT KHARAGPUR CAMPUS</h2>
                            <iframe
                                title="IIT Kharagpur Map"
                                src="https://www.google.com/maps?q=Indian+Institute+of+Technology+Kharagpur&output=embed"
                                width="100%"
                                height="450"
                                className="light-map-frame"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    )}
                </div>

                {showModal && selectedCard && (
                    <div className="acco-modal-overlay" onClick={handleCloseModal}>
                        <div className="acco-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="acco-close-modal-btn" onClick={handleCloseModal}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                            <h2>{selectedCard.heading}</h2>
                            <div className="acco-modal-body">
                                <p>{selectedCard.content}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StrictMode>
    );
}

export default Accommodation;