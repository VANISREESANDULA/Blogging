import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { loginUser } from './redux/authSlice';
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [book, setBook] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = "Email is required";
      if (!values.password) errors.password = "Password is required";
      return errors;
    },
    onSubmit: async (values) => {
      if (!values.email || !values.password) {
        toast.error("Please fill in all fields");
        return;
      }

      try {
        const resultAction = await dispatch(loginUser(values));
        if (loginUser.fulfilled.match(resultAction)) {
          toast.success("Login successful!");
          setTimeout(() => navigate("/home"), 1500);
        } else {
          toast.error(resultAction.payload || "Invalid credentials");
        }
      } catch (err) {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const handleSignUp = () => {
    setBook(!book);
    setTimeout(() => navigate("/register"), 200);
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url("/Screenshot 2025-11-13 232324.png.jpg")'}}>
      <div className="
  w-full max-w-4xl 
  rounded-3xl 
  flex flex-row-reverse 
  overflow-hidden 
  border border-white/20 
  bg-white/10 
  shadow-[0_8px_32px_rgba(31,38,135,0.37)]
  backdrop-blur-lg 
  backdrop-saturate-150
  
">

        {/* Login Form */}
        <div className="w-full md:w-1/2 p-10 border border-black/40 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Sign In</h2>
          <div className="flex items-center mb-4">
            <span className="grow border-t border-gray-300"></span>
            <span className="mx-2 text-black text-sm">or use your email</span>
            <span className="grow border-t border-gray-300"></span>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="relative mb-6">
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 shadow-[0px_0px_15px_1px_rgba(0,0,0,0.3)] border-2 bg-orange-100/50 rounded-lg focus:outline-none focus:border-amber-950 focus:ring-2 focus:ring-amber-950 transition-all duration-200"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                placeholder=" "
              />
              <label htmlFor="email" className={`absolute left-4 text-black font-bold transition-all duration-200 pointer-events-none ${formik.values.email ? 'top-[-8px] text-xs bg-white px-2 text-amber-900' : 'top-3 text-base'}`}>Email</label>
              {formik.touched.email && formik.errors.email && <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>}
            </div>

            <div className="relative mb-4">
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 rounded-lg shadow-[0px_0px_15px_1px_rgba(0,0,0,0.3)] border-2 bg-orange-100/50 focus:outline-none focus:border-amber-950 focus:ring-2 focus:ring-amber-950 transition-all duration-200"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder=" "
              />
              <label htmlFor="password" className={`absolute left-4 text-black font-bold transition-all duration-200 pointer-events-none ${formik.values.password ? 'top-[-8px] text-xs bg-white px-2 text-amber-900' : 'top-3 text-base'}`}>Password</label>
              {formik.touched.password && formik.errors.password && <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>}
            </div>

            <div className="text-right mb-6">
              <a href="#" className="text-sm text-purple-600 hover:text-purple-800 transition-colors">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-black font-semibold shadow-[0px_0px_15px_1px_rgba(0,0,0,0.3)] bg-orange-100/80 hover:bg-orange-200/80 transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        </div>

        {/* Sign Up Card */}
        <div className={`w-full md:w-1/2 relative flex items-center justify-center p-10 border border-black/30 rounded-2xl text-white shadow-2xl ${book ? "rotate-y-180 transition-all duration-300 origin-left bg-black text-transparent" : ""}`}>
          <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold mb-6">Hello Friend!</h3>
            <p className="mb-8 text-lg max-w-md">Enter your personal details and start your journey with us</p>
            <button type="button" onClick={handleSignUp} className="border-2 border-white rounded-lg px-8 py-3 font-semibold text-lg hover:bg-white hover:text-purple-700 transition-all duration-300 transform hover:scale-105">SIGN UP</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
