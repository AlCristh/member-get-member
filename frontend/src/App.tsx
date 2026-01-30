import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import MembersList from "./pages/MembersList";
import Referrals from "./pages/Referrals";
import Ranking from "./pages/Ranking";

export default function App() {
  return (
    <Routes>
      {/* público */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* protegido */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<MembersList />} />
          <Route path="referrals" element={<Referrals />} />
          <Route path="ranking" element={<Ranking />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
