import React, { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage on first load
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ci_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        setUserId(parsed?._id || null);
      }
    } catch (_) {
      localStorage.removeItem("ci_user");
    } finally {
      setReady(true);
    }
  }, []);

  const login = (userData) => {
    const safe = {
      _id:   userData._id,
      name:  userData.name,
      email: userData.email,
    };
    localStorage.setItem("ci_user", JSON.stringify(safe));
    setUser(safe);
    setUserId(safe._id);
  };

  const logout = () => {
    localStorage.removeItem("ci_user");
    setUser(null);
    setUserId(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, userId, isAuthenticated, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route wrapper
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
