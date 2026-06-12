import { useState, useEffect } from "react";
import { budgetService } from "../services/budgetService";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Wallet,
  Calendar,
  Lightbulb,
  MoreHorizontal,
  PieChart,
  Clock,
  ArrowUpRight
} from "lucide-react";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    alertThreshold: 80,
  });

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const data = await budgetService.getAll();
      setBudgets(data);
    } catch (error) {
      console.error("Error loading budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);
    try {
      if (editingBudget) {
        await budgetService.update(editingBudget.id, formData);
      } else {
        await budgetService.create(formData);
      }
      loadBudgets();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving budget:", error);
      if (error.response?.status === 409) {
        setFormError(
          `A budget for "${formData.category}" already exists for this month and year. Please edit the existing budget or choose a different category/period.`
        );
      } else {
        setFormError(
          error.response?.data?.message || "Failed to save budget. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await budgetService.delete(id);
        loadBudgets();
      } catch (error) {
        console.error("Error deleting budget:", error);
        alert(
          error.response?.data?.message ||
            "Failed to delete budget. Please try again.",
        );
      }
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category || "",
      amount: budget.amount || "",
      month: budget.month || new Date().getMonth() + 1,
      year: budget.year || new Date().getFullYear(),
      alertThreshold: budget.alertThreshold || 80,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBudget(null);
    setFormError("");
    setIsSubmitting(false);
    setFormData({
      category: "",
      amount: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      alertThreshold: 80,
    });
  };

  const getProgressPercentage = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  // Summary Computations
  const totalBudgetsCount = budgets.length;
  const totalBudgetAmount = budgets.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const totalSpentAmount = budgets.reduce((sum, b) => sum + (Number(b.spentAmount || b.spent) || 0), 0);
  const totalRemaining = totalBudgetAmount - totalSpentAmount;
  const totalPercentage = totalBudgetAmount > 0 ? (totalSpentAmount / totalBudgetAmount) * 100 : 0;

  // Donut chart math
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(totalPercentage, 100) / 100) * circumference;



  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
           style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800 shrink-0">
            <Wallet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: "1.375rem" }}>Budget Manager</h1>
            <p className="page-subtitle">Control your spending with smart budget tracking</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-dark w-full md:w-auto flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" /> Create Budget
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Budget Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
          {budgets.map((budget) => {
            const spentAmount = budget.spentAmount || budget.spent || 0;
            const percentage = getProgressPercentage(spentAmount, budget.amount);
            const remaining = budget.amount - spentAmount;
            const isOverBudget = percentage >= 100;
            const isWarning = percentage >= 80 && percentage < 100;

            return (
              <div
                key={budget.id}
                className="bg-[#f0fdf4] dark:bg-green-900/10 rounded-2xl p-5 border border-green-100 dark:border-green-900/50 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <span className="bg-green-100 dark:bg-green-800 p-1 rounded">💵</span> {budget.category}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1 mt-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(budget.year, budget.month - 1).toLocaleDateString("default", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {isOverBudget ? (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                      <AlertCircle className="h-3 w-3" /> Over Budget
                    </span>
                  ) : isWarning ? (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                      <AlertCircle className="h-3 w-3" /> Warning
                    </span>
                  ) : (
                    <span className="bg-[#22c55e] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                      <CheckCircle className="h-3 w-3" /> On Track
                    </span>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-50 dark:border-gray-600 mb-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Spent</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">₹{spentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Budget</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">₹{budget.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-px w-full bg-gray-100 dark:bg-gray-700 mb-3"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Remaining</span>
                    <span className={`text-lg font-bold ${remaining >= 0 ? "text-[#16a34a] dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      ₹{Math.abs(remaining).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Progress</span>
                    <span className={`text-sm font-bold ${isOverBudget ? "text-red-600" : isWarning ? "text-yellow-600" : "text-[#16a34a]"}`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-green-200 dark:bg-green-900/50 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full ${isOverBudget ? "bg-red-600" : isWarning ? "bg-yellow-500" : "bg-[#16a34a]"}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="flex-1 bg-[#16a34a] hover:bg-green-700 text-white py-2.5 rounded-xl font-medium flex items-center justify-center transition shadow-sm"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="flex-1 bg-[#dc2626] hover:bg-red-700 text-white py-2.5 rounded-xl font-medium flex items-center justify-center transition shadow-sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </button>
                </div>
              </div>
            );
          })}

          {budgets.length === 0 && (
            <div className="col-span-1 md:col-span-2 bg-[#f0fdf4] dark:bg-green-900/10 rounded-2xl p-10 border border-green-100 dark:border-green-900/50 flex flex-col items-center justify-center text-center shadow-sm">
              <Wallet className="h-16 w-16 text-green-300 dark:text-green-700 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Budgets Yet</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-md">
                Create your first budget to start tracking your spending and reaching your financial goals!
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#16a34a] text-white px-6 py-3 rounded-xl font-medium inline-flex items-center shadow-md hover:bg-green-700 transition"
              >
                <Plus className="h-5 w-5 mr-2" /> Create Your First Budget
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Insights Card */}
        <div className="lg:col-span-1 h-fit">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-300 dark:border-gray-600">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Budget Insights
              </h2>
              <button className="text-gray-600 hover:text-gray-600 transition">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                  {/* Background Circle */}
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-gray-100 dark:text-gray-700"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-out ${
                      totalPercentage >= 100
                        ? "text-red-500"
                        : totalPercentage >= 80
                        ? "text-yellow-500"
                        : "text-[#16a34a]"
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {totalPercentage.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                    of budget used
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#f0fdf4] dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/50">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-green-100 dark:bg-green-800 rounded-lg text-green-600 dark:text-green-300 mt-0.5">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {totalPercentage > 100 ? "Over Budget!" : totalPercentage > 80 ? "Nearing Limit!" : "Good Progress!"}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    {totalPercentage > 100 
                      ? "You have exceeded your total budget limit. Time to review expenses." 
                      : totalPercentage > 80 
                      ? "You are close to reaching your budget limit for this month." 
                      : "You're on track to meet your budget goal this month."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Row */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-300 dark:border-gray-600">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
          Budget Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <Wallet className="h-6 w-6 text-[#16a34a] dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Total Budgets</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100 my-0.5">{totalBudgetsCount}</p>
              <p className="text-xs text-gray-700 dark:text-gray-300">Active budgets</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <PieChart className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Total Budget</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100 my-0.5">₹{totalBudgetAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-700 dark:text-gray-300">Across all budgets</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
              <ArrowUpRight className="h-6 w-6 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Total Spent</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100 my-0.5">₹{totalSpentAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-700 dark:text-gray-300">This month</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6 text-orange-500 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Remaining</p>
              <p className={`text-xl font-bold my-0.5 ${totalRemaining >= 0 ? "text-[#16a34a] dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                ₹{Math.abs(totalRemaining).toLocaleString()}
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">Total remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingBudget ? "Edit Budget" : "Create Budget"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g., Food, Entertainment"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter budget amount"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Month
              </label>
              <select
                value={formData.month || new Date().getMonth() + 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    month: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-900"
                required
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year
              </label>
              <input
                type="number"
                value={formData.year || new Date().getFullYear()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year: parseInt(e.target.value) || new Date().getFullYear(),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                min="2020"
                max="2030"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alert Threshold (%)
            </label>
            <input
              type="number"
              value={formData.alertThreshold || 80}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  alertThreshold: parseInt(e.target.value) || 80,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              min="0"
              max="100"
              placeholder="e.g., 80"
            />
            <p className="text-xs text-gray-700 mt-1">
              Get notified when you reach this percentage of your budget
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 mt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
            <button type="button" onClick={handleCloseModal} className="btn-secondary" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-dark" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : editingBudget ? "Update Budget" : "Create Budget"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
