import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  FaUser,
  FaUserCircle,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import backgroundImage from "../assets/image.jpg";
import { useAuthStore } from "../store/authStore";
const SignUp = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    ism: "",
    familiya: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        <img
          src={backgroundImage}
          alt="background"
          className="w-full h-full object-cover brightness-95"
          style={{
            filter: "blur(0.2px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-4 sm:space-y-6 bg-white/50 backdrop-blur-[0.5px] p-3 sm:p-5 md:p-6 rounded-2xl shadow-2xl border border-white/30"
        >
          <div>
            <h2 className="mt-2 sm:mt-4 text-center text-2xl sm:text-3xl font-extrabold text-gray-800">
              Ro'yxatdan o'tish
            </h2>
          </div>
          <form
            className="mt-4 sm:mt-6 space-y-3 sm:space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="rounded-md shadow-sm space-y-2 sm:space-y-3">
              <div className="relative">
                <label htmlFor="ism" className="sr-only">
                  Ism
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                </div>
                <input
                  id="ism"
                  name="ism"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-8 sm:pl-10 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300/50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:z-10 bg-white/40 backdrop-blur-[0.5px] transition-all duration-200"
                  placeholder="Ism"
                  value={formData.ism}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <label htmlFor="familiya" className="sr-only">
                  Familiya
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                </div>
                <input
                  id="familiya"
                  name="familiya"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-8 sm:pl-10 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300/50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:z-10 bg-white/40 backdrop-blur-[0.5px] transition-all duration-200"
                  placeholder="Familiya"
                  value={formData.familiya}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-8 sm:pl-10 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300/50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:z-10 bg-white/40 backdrop-blur-[0.5px] transition-all duration-200"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Parol
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="appearance-none rounded-xl relative block w-full pl-8 sm:pl-10 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300/50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:z-10 bg-white/40 backdrop-blur-[0.5px] transition-all duration-200"
                  placeholder="Parol"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">
                  Parolni tasdiqlang
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="appearance-none rounded-xl relative block w-full pl-8 sm:pl-10 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300/50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:z-10 bg-white/40 backdrop-blur-[0.5px] transition-all duration-200"
                  placeholder="Parolni tasdiqlang"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-1.5 sm:py-2 px-4 border border-transparent text-sm sm:text-base font-medium rounded-xl text-white ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600/90 hover:bg-indigo-700/90"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Ro'yxatdan o'tish"
                )}
              </Motion.button>
            </div>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sizda allaqachon account bormi?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 inline-flex items-center gap-1"
              >
                Tizimga kirish
                <FaArrowRight className="h-3 w-3" />
              </Link>
            </p>
          </form>
        </Motion.div>
      </div>
    </div>
  );
};

export default SignUp;
