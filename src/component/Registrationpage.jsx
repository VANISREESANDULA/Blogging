import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
      
      // Username validation
      if (!values.username.trim()) {
        errors.username = 'Full name is required';
      } else if (values.username.trim().length < 2) {
        errors.username = 'Full name must be at least 2 characters';
      } else if (!/^[a-zA-Z\s]*$/.test(values.username)) {
        errors.username = 'Full name can only contain letters and spaces';
      }
      
      // Email validation
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address format';
      } else if (!values.email.includes('@')) {
        errors.email = 'Email must contain @ symbol';
      } else if (values.email.indexOf('@') === 0) {
        errors.email = 'Email must have characters before @';
      } else if (values.email.indexOf('@') === values.email.length - 1) {
        errors.email = 'Email must have domain after @';
      }
      
      // Password validation
      if (!values.password) {
        errors.password = 'Password is required';
      } else {
        const hasUpperCase = /(?=.*[A-Z])/.test(values.password);
        const hasSymbol = /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(values.password);
        const hasNumber = /(?=.*\d)/.test(values.password);
        const hasMinLength = values.password.length >= 8;
        
        if (!hasMinLength) {
          errors.password = 'Password must be at least 8 characters';
        } else if (!hasUpperCase || !hasSymbol || !hasNumber) {
          errors.password = 'Password must contain at least one uppercase letter, one symbol, and one number';
        }
      }
      
      // Confirm password validation - Fixed to properly compare
      if (!values.confirmpassword) {
        errors.confirmpassword = 'Please confirm your password';
      } else if (values.password !== values.confirmpassword) {
        errors.confirmpassword = 'Passwords do not match';
      }
      
      return errors;
    },
    onSubmit: (values) => {
      // Check if passwords match before submission (extra safety)
      if (values.password !== values.confirmpassword) {
        formik.setFieldError('confirmpassword', 'Passwords do not match');
        return;
      }
      console.log('Form submitted:', values);
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue('avatar', file);
    if (file) {
      console.log('Avatar file selected:', file.name, file);
      
      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        formik.setFieldError('avatar', 'Please select a valid image file (JPEG, PNG, GIF)');
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        formik.setFieldError('avatar', 'Image size must be less than 5MB');
        return;
      }
      
      formik.setFieldError('avatar', null);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl rounded-2xl overflow-hidden backdrop-blur-lg bg-white/40 shadow-2xl border border-white/30">
        
        {/* Sign Up Section */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4">Sign Up</h2>
          <div className="flex justify-center space-x-4 mb-4">
            <button type="button" className="border rounded-full p-2 hover:bg-gray-50 transition-colors">
              <img src="/G icon.png" alt="Google" className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button type="button" className="border rounded-full p-2 hover:bg-gray-50 transition-colors">
              <img src="/fb icon.webp" alt="Facebook" className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          <div className="flex items-center mb-4">
            <span className="flex-grow border-t"></span>
            <span className="mx-2 text-gray-400 text-xs sm:text-sm">or use your email</span>
            <span className="flex-grow border-t"></span>
          </div>
          
          {/* Avatar Upload - Updated to Square and Larger Size */}
          <div className="flex justify-center mb-6 relative w-fit mx-auto">
            <label className="relative cursor-pointer group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg border-2 border-gray-300 bg-white/60 overflow-hidden flex items-center justify-center shadow-md transition-all duration-300 group-hover:border-purple-500">
                <img
                  src={avatarPreview || "/Profile Icon.png"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-1 sm:p-2 rounded-lg border-2 border-white shadow-lg bg-gradient-to-br from-[#7c3aed] to-[#db2777] transition-transform duration-300 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0-6l-3 3m3-3l3 3m5-8a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7z" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                  Change Photo
                </span>
              </div>
            </label>
          </div>
          
          {/* Show avatar error if any */}
          {formik.errors.avatar && (
            <div className="text-red-500 text-sm text-center mb-4 -mt-2">{formik.errors.avatar}</div>
          )}
          
          {/* Formik Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Full Name Field */}
            <div className="relative mb-4 sm:mb-6">
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm sm:text-base"
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
                    : 'top-3 text-sm sm:text-base'
                }`}
              >
                Full name
              </label>
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.username}</div>
              )}
            </div>

            {/* Email Field */}
            <div className="relative mb-4 sm:mb-6">
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm sm:text-base"
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
                    : 'top-3 text-sm sm:text-base'
                }`}
              >
                Email
              </label>
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="relative mb-4 sm:mb-6">
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm sm:text-base"
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
                    : 'top-3 text-sm sm:text-base'
                }`}
              >
                Password
              </label>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative mb-4 sm:mb-6">
              <input
                type="password"
                id="confirmpassword"
                name="confirmpassword"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm sm:text-base"
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
                    : 'top-3 text-sm sm:text-base'
                }`}
              >
                Confirm Password
              </label>
              {formik.touched.confirmpassword && formik.errors.confirmpassword && (
                <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.confirmpassword}</div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold shadow-md bg-gradient-to-br from-[#7725f4] via-[#a249ea] to-[#e260d2] hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              SIGN UP
            </button>
          </form>
        </div>

        {/* Sign In Promotion Section */}
        <div
          className="w-full lg:w-1/2 flex flex-col items-center justify-center text-white p-6 sm:p-8 lg:p-10 relative order-1 lg:order-2 min-h-[300px] sm:min-h-[400px]"
          style={{
            backgroundImage: 'url("color bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-black/40 absolute inset-0 pointer-events-none rounded-lg"></div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-3">Welcome Back!</h3>
            <p className="mb-5 text-center text-sm sm:text-base px-4">
              Already have an account? Sign in to access all features
            </p>
            <button 
              type="button"
              onClick={handleSignIn}
              className="border border-white rounded-lg px-4 sm:px-6 py-2 font-semibold hover:bg-white hover:text-purple-500 transition text-sm sm:text-base"
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