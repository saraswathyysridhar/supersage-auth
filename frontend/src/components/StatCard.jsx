import { ArrowUp, ArrowDown } from "lucide-react";

function StatCard({ icon: Icon, label, value, delta, deltaLabel = "vs last month" }) {
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
            <Icon className="w-4.5 h-4.5 text-blue-600" size={18} />
          </div>
        )}
      </div>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h2>

      {delta !== undefined && (
        <div className="flex items-center gap-1 mt-2 text-sm">
          <span
            className={`flex items-center gap-0.5 font-medium ${
              isPositive ? "text-green-600" : "text-red-500"
            }`}
          >
            {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            {isPositive ? "+" : "-"}
            {Math.abs(delta)}%
          </span>
          <span className="text-gray-400">{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;
