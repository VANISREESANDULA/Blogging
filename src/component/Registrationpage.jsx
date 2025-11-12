import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Cropper } from 'react-advanced-cropper';
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "./redux/authSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-advanced-cropper/dist/style.css'
<<<<<<< HEAD
=======
import bgImage from "../assets/top-view-photo-laptop-flowerpot-small-spiral-notebook-pen-isolated-white-wooden-table-background-with-blank-space_352249-4747.avif";
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9

const Registrationpage = () => {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(""); // ✅ Added
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFormRight, setIsFormRight] = useState(false);
  const cropperRef = useRef(null);
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

<<<<<<< HEAD
  // Validation function for password
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    
    return errors;
=======
  // ✅ Password strength checker function
  const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password) setPasswordStrength("");
    else if (strongRegex.test(password)) setPasswordStrength("strong");
    else setPasswordStrength("weak");
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
  };

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

<<<<<<< HEAD
      // Username validation
      if (!values.username.trim()) {
        errors.username = 'Full name is required';
      } else if (values.username.trim().length < 2) {
        errors.username = 'Username must be at least 2 characters';
      }

      // Email validation
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }

      // Password validation
      if (!values.password) {
        errors.password = 'Password is required';
      } else {
        const passwordErrors = validatePassword(values.password);
        if (passwordErrors.length > 0) {
          errors.password = passwordErrors[0]; // Show first error
        }
      }

      // Confirm password validation
      if (!values.confirmpassword) {
        errors.confirmpassword = 'Please confirm your password';
      } else if (values.password !== values.confirmpassword) {
=======
      if (!values.username.trim()) errors.username = 'Full name is required';
      if (!values.email) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Invalid email address';
      }

      // ✅ Password validation
      if (!values.password) errors.password = 'Password is required';
      else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters';
      else if (!/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/.test(values.password))
        errors.password = 'Password must contain letters, numbers & a special character';

      if (!values.confirmpassword) errors.confirmpassword = 'Please confirm your password';
      else if (values.password !== values.confirmpassword)
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
        errors.confirmpassword = 'Passwords must match';

      return errors;
    },
    onSubmit: (values) => {
      const data = new FormData();
      data.append("username", values.username);
      data.append("email", values.email);
      data.append("password", values.password);
      data.append("confirmpassword", values.confirmpassword);
      if (values.avatar) {
        data.append("profilePhoto", values.avatar);
      }
      dispatch(registerUser(data));
      console.log('Form submitted:', values);
    },
  });

  useEffect(() => {
    if (user) {
      toast.success("Registration Successful 🎉");
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
  }, [user, navigate]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageToCrop(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCropSave = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            const originalName = formik.values.avatar?.name || "avatar.png";
            const file = new File([blob], originalName, { type: blob.type });
<<<<<<< HEAD

=======
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
            setAvatarPreview(URL.createObjectURL(file));
            formik.setFieldValue("avatar", file);
          }
        }, formik.values.avatar?.type || "image/png");
      }
    }
    setImageToCrop(null);
  };
