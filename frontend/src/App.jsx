import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Payments from "./pages/Payments";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Layout from "./pages/Layout";
import { useEffect, useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(
  localStorage.getItem("darkMode") === "true"
);

useEffect(() => {
  localStorage.setItem("darkMode", darkMode);
}, [darkMode]);

  return (
    <div className={darkMode ? "dark" : ""}>
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/analytics" element={<Analytics />} />
     <Route
  path="/settings"
  element={
    <Settings
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    />
  }
/>
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
    
  );
}

export default App;