// components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="bg-blue-800 text-white w-16 md:w-64 shrink-0 transition-all duration-300 hidden md:block">
      <div className="p-4 md:p-6">
        <h1 className="text-xl font-bold hidden md:block">ParkMate</h1>
        <div className="text-2xl font-bold md:hidden text-center">P</div>
      </div>

      <nav className="mt-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center py-3 px-4 text-white ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            ></path>
          </svg>
          <span className="hidden md:block">Dashboard</span>
        </NavLink>

        <NavLink
          to="/table"
          className={({ isActive }) =>
            `flex items-center py-3 px-4 text-white ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
          <span className="hidden md:block">Bookings Table</span>
        </NavLink>
        <NavLink
          to="/monthly-passes"
          className={({ isActive }) =>
            `flex items-center py-3 px-4 text-white ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0z"
            ></path>
          </svg>
          <span className="hidden md:block">Monthly Passes</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
