import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { SideBarMinimal } from "./pages/SideBar";

function DashboardLayout() {
  return (
    <div style={{ display: "flex" }}>
      <SideBarMinimal />
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Dashboard</h2>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard with sidebar layout */}
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;