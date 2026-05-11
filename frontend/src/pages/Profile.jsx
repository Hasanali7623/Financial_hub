import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Shield,
  Key,
  Download,
  Trash2,
  Settings,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import Modal from "../components/Modal";
import api from "../services/api";

export default function Profile() {
  const { user } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Password changed successfully!");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setSuccess("");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);

      // Fetch all user data
      const [transactions, budgets, goals, analytics] = await Promise.all([
        api.get("/transactions"),
        api.get("/budgets"),
        api.get("/goals"),
        api.get("/analytics/summary").catch(() => ({ data: {} })),
      ]);

      // Prepare export data
      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          name: user?.name,
          email: user?.email,
        },
        transactions: transactions.data.data || [],
        budgets: budgets.data.data || [],
        savingsGoals: goals.data.data || [],
        analytics: analytics.data.data || {},
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `financial-data-${new Date().toISOString().split("T")[0]}.json`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      alert("Data exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await api.delete("/auth/account");
      alert("Account deleted successfully");
      window.location.href = "/login";
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="page-hero">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3 text-gray-900 dark:text-gray-100">
              <User className="h-8 w-8 sm:h-10 sm:w-10 text-gray-700 dark:text-gray-300" />
              My Profile
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="hidden md:block">
            <Settings className="h-14 w-14 text-gray-300 dark:text-gray-600" />
          </div>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-xl opacity-50"></div>
            <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl ring-4 ring-white dark:ring-gray-800">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {user?.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              {user?.email}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Verified Account
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:scale-105 transition-all">
            <div className="bg-blue-500 p-3 rounded-xl">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Full Name
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {user?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border-2 border-purple-200 dark:border-purple-700 hover:scale-105 transition-all">
            <div className="bg-purple-500 p-3 rounded-xl">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Email Address
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          Account Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 border-2 border-blue-200 dark:border-blue-700 rounded-xl transition-all hover:scale-105 hover:shadow-xl"
          >
            <Key className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              Change Password
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Update your security
            </p>
          </button>
          <button
            onClick={handleExportData}
            className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50 border-2 border-green-200 dark:border-green-700 rounded-xl transition-all hover:scale-105 hover:shadow-xl"
          >
            <Download className="h-8 w-8 text-green-600 dark:text-green-400 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              Export Data
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Download your info
            </p>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="group p-6 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 hover:from-red-100 hover:to-rose-100 dark:hover:from-red-900/50 dark:hover:to-rose-900/50 border-2 border-red-200 dark:border-red-700 rounded-xl transition-all hover:scale-105 hover:shadow-xl"
          >
            <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              Delete Account
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Permanently remove
            </p>
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setError("");
          setSuccess("");
        }}
        title="Change Password"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="input-field pr-10"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    current: !showPasswords.current,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="input-field pr-10"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    new: !showPasswords.new,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="input-field pr-10"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    confirm: !showPasswords.confirm,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
              ⚠️ Warning: This action cannot be undone!
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm">
              Deleting your account will permanently remove all your data
              including transactions, budgets, goals, and reports. This action
              is irreversible.
            </p>
          </div>

          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete your account?
          </p>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, Delete My Account"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
