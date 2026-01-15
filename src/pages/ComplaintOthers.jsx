// import { useEffect, useState } from "react";
// import ComplaintList from "../components/ComplaintList";

// import {
//   submitComplaint,
//   fetchComplaints,
//   cancelComplaint,
// } from "../api/complaintApi";

// export default function ComplaintOthers() {
//   const token = localStorage.getItem("token");

//   const [issue, setIssue] = useState("");
//   const [complaints, setComplaints] = useState([]);

//   const load = async () => {
//     const res = await fetchComplaints(token);
//     setComplaints(res.data.data);
//   };

//   const submit = async () => {
//     await submitComplaint(token, "Others", issue);
//     setIssue("");
//     load();
//   };

//   const cancel = async (id) => {
//     await cancelComplaint(token, id);
//     load();
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <>
//       <textarea
//         className="w-full mt-4 p-3 text-black rounded"
//         placeholder="Describe your issue"
//         value={issue}
//         onChange={(e) => setIssue(e.target.value)}
//       />

//       <button
//         onClick={submit}
//         className="mt-4 px-6 py-2 bg-white text-black rounded"
//       >
//         Submit
//       </button>

//       <ComplaintList
//         complaints={complaints}
//         onCancel={cancel}
//       />
//     </>
//   );
// }
