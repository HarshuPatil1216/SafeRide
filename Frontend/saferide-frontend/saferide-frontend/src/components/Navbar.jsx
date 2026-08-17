import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar({ title, items = [] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const initials = (user?.email || "?").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-navy-900/10 bg-white/90 backdrop-blur px-4 md:px-6 py-3">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg hover:bg-navy-900/5"
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <h1 className="font-display text-lg font-semibold text-navy-900">{title}</h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-navy-900/5"
        >
          <span className="h-8 w-8 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-semibold">
            {initials}
          </span>
          <span className="hidden sm:block text-sm text-left leading-tight">
            <span className="block font-medium text-navy-900">{user?.email}</span>
            <span className="block text-xs text-navy-500 capitalize">{user?.role?.toLowerCase()}</span>
          </span>
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 mt-2 w-44 rounded-lg border border-navy-900/10 bg-white shadow-raised z-20 py-1">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-transit-stop hover:bg-navy-900/5 font-medium"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>

      {mobileNavOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden bg-navy-950 text-white p-3 flex flex-col gap-1 shadow-raised">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-white/10" : "text-navy-300"}`
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
