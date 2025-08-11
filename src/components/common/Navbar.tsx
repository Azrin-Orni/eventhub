import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";

const Navbar: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-slate-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl ">
          EventHub
        </Link>
        <div className="space-x-4">
          <Link to="/events" className="hover:underline">
            Events
          </Link>
          {user ? (
            <>
              {role === "attendee" && (
                <Link to="/my-bookings" className="hover:underline">
                  My Bookings
                </Link>
              )}
              {role === "organizer" && (
                <Link to="/organizer" className="hover:underline">
                  Organizer
                </Link>
              )}
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
