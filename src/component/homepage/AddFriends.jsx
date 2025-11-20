// import React from "react";
// import { useNavigate } from "react-router-dom";

// const AddFriends = () => {
//   const navigate = useNavigate();

//   const users = [
//     { name: "Sarah Mitchell", username: "@sarahmitchell", mutual: 24 },
//     { name: "Michael Chen", username: "@michaelchen", mutual: 18 },
//     { name: "Emily Rodriguez", username: "@emilyrodriguez", mutual: 31 },
//     { name: "David Thompson", username: "@davidthompson", mutual: 12 },
//     { name: "Jessica Park", username: "@jessicapark", mutual: 9 },
//     { name: "Ryan Martinez", username: "@ryanmartinez", mutual: 15 }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 flex">

//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-md flex flex-col">
//         <div className="p-4 border-b">
//           <h1 className="text-2xl font-semibold text-purple-700">EveryTale</h1>
//         </div>

//         <div className="p-4 flex flex-col gap-4 text-gray-700">
//           <button className="flex items-center gap-2 hover:text-purple-600" onClick={() => navigate("/home")}>
//             <span>🏠</span> Home
//           </button>

//           <button className="flex items-center gap-2 hover:text-purple-600" onClick={() => navigate("/add-friends")}>
//             <span>👥</span> Add Friends
//           </button>
//         </div>
//       </div>


//       {/* Content */}
//       <div className="flex-1 p-6">
//           <div className="flex gap-4 mb-6">
//         <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
//           All Requests
//         </button>
//         <button className="bg-white px-4 py-2 rounded-lg shadow">
//           Sent Requests
//         </button>
//         <button className="bg-white px-4 py-2 rounded-lg shadow">
//           Suggestions
//         </button>
//       </div>

//         <div className="grid grid-cols-2 gap-6">
//           {users.map((user, index) => (
//             <div key={index} className="bg-white p-4 rounded-lg shadow-md flex justify-between">
//               <div className="flex gap-3">
//                 <div className="w-12 h-12 bg-black rounded-md"></div>
//                 <div>
//                   <h3 className="font-semibold">{user.name}</h3>
//                   <p className="text-gray-500">{user.username}</p>
//                   <p className="text-sm">{user.mutual} mutual friends</p>

//                   <div className="flex gap-3 mt-3">
//                     <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
//                       Accept
//                     </button>
//                     <button className="bg-gray-200 px-4 py-2 rounded-lg">
//                       Decline
//                     </button>
//                   </div>
//                 </div>
//               </div>
//               <div className="text-gray-400">⋮</div>
//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   );
// };

// export default AddFriends;