<<<<<<< HEAD

  const handleSignIn = () => {
    navigate('/login');
  };

  // Helper function to determine input field styles
  const getFieldStyles = (fieldName) => {
    if (formik.touched[fieldName]) {
      if (formik.errors[fieldName]) {
        // Invalid field - red styling
        return {
          input: 'w-full px-4 py-3 border border-red-500 rounded-lg bg-red-50 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500',
          label: 'absolute left-4 transition-all duration-200 pointer-events-none top-[-8px] text-xs bg-red-50 px-2 text-red-600'
        };
      } else {
        // Valid field - green styling
        return {
          input: 'w-full px-4 py-3 border border-green-500 rounded-lg bg-green-50 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500',
          label: 'absolute left-4 transition-all duration-200 pointer-events-none top-[-8px] text-xs bg-green-50 px-2 text-green-600'
        };
      }
    }
    
    // Default styling
    return {
      input: 'w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500',
      label: `absolute left-4 text-gray-400 transition-all duration-200 pointer-events-none ${formik.values[fieldName] ? 'top-[-8px] text-xs bg-white px-2 text-purple-600' : 'top-3 text-base'}`
    };
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

=======

 const handleSignIn = () => {
  setIsFormRight(true); // move form to right visually
  setTimeout(() => {
    navigate("/login");
  }); // small delay for smooth transition
};


  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-0 bg-gradient-to-br bg-cover bg-center bg-no-repeat">
     <div  className={`flex flex-col md:flex-row w-full max-w-5xl rounded-2xl overflow-hidden backdrop-blur-lg bg-white/40 shadow-2xl border border-white/30 mx-auto transition-all duration-700 ${
    isFormRight ? "md:flex-row-reverse" : "md:flex-row"
  }`}>

        {/* Left Section - Sign Up */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
        <div className="flex justify-center space-x-4 mb-4">
            <button type="button" className="border rounded-full p-2">
              <img src="G icon.png" alt="Google" className="h-6 w-6" />
            </button>
            <button type="button" className="border rounded-full p-2">
              <img src="fb icon.webp" alt="Facebook" className="h-6 w-6" />
            </button>
          </div>
          <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
          {/* Avatar Upload */}
          <div className="flex justify-center mb-4 relative w-fit mx-auto">
            <label className="relative cursor-pointer">
              <img
                src={avatarPreview || "/Profile Icon.png"}
                alt="Avatar"
                className="h-32 w-32 border-2 border-gray-300 bg-white/60 object-cover rounded-md overflow-hidden"
              />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span
                className="absolute bottom-1 right-1 p-1 rounded-md border-2 border-white shadow-lg"
                style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0-6l-3 3m3-3l3 3m5-8a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7z" />
                </svg>
              </span>
            </label>
          </div>

<<<<<<< HEAD
          {/* Cropper Popup */}
=======
          {/* Crop Popup */}
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
          {imageToCrop && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-md shadow-xl w-[350px] h-[450px] flex flex-col gap-3">
                <div className="flex-1 overflow-hidden rounded-md">
                  <Cropper
                    ref={cropperRef}
                    src={imageToCrop}
                    className="w-full h-full"
                    stencilProps={{
                      movable: true,
                      resizable: true,
                      lines: true,
                      handlers: true,
                    }}
                    zoom={false}
                    resizeImage={true}
                    stencilSize={{
                      width: '80%',
                      height: '80%',
                    }}
                    imageRestriction="fit-area"
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setImageToCrop(null)}
                    className="px-3 py-1 bg-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropSave}
                    className="px-3 py-1 bg-purple-600 text-white rounded-md"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

<<<<<<< HEAD
          {/* Formik Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Full Name Field */}
=======
          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Username */}
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
            <div className="relative mb-6">
              <input
                type="text"
                id="username"
                name="username"
<<<<<<< HEAD
                className={getFieldStyles('username').input}
=======
                className={`w-full px-4 py-3 border ${formik.errors.username ? "border-red-500" : "border-gray-300"} rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                placeholder=" "
              />
<<<<<<< HEAD
              <label
                htmlFor="username"
                className={getFieldStyles('username').label}
              >
=======
              <label htmlFor="username" className={`absolute left-4 text-gray-400 transition-all duration-200 pointer-events-none ${formik.values.username ? 'top-[-8px] text-xs bg-white px-2 text-purple-600' : 'top-3 text-base'}`}>
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
                Full name
              </label>
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
              )}
            </div>

<<<<<<< HEAD
            {/* Email Field */}
            <div className="relative mb-6">
=======
            {/* Email */}
            <div className="relative mb-6">
              <label className="absolute right-3 top-2 text-orange-500">*</label>
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
              <input
                type="email"
                id="email"
                name="email"
<<<<<<< HEAD
                className={getFieldStyles('email').input}
=======
                required
                className={`w-full px-4 py-3 border ${formik.errors.email ? "border-red-500" : "border-gray-300"} rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                placeholder=" "
              />
<<<<<<< HEAD
              <label
                htmlFor="email"
                className={getFieldStyles('email').label}
              >
=======
              <label htmlFor="email" className={`absolute left-4 text-gray-400 transition-all duration-200 pointer-events-none ${formik.values.email ? 'top-[-8px] text-xs bg-white px-2 text-purple-600' : 'top-3 text-base'}`}>
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
                Email
              </label>
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

<<<<<<< HEAD
            {/* Password Field */}
=======
            {/* Password */}
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
            <div className="relative mb-6">
              <input
                type="password"
                id="password"
                name="password"
<<<<<<< HEAD
                className={getFieldStyles('password').input}
                onChange={formik.handleChange}
=======
                className={`w-full px-4 py-3 border ${formik.errors.password ? "border-red-500" : passwordStrength === "strong" ? "border-green-500" : "border-gray-300"} rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                onChange={(e) => {
                  formik.handleChange(e);
                  checkPasswordStrength(e.target.value);
                }}
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder=" "
              />
<<<<<<< HEAD
              <label
                htmlFor="password"
                className={getFieldStyles('password').label}
              >
                Password
              </label>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
              {formik.touched.password && !formik.errors.password && (
                <div className="text-green-500 text-sm mt-1">✓ Valid password</div>
              )}
            </div>

            {/* Confirm Password Field */}
=======
              <label htmlFor="password" className={`absolute left-4 text-gray-400 transition-all duration-200 pointer-events-none ${formik.values.password ? 'top-[-8px] text-xs bg-white px-2 text-purple-600' : 'top-3 text-base'}`}>
                Password
              </label>

              {passwordStrength && (
                <p className={`text-sm mt-1 ${passwordStrength === "strong" ? "text-green-600" : "text-red-500"}`}>
                  {passwordStrength === "strong" ? "Strong password 💪" : "Weak password ⚠️"}
                </p>
              )}
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            {/* Confirm Password */}
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
            <div className="relative mb-6">
              <input
                type="password"
                id="confirmpassword"
                name="confirmpassword"
<<<<<<< HEAD
                className={getFieldStyles('confirmpassword').input}
=======
                className={`w-full px-4 py-3 border ${formik.errors.confirmpassword ? "border-red-500" : "border-gray-300"} rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmpassword}
                placeholder=" "
              />
<<<<<<< HEAD
              <label
                htmlFor="confirmpassword"
                className={getFieldStyles('confirmpassword').label}
              >
=======
              <label htmlFor="confirmpassword" className={`absolute left-4 text-gray-400 transition-all duration-200 pointer-events-none ${formik.values.confirmpassword ? 'top-[-8px] text-xs bg-white px-2 text-purple-600' : 'top-3 text-base'}`}>
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
                Confirm Password
              </label>
              {formik.touched.confirmpassword && formik.errors.confirmpassword && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.confirmpassword}</div>
              )}
