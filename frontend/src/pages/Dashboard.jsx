// function Dashboard() {

//   const user = JSON.parse(
//     localStorage.getItem("user")
//   );

//   if (!user) {
//     window.location.href = "/login";
//     return null;
//   }

//   const logout = () => {
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   };

//   return (
//     <>
//       <div className="container">

//         <div className="card">

//           <div className="logo">
//             <div className="logo-circle">S</div>
//           <h2 style={{ color: "black" }}>SuperSage</h2>
//           </div>
// <h1 style={{ color: "black" }}>
//   Welcome Back, {user?.name} 👋
// </h1>

//           <div className="profile">

//             <h2>Profile Information</h2>

//             <div className="info-row">
//               <span>Name</span>
//               <strong>{user?.name}</strong>
//             </div>

//             <div className="info-row">
//               <span>Email</span>
//               <strong>{user?.email}</strong>
//             </div>

//             <div className="info-row">
//               <span>Status</span>
//               <strong>Active</strong>
//             </div>

//             <div className="info-row">
//               <span>Last Login</span>
//               <strong>Today</strong>
//             </div>

//             <div className="info-row">
//               <span>Date</span>
//               <strong>
//                 {new Date().toLocaleDateString()}
//               </strong>
//             </div>

//           </div>

//           <button onClick={logout}>
//             Logout
//           </button>

//         </div>

//       </div>

//       <style>{`
//         .container {
//           min-height: 100vh;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           background: linear-gradient(
//             135deg,
//             #eef2ff,
//             #f8fafc
//           );
//           padding: 20px;
//         }

//         .card {
//           width: 500px;
//           background: white;
//           padding: 35px;
//           border-radius: 16px;
//           box-shadow: 0 15px 40px rgba(0,0,0,0.12);
//         }

//         .logo {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           margin-bottom: 20px;
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
//           font-size: 28px;
//           font-weight: bold;
//           margin-bottom: 10px;
//         }

//         .logo h2 {
//           margin: 0;
//         }

//         h1 {
//           text-align: center;
//           margin-bottom: 25px;
//           font-size: 28px;
//         }

//         .profile {
//           background: #f8fafc;
//           padding: 20px;
//           border-radius: 12px;
//           margin-bottom: 20px;
//         color: #111827;
//         }

//         .profile h2 {
//           margin-top: 0;
//           margin-bottom: 20px;
//           color: #111827;
//         }

//         .info-row {
//           display: flex;
//           justify-content: space-between;
//           padding: 14px 0;
//           border-bottom: 1px solid #e5e7eb;
//         }

//         .info-row:last-child {
//           border-bottom: none;
//         }

//         .info-row span {
//           color: #6b7280;
//         }

//         .info-row strong {
//           color: #111827;
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
//       `}</style>
//     </>
//   );
// }

// export default Dashboard;
function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (
    !user ||
    !user.name ||
    !user.email
  ) {
    window.location.href = "/login";
    return null;
  }

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      <div className="container">

        <div className="card">

          <div className="logo">
            <div className="logo-circle">S</div>
            <h2 style={{ color: "black" }}>
              SuperSage
            </h2>
          </div>

          <h1 style={{ color: "black" }}>
            Welcome Back, {user.name} 
          </h1>

          <p className="subtitle">
            Manage your account information and profile details.
          </p>

          <div className="profile">

            <h2>Profile Information</h2>

            <div className="info-row">
              <span>Name</span>
              <strong>{user.name}</strong>
            </div>

            <div className="info-row">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            <div className="info-row">
              <span>Status</span>
              <span className="status">Active</span>
            </div>

            <div className="info-row">
              <span>Last Login</span>
              <strong>Today</strong>
            </div>

            <div className="info-row">
              <span>Date</span>
              <strong>
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </strong>
            </div>

          </div>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </div>

      <style>{`
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(
            135deg,
            #eef2ff,
            #f8fafc
          );
          padding: 20px;
        }

        .card {
          width: 500px;
          background: white;
          padding: 35px;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.12);
        }

        .logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
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

        .subtitle {
          text-align: center;
          color: #6b7280;
          margin-top: -10px;
          margin-bottom: 25px;
        }

        .profile {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .profile h2 {
          color: #111827;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row span {
          color: #374151;
          font-weight: 500;
        }

        .status {
          background: #dcfce7;
          color: #166534;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
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
      `}</style>
    </>
  );
}

export default Dashboard;