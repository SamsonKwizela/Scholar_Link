import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Register from "./auth/Register";
import { FooterCentered } from "./components/Footer";
import Login from "./auth/Login";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import ScholarshipDetails from "./pages/ScholarshipDetails";
import ApplicationSuccess from "./pages/ApplicationSuccess";
import ScholarshipAssessment from "./pages/ScholarshipAssessment";
import Home from "./pages/Home";
import DashboardContent from "./pages/DashboardContent";
import Scholarships from "./pages/Scholarships";
import FiledApplications from "./pages/FiledApplications";
import Assessments from "./pages/Assessment";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settiings";
import UserProfile from "./pages/UserProfile";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — accessible to everyone */}
        <Route
          path="/"
          element={
            <>
              <LandingPage />
              <FooterCentered />
            </>
          }
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/scholarship/details" element={<ScholarshipDetails />} />

        {/* Guest-only routes — redirect to dashboard if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Private routes — all rendered inside the Home layout (AppShell with sidebar) */}
        <Route element={<PrivateRoute />}>
          <Route element={<Home />}>
            <Route path="/user-dashboard" element={<DashboardContent />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/apply/:id" element={<ScholarshipAssessment />} />
            <Route
              path="/application-success"
              element={<ApplicationSuccess />}
            />
            <Route path="/filed-applications" element={<FiledApplications />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
