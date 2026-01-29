import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import MembersList from "./pages/MembersList";
import Ranking from "./pages/Ranking";
import Referrals from "./pages/Referrals";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/members" replace />} />
        <Route path="/members" element={<MembersList />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/referrals" element={<Referrals />} />
      </Routes>
    </AppLayout>
  );
}
