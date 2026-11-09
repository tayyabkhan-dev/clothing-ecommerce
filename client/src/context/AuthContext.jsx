import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext();

function getSavedToken() {
  try {
    return localStorage.getItem("authToken");
  } catch (error) {
    console.error(
      "Failed to read authentication token:",
      error
    );

    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] =
    useState(getSavedToken);

  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  // Restore logged-in user after page refresh
  useEffect(() => {
    const restoreUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data =
          await getCurrentUser(token);

        setUser(data.user);
      } catch (error) {
        console.error(
          "Failed to restore user:",
          error.message
        );

        localStorage.removeItem(
          "authToken"
        );

        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreUser();
  }, [token]);

  // Login
  const login = async (
    email,
    password
  ) => {
    const data = await loginUser(
      email,
      password
    );

    localStorage.setItem(
      "authToken",
      data.token
    );

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  // Register
  const register = async (
    name,
    email,
    password
  ) => {
    const data = await registerUser(
      name,
      email,
      password
    );

    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(
      "authToken"
    );

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}