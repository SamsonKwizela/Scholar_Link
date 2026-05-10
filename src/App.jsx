import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CreateUser from "./auth/CreateUser";
import { FooterCentered } from "./components/Footer";
import Login from "./auth/Login";
import AboutUs from "./pages/AboutUs";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <LandingPage />
              <FooterCentered />
            </>
          }
        />

        <Route path="/signup" element={<CreateUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUs />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;