// import React, { useState } from "react";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(false); // false = registration, true = login

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 md:px-0 bg-gradient-to-br bg-cover bg-center bg-no-repeat">
//       <div className="flex flex-col md:flex-row w-11/12 max-w-5xl rounded-2xl overflow-hidden backdrop-blur-lg bg-white/40 shadow-2xl border border-white/30 mx-auto transition-all duration-700 ease-in-out">

//         {/* Form Section */}
//         <div
//           className={`w-full md:w-1/2 p-10 flex flex-col justify-center transition-all duration-700 ease-in-out ${
//             isLogin ? "order-2 md:order-2" : "order-1 md:order-1"
//           }`}
//         >
//           {isLogin ? (
//             <>
//               {/* ✅ LOGIN FORM (your existing login form here) */}
//               <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
//               <form>
//                 <input type="email" placeholder="Email" className="border rounded-md p-2 w-full mb-4" />
//                 <input type="password" placeholder="Password" className="border rounded-md p-2 w-full mb-6" />
//                 <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full">
//                   Sign In
//                 </button>
//               </form>

//               <p className="text-center mt-6 text-sm">
//                 Don’t have an account?{" "}
//                 <button
//                   onClick={() => setIsLogin(false)}
//                   className="text-blue-600 font-semibold hover:underline"
//                 >
//                   Sign Up
//                 </button>
//               </p>
//             </>
//           ) : (
//             <>
//               {/* ✅ REGISTRATION FORM (your existing registration form here) */}
//               <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
//               <form>
//                 <input type="text" placeholder="Name" className="border rounded-md p-2 w-full mb-4" />
//                 <input type="email" placeholder="Email" className="border rounded-md p-2 w-full mb-4" />
//                 <input type="password" placeholder="Password" className="border rounded-md p-2 w-full mb-6" />
//                 <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md w-full">
//                   Sign Up
//                 </button>
//               </form>

//               <p className="text-center mt-6 text-sm">
//                 Already have an account?{" "}
//                 <button
//                   onClick={() => setIsLogin(true)}
//                   className="text-green-600 font-semibold hover:underline"
//                 >
//                   Sign In
//                 </button>
//               </p>
//             </>
//           )}
//         </div>

//         {/* Color Card Section */}
//         <div
//           className={`w-full md:w-1/2 flex flex-col items-center justify-center text-white p-10 relative transition-all duration-700 ease-in-out ${
//             isLogin
//               ? "bg-blue-600 order-1 md:order-1"
//               : "bg-green-600 order-2 md:order-2"
//           }`}
//         >
//           <h2 className="text-4xl font-bold mb-4">
//             {isLogin ? "Welcome Back!" : "Join Us Today!"}
//           </h2>
//           <p className="text-center text-white/90 max-w-sm">
//             {isLogin
//               ? "Access your account and explore our features."
//               : "Create your account and start your journey with us!"}
//           </p>
//         </div>
//       </div>

//       <ToastContainer position="top-center" autoClose={1500} />
//     </div>
//   );
// };

// export default AuthPage;
