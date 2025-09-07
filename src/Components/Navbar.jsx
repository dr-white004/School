import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const nav = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // re-check on mount and whenever location changes
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
  }, [window.location.pathname]);

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    nav('/login');
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-700">EduPlatform</Link>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link to="/courses" className="text-gray-700 hover:text-blue-600">Courses</Link>
             <Link to="/">Home</Link>
              <Link to="/contact">Contact Us</Link>
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
