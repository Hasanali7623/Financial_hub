import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  Bot,
  DollarSign,
  X,
  BarChart3,
  FileText,
  User,
} from "lucide-react";

const navigation = [
  { name: "Dashboard",          href: "/dashboard",  icon: LayoutDashboard },
  { name: "Transactions",       href: "/transactions", icon: ArrowLeftRight },
  { name: "Budgets",            href: "/budgets",    icon: Wallet },
  { name: "Savings Goals",      href: "/savings",    icon: Target },
  { name: "Analytics",          href: "/analytics",  icon: BarChart3 },
  { name: "Reports",            href: "/reports",    icon: FileText },
  { name: "AI Adviser",         href: "/ai-adviser", icon: Bot },
  { name: "Currency Converter", href: "/currency",   icon: DollarSign },
  { name: "Profile",            href: "/profile",    icon: User },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          background: "var(--color-surface)",
          borderRight: "1px solid var(--color-border)",
          boxShadow: "2px 0 12px -4px rgba(0,0,0,0.07)",
        }}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between px-4 py-3 md:hidden border-b"
             style={{ borderColor: "var(--color-border)" }}>
          <span className="text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>
            Navigation
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            style={{ color: "var(--color-text-muted)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav section label */}
        <div className="px-5 pt-5 pb-2">
          <span className="section-label">Menu</span>
        </div>

        <nav className="px-3 space-y-0.5">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "sidebar-link-active"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`
              }
              style={({ isActive }) =>
                !isActive ? { color: "var(--color-text-secondary)" } : {}
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`mr-3 p-1.5 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-primary-100 dark:bg-primary-900/40"
                        : "bg-slate-100 dark:bg-slate-900 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                    }`}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        isActive
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-slate-700 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-500"
                      }`}
                    />
                  </div>
                  <span className={isActive ? "font-semibold" : ""}>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom branding */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t"
             style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Wallet className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>FinanceHub</p>
              <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Smart Money Manager</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
