import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { useAuth } from "./context/AuthContext";

import Header    from "./Components/Header";
import Footer    from "./Components/Footer";
import ColorInsightChatbot from "./Components/ColorInsightChatbot";

import Home1     from "./Pages/Home1";
import Home      from "./Pages/Home";
import Login     from "./Pages/Login";
import SignUp    from "./Pages/SignUp";
import Upload    from "./Pages/Upload";
import Camera    from "./Pages/Camera";
import Profile   from "./Pages/Profile";
import Favourite from "./Pages/Favourite";
import Cart      from "./Pages/Cart";
import Form      from "./Pages/Form";
import NotFound  from "./Pages/NotFound";

// Root redirect based on auth
const RootRedirect = () => {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null;
  return isAuthenticated ? <Home /> : <Home1 />;
};

// Layout wrapper
const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
    {/* Iris chatbot — available on every page */}
    <ColorInsightChatbot />
  </div>
);

const AppRoutes = () => (
  <Layout>
    <Routes>
      {/* Public */}
      <Route path="/"       element={<RootRedirect />} />
      <Route path="/home1"  element={<Home1 />} />
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/form"   element={<Form />} />

      {/* Protected */}
      <Route path="/upload"    element={<ProtectedRoute><Upload /></ProtectedRoute>} />
      <Route path="/camera"    element={<ProtectedRoute><Camera /></ProtectedRoute>} />
      <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/favourite" element={<ProtectedRoute><Favourite /></ProtectedRoute>} />
      <Route path="/cart"      element={<ProtectedRoute><Cart /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Layout>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
