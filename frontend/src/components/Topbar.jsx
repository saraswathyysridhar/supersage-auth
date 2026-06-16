import { Search, Bell, HelpCircle } from "lucide-react";

function Topbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const profilePic = localStorage.getItem("profilePic") || "";
  const initial = user?.name?.charAt(0) || "U";

  return (
    <div className="h-16 flex items-center justify-between px-8 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      <div className="relative w-80">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:text-white"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <Bell size={20} />
        </button>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <HelpCircle size={20} />
        </button>
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
        )}
      </div>
    </div>
  );
}

export default Topbar;
