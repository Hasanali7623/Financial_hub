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
  ChevronRight,
  ShieldCheck,
  Lock
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
      const [transactions, budgets, goals, analytics] = await Promise.all([
        api.get("/transactions"),
        api.get("/budgets"),
        api.get("/goals"),
        api.get("/analytics/summary").catch(() => ({ data: {} })),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        user: { name: user?.name, email: user?.email },
        transactions: transactions.data.data || [],
        budgets: budgets.data.data || [],
        savingsGoals: goals.data.data || [],
        analytics: analytics.data.data || {},
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `financial-data-${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
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
      window.location.href = "/login";
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-300 dark:border-gray-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center border border-gray-300 dark:border-gray-600 shrink-0">
            <User className="h-7 w-7 text-gray-700 dark:text-gray-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              My Profile
            </h1>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
        <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-sm">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* User Info Container */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-300 dark:border-gray-600">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 mb-8">
          <div className="relative shrink-0 overflow-hidden rounded-full" style={{ padding: "8px" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-xl opacity-40" style={{ margin: "-4px" }}></div>
            <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg ring-4 ring-white dark:ring-gray-800">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="text-center md:text-left flex-1 pt-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {user?.name}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
              {user?.email}
            </p>
            <div className="flex justify-center md:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f0fdf4] dark:bg-green-900/30 text-[#16a34a] dark:text-green-400 rounded-full text-xs font-bold border border-green-100 dark:border-green-800/50">
                <ShieldCheck className="h-4 w-4" />
                Verified Account
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex items-center gap-4 p-5 bg-[#eff6ff] dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/50">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shrink-0 shadow-sm">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-0.5">
                Full Name
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {user?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-[#faf5ff] dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/50">
            <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shrink-0 shadow-sm">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-0.5">
                Email Address
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-300 dark:border-gray-600">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" /> Account Settings
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Change Password */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center p-5 bg-[#f8fafc] dark:bg-gray-900/50 hover:bg-[#eff6ff] dark:hover:bg-blue-900/10 border border-gray-300 dark:border-gray-600 hover:border-blue-100 dark:hover:border-blue-900/50 rounded-2xl transition-all group text-left shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mr-4 group-hover:scale-110 transition-transform">
              <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-0.5">
                Change Password
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                Update your security
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
          </button>

          {/* Export Data */}
          <button
            onClick={handleExportData}
            className="flex items-center p-5 bg-[#f8fafc] dark:bg-gray-900/50 hover:bg-[#f0fdf4] dark:hover:bg-green-900/10 border border-gray-300 dark:border-gray-600 hover:border-green-100 dark:hover:border-green-900/50 rounded-2xl transition-all group text-left shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0 mr-4 group-hover:scale-110 transition-transform">
              <Download className="h-5 w-5 text-[#16a34a] dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-0.5">
                Export Data
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                Download your info
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-green-500 transition-colors" />
          </button>

          {/* Delete Account */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center p-5 bg-[#f8fafc] dark:bg-gray-900/50 hover:bg-[#fef2f2] dark:hover:bg-red-900/10 border border-gray-300 dark:border-gray-600 hover:border-red-100 dark:hover:border-red-900/50 rounded-2xl transition-all group text-left shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center shrink-0 mr-4 group-hover:scale-110 transition-transform">
              <Trash2 className="h-5 w-5 text-[#dc2626] dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-0.5">
                Delete Account
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                Permanently remove
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-[#f8fafc] dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-2xl p-6 flex items-center justify-between shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
            <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 max-w-lg">
            Your data is secure with us. We never share your personal information.
          </p>
        </div>
        <div className="hidden sm:flex w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full items-center justify-center relative z-10 opacity-80">
           <Lock className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
           <div className="absolute top-0 right-0 w-3 h-3 bg-purple-300 rounded-full -mt-1 -mr-2"></div>
           <div className="absolute bottom-2 -left-2 w-2 h-2 bg-indigo-300 rounded-full"></div>
        </div>
      </div>

      {/* Modals remain mostly the same, just stylized input fields slightly */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
          setError("");
          setSuccess("");
        }}
        title="Change Password"
      >
        <form onSubmit={handlePasswordChange} className="space-y-5">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm border border-green-100">{success}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <button type="button" onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <button type="button" onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <button type="button" onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-300 dark:border-gray-600 mt-6">
            <button type="button" onClick={() => setShowPasswordModal(false)} className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
        <div className="space-y-5">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-5">
            <p className="text-red-800 dark:text-red-200 font-bold mb-2 flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Warning: Irreversible Action
            </p>
            <p className="text-red-700 dark:text-red-300/80 text-sm leading-relaxed">
              Deleting your account will permanently remove all your data including transactions, budgets, goals, and reports. This action cannot be undone.
            </p>
          </div>
          <p className="text-gray-800 dark:text-gray-200 font-medium">Are you sure you want to delete your account?</p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-300 dark:border-gray-600">
            <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition" disabled={loading}>
              Cancel
            </button>
            <button onClick={handleDeleteAccount} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition" disabled={loading}>
              {loading ? "Deleting..." : "Yes, Delete Account"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
