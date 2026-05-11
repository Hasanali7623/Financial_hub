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
} from "lucide-react";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

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

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "bg-red-600";
    if (percentage >= 70) return "bg-yellow-600";
    return "bg-green-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-hero">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center text-gray-900 dark:text-gray-100">
              <Wallet className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-gray-700 dark:text-gray-300" />
              Budget Manager
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Control your spending with smart budget tracking
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary w-full sm:w-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Budget
          </button>
        </div>
      </div>

      {/* Beautiful Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const spentAmount = budget.spentAmount || budget.spent || 0;
          const percentage = getProgressPercentage(spentAmount, budget.amount);
          const remaining = budget.amount - spentAmount;
          const isOverBudget = percentage >= 100;
          const isWarning = percentage >= 80 && percentage < 100;

          return (
            <div
              key={budget.id}
              className={`card hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden ${
                isOverBudget
                  ? "bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 border-red-300 dark:border-red-700"
                  : isWarning
                    ? "bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-300 dark:border-yellow-700"
                    : "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-300 dark:border-green-700"
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {isOverBudget ? (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Over Budget
                  </div>
                ) : isWarning ? (
                  <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Warning
                  </div>
                ) : (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    On Track
                  </div>
                )}
              </div>

              {/* Category & Date */}
              <div className="mb-6 mt-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  💵 {budget.category}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  📅{" "}
                  {new Date(budget.year, budget.month - 1).toLocaleDateString(
                    "default",
                    { month: "long", year: "numeric" },
                  )}
                </span>
              </div>

              {/* Amount Display */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Spent
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{spentAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Budget
                  </span>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    ₹{budget.amount.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Remaining
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      remaining >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    ₹{Math.abs(remaining).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Progress
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      isOverBudget
                        ? "text-red-600 dark:text-red-400"
                        : isWarning
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="relative w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ease-out relative overflow-hidden ${
                      isOverBudget
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : isWarning
                          ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                          : "bg-gradient-to-r from-green-500 to-emerald-500"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(budget)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center transition-all hover:scale-105"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(budget.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center transition-all hover:scale-105"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="card text-center py-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <Wallet className="h-24 w-24 mx-auto text-purple-300 dark:text-purple-600 mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            No Budgets Yet
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Create your first budget to start tracking your spending!
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Budget
          </button>
        </div>
      )}

      {/* Budget Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingBudget ? "Edit Budget" : "Create Budget"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="input-field"
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
              className="input-field"
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
                className="input-field"
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
                className="input-field"
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
              className="input-field"
              min="0"
              max="100"
              placeholder="e.g., 80"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get notified when you reach this percentage of your budget
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingBudget ? "Update" : "Create"} Budget
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
