import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: string }
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("CUSTOMER");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (!email || !email.includes("@")) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/password-reset/request", {
        email,
        userType,
      });

      setMessage({
        type: "success",
        text: "If there is an account associated with this email, you will receive a password reset link shortly.",
      });
    } catch (err) {
      setMessage({
        type: "success",
        text: "If there is an account associated with this email, you will receive a password reset link shortly.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="w-full h-full bg-black/60 flex justify-center items-center">
        <div className="w-full max-w-[450px] bg-white rounded-lg shadow-lg overflow-hidden mx-3">
          {/* Logo / Header */}
          <div className="text-center py-5 bg-[#0f1627] text-white">
            <h1 className="text-2xl font-semibold">CREMIx</h1>
            <p className="text-sm opacity-80">CRM Solution</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-xl font-semibold text-[#0f1627] text-center mb-4">
              Forgot Password
            </h2>
            <p className="text-gray-600 text-sm mb-4 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {/* Message */}
            {message && (
              <div
                className={`mb-4 p-3 rounded text-sm ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Account Type */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Account Type
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    checked={userType === "CUSTOMER"}
                    onChange={() => setUserType("CUSTOMER")}
                    className="text-[#0f1627] focus:ring-[#0f1627]"
                  />
                  <span>Customer</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    checked={userType === "EMPLOYEE"}
                    onChange={() => setUserType("EMPLOYEE")}
                    className="text-[#0f1627] focus:ring-[#0f1627]"
                  />
                  <span>Employee</span>
                </label>
              </div>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-[#0f1627]">
                <span className="px-3 text-gray-500">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-3 py-2 outline-none rounded-r-lg"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f1627] text-white py-2 rounded-lg hover:bg-[#2d3a5d] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>

            {/* Footer */}
            <div className="text-sm text-center mt-5">
              <button
                type="button"
                onClick={onBack}
                className="text-[#0f1627] hover:text-[#2d3a5d] underline flex items-center justify-center gap-1"
              >
                <i className="bi bi-arrow-left"></i> Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
