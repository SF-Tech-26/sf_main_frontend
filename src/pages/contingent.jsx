import React, { StrictMode, useContext, useEffect, useState } from "react";
import contin from "../assets/images/Untitled-2_upscayl_4x_upscayl-standard-4x.png";
import "./accommodation.css";
import cardbg from "../assets/images/dark-fantasy-scene.jpg";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Barcode from 'react-barcode';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AuthContext} from "../context/authContext.jsx";

function Contingent() {
  const navigate = useNavigate();
  const {token} = useContext(AuthContext);
  const [member, setMember] = useState([]);
  const [joinOn, setJoinOn] = useState(false);
  const [CreateOn, setCreateOn] = useState(false);
  const [conti, setConti] = useState(false);
  const [data, setData] = useState(null);
  const [myUserId,setId] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  useEffect(()=>{
  if (token) {
    try {
      const decoded = jwtDecode(token);
      setId(decoded.id);
    } catch (e) {
      console.error("Invalid token");
    }
  }
  },[token])
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
            // Handle unexpected codes (like code 1) from API
            toast.error("Failed to load contingent info.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        // Display specific error if available, otherwise generic network error
        const errorMsg = err.response?.data?.message || err.message || "Network Error: Could not fetch data.";
        toast.error(errorMsg);
      }
    };
    if(!token){
      return;
    }

    fetchData();
  }, [token]);

  const [joinId, setJoinId] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to simply open the custom modal
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

 const DeleteContin = async () => {
    if(isDeleting) return;

    if ((Object.keys(data.updatedMembersInfo).length !== 1) && myUserId === data.leaderId) {
      toast.error("Can't delete: Leader cannot leave if other members exist.");
      return;
    }
    
    const confirmLeave = window.confirm("Are you sure you want to abandon your contingent?");

    if (!confirmLeave) return;

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
        style={{ backgroundImage: `url(${contin})`, backgroundAttachment:"fixed",backgroundPosition:"bottom" }}
      >

      {!token && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/10 backdrop-blur-xl">
            <div className="w-full max-w-md p-10 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center relative overflow-hidden popup-anim backdrop-blur-md bg-gradient-to-r from-[#302e3b]/90 to-[#5f8a84]/70">
              {/* Decorative Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 blur-[100px]"></div>
              
              <span className="material-symbols-outlined !text-7xl text-purple-800 mb-4 block">
                lock_person
              </span>

              <h2 className="text-6xl text-white font-['Jolly_Lodger'] mb-4 tracking-widest">
                Halt, Stranger!
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
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-md p-8 rounded-3xl border border-white/20 shadow-2xl relative popup-anim backdrop-blur-md bg-gradient-to-r from-[#302e3b]/95 to-[#5f8a84]/80 text-center">
                  
                  <span className="material-symbols-outlined !text-6xl text-red-500 mb-4 block">
                    warning
                  </span>

                  <h2 className="text-5xl text-white font-['Jolly_Lodger'] mb-4 tracking-widest">
                    Abandon Journey?
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
                      ABANDON
                    </button>
                  </div>
                </div>
              </div>
  )}
            {showBarcodeModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                <div className="w-full max-w-sm p-8 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative text-center popup-anim backdrop-blur-md bg-gradient-to-r from-[#302e3b]/85 to-[#5f8a84]/65">
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
            {showAddModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="w-full max-w-md p-8 rounded-3xl border border-white/20 shadow-2xl relative popup-anim backdrop-blur-md bg-gradient-to-r from-[#302e3b]/80 to-[#5f8a84]/60">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="cursor-pointer absolute top-4 right-4 text-white/50 hover:text-white"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>

                  <h2 className="text-5xl text-white text-center font-['Jolly_Lodger'] mb-6 tracking-widest">
                    Summon Member
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

            <div className="h-[550px] overflow-auto w-[95%] sm:w-[85%] max-w-[800px] backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl relative p-6 mx-auto popup-anim bg-gradient-to-r from-[#302e3b]/80 to-[#5f8a84]/60">
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
                  {(myUserId == data.leaderId) && <button className="cursor-pointer h-[60px] bg-green-800 backdrop-blur-md border border-white/20 rounded-xl text-white font-['Jolly_Lodger'] text-2xl hover:bg-green-400 hover:text-black transition-all">
                    Contingent Payment
                  </button>}
                  <button className="cursor-pointer h-[60px] bg-green-800 backdrop-blur-md border border-white/20 rounded-xl text-white font-['Jolly_Lodger'] text-2xl  hover:bg-green-400 hover:text-black transition-all">
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
                  <button
                    onClick={() => setShowBarcodeModal(true)}
                    className="cursor-pointer group relative flex flex-col items-center justify-center w-full transition-all duration-300 active:scale-95"
                  >
                    <p className="font-['Jolly_Lodger'] text-white text-3xl opacity-70 mb-1 group-hover:text-purple-300 transition-colors">
                      View Barcode
                    </p>
                    <p className="font-['Jolly_Lodger'] text-purple-400 text-2xl tracking-widest border-b border-transparent group-hover:border-purple-500 group-hover:shadow-[0_5px_15px_rgba(168,85,247,0.4)] transition-all">
                      {data.id || "N/A"}
                    </p>
                    <span className="text-[10px] text-white/30 uppercase mt-2 tracking-tighter group-hover:text-white/60">
                      Click to scan
                    </span>
                  </button>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-center"
                style={{background:"linear-gradient(to right,#302e3b 0%, #5f8a84 100%)"}}>
                  <p className="font-['Jolly_Lodger'] text-white text-3xl opacity-70"
                  >Members</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {member.map((m, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between"
                    style={{background:"linear-gradient(to right,#302e3b 0%, #5f8a84 100%)"}}>
                      <span className="text-white font-['Jolly_Lodger'] text-xl">
                        <div className="text-4xl text-black">{m.name} {(m.id === data.leaderId) ? "👑" : ""}</div>
                        {m.sfId}
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


        {
          token && !conti && !joinOn && !CreateOn &&
          <div className="grid gap-2 bg-black/20 items-center h-[300px] w-[80%] max-h-[1085.5px] max-w-[500.25px] backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl popup-anim"
     style={{ gridTemplateRows: "2fr 5fr" }}>
            <button
              onClick={() => { navigate("/accommodation") }}
              className="cursor-pointer absolute top-4 left-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              <span className="material-symbols-outlined !text-[28px]">arrow_back</span>
            </button>
            <div className="h-[100px] w-full max-w-[300px] m-auto text-5xl sm:text-7xl rounded-2xl" style={{ display: "inline-flex", justifyContent: 'center', alignItems: 'center', fontFamily: 'Jolly Lodger', color: "black" }}>
              Contingent</div>
            <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr", }}>
              <div className="h-auto  m-auto bg-gray backdrop-blur-md border border-white/20 rounded-2xl shadow-xl contin-custom-btn btn-6 relative overflow-hidden group"
                onClick={() => setJoinOn(true)}
                style={{
                  background: "linear-gradient(135deg, #e7e5e4 0%, #d6d3d1 100%)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                }}>
                {/* Hover effect overlay */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                style={{background:"linear-gradient(to right,#302e3b 0%, #5f8a84 100%)"}}></div>
                
                {/* Text content */}
                <span className="p-2 relative z-10 flex items-center justify-center h-full font-['Jolly_Lodger'] text-4xl text-black group-hover:text-white transition-colors duration-300">
                  Join Contingent
                </span>
              </div>
             <div className=" m-auto bg-gray backdrop-blur-md border border-white/20 rounded-2xl shadow-xl contin-custom-btn btn-6 relative overflow-hidden group" 
                onClick={() => setCreateOn(true)}
                style={{
                  background: "linear-gradient(135deg, #e7e5e4 0%, #d6d3d1 100%)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                }}>
                {/* Hover effect overlay */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                style={{background:"linear-gradient(to right,#302e3b 0%, #5f8a84 100%)"}}></div>
                
                {/* Text content */}
                <span className="p-2 relative z-10 flex items-center justify-center h-full font-['Jolly_Lodger'] text-4xl text-black group-hover:text-white transition-colors duration-300">
                  Create Contingent
                </span>
              </div>
            </div>
          </div>
        }


        {!conti && !CreateOn && joinOn &&
          <>
            <div className="h-[150px] mt-[20px] w-full max-w-[350px] rounded-2xl shadow-xl "
              style={{ display: "inline-flex", justifyContent: 'center', alignItems: 'center', fontFamily: 'Jolly Lodger', color: "white", fontSize: '4rem' }}>
              Contingent</div>
            <div className="h-auto w-[80%] sm:w-[73%] max-w-[600.25px] backdrop-blur-md bg-black/10 border border-white/20 rounded-2xl shadow-xl justify-items-center relative popup-anim">
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
           <div className="h-auto w-[80%] sm:w-[73%] max-w-[600.25px] backdrop-blur-md bg-black/10 border border-white/20 rounded-2xl shadow-xl justify-items-center relative popup-anim">
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