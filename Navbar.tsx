import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">
          Recruitment Tracker
        </NavLink>
      </div>

      <div className="navbar-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Jobs
        </NavLink>

        <NavLink
          to="/applicants"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Applicants
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;

