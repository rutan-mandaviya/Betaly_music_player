import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Settings,
  LogOut,
  X,
  User as UserIcon,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import Login from "../pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { asyncLogoutuser } from "../store/actions/UserAction";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [loginPopup, setLoginPopup] = useState(false);
  const user = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Hide/show navbar on scroll
  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setShowNav(!(currentScroll > lastScroll && currentScroll > 100));
      lastScroll = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(asyncLogoutuser(navigate));
  };

  return (
    <>
      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 w-screen z-40 bg-[#fbfdf3] h-20 transition-transform duration-500 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        } shadow-sm`}
      >
        <div className="h-full w-full flex items-center justify-between px-6 md:px-20 pt-2">
          {/* Logo */}
          <div
            className="h-12 md:h-14 flex items-center cursor-pointer"
            onClick={() => navigate("/", { replace: true })}
          >
            <img
              src="/logo.png"
              alt="Betly Music Logo"
              className="h-full w-auto hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-[17px] font-medium">
            {user ? (
              <>
                <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  Hey,&nbsp;
                  <span className="text-lime-600 capitalize">
                    {user.fullname.firstname}
                  </span>
                  &nbsp;👋 Enjoy the vibe!
                </h1>

                <NavLink
                  to="/profile"
                  className="flex items-center gap-2 hover:text-lime-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings size={20} />
                  Profile
                </NavLink>

                {/* 👇 Artist Dashboard Link */}
                {user.role === "artist" && (
                  <NavLink
                    to="/artist/dashboard"
                    className="flex items-center gap-2 hover:text-lime-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard size={20} />
                    Artist Dashboard
                  </NavLink>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 font-semibold px-3 py-2 hover:bg-red-50 rounded-md transition"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <div className="border border-lime-400/60 hover:border-lime-500 transition-all duration-300 rounded-xl p-[2px] bg-gradient-to-r from-lime-500/10 to-transparent shadow-[0_0_10px_rgba(163,230,53,0.2)] hover:shadow-[0_0_15px_rgba(163,230,53,0.4)]">
                <button
                  onClick={() => setLoginPopup(true)}
                  className="flex items-center gap-2 bg-lime-600 px-5 py-2 text-white font-semibold rounded-lg hover:bg-lime-700 hover:scale-[1.03] cursor-pointer active:scale-[0.97] transition-all duration-300"
                >
                  <LogIn size={18} className="text-white" />
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X size={28} color="#bbf451" />
            ) : (
              <div className="border-2 border-slate-300 rounded-full p-1 bg-green-500">
                <UserIcon color="#fff" size={20} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden px-6 pb-4 flex flex-col gap-4 bg-[#fbfdf3] shadow-md rounded-b-lg transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          {user ? (
            <>
              <h1 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                Hey,&nbsp;
                <span className="text-lime-600 capitalize">
                  {user.fullname.firstname}
                </span>
                &nbsp;👋 Enjoy the vibe!
              </h1>

              <NavLink
                onClick={() => setIsOpen(false)}
                to="/profile"
                className="flex items-center gap-2"
              >
                <Settings size={20} /> Profile
              </NavLink>

              {/* 👇 Artist Dashboard Link for mobile */}
              {user.role === "artist" && (
                <NavLink
                  to="/artist/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard size={20} /> Artist Dashboard
                </NavLink>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 font-semibold hover:bg-red-50 py-2 rounded-md"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setLoginPopup(true);
                setIsOpen(false);
              }}
              className="bg-green-500 px-4 py-2 text-white font-medium rounded-md hover:bg-green-600 transition"
            >
              Login
            </button>
          )}
        </div>

        <div className="hidden md:block w-full h-[1.5px] bg-slate-200"></div>
      </div>

      {/* Login Popup */}
      {loginPopup && <Login onClose={() => setLoginPopup(false)} />}
    </>
  );
};

export default Nav;
