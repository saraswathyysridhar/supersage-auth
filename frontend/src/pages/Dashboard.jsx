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
import {
  Download,
  FileText,
  UserPlus,
  RefreshCw,
  Mail,
  Filter,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import StatCard from "../components/StatCard";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PLANS = ["Pro Tier", "Basic Tier", "Enterprise"];

function Dashboard() {
  const dashboardRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const darkMode = localStorage.getItem("darkMode") === "true";

  const [dashboardData, setDashboardData] = useState(null);
  const [members, setMembers] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [weekView, setWeekView] = useState("This Week");

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
  const totalMembers = members.length;

  const lifecycle = [
    { label: "Leads", value: Math.round(totalMembers * 1.4), color: "bg-blue-300" },
    { label: "Active", value: activeMembers, color: "bg-blue-600" },
    { label: "Expiring", value: Math.round(inactiveMembers * 0.4), color: "bg-orange-500" },
    { label: "Churned", value: inactiveMembers, color: "bg-rose-200" },
  ];
  const lifecycleMax = Math.max(...lifecycle.map((l) => l.value), 1);

  const THIS_WEEK_CHECKINS = [32, 41, 38, 45, 50, 28, 19];
  const LAST_WEEK_CHECKINS = [25, 30, 27, 33, 36, 20, 14];
  const weeklyData = WEEK_DAYS.map((day, i) => ({
    day,
    checkins: weekView === "This Week" ? THIS_WEEK_CHECKINS[i] : LAST_WEEK_CHECKINS[i],
  }));

  const today = new Date();
  const enrichedPayments = pendingPayments.map((payment, i) => {
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + (i - 1) * 3);

    const diffDays = Math.round((dueDate - today) / 86400000);
    let status = "Pending";
    if (diffDays < 0) status = `Overdue (${Math.abs(diffDays)} days)`;
    else if (diffDays === 0) status = "Due Today";

    return {
      ...payment,
      plan: PLANS[i % PLANS.length],
      dueDate: dueDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      derivedStatus: status,
    };
  });

  const statusBadgeClass = (status) => {
    if (status.startsWith("Overdue")) return "bg-red-50 text-red-600";
    if (status === "Due Today") return "bg-gray-900 text-white";
    return "bg-blue-50 text-blue-600";
  };

  return (
    <div
      ref={dashboardRef}
      className={`p-8 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back to SuperSage. Here's what's happening today.
          </p>
        </div>

        <button
          onClick={exportDashboard}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-medium"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={FileText}
          label="Total Revenue"
          value={`$${dashboardData.revenue.toLocaleString()}`}
          delta={12.5}
        />
        <StatCard
          icon={UserPlus}
          label="New Members"
          value={dashboardData.members}
          delta={8.2}
        />
        <StatCard
          icon={RefreshCw}
          label="Net Profit"
          value={`$${Math.round(dashboardData.profit).toLocaleString()}`}
          delta={-2.1}
        />
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* MEMBER LIFECYCLE */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-base font-semibold mb-6 flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            Member Lifecycle
          </h3>
          <div className="space-y-5">
            {lifecycle.map((stage) => (
              <div key={stage.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500">{stage.label}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stage.value}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stage.color}`}
                    style={{
                      width: `${Math.max((stage.value / lifecycleMax) * 100, 4)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WEEKLY CHECK-INS */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <BarChart3 size={16} className="text-gray-400" />
              Weekly Check-ins
            </h3>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-1 text-xs font-medium">
              {["This Week", "Last Week"].map((label) => (
                <button
                  key={label}
                  onClick={() => setWeekView(label)}
                  className={`px-3 py-1 rounded-full transition ${
                    weekView === label
                      ? "bg-blue-600 text-white"
                      : "text-gray-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Bar
                  dataKey="checkins"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PENDING PAYMENTS */}
      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500" />
            Pending Payments
          </h3>
          <a href="/payments" className="text-blue-600 text-sm font-medium hover:underline">
            View All
          </a>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="py-2 text-gray-400 text-xs font-medium uppercase tracking-wide">Member</th>
              <th className="text-gray-400 text-xs font-medium uppercase tracking-wide">Plan</th>
              <th className="text-gray-400 text-xs font-medium uppercase tracking-wide">Amount Due</th>
              <th className="text-gray-400 text-xs font-medium uppercase tracking-wide">Due Date</th>
              <th className="text-gray-400 text-xs font-medium uppercase tracking-wide">Status</th>
              <th className="text-gray-400 text-xs font-medium uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody>
            {enrichedPayments.map((payment) => (
              <tr key={payment._id} className="border-b border-gray-50 dark:border-gray-700">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                      {payment.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{payment.name}</p>
                      <p className="text-xs text-gray-400">
                        {payment.name?.toLowerCase().replace(/\s+/g, ".")}@example.com
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-sm text-gray-500">{payment.plan}</td>
                <td className="text-sm font-medium">${payment.amount.toFixed(2)}</td>
                <td className="text-sm text-gray-500">{payment.dueDate}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
                      payment.derivedStatus
                    )}`}
                  >
                    {payment.derivedStatus}
                  </span>
                </td>
                <td>
                  <button className="text-gray-400 hover:text-blue-600">
                    <Mail size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {enrichedPayments.length === 0 && (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
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