<<<<<<< HEAD
              {formik.touched.confirmpassword && !formik.errors.confirmpassword && (
                <div className="text-green-500 text-sm mt-1">✓ Passwords match</div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold shadow-md bg-gradient-to-br from-[#7725f4] via-[#a249ea] to-[#e260d2] hover:opacity-90 transition-opacity"
            >
=======
            </div>

            {/* Submit */}
            <button type="submit" className="w-full py-3 rounded-lg text-white font-semibold shadow-md bg-gradient-to-br from-[#7725f4] via-[#a249ea] to-[#e260d2] hover:opacity-90 transition-opacity">
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
              SIGN UP
            </button>
            {loading && <p className="text-blue-600 mt-2">Creating account...</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
            {user && <p className="text-green-600 mt-2">Account created successfully!</p>}
          </form>
        </div>

<<<<<<< HEAD
        {/* Sign In Promotion Section */}
        <div
          className="w-1/2 flex flex-col items-center justify-center text-white p-10 relative"
=======
        {/* Right Section */}
        <div
          className="w-full md:w-1/2 flex flex-col items-center justify-center text-white p-10 relative"
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
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
<<<<<<< HEAD
            <button
=======
            {/* <button
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
              type="button"
              onClick={handleSignIn}
              className="border border-white rounded-lg px-6 py-2 font-semibold hover:bg-white hover:text-purple-500 transition"
            >
              SIGN IN
<<<<<<< HEAD
            </button>
=======
            </button> */}
            <button
  type="button"
  onClick={handleSignIn}
  className="border border-white rounded-lg px-6 py-2 font-semibold hover:bg-white hover:text-purple-500 transition"
>
  SIGN IN
</button>

>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
<<<<<<< HEAD
}

export default Registrationpage;
=======
};

export default Registrationpage;








// import { useFormik } from 'formik';
// import { useNavigate } from 'react-router-dom';
// import { useState, useRef } from 'react';
// import { Cropper } from 'react-advanced-cropper';
// import { useDispatch, useSelector } from "react-redux";
// import { registerUser } from "./redux/authSlice";
// import { useEffect } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import 'react-advanced-cropper/dist/style.css'
// import bgImage from "../assets/top-view-photo-laptop-flowerpot-small-spiral-notebook-pen-isolated-white-wooden-table-background-with-blank-space_352249-4747.avif"; 


// const Registrationpage = () => {
//   const navigate = useNavigate();
//   const [avatarPreview, setAvatarPreview] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const cropperRef = useRef(null);
//   const dispatch = useDispatch();
//   const { loading, error, user } = useSelector((state) => state.auth);

//   const formik = useFormik({
//     initialValues: {
//       username: '',
//       email: '',
//       password: '',
//       confirmpassword: '',
//       avatar: null
//     },
//     validate: (values) => {
//       const errors = {};

//       if (!values.username.trim()) errors.username = 'Full name is required';
//       if (!values.email) errors.email = 'Email is required';
//       else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
//         errors.email = 'Invalid email address';
//       }
//       if (!values.password) errors.password = 'Password is required';
//       else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters';
//       if (!values.confirmpassword) errors.confirmpassword = 'Please confirm your password';
//       else if (values.password !== values.confirmpassword) {
//         errors.confirmpassword = 'Passwords must match';
//       }

//       return errors;
//     },
//     onSubmit: (values) => {

//       // console.log(values);

//       const data = new FormData();
//       data.append("username", values.username);
//       data.append("email", values.email);
//       data.append("password", values.password);
//       data.append("confirmpassword", values.confirmpassword);

//       if (values.avatar) {
//         data.append("profilePhoto", values.avatar); // ✅ file sent to backend
//       }

//       dispatch(registerUser(data));
//       console.log('Form submitted:', values);
//     },
//   });
//   useEffect(() => {
//     if (user) {
//       toast.success("Registration Successful 🎉");
//       setTimeout(() => {
//         navigate('/login');
//       }, 1500); // wait 1.5s before redirect
//     }
//   }, [user, navigate]);

//   // const handleFileChange = (event) => {
//   //   const file = event.currentTarget.files[0];
//   //   formik.setFieldValue('avatar', file);
//   //   if (file) {
//   //     console.log('Avatar file selected:', file.name, file);
//   //     const previewUrl = URL.createObjectURL(file);
//   //     setAvatarPreview(previewUrl);
//   //   } else {
//   //     setAvatarPreview(null);
//   //   }
//   // };
//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => setImageToCrop(reader.result);
//     reader.readAsDataURL(file);
//   };

//   // const handleCropSave = () => {
//   //   const cropper = cropperRef.current;
//   //   if (cropper) {
//   //     const canvas = cropper.getCanvas();
//   //     if (canvas) setAvatarPreview(canvas.toDataURL()); // Set final cropped image
//   //   }
//   //   setImageToCrop(null); // close cropper popup
//   // };

//   const handleCropSave = () => {
//     const cropper = cropperRef.current;
//     if (cropper) {
//       const canvas = cropper.getCanvas();
//       if (canvas) {
//         canvas.toBlob((blob) => {
//           if (blob) {
//             const originalName = formik.values.avatar?.name || "avatar.png";
//             const file = new File([blob], originalName, { type: blob.type });

//             setAvatarPreview(URL.createObjectURL(file));
//             formik.setFieldValue("avatar", file);
//           }
//         }, formik.values.avatar?.type || "image/png");

//       }
//     }
//     setImageToCrop(null); // close cropper popup
//   };
//   const handleSignIn = () => {
//     navigate('/login');
//   };

//   return (
//     <div  className="min-h-screen flex items-center justify-center px-4 md:px-0 bg-gradient-to-br  bg-cover bg-center bg-no-repeat " 
//     >
//       <div className="flex flex-col md:flex-row w-11/12 max-w-5xl rounded-2xl overflow-hidden backdrop-blur-lg bg-white/40 shadow-2xl border border-white/30 mx-auto "
      
//      >

//         {/* Sign Up Section */}
//         <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
//           <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
//           <div className="flex justify-center space-x-4 mb-4">
//             <button type="button" className="border rounded-full p-2">
//               <img src="/G icon.png" alt="Google" className="h-6 w-6" />
//             </button>
//             <button type="button" className="border rounded-full p-2">
//               <img src="/fb icon.webp" alt="Facebook" className="h-6 w-6" />
//             </button>
//           </div>
//           <div className="flex items-center mb-4">
//             <span className="flex-grow border-t"></span>
//             <span className="mx-2 text-gray-400 text-sm">or use your email</span>
//             <span className="flex-grow border-t"></span>
//           </div>

//           {/* Avatar Upload */}
//           {/* <div className="flex justify-center mb-4 relative w-fit mx-auto">
//             <label className="relative cursor-pointer">
//               <img
//                 src={avatarPreview || "/Profile Icon.png"}
//                 alt="Avatar"
//                 className="h-14 w-14 rounded-full border-2 border-gray-300 bg-white/60 object-cover"
//               />
//               <input
//                 type="file"
//                 name="avatar"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="absolute inset-0 opacity-0 cursor-pointer"
//               />
//               <span className="absolute bottom-0 right-0 p-1 rounded-full border-2 border-white shadow-lg"
//                 style={{background: "linear-gradient(135deg, #7c3aed, #db2777)"}}>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0-6l-3 3m3-3l3 3m5-8a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7z" />
//                 </svg>
//               </span>
//             </label>
//           </div>
//            */}

//           {/* Upload & Preview */}

//           <div className="flex justify-center mb-4 relative w-fit mx-auto">
//             <label className="relative cursor-pointer">
//               <img
//                 src={avatarPreview || "/Profile Icon.png"}
//                 alt="Avatar"
//                 className="h-32 w-32 border-2 border-gray-300 bg-white/60 object-cover rounded-md overflow-hidden"
//               // ↑ use rounded-md or remove it for sharp corners
//               />

//               <input
//                 type="file"
//                 name="avatar"
//                 accept="image/*"
//                 onChange={handleFileSelect}
//                 className="absolute inset-0 opacity-0 cursor-pointer"
//               />

//               {/* Remove circular bottom icon positioning; place at bottom-right */}
//               <span
//                 className="absolute bottom-1 right-1 p-1 rounded-md border-2 border-white shadow-lg"
//                 style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0-6l-3 3m3-3l3 3m5-8a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7z" />
//                 </svg>
//               </span>
//             </label>
//           </div>
//           {/* Cropper Popup */}
//           {imageToCrop && (
//             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//               <div className="bg-white p-4 rounded-md shadow-xl w-[350px] h-[450px] flex flex-col gap-3">

//                 <div className="flex-1 overflow-hidden rounded-md">
//                   <Cropper
//                     ref={cropperRef}
//                     src={imageToCrop}
//                     className="w-full h-full"
//                     stencilProps={{
//                       movable: true,
//                       resizable: true,
//                       lines: true,
//                       handlers: true,
//                     }}
//                     zoom={false}                   // ✅ Allow actual image sizing
//                     resizeImage={true}             // ✅ Let user resize freely
//                     stencilSize={{
//                       width: '80%',
//                       height: '80%',
//                     }}
//                     imageRestriction="fit-area"
//                   />
//                 </div>

//                 <div className="flex justify-between items-center pt-2">
//                   <button
//                     onClick={() => setImageToCrop(null)}
//                     className="px-3 py-1 bg-gray-300 rounded-md"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleCropSave}
//                     className="px-3 py-1 bg-purple-600 text-white rounded-md"
//                   >
//                     Done
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}



//           {/* Formik Form */}
//           <form onSubmit={formik.handleSubmit}>
//             {/* Full Name Field */}
//             <div className="relative mb-6">
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.username}
//                 placeholder=" "
//               />
//               <label
//                 htmlFor="username"
//                 className={`absolute left-4 text-gray-400 transition-all duration-200 pointer-events-none ${formik.values.username
//                   ? 'top-[-8px] text-xs bg-white px-2 text-purple-600'
//                   : 'top-3 text-base'
//                   }`}
//               >
//                 Full name
//               </label>
//               {formik.touched.username && formik.errors.username && (
//                 <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
//               )}
//             </div>

