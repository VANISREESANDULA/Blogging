import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from "../assets/top-view-photo-laptop-flowerpot-small-spiral-notebook-pen-isolated-white-wooden-table-background-with-blank-space_352249-4747.avif"; 


const Login = () => {
  const navigate = useNavigate();
  const [isFormRight, setIsFormRight] = useState(true);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      console.log('Sign In form submitted:', values);
    },
  });

  // const handleSignUp = () => {
  //   navigate('/register');
  // };
const handleSignUp = () => {
  setIsFormRight(false); // form goes left
  setTimeout(() => {
    navigate("/register");
  });
};

  return (
    <div  className="min-h-screen flex items-center justify-center px-4 md:px-0 bg-gradient-to-br relative  bg-cover bg-center bg-no-repeat " 
    >
      
 <div className={`flex flex-col md:flex-row w-11/12 max-w-5xl rounded-2xl overflow-hidden backdrop-blur-lg bg-white/40 shadow-2xl border border-white/30 mx-auto transition-all duration-700 ${
    isFormRight ? "md:flex-row-reverse" : ""
  }`}
 >
        
        {/* Sign In Section */}
       <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">

          <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
          <div className="flex justify-center space-x-4 mb-4">
            <button type="button" className="border rounded-full p-2">
              <img src="G icon.png" alt="Google" className="h-6 w-6" />
            </button>
            <button type="button" className="border rounded-full p-2">
              <img src="fb icon.webp" alt="Facebook" className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center mb-4">
            <span className="flex-grow border-t"></span>
            <span className="mx-2 text-gray-400 text-sm">or use your email</span>
            <span className="flex-grow border-t"></span>
          </div>
          
          {/* Formik Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Email Field */}
            <div className="relative mb-6">
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                onChange={formik.handleChange}
                value={formik.values.email}
                placeholder=" "
              />
              <label
                htmlFor="email"
                className={`absolute left-4 text-gray-400 transition-all duration-200 pointer-events-none ${
                  formik.values.email 
                    ? 'top-[-8px] text-xs bg-white px-2 text-purple-600' 
                    : 'top-3 text-base'
                }`}
              >
                Email
              </label>
            </div>

            {/* Password Field */}
            <div className="relative mb-4">
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder=" "
              />
              <label
                htmlFor="password"
                className={`absolute left-4 text-gray-400 transition-all duration-200 pointer-events-none ${
                  formik.values.password 
                    ? 'top-[-8px] text-xs bg-white px-2 text-purple-600' 
                    : 'top-3 text-base'
                }`}
              >
                Password
              </label>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mb-6">
              <a href="#" className="text-sm text-purple-600 hover:text-purple-700 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold shadow-md bg-gradient-to-br from-[#7725f4] via-[#a249ea] to-[#e260d2] hover:opacity-90 transition-opacity"
            >
              SIGN IN
            </button>

            {/* Copyright notice */}
            <div className="text-center mt-6 text-gray-500 text-sm">
              © 2025 your email
            </div>
          </form>
        </div>

        {/* Sign Up Promotion Section - with background image */}
        <div
          className="w-full md:w-1/2 flex flex-col items-center justify-center text-white p-10 relative"
          style={{
            backgroundImage: 'url("color bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay for readability */}
          <div className="bg-black/40 absolute inset-0 pointer-events-none rounded-lg"></div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full text-center">
            <h3 className="text-3xl font-bold mb-6">Hello Friend!</h3>
            <p className="mb-8 text-lg max-w-md">
              Enter your Personal details and start your journey with us
            </p>
            <button 
              type="button"
              onClick={handleSignUp}
              className="border-2 border-white rounded-lg px-8 py-3 font-semibold text-lg hover:bg-white hover:text-purple-500 transition-all duration-300 transform hover:scale-105"
            >
              SIGN UP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;