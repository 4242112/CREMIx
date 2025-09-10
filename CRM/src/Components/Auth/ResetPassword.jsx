import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const validatePassword = (password) => {
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!/\d/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number" };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one special character" };
  }
  return { isValid: true, message: "" };
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(null);
  const [isValidToken, setIsValidToken] = useState(null);
  const [isTokenChecking, setIsTokenChecking] = useState(true);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: string }
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (!tokenFromUrl) {
      setIsValidToken(false);
      setIsTokenChecking(false);
      return;
    }

    setToken(tokenFromUrl);

    const validateToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/password-reset/validate?token=${tokenFromUrl}`
        );
        setIsValidToken(response.data);
      } catch (error) {
        setIsValidToken(false);
      } finally {
        setIsTokenChecking(false);
      }
    };

    validateToken();
  }, [location]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const validation = validatePassword(newPassword);
    setPasswordError(validation.isValid ? null : validation.message);

    if (confirmPassword) {
      setConfirmPasswordError(
        newPassword === confirmPassword ? null : "Passwords do not match"
      );
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    setConfirmPasswordError(
      password === newConfirmPassword ? null : "Passwords do not match"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.message);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    if (!token) {
      setMessage({
        type: "error",
        text: "Invalid token. Please request a new password reset link.",
      });
      return;
    }

    setLoading(true);

    try {
      setMessage({
        type: "success",
        text: "Your password has been reset successfully! Redirecting to login...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to reset password. The link may have expired. Please request a new reset link.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  // Loading state
  if (isTokenChecking) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="w-full h-full bg-black/60 flex justify-center items-center">
          <div className="w-full max-w-[450px] bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-2xl font-semibold text-[#0f1627] mb-2">CREMIX</h1>
            <p className="text-gray-500 mb-6">CRM Solution</p>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-[#0f1627] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Verifying your reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="w-full h-full bg-black/60 flex justify-center items-center">
          <div className="w-full max-w-[450px] bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-2xl font-semibold text-[#0f1627] mb-2">CREMix</h1>
            <p className="text-gray-500 mb-6">CRM Solution</p>
            <div className="text-center py-4">
              <i className="text-red-600 text-5xl">⚠️</i>
              <h2 className="mt-3 text-xl font-semibold text-[#0f1627]">Invalid or Expired Link</h2>
              <p className="text-gray-600 mt-2 mb-4">
                The password reset link is invalid or has expired. Please request a new reset link.
              </p>
              <button
                onClick={handleGoToLogin}
                className="bg-[#0f1627] text-white px-5 py-2 rounded-lg hover:bg-[#2d3a5d] transition"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="w-full h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80')" }}>
      <div className="w-full h-full bg-black/60 flex justify-center items-center">
        <div className="w-full max-w-[450px] bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Logo */}
          <div className="text-center py-5 bg-[#0f1627] text-white">
            <h1 className="text-2xl font-semibold">CREMIx</h1>
            <p className="text-sm opacity-80">CRM Solution</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-xl font-semibold text-[#0f1627] text-center mb-4">
              Reset Password
            </h2>
            <p className="text-gray-600 text-sm mb-4 text-center">
              Please enter your new password below.
            </p>

            {/* Alert */}
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

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0f1627] outline-none ${
                  passwordError ? "border-red-500" : "border-gray-300"
                }`}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
              <small className="text-gray-500 text-xs">
                Must be 8+ chars, include uppercase, lowercase, number & special character.
              </small>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm your password"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0f1627] outline-none ${
                  confirmPasswordError ? "border-red-500" : "border-gray-300"
                }`}
              />
              {confirmPasswordError && (
                <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f1627] text-white py-2 rounded-lg hover:bg-[#2d3a5d] transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              )}
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
