import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  CreditCard,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
} from "lucide-react";
import api from "../api";
import Topbar from "../components/Topbar";

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

  const links = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { path: "/members", label: "Members", icon: Users },
    { path: "/payments", label: "Payments", icon: CreditCard },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  const navItem = ({ path, label, icon: Icon }) => (
    <Link
      key={path}
      to={path}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
        location.pathname === path
          ? "bg-blue-50 text-blue-600"
          : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col p-5">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            SuperSage
          </span>
        </div>

        <div className="flex-1 space-y-1">{links.map(navItem)}</div>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
