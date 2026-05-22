import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import CreateUser from "./auth/CreateUser";
import { FooterCentered } from "./components/Footer";
import Login from "./auth/Login";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import ScholarshipDetails from "./pages/ScholarshipDetails";
import ApplicationSuccess from "./pages/ApplicationSuccess";
import ScholarshipAssessment from "./pages/ScholarshipAssessment";
import Home from "./pages/Home";
import Scholarships from "./pages/Scholarships";
import FiledApplications from "./pages/FiledApplications";
import Assessments from "./pages/Assessment";
import Notifications from "./pages/Notifications";  
import Settings from "./pages/Settiings"; 

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public page */}
        <Route
          path="/"
          element={
            <>
              <LandingPage />
              <FooterCentered />
            </>
          }
        />

        <Route
          path="/signup"
          element={<CreateUser />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/about"
          element={<AboutUs />}
        />

        <Route
          path="/contact"
          element={<ContactUs />}
        />

        <Route
          path="/scholarship/details"
          element={<ScholarshipDetails />}
        />

        <Route
          path="/apply/:id"
          element={<ScholarshipAssessment />}
        />

        <Route
          path="/application-success"
          element={<ApplicationSuccess />}
        />

        <Route
          path="/user-dashboard"
          element={<Home/>}
        />

        <Route
          path="/scholarships"
          element={<Scholarships />}
        />

        <Route
          path="/filed-applications"
          element={<FiledApplications />}
        />

        <Route
          path="/assessments"
          element={<Assessments />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />  

      </Routes>

    </BrowserRouter>
  );
}

export default App;