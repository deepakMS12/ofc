import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import Loader from "../resuable/Loader";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, token } = useAppSelector((s) => s.auth);
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  const allowed = Boolean(
    token || hasToken || isAuthenticated,
  );

  if (!allowed) {
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
  } else {
    <Loader />;
  }

  return <>{children}</>;
}
