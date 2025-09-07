import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithGooglePopup } from "../firebase";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5080/api/user/check-email", {
        email: form.email,
      });

      if (res.status === 200) {
        navigate("/register", {
          state: form,
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGooglePopup();
      const googleUser = result.user;

      const res = await axios.post("http://localhost:5080/api/user/google-register", {
        email: googleUser.email,
        username: googleUser.displayName,
      });

      if (res.status === 201) {
        alert("Google registration successful!");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Google registration failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 👇 Top Banner (Always visible at the top) */}
      <div className="w-full py-6 text-center text-white bg-gradient-to-r bg-forest-green">
        <h1 className="mb-2 text-3xl font-bold">🌿 Welcome to Sundarban Tours</h1>
        <p className="text-lg">
          Explore the mangroves, wildlife, and the beauty of Sundarban.  
          Register now to begin your journey.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left side (Background only for larger screens) */}
        <div
          className="relative items-center justify-center hidden w-1/2 bg-center bg-cover md:flex"
          style={{
            backgroundImage:
              "url('https://sundarbantours.in/assets/sundarban-images/sundarban-faunadbe092ed755f8a1518eee0388972b427202006040240.webp')",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Right side (Register Form) */}
        <div className="flex items-center justify-center w-full bg-gray-100 md:w-1/2">
          <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-md backdrop-blur-md">
            <h2 className="mb-6 text-2xl font-semibold text-center text-black">
              Register
            </h2>

            {error && (
              <div className="mb-4 text-sm text-center text-red-400">{error}</div>
            )}

            {/* Normal Registration */}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full py-2 text-black bg-transparent border-b border-gray-400 outline-none placeholder-violet-500 focus:border-blue-400"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full py-2 text-black bg-transparent border-b border-gray-400 outline-none placeholder-violet-500 focus:border-blue-400"
              />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full py-2 text-black bg-transparent border-b border-gray-400 outline-none placeholder-violet-500 focus:border-blue-400"
              />

              <button
                type="submit"
                className="w-full py-2 font-medium text-gray-900 bg-white border border-gray-400 rounded-md hover:bg-gray-100"
              >
                Send OTP
              </button>
            </form>

            <div className="my-6 text-sm text-center text-black">OR</div>

            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full gap-2 py-2 font-medium text-gray-900 bg-white border border-gray-400 rounded-md hover:bg-gray-100"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <p className="mt-6 text-sm text-center text-black">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Login
              </Link>
              <br />
              <Link
                to="/login/forgetPassword"
                className="text-blue-400 hover:underline"
              >
                Forget Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
