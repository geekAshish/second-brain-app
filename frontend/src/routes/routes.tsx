import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const Signin = lazy(() => import("@/pages/Signin"));
const Signup = lazy(() => import("@/pages/Signup"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const ShareBrain = lazy(() => import("@/pages/share-brain"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense>
            <Navigate to="/dashboard" replace />
          </Suspense>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Suspense>
            <Dashboard />
          </Suspense>
        }
      />
      <Route
        path="/signup"
        element={
          <Suspense>
            <Signup />
          </Suspense>
        }
      />
      <Route
        path="/signin"
        element={
          <Suspense>
            <Signin />
          </Suspense>
        }
      />
      <Route
        path="/share-brain/:shareId"
        element={
          <Suspense>
            <ShareBrain />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  );
}
