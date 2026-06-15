import { Link, Outlet, useLocation } from "react-router-dom";
import api from "../api";

function Layout() {
  const location = useLocation();

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (_) {
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  const navItem = (path, label) => (
    <Link
      key={path}
      to={path}
      className={`block px-4 py-3 rounded-xl transition ${
        location.pathname === path
          ? "bg-blue-600 text-white"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-6">

        <h1 className="text-2xl font-bold text-blue-600 mb-8">
          SuperSage
        </h1>

        <div className="space-y-2">
          {navItem("/dashboard", "Dashboard")}
          {navItem("/members", "Members")}
          {navItem("/payments", "Payments")}
          {navItem("/analytics", "Analytics")}
          {navItem("/settings", "Settings")}
        </div>

        <button
          onClick={logout}
          className="w-full mt-6 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>

    </div>
  );
}

export default Layout;