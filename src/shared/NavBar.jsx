import React from "react";
import useAuth from "../hooks/useAuth";
import { NavLink, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useTheme } from "../providers/ThemeProvider";
import { IoMoonOutline } from "react-icons/io5";
import { MdOutlineWbSunny } from "react-icons/md";
import userIcon from "../assets/user.png";

const NavBar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  // Handle Logout
  const handleLogOut = () => {
    toast.info("🚪 You have successfully logged out. See you soon!", {
      icon: "👋",
    });
    logOut();
    navigate("/");
  };
  return (
    <div className="navbar fixed top-0 bg-[#377376] z-10 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-white text-2xl">TaskPilot</a>
      </div>
      <div className="navbar-end flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-white hover:text-white font-semibold bg-transparent border-none shadow-none text-2xl"
        >
          {isDark ? <MdOutlineWbSunny /> : <IoMoonOutline />}
        </button>
        {user && user?.email && (
          <button
            onClick={handleLogOut}
            className="btn hidden md:flex border-none bg-transparent text-lg shadow-none text-white font-bold transition-all"
          >
            LogOut
          </button>
        )}
        {user && user?.email ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="User Avatar" src={user?.photoURL || userIcon} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3  p-4 shadow text-black"
            >
              {/* User Display Name */}
              <li
                className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
                title={user?.displayName}
              >
                {user?.displayName}
              </li>
              {/* User Email */}
              <li
                className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
                title={user?.email}
              >
                {user?.email}
              </li>
            </ul>
          </div>
        ) : (
          <NavLink
            to="/sign-up"
            className="btn border-none shadow-none bg-transparent text-lg text-white font-bold transition-all"
          >
            SignUp
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default NavBar;
