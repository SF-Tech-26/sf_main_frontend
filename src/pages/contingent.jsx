import React, { StrictMode, useContext, useEffect, useState } from "react";
import contin from "../assets/images/Untitled-2_upscayl_4x_upscayl-standard-4x.png";
import "./accommodation.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Barcode from 'react-barcode';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../context/authContext.jsx";
import { Crown } from "lucide-react";
import icon1 from "../assets/images/handshake_shield_transparent.png";
import icon2 from "../assets/images/haunted_house_transparent_v2.png";

// --- CONFIGURATION ---
// Replace this with your actual Razorpay Key ID
// For production, it is best to use import.meta.env.VITE_RAZORPAY_KEY_ID
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID; 

function Contingent() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [member, setMember] = useState([]);
  const [joinOn, setJoinOn] = useState(false);
  const [CreateOn, setCreateOn] = useState(false);
  const [conti, setConti] = useState(false);
  const [data, setData] = useState(null);
  const [myUserId, setId] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setId(decoded.id);
      } catch (e) {
        console.error("Invalid token");
      }
    }
  }, [token]);

  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const API = "https://masterapi.springfest.in/api/contingent/getMembers";
      try {
        const response = await axios.post(API, { token: token });
        const resData = response.data;

        if (resData.code === 2) {
          setConti(false);
        } else if (resData.code === 0) {
          setConti(true);
          console.log(resData);
          setData(resData.data);
          if (resData.data && resData.data.updatedMembersInfo) {
            setMember(resData.data.updatedMembersInfo);
          }
        } else {
          toast.error("Failed to load contingent info.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        const errorMsg = err.response?.data?.message || err.message || "Network Error: Could not fetch data.";
        toast.error(errorMsg);
      }
    };
    if (!token) {
      return;
    }

    fetchData();
  }, [token]);

  const [joinId, setJoinId] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Individual Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    checkIn: "",
    checkOut: "",
    emergencyNumber: ""
  });
  const [isPaying, setIsPaying] = useState(false);

  // ---------------------------------------------------------
  // HANDLER: Individual Payment
  // ---------------------------------------------------------
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentData.checkIn || !paymentData.checkOut || !paymentData.emergencyNumber) {
      toast.warning("Please fill all fields");
      return;
    }

    // Date Validation
    if (paymentData.checkIn >= paymentData.checkOut) {
        toast.error("Check-out date must be after Check-in date");
        return;
    }
    
    // SDK Check
    if (!window.Razorpay) {
        toast.error("Payment SDK not loaded. Check your internet connection or reload the page.");
        return;
    }

    setIsPaying(true);
    try {
      // Step 1: Initiate
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
          callback_url:"/dashboard",
          prefill: {
            SF_Transaction_id:orderData.receipt,
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
        setIsPaying(false);
      } else {
        toast.error(response.data.message || "Failed to initiate payment");
        setIsPaying(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed");
      setIsPaying(false);
    }
  };

  // Contingent Payment Modal State
  const [showContingentPayModal, setShowContingentPayModal] = useState(false);
  const [contingentPayData, setContingentPayData] = useState({
    checkIn: "",
    checkOut: "",
    emergencyNumber: ""
  });
  const [isContingentPaying, setIsContingentPaying] = useState(false);

  const totalAmount = member.length * 2449;

  // ---------------------------------------------------------
  // HANDLER: Contingent Payment
  // ---------------------------------------------------------
  const handleContingentPaySubmit = async (e) => {
    e.preventDefault();
    if (!contingentPayData.checkIn || !contingentPayData.checkOut || !contingentPayData.emergencyNumber) {
      toast.warning("Please fill all fields");
      return;
    }

    // Date Validation
    if (contingentPayData.checkIn >= contingentPayData.checkOut) {
        toast.error("Check-out date must be after Check-in date");
        return;
    }
    
    // SDK Check
    if (!window.Razorpay) {
        toast.error("Payment SDK not loaded. Check your internet connection.");
        return;
    }

    setIsContingentPaying(true);
    try {
      const response = await axios.post("https://masterapi.springfest.in/api/payment/initiate", {
        token: token,
        check_in: contingentPayData.checkIn,
        check_out: contingentPayData.checkOut,
        emergency_number: contingentPayData.emergencyNumber,
        type_of_acco: "Common",
        type_of_payment: "Contingent"
      });

      if (response.data.code === 0) {
        const orderData = response.data.data;

        const options = {
          key: RAZORPAY_KEY_ID, 
          amount: orderData.amount,
          currency: "INR",
          name: "Spring Fest 2026",
          description: orderData.receipt,
          order_id: orderData.id,
          callback_url:"/dashboard",
          prefill: {
            SF_Transaction_id:orderData.receipt,
          },
          theme: {
            color: "#3399cc"
          },
          modal: {
            ondismiss: function () {
              toast.info("Payment cancelled");
              setIsContingentPaying(false);
             
            }
          }
        };

        const rzp2 = new window.Razorpay(options);
        rzp2.on('payment.failed', function (response){
            toast.error(response.error.description || "Payment Failed");
            setIsContingentPaying(false);
        });
        rzp2.open();
        setIsContingentPaying(false);
      } else {
        toast.error(response.data.message || "Failed to initiate payment");
        setIsContingentPaying(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed");
      setIsContingentPaying(false);
    }
  };

  const triggerLeaveConfirmation = () => {
    if (isDeleting) return;

    if (data?.updatedMembersInfo && (Object.keys(data.updatedMembersInfo).length !== 1) && myUserId === data.leaderId) {
      toast.error("Can't delete: Leader cannot leave if other members exist.");
      return;
    }
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = async () => {
    setShowLeaveModal(false);
    setIsDeleting(true);

    try {
      const response = await axios.post("https://masterapi.springfest.in/api/contingent/leave", {
        token: token
      });

      if (response.data.code === 0) {
        toast.success("Successfully left the contingent.");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(response.data.message || "Failed to leave.");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Error leaving contingent:", err);
      toast.error(err.response?.data?.message || "An error occurred. Please try again.");
      setIsDeleting(false);
    }
  };

  const Joincontingent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("https://masterapi.springfest.in/api/contingent/join", {
        token: token,
        contingent_id: joinId,
        contingent_code: joinCode
      });

      if (response.data.code === 0) {
        toast.success("Successfully joined!");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(response.data.message || "Failed to join");
      }
    } catch (err) {
      console.error("Join error:", err);
      toast.error(err.response?.data?.message || "An error occurred while joining.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [newContingentName, setNewContingentName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const createContin = async (e) => {
    e.preventDefault();

    if (!newContingentName.trim()) {
      toast.warning("Please enter a valid name");
      return;
    }

    setIsCreating(true);
    try {
      const response = await axios.post("https://masterapi.springfest.in/api/contingent", {
        token: token,
        contingent_name: newContingentName
      });

      if (response.data.code === 0) {
        toast.success("Contingent Created Successfully!");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(response.data.message || "Error creating contingent");
      }
    } catch (err) {
      console.error("Creation Error:", err);
      toast.error(err.response?.data?.message || "Server error. Please try again later.");
    } finally {
      setIsCreating(false);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberSfId, setNewMemberSfId] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const AddMember = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const response = await axios.post("https://masterapi.springfest.in/api/contingent/add", {
        token: token,
        members: [
          {
            sfId: newMemberSfId,
            email: newMemberEmail
          }
        ]
      });

      if (response.data.code === 0) {
        toast.success("Member added successfully!");
        setShowAddModal(false);
        setNewMemberSfId("");
        setNewMemberEmail("");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(response.data.message || "Error adding member");
      }
    } catch (err) {
      console.error("Add member error:", err);
      toast.error(err.response?.data?.message || "Check the SF ID and Email again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <StrictMode>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div
        className="min-h-screen flex flex-col flex-1 items-center justify-center bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${contin})`, backgroundAttachment: "fixed", backgroundPosition: "bottom" }}
      >

        {!token && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
            <div className="w-full max-w-md p-10 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center relative overflow-hidden popup-anim backdrop-blur-md bg-gradient-to-r from-[#302e3b]/90 to-[#5f8a84]/70">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 blur-[100px]"></div>

              <span className="material-symbols-outlined !text-7xl text-purple-800 mb-4 block">
                lock_person
              </span>

              <h2 className="text-6xl text-white font-['Jolly_Lodger'] mb-4 tracking-widest">
                Sign In
              </h2>

              <p className="text-gray-300 text-xl font-sans mb-8 leading-relaxed">
                You must be part of our realm to manage a contingent. Please sign in to continue your journey.
              </p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => navigate("/signin")}
                  className="cursor-pointer w-full py-4 text-3xl text-white font-['Jolly_Lodger'] tracking-[0.2em] bg-purple-900/40 border border-purple-500/50 rounded-xl hover:bg-purple-700/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 active:scale-95"
                >
                  SIGN IN
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="cursor-pointer text-gray-400 hover:text-white font-['Jolly_Lodger'] text-2xl transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {conti && (
          <>
            {showLeaveModal && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowLeaveModal(false)}
              >
                <div
                  className="w-full max-w-md p-8 rounded-3xl border border-white/20 shadow-2xl relative popup-anim backdrop-blur-md bg-gradient-to-r from-[#302e3b]/95 to-[#5f8a84]/80 text-center"
                  onClick={(e) => e.stopPropagation()}
                >

                  <span className="material-symbols-outlined !text-6xl text-red-500 mb-4 block">
                    warning
                  </span>

                  <h2 className="text-5xl text-white font-['Jolly_Lodger'] mb-4 tracking-widest">
                    leave Contingent?
                  </h2>

                  <p className="text-gray-200 text-xl font-sans mb-8 leading-relaxed">
                    Are you sure you want to leave your contingent?
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setShowLeaveModal(false)}
                      className="cursor-pointer flex-1 py-3 text-2xl text-white font-['Jolly_Lodger'] tracking-widest bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
                    >
                      STAY
                    </button>
                    <button
                      onClick={handleConfirmLeave}
                      className="cursor-pointer flex-1 py-3 text-2xl text-white font-['Jolly_Lodger'] tracking-widest bg-red-900/60 border border-red-500/50 rounded-xl hover:bg-red-600/80 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all"
                    >
                      Leave
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showBarcodeModal && (
              <div
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                onClick={() => setShowBarcodeModal(false)}
              >
                <div
                  className="w-full max-w-sm p-8 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative text-center popup-anim backdrop-blur-md bg-gradient-to-r from-[#302e3b]/85 to-[#5f8a84]/65"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowBarcodeModal(false)}
                    className="cursor-pointer absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>

                  <h2 className="text-5xl text-white font-['Jolly_Lodger'] mb-2 tracking-widest">
                    Bar-Code
                  </h2>
                  <p className="text-purple-400 font-['Jolly_Lodger'] text-xl mb-6">
                    {data.contingent_name}
                  </p>

                  <div className="bg-white p-6 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] inline-block">
                    <Barcode
                      value={data.id || "000000"}
                      width={1.5}
                      height={60}
                      displayValue={false}
                      lineColor="#000000"
                      background="#ffffff"
                    />
                    <div className="mt-4 border-t border-gray-200 pt-2">
                      <p className="text-black font-mono text-sm font-bold tracking-[0.3em]">
                        {data.id}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {showPaymentModal && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowPaymentModal(false)}
              >
                <div
                  className="w-full max-w-md p-8 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative popup-anim backdrop-blur-md bg-black/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="cursor-pointer absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>

                  <h2 className="text-5xl text-white font-['Jolly_Lodger'] mb-1 tracking-widest">
                    Make Payment
                  </h2>
                  <p className="text-gray-300 font-sans text-lg mb-6 border-b border-white/10 pb-4">
                    Total: <span className="text-green-400 font-bold">₹2449</span>
                  </p>

                  <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-5">

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
                          <option value="2026-01-26">26-01-2026</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>

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
                          <option value="2026-01-27">27-01-2026</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-200 font-['Jolly_Lodger'] text-2xl mb-1 ml-1">
                        Emergency Number
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength="10"
                        pattern="[0-9]{10}"
                        placeholder="10 digit mobile number"
                        value={paymentData.emergencyNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, emergencyNumber: e.target.value.replace(/\D/g, '') })}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors placeholder:text-gray-500"
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

            {showContingentPayModal && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowContingentPayModal(false)}
              >
                <div
                  className="w-full max-w-md p-8 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative popup-anim backdrop-blur-md bg-black/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowContingentPayModal(false)}
                    className="cursor-pointer absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>

                  <h2 className="text-5xl text-white font-['Jolly_Lodger'] mb-1 tracking-widest">
                    Contingent Payment
                  </h2>

                  <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
                    <p className="text-gray-300 font-sans text-lg">
                      Paying for <span className="text-white font-bold">{member.length}</span> members
                    </p>
                    <p className="text-3xl text-green-400 font-['Jolly_Lodger'] tracking-wider">
                      ₹{totalAmount}
                    </p>
                  </div>

                  <form onSubmit={handleContingentPaySubmit} className="flex flex-col gap-5">

                    <div>
                      <label className="block text-gray-200 font-['Jolly_Lodger'] text-2xl mb-1 ml-1">
                        Check-In
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={contingentPayData.checkIn}
                          onChange={(e) => setContingentPayData({ ...contingentPayData, checkIn: e.target.value })}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none outline-none focus:border-purple-500 transition-colors cursor-pointer"
                        >
                          <option value="" disabled>Select Check-in</option>
                          <option value="2026-01-22">22-01-2026</option>
                          <option value="2026-01-23">23-01-2026</option>
                          <option value="2026-01-24">24-01-2026</option>
                          <option value="2026-01-25">25-01-2026</option>
                          <option value="2026-01-26">26-01-2026</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-200 font-['Jolly_Lodger'] text-2xl mb-1 ml-1">
                        Check-Out
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={contingentPayData.checkOut}
                          onChange={(e) => setContingentPayData({ ...contingentPayData, checkOut: e.target.value })}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none outline-none focus:border-purple-500 transition-colors cursor-pointer"
                        >
                          <option value="" disabled>Select Check-out</option>
                          <option value="2026-01-23">23-01-2026</option>
                          <option value="2026-01-24">24-01-2026</option>
                          <option value="2026-01-25">25-01-2026</option>
                          <option value="2026-01-26">26-01-2026</option>
                          <option value="2026-01-27">27-01-2026</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-200 font-['Jolly_Lodger'] text-2xl mb-1 ml-1">
                        Emergency Number
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength="10"
                        pattern="[0-9]{10}"
                        placeholder="10 digit mobile number"
                        value={contingentPayData.emergencyNumber}
                        onChange={(e) => setContingentPayData({ ...contingentPayData, emergencyNumber: e.target.value.replace(/\D/g, '') })}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors placeholder:text-gray-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isContingentPaying}
                      className="mt-2 cursor-pointer w-full py-3 text-3xl text-white font-['Jolly_Lodger'] tracking-widest bg-green-700/80 border border-green-500/50 rounded-xl hover:bg-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isContingentPaying ? "Processing..." : "Make Payment"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {showAddModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowAddModal(false)}
              >
                <div
                  className="w-full max-w-md p-8 rounded-3xl border border-white/20 shadow-2xl relative popup-anim backdrop-blur-md bg-gradient-to-r from-[#302e3b]/80 to-[#5f8a84]/60"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="cursor-pointer absolute top-4 right-4 text-white/50 hover:text-white"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>

                  <h2 className="text-5xl text-white text-center font-['Jolly_Lodger'] mb-6 tracking-widest">
                    Add Member
                  </h2>

                  <form onSubmit={AddMember} className="flex flex-col gap-5">
                    <div>
                      <label className="block text-gray-300 font-['Jolly_Lodger'] text-2xl mb-1 ml-1">SF ID</label>
                      <input
                        type="text"
                        required
                        value={newMemberSfId}
                        onChange={(e) => setNewMemberSfId(e.target.value)}
                        placeholder="SF00XXX"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-['Jolly_Lodger'] text-2xl mb-1 ml-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="member@email.com"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAdding}
                      className="cursor-pointer w-full py-4 text-3xl text-white font-['Jolly_Lodger'] tracking-widest bg-purple-900/40 border border-purple-500/50 rounded-xl hover:bg-purple-700/60 transition-all"
                    >
                      {isAdding ? "Summoning..." : "ADD MEMBER"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            <div
              className="h-[100px] w-full flex mt-[50px] items-center justify-center font-['Jolly_Lodger'] text-white text-5xl sm:text-7xl"
            >
              Contingent
            </div>

            <div className="h-[550px] overflow-auto w-[95%] sm:w-[85%] max-w-[800px] backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl relative p-6 mx-auto popup-anim bg-black/70">
              <button
                onClick={() => { navigate("/accommodation") }}
                className="cursor-pointer absolute top-4 left-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all z-10"
              >
                <span className="material-symbols-outlined !text-[28px]">arrow_back</span>
              </button>

              <h2 className="text-4xl sm:text-6xl text-white text-center tracking-wider font-['Jolly_Lodger'] mt-0 mb-2">
                {data.contingent_name}
              </h2>

              <div className="flex flex-col gap-8">

                <div className={(myUserId === data.leaderId) ? "grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[600px] mx-auto" : "grid grid-cols-1 gap-4 w-[250px] mx-auto"}>
                  {(myUserId == data.leaderId) && <button
                    onClick={() => setShowContingentPayModal(true)}
                    className="cursor-pointer h-[60px] bg-green-800 backdrop-blur-md border border-white/20 rounded-xl text-white font-['Jolly_Lodger'] text-2xl hover:bg-green-400 hover:text-black transition-all"
                  >
                    Contingent Payment
                  </button>}
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="cursor-pointer h-[60px] bg-green-800 backdrop-blur-md border border-white/20 rounded-xl text-white font-['Jolly_Lodger'] text-2xl hover:bg-green-400 hover:text-black transition-all"
                  >
                    {(myUserId === data.leaderId) ? "Individual Payment" : "Make Payment"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-center">
                    <p className="font-['Jolly_Lodger'] text-white text-3xl opacity-70">Contingent ID</p>
                    <p className="font-['Jolly_Lodger'] text-white text-2xl tracking-widest text-purple-400">{data.id}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-center">
                    <p className="font-['Jolly_Lodger'] text-white text-3xl opacity-70">Contingent Code</p>
                    <p className="font-['Jolly_Lodger'] text-white text-2xl tracking-widest text-purple-400">{data.code}</p>
                  </div>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-center">
                  <p className="font-['Jolly_Lodger'] text-white text-3xl opacity-70">Barcode</p>
                  <div className=" justify-items-center">
                    <button
                      onClick={() => setShowBarcodeModal(true)}
                      className="cursor-pointer group relative flex flex-col items-center justify-center w-full max-w-[200px] transition-all duration-300 active:scale-95 bg-green-800 hover:bg-green-400 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 shadow-lg hover:shadow-purple-500/20"
                    >
                      <p className="font-['Jolly_Lodger'] text-white text-2xl tracking-widest group-hover:text-black transition-all">
                        {data.id || "N/A"}
                      </p>
                      <span className="text-[10px] text-white/80 uppercase mt-2 tracking-tighter group-hover:text-black">
                        Click to scan
                      </span>
                    </button>
                  </div>
                </div>
                <div className="bg-black/70 p-4 rounded-2xl border border-white/10 text-center">
                  <p className="font-['Jolly_Lodger'] text-white text-3xl opacity-70"
                  >Members</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {member.map((m, index) => (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-xl flex items-center justify-between"
                    >
                      <span className="text-white font-['Jolly_Lodger'] text-xl">
                        <div className="text-4xl text-white flex items-center gap-2">
                          {m.name}
                        </div>
                        {(m.id === data.leaderId) && (
                          <p className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                            <Crown className="w-4 h-4" />
                            Leader
                          </p>
                        )}
                        <div>
                          {m.sfId}
                        </div>
                      </span>
                      {m.paymentStatus && <span className="text-green-800 text-xs uppercase font-bold">Paid</span>}
                      {!m.paymentStatus && <span className="text-red-800 text-xs uppercase font-bold">Unpaid</span>}
                    </div>
                  ))}
                </div>

                <div className={(myUserId === data.leaderId) ? "grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[600px] mx-auto" : "grid grid-cols-1 gap-4 w-[250px] mx-auto"}>
                  <button
                    disabled={isDeleting}
                    className={`cursor-pointer h-[60px] bg-red-800 backdrop-blur-md border border-white/20 rounded-xl text-white font-['Jolly_Lodger'] text-2xl hover:bg-red-400 hover:text-black transition-all ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={triggerLeaveConfirmation}
                  >
                    {isDeleting ? "Processing..." : (myUserId === data.leaderId) ? "Delete Contingent" : "Leaving Contingent"}
                  </button>
                  {(myUserId === data.leaderId) && <button className="cursor-pointer h-[60px] bg-green-800 backdrop-blur-md border border-white/20 rounded-xl text-white font-['Jolly_Lodger'] text-2xl  hover:bg-green-400 hover:text-black transition-all" onClick={() => setShowAddModal(true)}>
                    ADD Member
                  </button>}
                </div>

              </div>
            </div>
          </>
        )}


        {token && !conti && !joinOn && !CreateOn &&
          <div className="flex flex-col gap-6 bg-black/70 p-6 sm:p-10 w-[95%] sm:w-[90%] max-w-[550px] h-auto backdrop-blur-xl border border-purple-500/30 rounded-3xl shadow-2xl popup-anim relative">
            <button
              onClick={() => { navigate("/accommodation") }}
              className="absolute top-4 left-4 p-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/20 transition-all z-10 hover:shadow-lg hover:shadow-purple-500/30"
            >
              <span className="material-symbols-outlined !text-[28px]">arrow_back</span>
            </button>

            <div className="text-center pt-8 sm:pt-8 pb-2 sm:pb-2">
              <h1 className="font-['Jolly_Lodger'] text-5xl sm:text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                Contingent
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-h-[250px] sm:gap-6 w-full px-2 sm:px-4 flex-1 items-center sm:items-stretch">
              <div
                onClick={() => setJoinOn(true)}
                className="w-full sm:flex-1 h-[140px] sm:h-auto sm:aspect-square group cursor-pointer relative overflow-hidden rounded-xl border-2 hover:border-[#4a4a5e] transition-all duration-500 hover:scale-105"
                style={{
                  background: "rgba(74, 74, 94, 0.25)",
                  borderColor: "rgba(74, 74, 94, 0.5)",
                  boxShadow: "0 0 0 rgba(74, 74, 94, 0.3)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 0 40px rgba(74, 74, 94, 0.5)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 0 0 rgba(74, 74, 94, 0.3)"}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#4a4a5e]/0 via-[#4a4a5e]/0 to-[#4a4a5e]/0 group-hover:from-[#4a4a5e]/30 group-hover:via-[#4a4a5e]/20 group-hover:to-[#4a4a5e]/30 transition-all duration-500"></div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#4a4a5e] to-transparent blur-sm"></div>
                </div>

                <div className="relative z-10 flex flex-row sm:flex-col items-center justify-center gap-4 sm:gap-3 p-4 sm:p-6 h-full">
                  <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300">
                    <img src={icon1} />
                  </div>
                  <div className="flex flex-col items-center sm:items-center">
                    <h2 className="font-['Jolly_Lodger'] text-3xl sm:text-4xl text-white text-center transition-colors duration-300" style={{ color: "white" }}>
                      Join Contingent
                    </h2>
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 w-16 h-16 rounded-tl-full" style={{ background: "linear-gradient(to top left, rgba(74, 74, 94, 0.2), transparent)" }}></div>
              </div>

              <div
                onClick={() => setCreateOn(true)}
                className="w-full sm:flex-1 h-[140px] sm:h-auto sm:aspect-square group cursor-pointer relative overflow-hidden rounded-xl border-2 hover:border-[#5F938B] transition-all duration-500 hover:scale-105"
                style={{
                  background: "rgba(95, 147, 139, 0.15)",
                  borderColor: "rgba(95, 147, 139, 0.4)",
                  boxShadow: "0 0 0 rgba(95, 147, 139, 0.3)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 0 40px rgba(95, 147, 139, 0.5)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 0 0 rgba(95, 147, 139, 0.3)"}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#5F938B]/0 via-[#5F938B]/0 to-[#5F938B]/0 group-hover:from-[#5F938B]/30 group-hover:via-[#5F938B]/20 group-hover:to-[#5F938B]/30 transition-all duration-500"></div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#5F938B] to-transparent blur-sm"></div>
                </div>

                <div className="relative z-10 flex flex-row sm:flex-col items-center justify-center gap-4 sm:gap-3 p-4 sm:p-6 h-full">
                  <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300">
                    <img src={icon2} />
                  </div>
                  <div className="flex flex-col items-center sm:items-center">
                    <h2 className="font-['Jolly_Lodger'] text-3xl sm:text-4xl text-white text-center transition-colors duration-300" style={{ color: "white" }}>
                      Create Contingent
                    </h2>
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 w-16 h-16 rounded-tl-full" style={{ background: "linear-gradient(to top left, rgba(95, 147, 139, 0.2), transparent)" }}></div>
              </div>
            </div>
          </div>
        }


        {!conti && !CreateOn && joinOn &&
          <>
            <div className="h-[150px] mt-[20px] w-full max-w-[350px] rounded-2xl shadow-xl "
              style={{ display: "inline-flex", justifyContent: 'center', alignItems: 'center', fontFamily: 'Jolly Lodger', color: "white", fontSize: '4rem' }}>
              Contingent</div>
            <div className="h-auto w-[80%] sm:w-[73%] max-w-[600.25px] backdrop-blur-md bg-black/70 border border-white/20 rounded-2xl shadow-xl justify-items-center relative popup-anim">
              <h2 className="text-5xl text-white text-center tracking-wider font-['Jolly_Lodger'] mt-5">
                Join Contingents
              </h2>

              <button
                onClick={() => setJoinOn(false)}
                className="cursor-pointer absolute top-10 left-3 sm:left-10 flex items-center justify-center p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 group"
              >
                <span className="material-symbols-outlined !text-[28px] group-hover:-translate-x-1 transition-transform">
                  arrow_back
                </span>
              </button>

              <form className="w-[90%] sm:w-[100%] max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 mt-5 mb-20" onSubmit={Joincontingent}>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-3xl text-gray-300  mb-1 ml-1 text-center font-['Jolly_Lodger']">Contingent ID</label>
                    <input
                      type="text"
                      placeholder="Your Contingent ID..."
                      onChange={(e) => setJoinId(e.target.value)}
                      value={joinId}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-center font-['Jolly_lodger'] text-3xl mb-1 ml-1">Contingent Code</label>
                    <input
                      type="text"
                      placeholder="Your Contingent Code"
                      onChange={(e) => setJoinCode(e.target.value)}
                      value={joinCode}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full py-3 text-2xl text-white font-['Jolly_Lodger'] tracking-widest border border-white/40 rounded-xl hover:bg-white/20 hover:border-white bg-black/60 transition-all duration-300 active:scale-95"
                >
                  {isSubmitting ? "Joining..." : "Join Contingent"}

                </button>

              </form>
            </div>
          </>
        }

        {!conti && CreateOn && !joinOn &&
          <>
            <div className="h-[150px] w-full max-w-[350px] rounded-2xl shadow-xl "
              style={{ display: "inline-flex", justifyContent: 'center', alignItems: 'center', fontFamily: 'Jolly Lodger', color: "white", fontSize: '4rem' }}>
              Contingent</div>
            <div className="h-auto w-[80%] sm:w-[73%] max-w-[600.25px] backdrop-blur-md bg-black/70 border border-white/20 rounded-2xl shadow-xl justify-items-center relative popup-anim">
              <h2 className="text-5xl text-white text-center tracking-wider font-['Jolly_Lodger'] mt-5">
                Create A Contingents
              </h2>

              <button
                onClick={() => setCreateOn(false)}
                className="cursor-pointer absolute top-10 left-3 sm:left-10 flex items-center justify-center p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 group"
              >
                <span className="material-symbols-outlined !text-[28px] group-hover:-translate-x-1 transition-transform">
                  arrow_back
                </span>
              </button>

              <form className="w-[90%] sm:w-[100%] max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 mt-5 mb-10" onSubmit={createContin}>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-3xl text-gray-300  mb-1 ml-1 text-center font-['Jolly_Lodger']">Contingent Name</label>
                    <input
                      type="text"
                      placeholder="Your Contingent Name..."
                      value={newContingentName}
                      onChange={(e) => setNewContingentName(e.target.value)}
                      required
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                </div>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="cursor-pointer w-full py-3 text-2xl text-white font-['Jolly_Lodger'] tracking-widest border border-white/40 rounded-xl hover:bg-white/20 hover:border-white bg-black/60 transition-all duration-300 active:scale-95"
                >
                  {isCreating ? "Creating..." : "Create Contingent"}
                </button>

              </form>
            </div>
          </>
        }

      </div>
    </StrictMode>
  );
}

export default Contingent;