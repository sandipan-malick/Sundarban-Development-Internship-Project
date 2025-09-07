// src/pages/OtpVerify.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function OtpVerify() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [resendDisabled, setResendDisabled] = useState(true);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state;

  const formatTime = (secs) => {
    const min = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const sec = (secs % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  // Timer countdown
  useEffect(() => {
    let interval;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, timer]);

  // Handle OTP input
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only digits
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus(); // Auto move to next
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus(); // Move back
    }
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("https://sundarban-development-internship-project.onrender.com/api/user/verify-otp", {
        otp: otp.join(""),
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });

      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      await axios.post("https://sundarban-development-internship-project.onrender.com/api/user/send-otp", {
        email: userData.email,
      });
      alert("OTP resent to your email.");
      setTimer(300);
      setResendDisabled(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 border shadow-xl rounded-2xl bg-white/10 backdrop-blur-lg border-white/20"
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-white">
          OTP Verification
        </h2>
        <p className="mb-4 text-center text-gray-300">
          Enter the 6-digit OTP sent to{" "}
          <span className="font-medium text-blue-400">{userData.email}</span>
        </p>

        {/* OTP Input Boxes */}
        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-xl font-bold text-center text-white border rounded-lg bg-zinc-700 border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {error && <p className="mb-2 text-sm text-center text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="mt-6 text-center text-gray-300">
          Didn’t get the OTP?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendDisabled}
            className={`ml-1 font-medium ${
              resendDisabled
                ? "text-gray-500 cursor-not-allowed"
                : "text-blue-400 hover:underline"
            }`}
          >
            Resend {resendDisabled ? `(${formatTime(timer)})` : ""}
          </button>
        </div>
      </form>
    </div>
  );
}

export default OtpVerify;
