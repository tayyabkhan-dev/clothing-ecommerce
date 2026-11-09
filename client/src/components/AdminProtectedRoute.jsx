import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext.jsx";

function AdminProtectedRoute({
  children,
}) {
  const location = useLocation();

  const {
    user,
    isAuthenticated,
    isLoading,
  } = useAuth();

  // Wait until authentication is restored
  if (isLoading) {
    return (
      <main>
        <section>
          <p>
            Checking admin access...
          </p>
        </section>
      </main>
    );
  }

  // Redirect users who are not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // Only admin users can access admin pages
  if (user?.role !== "admin") {
    return (
      <Navigate
        to="/account"
        replace
      />
    );
  }

  return children;
}

export default AdminProtectedRoute;