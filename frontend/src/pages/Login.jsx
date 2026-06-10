// import { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/login",
//         {
//           name: "",
//           email,
//           password,
//         }
//       );

//       localStorage.setItem(
//         "user",
//         JSON.stringify(response.data)
//       );

//       navigate("/dashboard");

//     } catch (error) {
//       console.log(error);
//       alert("Login failed");
//     }
//   };

//   return (
//     <>
//       <div className="container">
//         <div className="card">

//           <div className="logo">
//             <div className="logo-circle">S</div>
//             <h2>SuperSage</h2>
//           </div>

//           <h1 style={{ color: "black" }}>
//             Login
// </h1>

//           <p>Welcome back to SuperSage</p>

//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button onClick={handleLogin}>
//             Login
//           </button>

//           <p className="bottom-link">
//             Don't have an account?
//             <Link to="/signup"> Sign Up</Link>
//           </p>

//         </div>
//       </div>

//       <style>{`
//         .container {
//           height: 100vh;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           background: linear-gradient(
//             135deg,
//             #eef2ff,
//             #f8fafc
//           );
//         }

//         .card {
//           width: 400px;
//           background: white;
//           padding: 30px;
//           border-radius: 16px;
//           box-shadow: 0 15px 40px rgba(0,0,0,0.12);
//         }

//         .logo {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           margin-bottom: 25px;
//         }

//         .logo-circle {
//           width: 60px;
//           height: 60px;
//           border-radius: 50%;
//           background: #2563eb;
//           color: white;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           font-size: 24px;
//           font-weight: bold;
//           margin-bottom: 10px;
//         }

//         .logo h2 {
//           margin: 0;
//           color:black;
//         }

//         h1 {
//           text-align: center;
//           margin-bottom: 20px;
//         }

//         p {
//           text-align: center;
//           color: black;
//           margin-bottom: 20px;
//         }

//         input {
//           width: 100%;
//           padding: 12px;
//           margin-bottom: 15px;
//           border: 1px solid #ddd;
//           border-radius: 8px;
//           box-sizing: border-box;
//         }

//         input:focus {
//           outline: none;
//           border-color: #2563eb;
//         }

//         button {
//           width: 100%;
//           padding: 12px;
//           background: #2563eb;
//           color: white;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           font-size: 16px;
//         }

//         button:hover {
//           background: #1d4ed8;
//         }

//         .bottom-link {
//           text-align: center;
//           margin-top: 20px;
//         }

//         .bottom-link a {
//           color: #2563eb;
//           text-decoration: none;
//           font-weight: bold;
//         }
//       `}</style>
//     </>
//   );
// }

// export default Login;
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          name: "",
          email,
          password,
        }
      );

      if (response.data.message === "Login successful") {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );

        navigate("/dashboard");
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  return (
    <>
      <div className="container">
        <div className="card">

          <div className="logo">
            <div className="logo-circle">S</div>
            <h2 style={{ color: "black" }}>SuperSage</h2>
          </div>

          <h1 style={{ color: "black" }}>
            Login
          </h1>

          <p>Welcome back to SuperSage</p>

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

          <button onClick={handleLogin}>
            Login
          </button>

          <p className="bottom-link">
            Don't have an account?
            <Link to="/signup"> Sign Up</Link>
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
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        p {
          text-align: center;
          color: black;
          margin-bottom: 20px;
        }

        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-sizing: border-box;
        }

        button {
          width: 100%;
          padding: 12px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
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

export default Login;