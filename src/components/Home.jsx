import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';

import iitkgpLogo from "../assets/images/iitkgp.webp";
import springFestLogo from "../assets/images/new1.webp";
import sfHandLogo from "../assets/images/sf.webp";
import springFestTextLogo from "../assets/images/ILU1.webp";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const HomePage = ({ backgroundImage }) => {
  const { isAuthenticated, user, token } = useAuth();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const [paymentData, setPaymentData] = useState({
    checkIn: '',
    checkOut: '',
    emergencyNumber: ''
  });
  
  const [isPaying, setIsPaying] = useState(false);
  
  const isPaid = user?.isPaid || false;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!paymentData.checkIn || !paymentData.checkOut || !paymentData.emergencyNumber) {
      toast.warning("Please fill all fields");
      return;
    }

    if (paymentData.checkIn >= paymentData.checkOut) {
        toast.error("Check-out date must be after Check-in date");
        return;
    }
    
    if (!window.Razorpay) {
        toast.error("Payment SDK not loaded. Please refresh the page or check your connection.");
        return;
    }

    setIsPaying(true);
    try {
      // Step 1: Initiate Payment
      const response = await axios.post("https://masterapi.springfest.in/api/payment/initiate", {
        token: token, 
        check_in: paymentData.checkIn,
        check_out: paymentData.checkOut,
        emergency_number: paymentData.emergencyNumber,
        type_of_acco: "Common",
        type_of_payment: "Individual"
      });

      if (response.data.code === 0) {
        const orderData = response.data.data;

        // Step 2: Open Razorpay
        const options = {
          key: RAZORPAY_KEY_ID, 
          amount: orderData.amount,
          currency: "INR",
          name: "Spring Fest 2026",
          description: orderData.receipt,
          order_id: orderData.id,
          callback_url: "/dashboard",
          prefill: {
            SF_Transaction_id: orderData.receipt,
          },
          theme: {
            color: "#3399cc"
          },
          modal: {
            ondismiss: function () {
              toast.info("Payment cancelled");
              setIsPaying(false);
            }
          }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
            toast.error(response.error.description || "Payment Failed");
            setIsPaying(false);
        });
        rzp1.open();
      } else {
        toast.error(response.data.message || "Failed to initiate payment");
        setIsPaying(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed");
      setIsPaying(false);
    }
    setShowPaymentModal(false);
  };

  return (
    <>
      {/* --- PAYMENT MODAL --- */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-8 max-h-[425px] md:h-auto overflow-auto rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative popup-anim backdrop-blur-md bg-black/10"
          >
            <button
              onClick={() => setShowPaymentModal(false)}
              className="cursor-pointer absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h2 className="text-3xl text-white font-['Jolly_Lodger'] mb-1 tracking-widest">
              Make Payment
            </h2>
            <p className="text-gray-300 font-sans text-lg mb-6 border-b border-white/10 pb-4">
              Total: <span className="text-green-400 font-bold">₹2449</span>
            </p>

            <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-5">
              {/* Check In */}
              <div>
                <label className="block text-gray-200 font-['Jolly_Lodger'] text-2xl mb-1 ml-1">
                  Check-In
                </label>
                <div className="relative">
                  <select
                    required
                    value={paymentData.checkIn}
                    onChange={(e) => setPaymentData({ ...paymentData, checkIn: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none outline-none focus:border-purple-500 transition-colors cursor-pointer"
                  >
                    <option value="" disabled>Select Check-in</option>
                    <option value="2026-01-22">22-01-2026</option>
                    <option value="2026-01-23">23-01-2026</option>
                    <option value="2026-01-24">24-01-2026</option>
                    <option value="2026-01-25">25-01-2026</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Check Out */}
              <div>
                <label className="block text-gray-200 font-['Jolly_Lodger'] text-2xl mb-1 ml-1">
                  Check-Out
                </label>
                <div className="relative">
                  <select
                    required
                    value={paymentData.checkOut}
                    onChange={(e) => setPaymentData({ ...paymentData, checkOut: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none outline-none focus:border-purple-500 transition-colors cursor-pointer"
                  >
                    <option value="" disabled>Select Check-out</option>
                    <option value="2026-01-23">23-01-2026</option>
                    <option value="2026-01-24">24-01-2026</option>
                    <option value="2026-01-25">25-01-2026</option>
                    <option value="2026-01-26">26-01-2026</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Emergency Number */}
              <div>
                <label className="block text-gray-200 font-['Jolly_Lodger'] text-2xl mb-1 ml-1">
                  Emergency Number
                </label>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  pattern="[0-9]{10}"
                  placeholder="123-456-7890"
                  value={paymentData.emergencyNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, emergencyNumber: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-white/15 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors placeholder:text-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={isPaying}
                className="mt-2 cursor-pointer w-full py-3 text-3xl text-white font-['Jolly_Lodger'] tracking-widest bg-green-700/80 border border-green-500/50 rounded-xl hover:bg-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPaying ? "Processing..." : "Make Payment"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div
        className="h-[100vh] w-screen bg-center bg-cover relative overflow-hidden flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/30 z-0" />

        <nav className="absolute top-2 left-0 right-0 px-6 flex justify-between items-start z-20 w-full">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="scale-110 md:scale-150 origin-top-left ml-6 md:ml-14"
          >
            <img src={sfHandLogo} alt="SF Icon" className="h-12 w-12 md:h-16 md:w-16 drop-shadow-lg" />
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4 md:gap-6"
          >
            <a href="https://www.iitkgp.ac.in/" target="_blank" rel="noreferrer">
              <img src={iitkgpLogo} alt="IIT Kharagpur" className="h-12 w-12 md:h-16 md:w-16 object-contain hover:scale-105 transition-transform" />
            </a>
            <img src={springFestLogo} alt="Spring Fest 75" className="h-12 w-12 md:h-16 md:w-16 object-contain" />
          </motion.div>
        </nav>

        <main className="relative z-10 flex flex-col items-center text-center px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mb-12"
          >
            <img
              src={springFestTextLogo}
              alt="Spring Fest"
              className="w-[280px] md:w-[500px] h-auto object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
            />
          </motion.div>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[16px] translate-y-[120px]">
            <div className="min-h-auto w-full flex items-center justify-center">
              
              {!isAuthenticated ? (
                <div className="mt-50">
                <Link
                  to="/signin"
                  className="inline-flex items-center justify-center w-[160px] h-[48px] text-[16px] font-semibold tracking-[0.18em] uppercase text-[#e8dcc4] bg-gradient-to-b from-[#3b3a35] to-[#1a1916] border border-[#6e6a5f] rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:from-[#4a483f] hover:to-[#23211c] hover:shadow-[0_14px_40px_rgba(0,0,0,0.8)] active:scale-[0.97] transition-all duration-300 ease-out no-underline"
                >
                  SIGN IN
                </Link>
                </div>
              ) : (
               <div className="flex flex-col gap-6 mt-35">


                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center w-[180px] h-[50px] text-[15px] font-semibold tracking-[0.18em] uppercase text-[#e8dcc4] bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] border border-[#6e6a5f] rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.8)] transition-all duration-300 no-underline"
                  >
                    DASHBOARD
                  </Link>

                  {!isPaid && (
                    <button
  onClick={() => setShowPaymentModal(true)}
  className="
    cursor-pointer
    inline-flex items-center justify-center
    w-[180px] h-[50px]
    text-[15px]
    font-semibold
    tracking-[0.18em]
    uppercase
    text-[#ffffff]

    bg-gradient-to-b
    from-[#6fd08c]
    to-[#1f5f3a]

    border border-[#7be3a0]
    rounded-[10px]

    shadow-[0_10px_30px_rgba(0,0,0,0.4)]
    hover:shadow-[0_14px_40px_rgba(0,0,0,0.6)]

    transition-all duration-300
  "
>
  PAY NOW
</button>

                  )}
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default HomePage;