import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="page-bg min-h-screen flex items-center justify-center px-4 text-center">
    <div className="animate-scale-in">
      <p className="font-mono text-8xl font-bold gradient-text mb-4">404</p>
      <h1 className="font-display text-3xl font-bold mb-3">Page Not Found</h1>
      <p className="text-[var(--text-secondary)] mb-8 max-w-sm mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary px-8 py-3">Go Home</Link>
    </div>
  </div>
);

export default NotFound;
