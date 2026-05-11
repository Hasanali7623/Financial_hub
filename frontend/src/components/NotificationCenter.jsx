import { useState, useEffect } from "react";
import {
  Bell,
  X,
  Check,
  TrendingUp,
  AlertTriangle,
  Target,
  Wallet,
  Info,
} from "lucide-react";
import { budgetService } from "../services/budgetService";
import { analyticsService } from "../services/analyticsService";
import { transactionService } from "../services/transactionService";

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [budgets, summary, upcomingBills] = await Promise.all([
        budgetService.getAll(),
        analyticsService.getSummary(),
        transactionService.getUpcomingRecurring(),
      ]);

      const newNotifications = [];

      // Add upcoming bill notifications
      upcomingBills.forEach((bill) => {
        const dueDate = new Date(bill.nextDueDate);
        const today = new Date();
        const daysUntilDue = Math.ceil(
          (dueDate - today) / (1000 * 60 * 60 * 24),
        );
        const isUrgent = daysUntilDue <= 1;

        newNotifications.push({
          id: `bill-${bill.id}`,
          type: isUrgent ? "alert" : "warning",
          title: isUrgent ? "Bill Due Soon!" : "Upcoming Bill",
          message: `${
            bill.category
          } payment of ₹${bill.amount.toLocaleString()} is due ${
            daysUntilDue === 0
              ? "today"
              : daysUntilDue === 1
                ? "tomorrow"
                : `in ${daysUntilDue} days`
          }`,
          time:
            daysUntilDue === 0
              ? "Today"
              : daysUntilDue === 1
                ? "Tomorrow"
                : `${daysUntilDue} days`,
          read: false,
          icon: AlertTriangle,
          color: isUrgent ? "red" : "orange",
        });
      });

      // Check budgets for alerts
      budgets.forEach((budget) => {
        const spentAmount = budget.spentAmount || 0;
        const percentage = (spentAmount / budget.amount) * 100;
        const alertThreshold = budget.alertThreshold || 80;

        if (percentage >= 100) {
          newNotifications.push({
            id: `budget-over-${budget.id}`,
            type: "alert",
            title: "Over Budget",
            message: `${
              budget.category
            } expenses exceeded your budget by ₹${Math.abs(
              budget.amount - spentAmount,
            ).toLocaleString()}`,
            time: "Recently",
            read: false,
            icon: AlertTriangle,
            color: "red",
          });
        } else if (percentage >= alertThreshold) {
          newNotifications.push({
            id: `budget-warning-${budget.id}`,
            type: "warning",
            title: "Budget Alert",
            message: `You've spent ${percentage.toFixed(0)}% of your ${
              budget.category
            } budget this month`,
            time: "Recently",
            read: false,
            icon: Wallet,
            color: "orange",
          });
        }
      });

      // Add spending insight if available
      if (summary?.totalExpenses > 0) {
        newNotifications.push({
          id: "spending-summary",
          type: "info",
          title: "Monthly Summary",
          message: `Total expenses: ₹${summary.totalExpenses.toLocaleString()}. Income: ₹${summary.totalIncome.toLocaleString()}`,
          time: "Today",
          read: false,
          icon: TrendingUp,
          color: "blue",
        });
      }

      setNotifications(newNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getColorClasses = (color) => {
    const colors = {
      orange:
        "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      green:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-all hover:scale-110"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panel */}
          <div className="fixed top-20 left-2 right-2 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 border-2 border-gray-200 dark:border-gray-700 max-h-[75vh] sm:max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl">
              <div className="flex items-center gap-2 text-white">
                <Bell className="h-5 w-5" />
                <h3 className="text-lg font-bold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Actions */}
            {unreadCount > 0 && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                >
                  Mark all as read
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        !notification.read
                          ? "bg-purple-50/50 dark:bg-purple-900/10"
                          : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div
                          className={`p-2 rounded-xl h-fit ${getColorClasses(
                            notification.color,
                          )}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                              {notification.title}
                            </h4>
                            <div className="flex gap-1">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                title="Delete"
                              >
                                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-semibold">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
