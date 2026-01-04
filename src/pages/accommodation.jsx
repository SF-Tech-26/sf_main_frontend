import React, { StrictMode, useState } from "react";
import "./accommodation.css";

function Accommodation() {
    const info = [{id:1,heading:"ABOUT US",content:"Spring Fest, since its inception in 1960, has stood as a shining example of cultural excellence, growing exponentially in scale, participation, and grandeur. Renowned for its world-class performances, diverse events, and a vibrant atmosphere, the fest attracts massive crowds, creating an unparalleled celebration of art and culture. Amidst this vastness, ensuring hospitality becomes a cornerstone, reflecting the event's commitment to creating a welcoming and memorable experience for all its guests."},
                {id:2,heading:" ",content:"At SPRING FEST, IIT Kharagpur, we work hard to ensure the utmost satisfaction of every participant and guest. Our team will not leave a single stone unturned to provide secure and comfortable accommodation to you and make you feel at home even away from home. This year, hospitality management is one of the core focuses of TEAM SPRING FEST 2026, so we look forward to making your stay delightful and your experience truly unforgettable. Guests will be provided with accommodation from the date of their arrival to 27th of January , along with free access to all the events that make Spring Fest a celebration like no other."},
                {id:3,heading:"TIMING:",content:"Check-In Time - 6:00 A.M. to 10:00 P.M. on Your Check-In Date.\n Check-Out Time - Anytime on or Before Your Check-Out Date.\nThe arena and registration desk will remain closed between 7 PM and 10 PM on the fest dates. All the services will resume after 10 PM during fest dates."},
                {id:4,heading:"REGISTRATION CHARGES:",content:"Registration Charges at Spring Fest, IIT Kharagpur, is charged @2389 INR only/- per head for 3 Days and 4 Nights package with 3 pronites passes, complimentary accommodation and SF Kit. (From 23 January 2026 08:00 A.M. to 27 January 2026 10:00 A.M)"},
                {id:5,heading:"CANCELLATION POLICY:",content:"Any queries regarding Cancellation or Refund shall be emailed to accommodation@springfest.in . The subject of the email should be 'Cancellation of Accommodation'. For any cancellations before the deadline, 75% of the total amount shall be refunded within 10 working days after the festival; there shall be no refunds for cancellations after the deadline. Deadline of cancellation: 20th January 2026."},
                {id:6,heading:"What is Contingent?",content:"A Contingent refers to a group of participants representing a particular college at Spring Fest."},
                {id:7,heading:"Benefits of a Contingent:",content:"1.Unified Accommodation: As a part of a contingent, all members will be accommodated together in the same common room, ensuring a seamless and cohesive experience. Separate accommodations will be provided for boys and girls.\n2.Contingent Championship: The contingent with the highest cumulative score at the end of the Fest will be crowned the Contingent Champion, adding a sense of pride and achievement to your college's participation."},
                {id:8,heading:"What is a Contingent Championship?",content:"In the Contingent Championship all the contingent will compete and the Contingent with the highest score in the end will win the trophy."},
                {id:9,heading:"How do I register my contingent?",content:"To discover this information, kindly navigate to our Accommodation Portal, where you'll find a section dedicated specifically to the contingent. Explore the various options in that section to get detailed insights into accommodation details tailored for contingents. If you have any further queries, the portal should provide comprehensive assistance."},
                {id:10,heading:"See you here at Spring Fest 2026.",content:"\n Regards,\n \n Team Spring Fest"},
                    ];

    const faq = [
        { id: 1, heading: "What will be included in this price?", content: "The provided price includes the following:\n1.Pronites passes for access to all major performances.\n2.Registration fee for participation in the event.\n3.Complimentary accommodation to ensure a comfortable stay during the festival." },
        { id: 2, heading: "What is the payment procedure?", content:"To pay for registration and accommodation, go to springfest.in and log in or register if you haven't done so already. After logging in, click on the Accommodation button from the dashboard to access the accommodation section where you will find the payment option. Follow the prompts and fill in the details required to complete the payment. If you have any problems, refer to the support or contact information on the website. Complete both the registration step and the payment step to ensure you have arranged for accommodation so that things go smoothly at the event." },
        {id:3,heading:"How do I know I have paid for accommodation?",content:"Once you complete the registration and payment process through the portal, you will receive a confirmation email containing your transaction ID. Additionally, your payment status will be updated on the dashboard, allowing real-time visibility of your transaction. This seamless system ensures transparency and helps you track your payment easily. Keep an eye on your email for the transaction details and monitor your payment status on the dashboard for a smooth experience."},
        {id:4,heading:"What payment procedure is accepted?",content:"We offer flexible payment options to enhance your convenience. Choose from a variety of methods, including UPI, net banking, and debit/credit card payments. This ensures a seamless and secure transaction experience for our valued customers. Your preferred payment mode is just a click away, making the process quick and hassle-free. Join us in simplifying your payment journey with these diverse and accessible options. If the payment is coming from your Institute and it is not possible to pay online,please contact us for more knowledge about the same directly to the Spring Fest Team 2026. For details you can visit https://teams.springfest.in/"},
        {id:5,heading:"What are the documents that guests have to carry?",content:"1. Any valid Govt photo ID.\n2. Print out/screenshot of Email confirmation.\n3. Valid College ID for participants."},
        {id:6,heading:"Will the Acco tent be open 24x7?",content:"Yes, the Acco tent will be open 24x7, providing continuous support throughout the event. However, please note there will be a temporary interruption from 7 PM to 10 PM between January 24th and January 26th. We appreciate your understanding during this brief downtime."},
        {id:7,heading:"What kind of accommodation is provided?",content:"Accommodation will be provided on a shared basis inside the campus halls, with space for keeping luggage and other essential items.Girls and boys will be accommodated separately. The number of guests in a room will be decided by Spring Fest and will be allotted by the Spring fest team."},
        {id:8,heading:"Do the accommodation charges include food facilities too?",content:"Breakfast,Lunch and dinner is not included in the accommodation fee but can be purchased from the food court in the arena, night canteens and other stalls present on the campus."},
        {id:9,heading:"What are the food facilities inside the campus?",content:"The campus will have several food facilities to cater to your needs. The arena will feature a food outlet for convenient dining, while the SF Cafe provides a cozy spot for refreshments. For more options, the night canteen will offer a variety of food choices, ensuring there's something for everyone to enjoy."},
        {id:10,heading:"What about the hospital facility?",content:"In case anyone falls ill, they are advised to report at the accomodation desk so that appropriate arrangements can be made for them. A first aid kit shall also be present at the accomodation desk which can be availed by the guests."},
        {id:11,heading:"What about the security facilities during the fest in the campus?",content:"IIT Kharagpur campus has a vigilant and round-the-clock security service. To ensure the safety of the participants, there will be additional security guards in hostels in order to avoid thefts and other mishaps. There will be a Strong room for highly valuable products. Although the Spring Fest team will not take responsibility for any theft or other mishaps that happened at the accommodation. So guests are requested to take care of their luggage and valuable items."},
        {id:12,heading:"Where will I get my accommodation?",content:"You will be getting accommodation inside the campus in various halls depending upon availability."},
        {id:13,heading:"Can I enter the IIT-KGP campus anytime?",content:"You can enter IIT Main gate anytime by showing valid photo ID proof from 6 am to 10 pm, however, you need to have accommodation inside the campus to stay in campus after 10pm."},
        {id:14,heading:"We are a group of people not participating in any of the competitions or workshops and just coming to Spring Fest for enjoyment. Would we be provided accommodation?",content:"Yes, You just have to pay the Accommodation fees."},
        {id:15,heading:"Where do I have to report during the fest?",content:"You need to come to the Accommodation tent at the Spring Fest arena near the Computer science building."},
    ];

    const rules = [
        { id: 1, heading: "", content:"We care about our campus as much as you care about enjoying it to the fullest in Spring Fest. Let’s follow these simple rules to make this SF a memorable one and not a dreadful one just because of something you did wrong." },
        { id: 2, heading: "", content: "At a time, the payment of maximum 1 participants can be done with the same transaction ID. The participant/team is requested to note down their transaction ID & accommodation ID and keep it with them for their convenience." },
        {id:3,heading:"",content:"Participants from a college may have a maximum of 2 professors/faculty with their institute ID card. They will be charged and provided accommodation only on showing the ID card. The organising team will try their best to provide separate rooms to the faculty but it is not promised."},
        {id:4,heading:"",content:"The accommodation charges and other necessary details regarding the payment will be available under the tab Accommodation Charges."},
        {id:5,heading:"",content:"Accommodation tent will remain closed from 6 pm to 11 pm throughout the Starnights from 22nd to 25th January 2026. Any call/request for accommodation at that time will not be entertained. But in case you do visit the campus at this time, you may sit at Old Badminton Court, Gymkhana"},
        {id:6,heading:"",content:"Accommodation will be provided to the participants from the check-in time to the check-out time as mentioned on the Accommodation Portal/Participant Slip. If the participant/team stays for more than the check-out time and refuses to vacate his allotted space, a fine of Rs. 500 per person will be levied on the participant/team."},
        {id:7,heading:"",content:"Students are not permitted to eat in the hall mess. However, they are welcome to dine at hall canteens, food stalls, and other eateries available on campus."},
        {id:8,heading:"",content:"Participants may be required to share mattresses as per the allotment guidelines."},
        {id:9,heading:"",content:"Blankets can be obtained from the Accommodation tent with a security deposit of ₹100 per blanket. The deposit will be refunded upon return of the blanket in good condition."},
        {id:10,heading:"",content:"Blankets should be submitted at the Accommodation tent while leaving the campus else the security deposit will not be returned. Refundable amount would be refunded only when the Accommodation slip is produced at the Finance tent along with the blankets on 26th and 29th January from 4pm-6:30pm & 11pm onwards"},
        {id:11,heading:"",content:"Blankets should not be exchanged. Additionally, blankets and mattresses are not allowed to be taken outside the hall. If found misplaced or taken outside, the participant will incur a fine of ₹500 per mattress. Please adhere to these guidelines to avoid penalties."},
        {id:12,heading:"",content:"Participants found littering anywhere within the Hall Premises shall be penalised as accordingly by Hall Authorities."},
        {id:13,heading:"",content:"Smoking, alcoholism, or any form of substance abuse is strictly prohibited inside the hostel premises. The organizing committee reserves the right to fine or deport any participant or team found violating these rules. Such actions will be carried out at the full discretion of the Organizing Committee. Additionally, no refund will be issued in the case of deportation. Please ensure adherence to these rules to avoid any consequences."},
        {id:14,heading:"",content:"Frisking of your belongings for security reasons may be conducted at any time if there is suspicion of possession of alcohol, drugs, or any prohibited substances. This will be done by security officials in your presence, and you are kindly requested to cooperate with them during the process."},
        {id:15,heading:"",content:"Any form of molestation, theft, harm, or similar offenses will be treated as severe criminal offenses. The case will be immediately reported to the police station, and your college administration will also be informed. Such actions may result in suspension from your college or criminal charges."},
        {id:16,heading:"",content:"In case of any complaint made against the behaviour of the participant which causes any discomfort to the hostel boarders or other participants, the Organizing Committee’s decision would be final and binding."},
        {id:17,heading:"",content:"It is the responsibility of the participants to maintain the hostel property. In case of any damage to the hostel property, participants will be fined or deported based on the extent of the damage, as decided by the organizing committee."},
        {id:18,heading:"",content:"Additionally, please ensure that you carry your institute ID card, institute medical book, and library card with you at all times to avoid any inconvenience."},
        {id:19,heading:"",content:"All rooms have to be vacated by 28th January 2026 strictly by 2pm."},
    ];

    const map = [
        { id: 1, heading: "REACHING IIT", content: "Kharagpur is about 140 kms west of Kolkata and is well connected to the city by road and rail.\nKharagpur can be reached in about 2 hours by train or 3 hours by car from Kolkata's Howrah railway station. Kharagpur is also linked by direct train services to the majority of the country's major cities.\nThe Institute is about a 10-minute drive (5 km) from the Kharagpur railway station and a 5 min walk from Hijli station. To get to the Institute, you can hire a private taxi, autorickshaw, or cycle rickshaw.\n**Buses will be provided by SPRING FEST at Kharagpur railway station for the guests to reach IIT Kharagpur campus." },
        { id: 2, heading: "You can reach IIT Kharagpur in two ways:", content: "By Air: The nearest airport to Kharagpur is Kolkata's Netaji Subhas Chandra Bose International Airport (CCU). From Kolkata Airport, take a taxi to Kharagpur from the airport taxi stand. The distance is close to 140 Kilometres. Take a taxi to Howrah railway station. Regular express and local trains run to Kharagpur. The Institute is located 5 Kilometres from Kharagpur Railway Station.\nBy train: Kharagpur is well connected to most major cities of India by rail. The nearest railway station to IIT Kharagpur is Hijli Station. There are frequent trains to Kharagpur. Alternatively, you can reach the Howrah Railway station and take a local or express train to Kharagpur or Book a cab to reach Kharagpur via road. The distance is almost 140KM.\n" },
        {id:3,heading:"Some Important Things To Remember",content:"1. A Team ID will be allocated to the team on registration which shall be used for future references.\n2. No responsibility will be held by Spring Fest, IIT Kharagpur for any late, lost, or misdirected entries.\n3. All modes of official communication will be through the Spring fest e-mail. Participants are advised to keep track of all folders in their email accounts.\n4. Note that at any point of time the latest information will be the one mentioned on the website. However, registered participants will be informed through mail about any changes.\n5. The decision of the organizers or judges shall be treated as final and binding on all."}
    ];

    const [cards, setCard] = useState(info);
    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [activeTab, setActiveTab] = useState("info");

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
            <div className="main-container">
                <div className="container-1">
                    <h1 className="heading">
                        <span>ACCOMMODATIONS</span>
                        <div className="holder" id="b1"></div>
                        <div className="holder" id="b2"></div>
                        <div className="holder" id="b3"></div>
                        <div className="holder" id="b4"></div>
                    </h1>

                    <p className="head-p">
                        Welcome to Spring Fest 2026. Please find information regarding your stay at IIT Kharagpur. Click on any tombstone to read details.
                    </p>

                    <div className="container-2">
                        <div className="bnt-con">
                            <button className="nav-btn" id="n1" onClick={() => handleCategoryChange(info, "info")}>
                                <i className="fa-solid fa-circle-info"></i> INFO
                            </button>
                            <button className="nav-btn" id="n2" onClick={() => handleCategoryChange(faq, "faq")}>
                                <i className="fa-solid fa-circle-question"></i> FAQ
                            </button>
                            <button className="nav-btn" id="n3" onClick={() => handleCategoryChange(rules, "rules")}>
                                <i className="fa-solid fa-scroll"></i> RULES
                            </button>
                            <button className="nav-btn" id="n4" onClick={() => handleCategoryChange(map, "map")}>
                                <i className="fa-solid fa-map-location-dot"></i> MAP
                            </button>
                        </div>
                    </div>

                    <div className="cards-container">
                        {cards.map((card) => (
                            <div className="card" key={card.id}>
                                <div className="m-con" onClick={() => handleCardClick(card)}>
                                    <h1>{card.heading}</h1>
                                    <p>{card.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* --- NEW GOOGLE MAP SECTION --- */}
                    {activeTab === "map" && (
                        <div className="map-wrapper">
                            <h2 className="map-title">IIT KHARAGPUR CAMPUS</h2>
                            <iframe
                                title="IIT Kharagpur Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.0121115503096!2d87.30831207604474!3d22.316314742352882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1d440447330757%3A0x10f0396558504533!2sIIT%20Kharagpur!5e0!3m2!1sen!2sin!4v1705000000000"
                                width="100%"
                                height="450"
                                className="light-map-frame"
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    )}
                    {/* --- END MAP SECTION --- */}
                </div>

                {/*conditional rendering */}
                {showModal && selectedCard && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        {/* stopPropagation prevents clicking inside the box from closing it */}
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-modal-btn" onClick={handleCloseModal}>X</button>
                            <h2>{selectedCard.heading}</h2>
                            <div className="modal-body">
                                <p>{selectedCard.content}</p>
                            </div>
                        </div>
                    </div>
                )}
                 {/* --- END --- */}

            </div>
        </StrictMode>
    );
}

export default Accommodation;