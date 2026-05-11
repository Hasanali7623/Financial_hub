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
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Budgets", href: "/budgets", icon: Wallet },
  { name: "Savings Goals", href: "/savings", icon: Target },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "AI Adviser", href: "/ai-adviser", icon: Bot },
  { name: "Currency Converter", href: "/currency", icon: DollarSign },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-40 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive
                        ? "text-primary-700 dark:text-primary-300"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
