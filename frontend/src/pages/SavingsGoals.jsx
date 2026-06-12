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
  Calendar,
  DollarSign,
  PieChart,
  Wallet,
  MoreVertical,
  Flag
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

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
    setFormError("");
    setIsSubmitting(true);
    try {
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
      setFormError(error.response?.data?.message || "Failed to save goal. Please check all fields.");
    } finally {
      setIsSubmitting(false);
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
    setFormError("");
    setIsSubmitting(false);
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

  // Global Summaries
  const totalCurrent = goals.reduce((sum, g) => sum + (Number(g.currentAmount) || 0), 0);
  const totalTarget = goals.reduce((sum, g) => sum + (Number(g.targetAmount) || 0), 0);
  const globalProgress = totalTarget > 0 ? Math.min((totalCurrent / totalTarget) * 100, 100) : 0;



  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
           style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800 shrink-0">
            <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: "1.375rem" }}>Savings Goals</h1>
            <p className="page-subtitle">Achieve your dreams with smart savings tracking ✨</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-dark w-full md:w-auto flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" /> Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side: Goal Cards Grid */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
          {goals.map((goal) => {
            const progress = getProgress(goal.currentAmount, goal.targetAmount);
            const daysLeft = getDaysRemaining(goal.targetDate);
            const isAchieved = progress >= 100;
            const remaining = goal.targetAmount - goal.currentAmount;

            const radius = 50;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

            return (
              <div
                key={goal.id}
                className="bg-[#eff6ff] dark:bg-blue-900/10 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/50 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all hover:shadow-md"
              >
                {/* Background Pattern */}
                <div className="absolute top-1/4 left-0 right-0 h-1/2 opacity-20 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    <circle cx="25" cy="40" r="1.5" fill="#3b82f6" />
                    <circle cx="75" cy="60" r="1.5" fill="#3b82f6" />
                    <circle cx="50" cy="50" r="1.5" fill="#3b82f6" />
                  </svg>
                </div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {goal.name}
                      </h3>
                      <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs font-semibold rounded-md">
                        {isAchieved ? "Achieved" : "Active"}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-700 hover:text-gray-700 dark:text-gray-300">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                {/* Donut Chart Progress */}
                <div className="flex justify-center mb-6 relative z-10">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-blue-200 dark:text-blue-900/30"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="text-blue-600 dark:text-blue-500 transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                        {progress.toFixed(0)}%
                      </span>
                      <span className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-0.5">
                        of goal achieved
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amounts Inset Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-300 dark:border-gray-600 mb-4 relative z-10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                      <div className="p-1 bg-blue-50 dark:bg-blue-900/30 rounded text-blue-500">
                        <DollarSign className="h-3.5 w-3.5" />
                      </div>
                      Current
                    </span>
                    <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                      ₹{goal.currentAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                      <div className="p-1 bg-purple-50 dark:bg-purple-900/30 rounded text-purple-500">
                        <Target className="h-3.5 w-3.5" />
                      </div>
                      Target
                    </span>
                    <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                      ₹{goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px w-full bg-gray-100 dark:bg-gray-700 mb-3"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                      <div className="p-1 bg-blue-50 dark:bg-blue-900/30 rounded text-blue-500">
                        <PieChart className="h-3.5 w-3.5" />
                      </div>
                      Remaining
                    </span>
                    <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                      ₹{Math.max(0, remaining).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Date Remaining */}
                <div className="bg-blue-100 dark:bg-blue-900/40 rounded-xl p-3 mb-5 border border-blue-200 dark:border-blue-800 flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {daysLeft > 0 ? `${daysLeft} days remaining` : "Deadline passed"}
                    </span>
                  </div>
                  <span className="text-xs text-blue-700/80 dark:text-blue-300/80 font-medium">
                    {format(new Date(goal.targetDate), "MMM dd, yyyy")}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 relative z-10 mt-auto">
                  <button
                    onClick={() => handleContribute(goal)}
                    className="flex-grow bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2.5 rounded-xl font-medium flex items-center justify-center transition shadow-md"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" /> Add Funds
                  </button>
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-3 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/50 transition shadow-sm shrink-0"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition shadow-sm shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {goals.length === 0 && (
            <div className="col-span-1 md:col-span-2 bg-[#eff6ff] dark:bg-blue-900/10 rounded-2xl p-10 border border-blue-100 dark:border-blue-900/50 flex flex-col items-center justify-center text-center shadow-sm">
              <Trophy className="h-16 w-16 text-blue-400 dark:text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Goals Set</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-md">
                Dreams without goals are just dreams. Set your first savings goal and start tracking your progress!
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center shadow-md hover:bg-blue-700 transition"
              >
                <Plus className="h-5 w-5 mr-2" /> Add Your First Goal
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Summary & Motivation */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* Goal Summary Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-300 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Goal Summary</h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-500">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Saved</span>
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">₹{totalCurrent.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-500">
                    <Target className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Target Amount</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">₹{totalTarget.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-500">
                    <PieChart className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Progress</span>
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{globalProgress.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Motivational Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6 shadow-sm border border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden flex-1 min-h-[250px]">
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2">
                Keep Going! <span className="text-xl">💪</span>
              </h3>
              <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed max-w-[80%]">
                You're making great progress towards your goal. Stay consistent and achieve your dreams!
              </p>
            </div>
            
            {/* SVG Mountain Illustration */}
            <div className="absolute bottom-0 right-0 w-full h-3/4 pointer-events-none">
               <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full absolute bottom-0 right-[-10%]">
                  <path d="M180 150 L120 40 L60 150 Z" fill="#6366f1" opacity="0.8"/>
                  <path d="M120 150 L80 80 L30 150 Z" fill="#818cf8" opacity="0.6"/>
                  <path d="M120 40 L135 45 L135 20 L155 30 L135 40 Z" fill="#4f46e5" />
                  <circle cx="160" cy="50" r="10" fill="#e0e7ff" opacity="0.5" />
                  <circle cx="40" cy="80" r="6" fill="#e0e7ff" opacity="0.5" />
               </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingGoal ? "Edit Goal" : "Add Savings Goal"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
              {formError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Goal Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              placeholder="Add notes about this goal..."
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 mt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
            <button type="button" onClick={handleCloseModal} className="btn-secondary" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-dark" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : editingGoal ? "Update Goal" : "Create Goal"}
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
          <p className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
            <button type="button" onClick={() => setShowContribution(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Contribution</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
