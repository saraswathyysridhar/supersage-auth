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

const COLORS = ["#22c55e", "#f59e0b"];

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
          : "bg-gray-100 text-black"
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
            Payments
          </h1>
          <p className="text-gray-500 mt-1">
            Revenue and payment tracking
          </p>
        </div>

        <button
          onClick={exportPayments}
          className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700"
        >
          Export Report
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold mt-2">
            ${totalRevenue}
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm">
          <p className="text-gray-500">Paid</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {paidCount}
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm">
          <p className="text-gray-500">Pending</p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-2">
            {pendingCount}
          </h2>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PAYMENT TABLE */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 dark:text-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Payment History
            </h2>

            <input
              type="text"
              placeholder="Search payments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 w-72 text-white"
            />
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-500">
              Loading...
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3">Member</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment, index) => (
                  <tr
                    key={payment._id || index}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-4">{payment.name}</td>
                    <td>${payment.amount}</td>
                    <td>
                      <span
                        className={
                          payment.status === "Paid"
                            ? "bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm"
                            : "bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm"
                        }
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => createInvoice(payment)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
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
        <div className="bg-white dark:bg-gray-800 dark:text-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">
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
