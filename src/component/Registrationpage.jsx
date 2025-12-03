import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Cropper } from 'react-advanced-cropper';
import { useDispatch, useSelector } from "react-redux";
import { resetRegistrationSuccess, registerUser } from './redux/authSlice';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-advanced-cropper/dist/style.css';

const Registrationpage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cropperRef = useRef(null);

  const [imageToCrop, setImageToCrop] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(""); 
  const [book, setBook] = useState(false);

  const { loading, error, registrationSuccess } = useSelector((state) => state.auth);

  const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) setPasswordStrength("");
    else if (strongRegex.test(password)) setPasswordStrength("strong");
    else setPasswordStrength("weak");
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
      if (!values.username.trim()) errors.username = 'Full name is required';
      else if (values.username.trim().length < 2) errors.username = 'Full name must be at least 2 characters';
      if (!values.email) errors.email = 'Email is required';
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) errors.email = 'Invalid email address';
      if (!values.password) errors.password = 'Password is required';
      else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters';
      else if (!/(?=.*[a-z])/.test(values.password)) errors.password = 'Password must contain lowercase';
      else if (!/(?=.*[A-Z])/.test(values.password)) errors.password = 'Password must contain uppercase';
      else if (!/(?=.*\d)/.test(values.password)) errors.password = 'Password must contain number';
      else if (!/(?=.*[@$!%*?&])/.test(values.password)) errors.password = 'Password must contain special character';
      if (!values.confirmpassword) errors.confirmpassword = 'Please confirm your password';
      else if (values.password !== values.confirmpassword) errors.confirmpassword = 'Passwords must match';
      return errors;
    },
    onSubmit: (values) => {
      const data = new FormData();
      data.append("username", values.username);
      data.append("email", values.email);
      data.append("password", values.password);
      data.append("confirmpassword", values.confirmpassword);
      if (values.avatar) data.append("profilePhoto", values.avatar);
      dispatch(registerUser(data));
    },
  });

  const isFormValid = () => {
    return (
      formik.values.username &&
      formik.values.email &&
      formik.values.password &&
      formik.values.confirmpassword &&
      !formik.errors.username &&
      !formik.errors.email &&
      !formik.errors.password &&
      !formik.errors.confirmpassword
    );
  };

  useEffect(() => {
    if (registrationSuccess) {
      toast.success("Registration Successful! Redirecting to login...");
      formik.resetForm();
      setAvatarPreview(null);
      setPasswordStrength("");
      setTimeout(() => {
        navigate('/login');
        dispatch(resetRegistrationSuccess());
      }, 2000);
    }
  }, [registrationSuccess, navigate, dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

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
            setAvatarPreview(URL.createObjectURL(file));
            formik.setFieldValue("avatar", file);
          }
        }, formik.values.avatar?.type || "image/png");
      }
    }
    setImageToCrop(null);
  };

  const handleSignInClick = () => {
    setBook(!book);
    setTimeout(() => navigate("/login"), 200);
  };

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

        <div className="w-full md:w-1/2 p-10 border border-black/10 rounded-2xl shadow-xl ">
          <h2 className="text-2xl font-semibold text-center mb-4 ">Sign Up</h2>

          {/* Avatar Upload */}
          <div className="flex justify-center mb-4 relative w-fit mx-auto">
            <label className="relative cursor-pointer">
              <img src={avatarPreview || "/Profile Icon.png"} alt="Avatar" className="h-32 w-32 border-2 border-black-300 bg-white/10 object-cover rounded-md overflow-hidden"/>
              <input type="file" name="avatar" accept="image/*" onChange={handleFileSelect} className="absolute inset-0 opacity-0 cursor-pointer"/>
            </label>
          </div>

          {imageToCrop && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-md shadow-xl w-[350px] h-[450px] flex flex-col gap-3">
                <Cropper ref={cropperRef} src={imageToCrop} className="w-full h-full"
                  stencilProps={{ movable: true, resizable: true, lines: true, handlers: true }}
                  zoom={false} resizeImage={true} stencilSize={{ width: '80%', height: '80%' }} imageRestriction="fit-area"
                />
                <div className="flex justify-between pt-2">
                  <button onClick={() => setImageToCrop(null)} className="px-3 py-1 bg-gray-300 rounded-md">Cancel</button>
                  <button onClick={handleCropSave} className="px-3 py-1 bg-purple-600 text-white rounded-md">Done</button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={formik.handleSubmit}>
            {/* Username */}
            <div className="relative mb-6">
              <input type="text" id="username" name="username" className={`w-full px-4 py-3 border ${formik.errors.username ? "border-red-500" : "border-black-300"} rounded-lg bg-orange-100/50 focus:outline-none focus:border-amber-950 focus:ring-1 focus:ring-amber-950`} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} placeholder=" "/>
              <label htmlFor="username" className={`absolute left-4 text-black font-bold transition-all duration-200 pointer-events-none ${formik.values.username ? 'top-[-8px] text-xs bg-white px-2 text-amber-950' : 'top-3 text-base'}`}>Full name</label>
              {formik.touched.username && formik.errors.username && <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>}
            </div>

            {/* Email */}
            <div className="relative mb-6">
              <input type="email" id="email" name="email" className={`w-full px-4 py-3 border ${formik.errors.email ? "border-red-500" : "border-black-300"} rounded-lg bg-orange-100/50 focus:outline-none focus:border-amber-950 focus:ring-1 focus:ring-amber-950`} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} placeholder=" "/>
              <label htmlFor="email" className={`absolute left-4 text-black font-bold transition-all duration-200 pointer-events-none ${formik.values.email ? 'top-[-8px] text-xs bg-white px-2 text-amber-950' : 'top-3 text-base'}`}>Email</label>
              {formik.touched.email && formik.errors.email && <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>}
            </div>

            {/* Password */}
            <div className="relative mb-6">
              <input type="password" id="password" name="password" className={`w-full px-4 py-3 border ${formik.errors.password ? "border-red-500" : passwordStrength === "strong" ? "border-green-500" : "border-gray-800"} rounded-lg bg-orange-100/50 focus:outline-none focus:border-amber-950 focus:ring-1 focus:ring-amber-950`} onChange={(e)=>{formik.handleChange(e); checkPasswordStrength(e.target.value)}} onBlur={formik.handleBlur} value={formik.values.password} placeholder=" "/>
              <label htmlFor="password" className={`absolute left-4 text-black font-bold transition-all duration-200 pointer-events-none ${formik.values.password ? 'top-[-8px] text-xs bg-white px-2 text-amber-950' : 'top-3 text-base'}`}>Password</label>
              {passwordStrength && <p className={`text-sm mt-1 ${passwordStrength === "strong" ? "text-green-600" : "text-red-500"}`}>{passwordStrength === "strong" ? "Strong password 💪" : "Weak password ⚠️"}</p>}
              {formik.touched.password && formik.errors.password && <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div className="relative mb-6">
              <input type="password" id="confirmpassword" name="confirmpassword" className="w-full px-4 py-3 border border-gray-800 rounded-lg bg-orange-100/50 focus:outline-none focus:border-amber-950 focus:ring-1 focus:ring-amber-950" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmpassword} placeholder=" "/>
              <label htmlFor="confirmpassword" className={`absolute left-4 text-black font-bold transition-all duration-200 pointer-events-none ${formik.values.confirmpassword ? 'top-[-8px] text-xs bg-white px-2 text-amber-950' : 'top-3 text-base'}`}>Confirm Password</label>
              {formik.touched.confirmpassword && formik.errors.confirmpassword && <div className="text-red-500 text-sm mt-1">{formik.errors.confirmpassword}</div>}
            </div>

            <button type="submit" disabled={!isFormValid() || loading} className={`w-full py-3 rounded-lg text-white font-semibold shadow-md ${!isFormValid() || loading ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-orange-100/50 hover:opacity-90'}`}>{loading ? "Creating Account..." : "SIGN UP"}</button>
          </form>
        </div>

        {/* Right Card */}
        <div className={`w-full md:w-1/2 relative flex items-center justify-center text-white p-10 border border-black/10 rounded-2xl shadow-2xl ${book?"rotate-y-180 transition-all duration-300 origin-right bg-black text-transparent":""}`}>
          <div className="absolute inset-0 bg-black/10 z-0 rounded-lg"></div>
          <div className="relative z-10 text-center max-w-md">
            <h3 className="text-xl font-semibold mb-3">Welcome Back!</h3>
            <p className="mb-5">Already have an account? Sign in to access all features</p>
            <button type="button" onClick={handleSignInClick} className="border border-white rounded-lg px-6 py-2 font-semibold hover:bg-white hover:text-amber-950 transition">SIGN IN</button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
};

export default Registrationpage;
