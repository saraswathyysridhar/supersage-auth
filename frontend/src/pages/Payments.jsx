import { useState, useEffect, useRef } from "react";
import api from "../api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Download, DollarSign, CheckCircle2, Clock, Search, FileText } from "lucide-react";
import StatCard from "../components/StatCard";

const COLORS = ["#2563eb", "#f59e0b"];

function Payments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const darkMode =
    localStorage.getItem("darkMode") === "true";

  const paymentsRef = useRef(null);

  useEffect(() => {
    api
      .get("/payments")
      .then((res) => setPayments(res.data))
      .catch(() => alert("Failed to load payments"))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const paidCount = payments.filter(
    (p) => p.status === "Paid"
  ).length;

  const pendingCount = payments.filter(
    (p) => p.status === "Pending"
  ).length;

  const chartData = [
    {
      name: "Paid",
      value: payments
        .filter((p) => p.status === "Paid")
        .reduce((sum, p) => sum + p.amount, 0),
    },
    {
      name: "Pending",
      value: payments
        .filter((p) => p.status === "Pending")
        .reduce((sum, p) => sum + p.amount, 0),
    },
  ];

  const filteredPayments = payments.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const exportPayments = async () => {
    try {
      if (!paymentsRef.current) return;
      const dataUrl = await toPng(paymentsRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "payments-report.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(error);
      alert("Export failed");
    }
  };

  const createInvoice = (payment) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("SuperSage Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Member: ${payment.name}`, 20, 40);
    doc.text(`Amount Due: $${payment.amount}`, 20, 50);
    doc.text(`Status: ${payment.status}`, 20, 60);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      20,
      80
    );
    doc.save(
      `${payment.name
        .replace(/\s+/g, "-")
        .toLowerCase()}-invoice.pdf`
    );
  };

  return (
    <div
      ref={paymentsRef}
      className={`p-8 min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-black"
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
            Payments
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Revenue and payment tracking
          </p>
        </div>

        <button
          onClick={exportPayments}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-medium"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${totalRevenue}`} />
        <StatCard icon={CheckCircle2} label="Paid" value={paidCount} />
        <StatCard icon={Clock} label="Pending" value={pendingCount} />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PAYMENT TABLE */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 dark:text-white rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold">
              Payment History
            </h2>

            <div className="relative w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:text-white"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-500">
              Loading...
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="py-2 text-gray-400 text-xs font-medium uppercase tracking-wide">Member</th>
                  <th className="text-gray-400 text-xs font-medium uppercase tracking-wide">Amount</th>
                  <th className="text-gray-400 text-xs font-medium uppercase tracking-wide">Status</th>
                  <th className="text-gray-400 text-xs font-medium uppercase tracking-wide">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment, index) => (
                  <tr
                    key={payment._id || index}
                    className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-4 text-sm font-medium">{payment.name}</td>
                    <td className="text-sm">${payment.amount}</td>
                    <td>
                      <span
                        className={
                          payment.status === "Paid"
                            ? "bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium"
                            : "bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium"
                        }
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => createInvoice(payment)}
                        className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 text-xs font-medium"
                      >
                        <FileText size={14} />
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-gray-500"
                    >
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* PIE CHART */}
        <div className="bg-white dark:bg-gray-800 dark:text-white rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-base font-semibold mb-4">
            Payment Breakdown
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;
