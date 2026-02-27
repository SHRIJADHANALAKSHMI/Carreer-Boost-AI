import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  requireResumeUpload?: boolean;
  resumeUploadPath?: string;
  loginPath?: string;
  redirectIfResumeUploadedTo?: string;
}

const ProtectedRoute = ({
  requireResumeUpload = true,
  resumeUploadPath = "/resume-upload",
  loginPath = "/login",
  redirectIfResumeUploadedTo,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, resumeUploaded, isLoading, isProfileLoading } = useAuth();

  if (isLoading || isProfileLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (requireResumeUpload && !resumeUploaded && location.pathname !== resumeUploadPath) {
    return <Navigate to={resumeUploadPath} replace />;
  }

  if (!requireResumeUpload && resumeUploaded && redirectIfResumeUploadedTo) {
    return <Navigate to={redirectIfResumeUploadedTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
