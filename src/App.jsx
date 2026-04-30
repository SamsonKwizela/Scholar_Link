import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { SideBarMinimal } from "./components/SideBar";
import CreateUser from "./auth/CreateUser"
import { FooterCentered } from "./components/Footer";
import Login from "./auth/Login";
import ContactUs from "./pages/ContactUs";  


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
        <Route path="/" element={
  <>
    <LandingPage />
    <FooterCentered />
    <ContactUs />
  </>
} />

        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/signup" element={<CreateUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;