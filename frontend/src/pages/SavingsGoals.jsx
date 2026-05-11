import { useState, useEffect } from "react";
import { savingsGoalService } from "../services/savingsGoalService";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Target,
  Trophy,
  Sparkles,
  Calendar,
  DollarSign,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showContribution, setShowContribution] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
    description: "",
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await savingsGoalService.getAll();
      setGoals(data);
    } catch (error) {
      console.error("Error loading goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare data with proper types
      const goalData = {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        targetDate: formData.targetDate,
        description: formData.description || null,
      };

      if (editingGoal) {
        await savingsGoalService.update(editingGoal.id, goalData);
      } else {
        await savingsGoalService.create(goalData);
      }
      loadGoals();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving goal:", error);
      alert(
        error.response?.data?.message ||
          "Failed to save goal. Please check all fields.",
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await savingsGoalService.delete(id);
        loadGoals();
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate,
      description: goal.description || "",
    });
    setShowModal(true);
  };

  const handleContribute = (goal) => {
    setSelectedGoal(goal);
    setContributionAmount("");
    setShowContribution(true);
  };

  const handleSubmitContribution = async (e) => {
    e.preventDefault();
    try {
      const amount = parseFloat(contributionAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }
      await savingsGoalService.addContribution(selectedGoal.id, amount);
      loadGoals();
      setShowContribution(false);
      setContributionAmount("");
    } catch (error) {
      console.error("Error adding contribution:", error);
      alert(
        error.response?.data?.message ||
          "Failed to add contribution. Please try again.",
      );
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGoal(null);
    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "",
      targetDate: "",
      description: "",
    });
  };

  const getProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (targetDate) => {
    return differenceInDays(new Date(targetDate), new Date());
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
              <Trophy className="h-7 w-7 sm:h-8 sm:w-8 mr-3 text-gray-700 dark:text-gray-300" />
              Savings Goals
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              ✨ Achieve your dreams with smart savings tracking
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary w-full sm:w-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Goal
          </button>
        </div>
      </div>

      {/* Beautiful Goal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = getProgress(goal.currentAmount, goal.targetAmount);
          const daysLeft = getDaysRemaining(goal.targetDate);
          const isAchieved = progress >= 100;
          const remaining = goal.targetAmount - goal.currentAmount;

          return (
            <div
              key={goal.id}
              className={`rounded-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden shadow-lg border-2 ${
                isAchieved
                  ? "bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 dark:from-yellow-900/30 dark:via-amber-900/30 dark:to-orange-900/30 border-yellow-500 dark:border-yellow-600"
                  : "bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 dark:from-cyan-900/30 dark:to-blue-900/30 border-cyan-500 dark:border-cyan-700"
              }`}
            >
              {/* Achievement Badge */}
              {isAchieved && (
                <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white px-4 py-3 text-center animate-pulse">
                  <div className="flex items-center justify-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span className="font-bold text-lg">GOAL ACHIEVED!</span>
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
              )}

              {/* Goal Header */}
              <div className={`mb-6 ${isAchieved ? "mt-16" : "mt-0"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Target className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {goal.name}
                    </h3>
                  </div>
                </div>
                {goal.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">
                    {goal.description}
                  </p>
                )}
              </div>

              {/* Progress Circle */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <svg
                    className="transform -rotate-90"
                    width="120"
                    height="120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={
                        isAchieved
                          ? "url(#achieved-gradient)"
                          : "url(#progress-gradient)"
                      }
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${progress * 3.14} 314`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient
                        id="progress-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <linearGradient
                        id="achieved-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold ${
                          isAchieved
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-cyan-600 dark:text-cyan-400"
                        }`}
                      >
                        {progress.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 space-y-3 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Current
                  </span>
                  <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                    ₹{goal.currentAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    Target
                  </span>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    ₹{goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Remaining
                  </span>
                  <span
                    className={`text-xl font-bold ${
                      remaining > 0
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    ₹{Math.abs(remaining).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Deadline */}
              <div className="bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-xl p-3 mb-4 border border-blue-300 dark:border-blue-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {daysLeft > 0
                        ? `${daysLeft} days remaining`
                        : "Deadline passed"}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {format(new Date(goal.targetDate), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleContribute(goal)}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center transition-all hover:scale-105 shadow-md"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Add Funds
                </button>
                <button
                  onClick={() => handleEdit(goal)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-900 dark:text-blue-300 py-3 px-4 rounded-xl transition-all hover:scale-105"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900 dark:text-red-300 py-3 px-4 rounded-xl transition-all hover:scale-105"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="rounded-lg p-6 text-center py-16 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 border-2 border-cyan-300 dark:border-cyan-700 shadow-lg">
          <Trophy className="h-24 w-24 mx-auto text-cyan-500 dark:text-cyan-600 mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            No Savings Goals Yet
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Start saving for your dreams! Create your first goal to start
            saving!
          </p>
        </div>
      )}

      {/* Goal Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingGoal ? "Edit Goal" : "Add Savings Goal"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Goal Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input-field"
              placeholder="e.g., Emergency Fund, Vacation"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Amount
              </label>
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) =>
                  setFormData({ ...formData, targetAmount: e.target.value })
                }
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.currentAmount}
                onChange={(e) =>
                  setFormData({ ...formData, currentAmount: e.target.value })
                }
                className="input-field"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Date
            </label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) =>
                setFormData({ ...formData, targetDate: e.target.value })
              }
              className="input-field"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="input-field"
              rows="3"
              placeholder="Add notes about this goal..."
            />
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
              {editingGoal ? "Update" : "Create"} Goal
            </button>
          </div>
        </form>
      </Modal>

      {/* Contribution Modal */}
      <Modal
        isOpen={showContribution}
        onClose={() => setShowContribution(false)}
        title="Add Contribution"
      >
        <form onSubmit={handleSubmitContribution} className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add money to: <strong>{selectedGoal?.name}</strong>
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              className="input-field"
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowContribution(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Contribution
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
