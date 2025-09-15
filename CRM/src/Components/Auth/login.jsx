import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import AuthService from "../../services/AuthService";
import axios from "axios";

const validatePassword = (password) => {
  if (password.length < 8) return { isValid: false, message: "Password must be at least 8 characters long" };
  if (!/[A-Z]/.test(password)) return { isValid: false, message: "Password must contain at least one uppercase letter" };
  if (!/[a-z]/.test(password)) return { isValid: false, message: "Password must contain at least one lowercase letter" };
  if (!/\d/.test(password)) return { isValid: false, message: "Password must contain at least one number" };
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return { isValid: false, message: "Password must contain at least one special character" };
  return { isValid: true, message: "" };
};

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    setPasswordError(null);
    setPasswordTouched(false);
    setEmail("");
    setPassword("");
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (passwordTouched) {
      const validation = validatePassword(newPassword);
      setPasswordError(validation.isValid ? null : validation.message);
    }
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    const validation = validatePassword(password);
    setPasswordError(validation.isValid ? null : validation.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === "employee") {
        const response = await AuthService.loginEmployee({ email, password });
        if (response.isAuthenticated) {
          setLoading(false);
          navigate("/"); // Redirect employees to MainLayout system
        } else {
          setError("Invalid credentials. Please try again.");
          setLoading(false);
        }
      } else if (activeTab === "admin") {
        // Use the backend API for admin login
        const response = await AuthService.loginAdmin({ email, password });
        if (response.isAuthenticated) {
          setLoading(false);
          navigate("/admin/dashboard");
        } else {
          setError("Invalid admin credentials. Please try again.");
          setLoading(false);
        }
      } else {
        const response = await AuthService.loginCustomer({ email, password });
        if (response.isAuthenticated) {
          setTimeout(() => {
            navigate("/customer-portal");
            setLoading(false);
          }, 1000);
        } else {
          setError("Invalid credentials. Please try again.");
          setLoading(false);
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) setError("Customer account not found. Please check your email.");
        else if (err.response?.status === 401) setError("Invalid password. Please try again.");
        else if (err.response?.status === 403) setError("This customer does not have a password set. Please register first.");
        else setError("Login failed. Please try again later.");
      } else {
        setError("Login failed. Please try again later.");
      }
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div
      className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 relative"
    >
      <div className="w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Logo */}
          <div className="text-center py-6 bg-[#0f1627] text-white">
            <h1 className="text-2xl font-semibold">CREMIx</h1>
            <p className="text-sm opacity-80">CRM Solution</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-100">
            {["customer", "employee", "admin"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  activeTab === tab
                    ? "text-[#0f1627] border-b-2 border-[#0f1627]"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#0f1627] text-center mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Login
            </h2>

            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="flex items-center border rounded px-3">
                  <i className="bi bi-envelope text-gray-500 mr-2"></i>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full py-2 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="flex items-center border rounded px-3">
                  <i className="bi bi-lock text-gray-500 mr-2"></i>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    required
                    className="w-full py-2 outline-none text-sm"
                  />
                </div>
                {passwordError && <p className="text-red-600 text-xs mt-1">{passwordError}</p>}
                <p className="text-gray-500 text-xs mt-1">
                  Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#0f1627] text-white py-2 rounded hover:bg-[#1a2240] transition mb-3 flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
                    Processing...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              {/* Links */}
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  className="text-[#0f1627] hover:underline"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </button>
                {activeTab === "customer" && (
                  <button
                    type="button"
                    className="text-[#0f1627] hover:underline"
                    onClick={() => navigate("/register")}
                  >
                    Register Now
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
