import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
// import { CropperRef, Cropper } from 'react-advanced-cropper';
// import 'react-advanced-cropper/dist/style.css'


const Registrationpage = () => {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmpassword: '',
      avatar: null
    },
    validate: (values) => {
      const errors = {};
      
      if (!values.username.trim()) errors.username = 'Full name is required';
      if (!values.email) errors.email = 'Email is required';
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      if (!values.password) errors.password = 'Password is required';
      else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters';
      if (!values.confirmpassword) errors.confirmpassword = 'Please confirm your password';
      else if (values.password !== values.confirmpassword) {
        errors.confirmpassword = 'Passwords must match';
      }
      
      return errors;
    },
    onSubmit: (values) => {
      console.log('Form submitted:', values);
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue('avatar', file);
    if (file) {
      console.log('Avatar file selected:', file.name, file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden backdrop-blur-lg bg-white/40 shadow-2xl border border-white/30">
        
        {/* Sign Up Section */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
          <div className="flex justify-center space-x-4 mb-4">
            <button type="button" className="border rounded-full p-2">
              <img src="/G icon.png" alt="Google" className="h-6 w-6" />
            </button>
            <button type="button" className="border rounded-full p-2">
              <img src="/fb icon.webp" alt="Facebook" className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center mb-4">
            <span className="flex-grow border-t"></span>
            <span className="mx-2 text-gray-400 text-sm">or use your email</span>
            <span className="flex-grow border-t"></span>
          </div>
          
          {/* Avatar Upload */}
          <div className="flex justify-center mb-4 relative w-fit mx-auto">
            <label className="relative cursor-pointer">
              <img
                src={avatarPreview || "/Profile Icon.png"}
                alt="Avatar"
                className="h-14 w-14 rounded-full border-2 border-gray-300 bg-white/60 object-cover"
              />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="absolute bottom-0 right-0 p-1 rounded-full border-2 border-white shadow-lg"
                style={{background: "linear-gradient(135deg, #7c3aed, #db2777)"}}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0-6l-3 3m3-3l3 3m5-8a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7z" />
                </svg>
              </span>
            </label>
          </div>
          
          {/* Formik Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Full Name Field */}
            <div className="relative mb-6">
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                placeholder=" "
              />
              <label
                htmlFor="username"
                className={`absolute left-4 text-gray-400 transition-all duration-200 pointer-events-none ${
                  formik.values.username 
                    ? 'top-[-8px] text-xs bg-white px-2 text-purple-600' 
                    : 'top-3 text-base'
                }`}
              >
                Full name
              </label>
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
              )}
            </div>

            {/* Email Field */}
            <div className="relative mb-6">
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="relative mb-6">
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative mb-6">
              <input
                type="password"
                id="confirmpassword"
                name="confirmpassword"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmpassword}
                placeholder=" "
              />
              <label
                htmlFor="confirmpassword"
                className={`absolute left-4 text-gray-400 transition-all duration-200 pointer-events-none ${
                  formik.values.confirmpassword 
                    ? 'top-[-8px] text-xs bg-white px-2 text-purple-600' 
                    : 'top-3 text-base'
                }`}
              >
                Confirm Password
              </label>
              {formik.touched.confirmpassword && formik.errors.confirmpassword && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.confirmpassword}</div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold shadow-md bg-gradient-to-br from-[#7725f4] via-[#a249ea] to-[#e260d2] hover:opacity-90 transition-opacity"
            >
              SIGN UP
            </button>
          </form>
        </div>

        {/* Sign In Promotion Section */}
        <div
          className="w-1/2 flex flex-col items-center justify-center text-white p-10 relative"
          style={{
            backgroundImage: 'url("color bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-black/40 absolute inset-0 pointer-events-none rounded-lg"></div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full">
            <h3 className="text-xl font-semibold mb-3">Welcome Back!</h3>
            <p className="mb-5 text-center">
              Already have an account? Sign in to access all features
            </p>
            <button 
              type="button"
              onClick={handleSignIn}
              className="border border-white rounded-lg px-6 py-2 font-semibold hover:bg-white hover:text-purple-500 transition"
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registrationpage;