import { NavLink } from "react-router-dom";

export default function Sidebar({ items }) {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-navy-900/10 bg-navy-950 text-white min-h-screen py-6 px-3">
      <div className="px-3 mb-8 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-signal-500 flex items-center justify-center font-display font-bold text-navy-950">S</div>
        <span className="font-display font-semibold text-lg tracking-tight">SafeRide</span>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-navy-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <span className="text-base leading-none">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
