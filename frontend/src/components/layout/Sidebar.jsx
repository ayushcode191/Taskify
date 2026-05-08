import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  UserCircle2,
  CheckCircle2,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import { cn } from "../../utils/cn.js";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/projects",
    label: "Projects",
    icon: FolderKanban,
  },
  {
    to: "/tasks",
    label: "Tasks",
    icon: CheckSquare,
  },
  {
    to: "/users",
    label: "Team",
    icon: Users,
    roles: ["admin", "manager"],
  },
  {
    to: "/profile",
    label: "Profile",
    icon: UserCircle2,
  },
];

export default function Sidebar({ open, onClose }) {
  const { hasRole } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-72 border-r border-slate-800 bg-slate-950 text-slate-200 transition-transform duration-300 lg:sticky lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">
                Taskify
              </h1>

              <p className="text-xs text-slate-400">
                Team Workspace
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            if (item.roles && !hasRole(...item.roles)) {
              return null;
            }

            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-cyan-500 text-white"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  )
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full border-t border-slate-800 p-4">
          <div className="rounded-xl bg-slate-900 p-4">
            <p className="text-sm font-semibold text-white">
              Stay Organized
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Manage projects, track tasks, and collaborate with your team efficiently.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
