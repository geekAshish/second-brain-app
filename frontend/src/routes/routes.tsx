import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";

const Signin = lazy(() => import("@/pages/Signin"));
const Signup = lazy(() => import("@/pages/Signup"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/share-brain/:brainId" element={<Signin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
