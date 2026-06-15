import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (name.trim().length < 2) {
      alert("Name must be at least 2 characters");
      return;
    }

    if (name.trim().length > 50) {
      alert("Name cannot exceed 50 characters");
      return;
    }

    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email");
      return;
    }

    if (email.length > 100) {
      alert("Email cannot exceed 100 characters");
      return;
    }

    if (!password.trim()) {
      alert("Password is required");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (password.length > 50) {
      alert("Password cannot exceed 50 characters");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/signup",
        {
          name,
          email,
          password,
        }
      );

      alert(response.data.message);

      setName("");
      setEmail("");
      setPassword("");

      navigate("/login");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message || "Signup failed");
      } else {
        alert("Cannot connect to server");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8">
        <h1 className="text-3xl font-bold text-blue-600">
          SuperSage
        </h1>

        <Link
          to="/login"
          className="text-sm font-semibold text-gray-500"
        >
          Login
        </Link>
      </header>

      <div className="grid md:grid-cols-2 min-h-[calc(100vh-64px)]">
        <div className="bg-[#f7f9fc] flex items-center px-12">
          <div className="max-w-md">
            <div className="w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-8 shadow-lg">
              S
            </div>

            <h2 className="text-6xl font-bold text-gray-900 leading-tight mb-8">
              Join the future
              <br />
              of intelligence
            </h2>

            <p className="text-gray-500 text-xl leading-9 mb-10">
              Experience the next generation of AI-driven
              insights. Streamline your workflow and unlock
              potential with SuperSage.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border bg-blue-100"></div>
                <div className="w-10 h-10 rounded-full border bg-gray-100"></div>
                <div className="w-10 h-10 rounded-full border bg-orange-100"></div>
              </div>

              <span className="text-sm text-gray-500">
                Trusted by 10k+ professionals
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#fafbfc] flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-2">
              Create Account
            </h2>

            <p className="text-center text-gray-500 mb-8">
              Sign up to access your dashboard
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSignup}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
              >
                Sign Up
              </button>
            </div>

            <hr className="my-8" />

            <p className="text-center text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;