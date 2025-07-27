import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Forgot from "./Pages/ForgotPassword";
import Reset from "./Pages/ResetPassword";
import FoundItems from "./Pages/FoundItems";
import LostItems from "./Pages/LostItems";
import ReportLostItem from "./components/ReportLostItem";
import ReportFoundItem from "./components/ReportFoundItem";
import ViewReports from "./Pages/ViewReports";
import Profile from "./components/Profile";
import AdminDashboard from "./Pages/AdminDashboard";

import { Toaster } from "react-hot-toast";
import RequireAuth from "./Pages/RequireAuth";
import { AuthProvider } from "./Pages/AuthContext";
import "./index.css";
import Notifications from "./Pages/Notification";
import ChatPageWrapper from "./components/ChatPageWrapper";
import ClaimsPage from "./Pages/ClaimsPage";
import Logout from "./Pages/Logout";

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<Forgot />} />
            <Route path="/reset-password" element={<Reset />} />
            {/* Protected Routes - for students and admins */}
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/found-items" element={<FoundItems />} />
            <Route path="/lost-items" element={<LostItems />} />
            <Route path="/report-lost-item" element={<ReportLostItem />} />
            <Route path="/report-found-item" element={<ReportFoundItem />} />
            <Route path="/view-reports" element={<ViewReports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat/:claimId" element={<ChatPageWrapper />} />
            <Route path="/claims/:itemId" element={<ClaimsPage />} />
            <Route
              element={<RequireAuth allowedRoles={["student", "admin"]} />}
            >
              <Route path="/" element={<Homepage />} />
            </Route>

            {/* Admin-only Route */}
            <Route element={<RequireAuth allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
