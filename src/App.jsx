import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CreateUser from "./auth/CreateUser";
import { FooterCentered } from "./components/Footer";
import Login from "./auth/Login";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";  


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

        <Route path="/signup" element={<CreateUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUs />} /> 
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;