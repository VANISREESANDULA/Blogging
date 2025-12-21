import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { loginUser } from './redux/authslice';
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const isDark = useSelector((state) => state.theme.isDark);

  // Theme-aware classes for inputs and labels
  const inputBase = 'w-full px-4 py-3 rounded-lg shadow-[0px_0px_15px_1px_rgba(0,0,0,0.3)] border-2 focus:outline-none focus:border-amber-950 focus:ring-2 focus:ring-amber-950 transition-all duration-200';
  // Default inputs are black for high-contrast readability
  const inputBg = 'bg-white text-black placeholder-gray-400 border-gray-700';
  const labelBase = `absolute left-4 font-bold transition-all duration-200 pointer-events-none`;
  const labelColor = 'text-black';
  const labelRaisedBg = 'top-[-8px] text-xs bg-white px-2 text-black';
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
          const errorMessage = resultAction.error?.message || 
                             resultAction.payload || 
                             "Invalid credentials";
          toast.error(errorMessage);
        }
      } catch (err) {
        toast.error("Something went wrong. Please try again.");
        console.error("Login error:", err);
      }
    },
  });

  const handleSignUp = () => {
    setBook(true);
    setTimeout(() => navigate("/register"), 300);
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  // Display error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-cover bg-center bg-no-repeat bg-orange-50" >
      <div className="
        w-full max-w-4xl 
        rounded-3xl 
        flex flex-col md:flex-row-reverse 
        overflow-hidden 
        border border-white/20 
        bg-orange-50 
        shadow-[0_8px_32px_rgba(31,38,135,0.37)]
        backdrop-blur-lg 
        backdrop-saturate-150
      ">
        {/* Login Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 border border-black/40 rounded-2xl shadow-xl bg-orange-100" >
          <h2 className="text-2xl font-semibold text-center mb-4 text-black">Sign In</h2>
          <div className="flex items-center mb-4">
            <span className="grow border-t border-black"></span>
            <span className="px-4 text-black">Welcome back</span>
            <span className="grow border-t border-black"></span>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="relative mb-6">
              <input
                type="email"
                id="email"
                name="email"
                className={`${inputBase} ${inputBg} ${formik.errors.email ? 'border-red-500' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                placeholder=" "
              />
              <label 
                htmlFor="email" 
                className={`${labelBase} ${labelColor} ${formik.values.email ? labelRaisedBg : 'top-3 text-base'}`}
              >
                Email
              </label>
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

            <div className="relative mb-4">
              <input
                type="password"
                id="password"
                name="password"
                className={`${inputBase} ${inputBg} ${formik.errors.password ? 'border-red-500' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder=" "
              />
              <label 
                htmlFor="password" 
                className={`${labelBase} ${labelColor} ${formik.values.password ? labelRaisedBg : 'top-3 text-base'}`}
              >
                Password
              </label>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            <div className="text-right mb-6">
              <a href="#" className="text-sm text-orange-500 hover:text-orange-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-3 rounded-lg text-black font-semibold shadow-[0px_0px_15px_1px_rgba(0,0,0,0.3)] bg-orange-100/80 hover:bg-orange-500 transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        </div>

        {/* Sign Up Card */}
        <div className={`w-full md:w-1/2 relative flex items-center justify-center p-10 border border-black/30 rounded-2xl text-white shadow-2xl transition-all duration-300 ${book ? "opacity-0 scale-95" : ""}`}>
          <div className="absolute inset-0 bg-orange-500 rounded-2xl"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold mb-6">Hello Friend!</h3>
            <p className="mb-8 text-lg max-w-md mx-auto">
              Enter your personal details and start your journey with us
            </p>
            <button 
              type="button" 
              onClick={handleSignUp} 
              className="border-2 border-white rounded-lg px-8 py-3 font-semibold text-lg hover:bg-white hover:text-blue-950 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              SIGN UP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;