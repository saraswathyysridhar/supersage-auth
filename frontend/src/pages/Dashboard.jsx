import { useEffect, useState, useRef } from "react";
import api from "../api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { toPng } from "html-to-image";

function Dashboard() {
  const dashboardRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const darkMode = localStorage.getItem("darkMode") === "true";

  const [dashboardData, setDashboardData] = useState(null);
  const [members, setMembers] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);

  const exportDashboard = async () => {
    try {
      if (!dashboardRef.current) return;
      const dataUrl = await toPng(dashboardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "dashboard.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(error);
      alert("Export failed");
    }
  };

  useEffect(() => {
    Promise.all([
      api.get("/dashboard"),
      api.get("/members"),
      api.get("/payments"),
    ])
      .then(([dashRes, membersRes, paymentsRes]) => {
        setDashboardData(dashRes.data);
        setMembers(membersRes.data);
        setPendingPayments(
          paymentsRes.data.filter((p) => p.status === "Pending")
        );
      })
      .catch((err) => console.error(err));
  }, []);

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  if (!dashboardData) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const activeMembers = members.filter((m) => m.status === "Active").length;
  const inactiveMembers = members.filter((m) => m.status !== "Active").length;

  const memberChartData = [
    { status: "Active", count: activeMembers },
    { status: "Inactive", count: inactiveMembers },
  ];

  return (
    <div
      ref={dashboardRef}
      className={`p-8 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Dashboard Overview
          </h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>

        <button
          onClick={exportDashboard}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Export Report
        </button>
      </div>

      {/* SESSION TOKEN */}
      {user?.token && (
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Session Token</p>
          <p className="text-sm font-mono break-all text-gray-700 dark:text-gray-300">
            {user.token}
          </p>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-3xl font-bold">${dashboardData.revenue}</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm">
          <p className="text-gray-500">Members</p>
          <h2 className="text-3xl font-bold">{dashboardData.members}</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm">
          <p className="text-gray-500">Profit</p>
          <h2 className="text-3xl font-bold">${dashboardData.profit}</h2>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Member Overview</h3>
          <p className="text-gray-500">Active Members</p>
          <p className="text-2xl font-bold">{activeMembers}</p>
          <p className="text-gray-400 mt-2">{inactiveMembers} inactive</p>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold">Member Status</h3>
            <span className="text-gray-500 text-sm">
              {members.length} total
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PENDING PAYMENTS */}
      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">Pending Payments</h3>
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
            {pendingPayments.length}
          </span>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-gray-500 font-medium">Member</th>
              <th className="text-gray-500 font-medium">Amount</th>
              <th className="text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayments.map((payment) => (
              <tr key={payment._id} className="border-b">
                <td className="py-3">{payment.name}</td>
                <td>${payment.amount}</td>
                <td>
                  <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm">
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
            {pendingPayments.length === 0 && (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-500">
                  No pending payments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
