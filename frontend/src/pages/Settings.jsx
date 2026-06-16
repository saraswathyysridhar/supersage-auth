import { useState, useEffect } from "react";
import { Download, LogOut } from "lucide-react";
import api from "../api";

function Settings() {
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(
    localStorage.getItem("company") || ""
  );

  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic") || ""
  );

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [weeklyReports, setWeeklyReports] =
    useState(true);

  useEffect(() => {
    api
      .get("/me")
      .then((res) => {
        if (res.data.name) setName(res.data.name);
        if (res.data.email) setEmail(res.data.email);
      })
      .catch(() => {
        setName(storedUser.name || "");
        setEmail(storedUser.email || "");
      });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const saveChanges = () => {
    localStorage.setItem("company", company);
    localStorage.setItem("darkMode", String(darkMode));
    alert("Settings Saved Successfully");
  };

  const signOutEverywhere = async () => {
    try {
      await api.post("/logout");
    } catch (_) {
    } finally {
      localStorage.clear();
      window.location.href = "/login";
    }
  };



  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePic(reader.result);
      localStorage.setItem("profilePic", reader.result);
    };

    reader.readAsDataURL(file);
  };

  const exportProfile = () => {
    const data = {
      name,
      email,
      company,
      darkMode,
      emailNotifications,
      weeklyReports,
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "profile-data.json";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`p-8 min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-black"
      }`}
    >
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
          Manage your account preferences
        </p>
      </div>

      {/* PROFILE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PROFILE FORM */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-base font-semibold mb-6 text-gray-900 dark:text-white">
            Profile Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Full Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Email
              </label>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Company
              </label>

              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your Company"
                className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <div className="flex flex-col items-center">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold mb-4">
                {name?.charAt(0) || "U"}
              </div>
            )}

            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-gray-500 text-sm">{email}</p>
            <p className="text-sm text-gray-400 mt-2">
              {company || "No Company Added"}
            </p>

            <span className="mt-3 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
              Active Account
            </span>

            {/* Upload + Remove */}
            <div className="mt-4 flex gap-3">
              <label className="bg-blue-600 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-700 text-sm font-medium">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  setProfilePic("");
                  localStorage.removeItem("profilePic");
                }}
                className="bg-red-50 text-red-500 px-4 py-2 rounded-xl hover:bg-red-100 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PREFERENCES */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mt-6">
        <h2 className="text-base font-semibold mb-6 text-gray-900 dark:text-white">
          Preferences
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700">
            <span className="text-sm font-medium">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium text-white ${
                darkMode ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              {darkMode ? "ON" : "OFF"}
            </button>
          </div>

          <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-700 pb-6">
            <div>
              <h3 className="font-medium text-sm">
                Email Notifications
              </h3>
              <p className="text-sm text-gray-400">
                Receive updates by email
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() =>
                setEmailNotifications(!emailNotifications)
              }
              className="w-5 h-5 accent-blue-600"
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-sm">
                Weekly Reports
              </h3>
              <p className="text-sm text-gray-400">
                Receive analytics reports weekly
              </p>
            </div>
            <input
              type="checkbox"
              checked={weeklyReports}
              onChange={() =>
                setWeeklyReports(!weeklyReports)
              }
              className="w-5 h-5 accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* SECURITY */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mt-6">
        <h2 className="text-base font-semibold mb-6 text-gray-900 dark:text-white">
          Security
        </h2>

        {storedUser?.token && (
          <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
            <p className="text-xs text-gray-500 mb-1">Session Token</p>
            <p className="text-sm font-mono break-all text-gray-700 dark:text-gray-300">
              {storedUser.token}
            </p>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={exportProfile}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl hover:bg-blue-100 text-sm font-medium"
          >
            <Download size={16} />
            Export My Data
          </button>

          <button
            onClick={signOutEverywhere}
            className="flex items-center gap-2 bg-red-50 text-red-500 px-5 py-2.5 rounded-xl hover:bg-red-100 text-sm font-medium"
          >
            <LogOut size={16} />
            Sign Out Everywhere
          </button>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="mt-6">
        <button
          onClick={saveChanges}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Settings;