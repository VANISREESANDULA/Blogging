import { useFormik } from 'formik';
import { useState,useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { loginUser } from "./redux/authSlice";
import { toast } from "react-toastify";
import bgImage from "../assets/BG.jpg";


const Login = () => {
  const navigate = useNavigate();
   const dispatch = useDispatch();
    const { user,success, loading, error } = useSelector((state) => state.auth);
  const [isFormRight, setIsFormRight] = useState(true);
  const [book,setBook]=useState(false)
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
    // to dispatch redux thunk
    const resultAction = await dispatch(loginUser(values)); 
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } else {
      toast.error(resultAction.payload || "Invalid credentials");
    }
  } catch (err) {
    toast.error("Something went wrong. Please try again.");
  }
},

    onSubmit: (values) => {
      
      console.log('Sign In form submitted:', values);
        toast.success("Login successful!");
      setTimeout(() => {
    navigate("/home");
  }, 3500);
    },
  });
const handleSignIn = () => {
  setIsFormRight(false);
  setBook(!book) 
  setTimeout(() => {
    navigate("/register");
  },200);
};

  useEffect(() => {
    if (user) {
      navigate("/home"); 
    }
  }, [user, navigate]);
  useEffect(() => {
  if (error) {
    toast.error(error);
  }
}, [error]);
  return (
  <div className="min-h-screen flex items-center justify-center py-12 bg-cover bg-center bg-no-repeat" style={{
    backgroundImage: 'url("/Screenshot 2025-11-13 232324.png")',
    filter: 'brightness(1)' 
  }}>
  <div className="w-full max-w-4xl shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden inset-0 bg-black/10">
       <div className="w-full md:w-1/2 p-10   
                border 
                border-black/40 
                rounded-2xl 
                shadow-xl ">
          <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
          <div className="flex items-center mb-4">
            <span className="grow border-t"></span>
            <span className="mx-2 text-black-400 text-sm">or use your email</span>
            <span className="grow border-t"></span>
          </div>

          <form onSubmit={formik.handleSubmit}>

            <div className="relative mb-6">
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3  shadow-[0px_0px_15px_1px_rgba(0,0,0,0.5)]  bg-orange-100/50 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                onChange={formik.handleChange}
                value={formik.values.email}
                placeholder=" "
              />
              <label
                htmlFor="email"
                className={`absolute left-4 text-black font-bold transition-all duration-200  pointer-events-none ${
                  formik.values.email 
                    ? 'top-[-8px] text-xs bg-white px-2 text-purple-600' 
                    : 'top-3 text-base'
                }`}
              >
                Email(mail@gmail.com)
              </label>
            </div>

            <div className="relative mb-4">
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3  rounded-lg shadow-[0px_0px_15px_1px_rgba(0,0,0,0.5)]  bg-orange-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder=" "
              />
              <label
                htmlFor="password"
                className={`absolute left-4 text-black font-bold transition-all duration-500 pointer-events-none ${
                  formik.values.password 
                    ? '-top-2[-8px] text-xs bg-white px-2 text-purple-600' 
                    : 'top-3 text-base'
                }`}
              >
                Password
              </label>
            </div>

            <div className="text-right mb-6">
              <a href="#" className="text-sm text-purple-600 hover:text-purple-700 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-black font-semibold  shadow-[0px_0px_15px_1px_rgba(0,0,0,0.5)]  bg-orange-100/80 hover:opacity-90 transition-opacity"
            >
              SIGN IN
            </button>
          </form>
        </div>
     <div className={`w-full md:w-1/2 relative flex items-center justify-center p-10
             border border-black/30  
             rounded-2xl 
            text-white
             shadow-2xl ${book?"rotate-y-180 transition-all duration-300 origin-left bg-black text-transparent":""}`}
  style={{
    // backgroundImage: 'url("color bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* <div className="absolute z-0 rounded-lg inset-0 bg-black/10"></div> */}
  <div className={`relative z-10 text-center `}>
            <h3 className="text-3xl font-bold mb-6 ">Hello Friend!</h3>
            <p className="mb-8 text-lg max-w-md ">
              Enter your Personal details and start your journey with us
            </p>
            <button 
              type="button"
              onClick={handleSignIn}
              className="border-2 border-white rounded-lg px-8 py-3 font-semibold text-lg hover:bg-white hover:text-purple-500 transition-all duration-300 transform hover:scale-105 "
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



