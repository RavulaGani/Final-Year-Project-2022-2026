import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(localStorage.getItem("user"));
  const location = useLocation();

  useEffect(() => {
    setUser(localStorage.getItem("user"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="p-4 h-[80px] flex justify-between items-center bg-blue-50 top-0 sticky z-50">
      <Link to="/" className="text-2xl font-bold font-serif ml-5">
        COLOR INSIGHT
      </Link>

      <div className="flex justify-center items-center gap-10 font-bold text-lg mr-10">
        {user ? (
          <>
            <Link to="/" className="hover:underline underline-offset-2">
              About
            </Link>
            <Link to="/upload" className="hover:underline underline-offset-2">
              Upload
            </Link>
            <Link to="/camera" className="hover:underline underline-offset-2">
              Camera
            </Link>

            <Link to="/cart" className="hover:underline underline-offset-2">
              Cart
            </Link>
            <Link
              to="/favourite"
              className="hover:underline underline-offset-2"
            >
              Favourite
            </Link>
            <button
              onClick={handleLogout}
              className="hover:underline underline-offset-2"
            >
              LogOut
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline underline-offset-2">
              Login
            </Link>
            <Link to="/" className="hover:underline underline-offset-2">
              About
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
