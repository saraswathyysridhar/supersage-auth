import { useEffect, useState } from "react";
import api from "../api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Users, DollarSign, Activity, Repeat } from "lucide-react";
import StatCard from "../components/StatCard";

function Analytics() {
  const [dashboard, setDashboard] = useState(null);
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const darkMode = localStorage.getItem("darkMode") === "true";

  useEffect(() => {
    Promise.all([
      api.get("/dashboard"),
      api.get("/members"),
      api.get("/payments"),
    ])
      .then(([dashRes, membersRes, paymentsRes]) => {
        setDashboard(dashRes.data);
        setMembers(membersRes.data);
        setPayments(paymentsRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === "Active").length;
  const inactiveMembers = members.filter((m) => m.status !== "Active").length;
  const totalRevenue = dashboard?.revenue ?? 0;
  const paidCount = payments.filter((p) => p.status === "Paid").length;
  const totalPayments = payments.length;
  const engagementRate =
    totalMembers > 0
      ? ((activeMembers / totalMembers) * 100).toFixed(0)
      : 0;
  const retentionRate =
    totalPayments > 0
      ? ((paidCount / totalPayments) * 100).toFixed(0)
      : 0;

  const memberChartData = [
    { status: "Active", count: activeMembers },
    { status: "Inactive", count: inactiveMembers },
  ];

  const paymentChartData = payments.map((p) => ({
    name: p.name,
    amount: p.amount,
    status: p.status,
  }));

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div
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
            Analytics
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Performance insights and growth trends
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} label="Total Members" value={totalMembers} delta={Number(engagementRate)} deltaLabel="active" />
        <StatCard icon={DollarSign} label="Revenue" value={`$${totalRevenue}`} />
        <StatCard icon={Activity} label="Engagement" value={`${engagementRate}%`} />
        <StatCard icon={Repeat} label="Retention" value={`${retentionRate}%`} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* MEMBER STATUS */}
        <div className="bg-white dark:bg-gray-800 dark:text-white rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-base font-semibold mb-6">Member Status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="status" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PAYMENT AMOUNTS */}
        <div className="bg-white dark:bg-gray-800 dark:text-white rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-base font-semibold mb-6">Payment Amounts</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="bg-white dark:bg-gray-800 dark:text-white rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <h2 className="text-base font-semibold mb-6">Performance Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl border border-gray-100 dark:border-gray-600">
            <h3 className="font-semibold mb-2 text-sm">Member Activity</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {activeMembers} out of {totalMembers} members are currently active.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl border border-gray-100 dark:border-gray-600">
            <h3 className="font-semibold mb-2 text-sm">Payment Status</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {paidCount} of {totalPayments} payments have been completed.{" "}
              {totalPayments - paidCount} pending.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl border border-gray-100 dark:border-gray-600">
            <h3 className="font-semibold mb-2 text-sm">Revenue</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Total revenue collected is ${totalRevenue}. Estimated profit is $
              {dashboard?.profit?.toFixed(0) ?? 0}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
