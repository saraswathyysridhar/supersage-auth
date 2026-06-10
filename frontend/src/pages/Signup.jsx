import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/signup",
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
      console.log(error);
      alert("Signup failed");
    }
  };

  return (
    <>
      <div className="container">
        <div className="card">

          <div className="logo">
            <div className="logo-circle">S</div>
            <h2 style={{ color: "#111827" }}>
              SuperSage
            </h2>
          </div>

          <h1 style={{ color: "#111827" }}>
            Create Account
          </h1>

          <p>Sign up to access your dashboard</p>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleSignup}>
            Sign Up
          </button>

          <p className="bottom-link">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>

        </div>
      </div>

      <style>{`
        .container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(
            135deg,
            #eef2ff,
            #f8fafc
          );
        }

        .card {
          width: 400px;
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.12);
        }

        .logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 25px;
        }

        .logo-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .logo h2 {
          margin: 0;
        }

        h1 {
          text-align: center;
          margin-bottom: 10px;
        }

        p {
          color: #6b7280;
          margin-bottom: 20px;
          text-align: center;
        }

        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-sizing: border-box;
        }

        input:focus {
          outline: none;
          border-color: #2563eb;
        }

        button {
          width: 100%;
          padding: 12px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }

        button:hover {
          background: #1d4ed8;
        }

        .bottom-link {
          text-align: center;
          margin-top: 20px;
        }

        .bottom-link a {
          color: #2563eb;
          text-decoration: none;
          font-weight: bold;
        }
      `}</style>
    </>
  );
}

export default Signup;