//             {/* Email Field */}
//             <div className="relative mb-6">
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.email}
//                 placeholder=" "
//               />
//               <label
//                 htmlFor="email"
//                 className={`absolute left-4 text-gray-400 transition-all duration-200 pointer-events-none ${formik.values.email
//                   ? 'top-[-8px] text-xs bg-white px-2 text-purple-600'
//                   : 'top-3 text-base'
//                   }`}
//               >
//                 Email
//               </label>
//               {formik.touched.email && formik.errors.email && (
//                 <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
//               )}
//             </div>

//             {/* Password Field */}
//             <div className="relative mb-6">
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.password}
//                 placeholder=" "
//               />
//               <label
//                 htmlFor="password"
//                 className={`absolute left-4 text-gray-400 transition-all duration-200 pointer-events-none ${formik.values.password
//                   ? 'top-[-8px] text-xs bg-white px-2 text-purple-600'
//                   : 'top-3 text-base'
//                   }`}
//               >
//                 Password
//               </label>
//               {formik.touched.password && formik.errors.password && (
//                 <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
//               )}
//             </div>

//             {/* Confirm Password Field */}
//             <div className="relative mb-6">
//               <input
//                 type="password"
//                 id="confirmpassword"
//                 name="confirmpassword"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.confirmpassword}
//                 placeholder=" "
//               />
//               <label
//                 htmlFor="confirmpassword"
//                 className={`absolute left-4 text-gray-400 transition-all duration-200 pointer-events-none ${formik.values.confirmpassword
//                   ? 'top-[-8px] text-xs bg-white px-2 text-purple-600'
//                   : 'top-3 text-base'
//                   }`}
//               >
//                 Confirm Password
//               </label>
//               {formik.touched.confirmpassword && formik.errors.confirmpassword && (
//                 <div className="text-red-500 text-sm mt-1">{formik.errors.confirmpassword}</div>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="w-full py-3 rounded-lg text-white font-semibold shadow-md bg-gradient-to-br from-[#7725f4] via-[#a249ea] to-[#e260d2] hover:opacity-90 transition-opacity"
//             >
//               SIGN UP
//             </button>
//             {loading && <p className="text-blue-600 mt-2">Creating account...</p>}
//             {error && <p className="text-red-600 mt-2">{error}</p>}
//             {user && <p className="text-green-600 mt-2">Account created successfully!</p>}

//           </form>
//         </div>

//         {/* Sign In Promotion Section */}
//         <div
//           className="w-full md:w-1/2 flex flex-col items-center justify-center text-white p-10 relative"
//           style={{
//             backgroundImage: 'url("color bg.jpg")',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//           }}
//         >
//           <div className="bg-black/40 absolute inset-0 pointer-events-none rounded-lg"></div>
//           <div className="relative z-10 flex flex-col items-center justify-center w-full">
//             <h3 className="text-xl font-semibold mb-3">Welcome Back!</h3>
//             <p className="mb-5 text-center">
//               Already have an account? Sign in to access all features
//             </p>
//             <button
//               type="button"
//               onClick={handleSignIn}
//               className="border border-white rounded-lg px-6 py-2 font-semibold hover:bg-white hover:text-purple-500 transition"
//             >
//               SIGN IN
//             </button>
//           </div>
//         </div>
//       </div>
//       <ToastContainer position="top-center" autoClose={1500} />
//     </div>
//   );
// }

// export default Registrationpage;
>>>>>>> ffa0d8912b424f23b7d69e1f8338d2230aa057e9
