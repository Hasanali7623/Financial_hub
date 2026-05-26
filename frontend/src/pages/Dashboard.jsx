import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analyticsService } from "../services/analyticsService";
import { transactionService } from "../services/transactionService";
import { budgetService } from "../services/budgetService";
import { savingsGoalService } from "../services/savingsGoalService";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  RefreshCw,
  Sparkles,
  Leaf,
  PieChart as PieChartIcon,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip
} from "recharts";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];
const DUMMY_SPARKLINE = [{ v: 10 }, { v: 15 }, { v: 12 }, { v: 20 }, { v: 18 }, { v: 25 }, { v: 30 }];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [topBudgets, setTopBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const totalIncome = summary?.totalIncome || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  const expenseToIncome = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  const totalBudgetItems = topBudgets.length;
  const overBudgetItems = topBudgets.filter(
    (b) => ((b.spentAmount || 0) / b.amount) * 100 >= 100
  ).length;
  const budgetHealth = totalBudgetItems > 0
    ? Math.max(0, ((totalBudgetItems - overBudgetItems) / totalBudgetItems) * 100)
    : 100;
  const healthScore = Math.min(100, Math.max(0, Math.round(savingsRate * 1.8 + budgetHealth * 0.5)));

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryData, categorySpending, trends, transactions, budgets, goals] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getCategorySpending(),
        analyticsService.getMonthlyTrends(),
        transactionService.getAll(),
        budgetService.getAll(),
        savingsGoalService.getAll(),
      ]);
      setSummary(summaryData);
      setCategoryData(categorySpending);
      setMonthlyData(trends);
      setRecentTransactions(transactions.slice(0, 5));
      setTopBudgets(budgets.slice(0, 4));
      setSavingsGoals(goals.slice(0, 3));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.name || "User"}!</span> 👋 Here's your financial overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2 shadow-sm">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={() => navigate("/analytics")} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition flex items-center gap-2 shadow-md shadow-blue-500/20">
            <Sparkles size={16} /> View Insights
          </button>
        </div>
      </div>

      {/* Row 1: KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700 relative overflow-hidden flex flex-col justify-between h-40">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Savings Rate</p>
              <p className="text-3xl font-bold text-green-500">{savingsRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-400 mt-1">Net savings divided by income</p>
            </div>
            <Leaf className="text-green-500" size={24} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 opacity-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DUMMY_SPARKLINE}>
                <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700 relative overflow-hidden flex flex-col justify-between h-40">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Expense Ratio</p>
              <p className="text-3xl font-bold text-red-500">{expenseToIncome.toFixed(1)}%</p>
              <p className="text-xs text-gray-400 mt-1">Share of income currently spent</p>
            </div>
            <PieChartIcon className="text-red-500" size={24} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 opacity-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DUMMY_SPARKLINE}>
                <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700 relative overflow-hidden flex flex-col justify-between h-40">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Financial Health</p>
              <p className="text-3xl font-bold text-blue-500">{healthScore}/100</p>
              <p className="text-xs text-gray-400 mt-1">{healthScore >= 70 ? "You're in great shape!" : healthScore >= 40 ? "Room for improvement" : "Needs attention"}</p>
            </div>
            <Activity className="text-blue-500" size={24} />
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${healthScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Balance" value={`₹${(summary?.totalBalance || 0).toLocaleString()}`} icon={Wallet} color="primary" trend={`${recentTransactions.length} recent txns`} />
        <StatCard title="Total Income" value={`₹${totalIncome.toLocaleString()}`} icon={TrendingUp} color="success" trend="All time" />
        <StatCard title="Total Expenses" value={`₹${totalExpenses.toLocaleString()}`} icon={TrendingDown} color="danger" trend="All time" />
        <StatCard title="Savings Goals" value={`${summary?.savingsGoalsCount || 0}`} icon={Target} color="purple" trend={`${summary?.achievedGoals || 0} achieved`} />
      </div>

      {/* Row 3: Income / Expense / Net Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Income Overview</p>
              <p className="text-3xl font-bold text-green-500 mt-2">₹{totalIncome.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Total income</p>
            </div>
            <ArrowUpRight className="text-green-500" size={24} />
          </div>
          <div className="absolute bottom-0 left-4 right-4 h-20 opacity-30">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData.length > 0 ? monthlyData : DUMMY_SPARKLINE.map(d => ({ income: d.v }))}>
                <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expenses Overview</p>
              <p className="text-3xl font-bold text-red-500 mt-2">₹{totalExpenses.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Total expenses</p>
            </div>
            <ArrowDownRight className="text-red-500" size={24} />
          </div>
          <div className="absolute bottom-0 left-4 right-4 h-20 opacity-30">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData.length > 0 ? monthlyData : DUMMY_SPARKLINE.map(d => ({ expenses: d.v }))}>
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Net Savings</p>
              <p className={`text-3xl font-bold mt-2 ${netSavings >= 0 ? "text-blue-500" : "text-red-500"}`}>₹{Math.abs(netSavings).toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{netSavings >= 0 ? "Positive cash flow" : "Deficit"}</p>
            </div>
            <Activity className="text-blue-500" size={24} />
          </div>
          <div className="absolute bottom-0 left-4 right-4 h-20 opacity-30">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DUMMY_SPARKLINE}>
                <defs>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="url(#netGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Recent Transactions + Spending Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Recent Transactions</h3>
            <button onClick={() => navigate("/transactions")} className="text-xs text-blue-600 hover:underline font-medium">View All</button>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Wallet className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No transactions yet.</p>
              <button onClick={() => navigate("/transactions")} className="mt-3 text-xs text-blue-600 hover:underline">Add your first transaction →</button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${txn.type === "INCOME" ? "bg-green-500" : "bg-red-500"}`}>
                      {txn.type === "INCOME" ? "+" : "-"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{txn.category}</p>
                      <p className="text-xs text-gray-400">{txn.description || txn.merchant || "No description"} · {txn.transactionDate}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${txn.type === "INCOME" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {txn.type === "INCOME" ? "+" : "-"}₹{Number(txn.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Spending Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Spending by Category</h3>
            <PieChartIcon className="text-blue-500" size={18} />
          </div>
          {categoryData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
              <PieChartIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-400">No expense data yet</p>
            </div>
          ) : (
            <>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 space-y-2">
                {categoryData.slice(0, 4).map((cat, index) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="text-gray-600 dark:text-gray-400 truncate max-w-[100px]">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">₹{Number(cat.value).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 5: Budgets + Savings Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Budgets */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Active Budgets</h3>
            <button onClick={() => navigate("/budgets")} className="text-xs text-blue-600 hover:underline font-medium">Manage →</button>
          </div>
          {topBudgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Target className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-400">No budgets created yet.</p>
              <button onClick={() => navigate("/budgets")} className="mt-2 text-xs text-blue-600 hover:underline">Create a budget →</button>
            </div>
          ) : (
            <div className="space-y-4">
              {topBudgets.map((budget) => {
                const spent = Number(budget.spentAmount || 0);
                const total = Number(budget.amount || 1);
                const pct = Math.min((spent / total) * 100, 100);
                const isOver = pct >= 100;
                const isWarn = pct >= 80 && !isOver;
                return (
                  <div key={budget.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        {isOver ? <AlertCircle size={13} className="text-red-500" /> : isWarn ? <AlertCircle size={13} className="text-yellow-500" /> : <CheckCircle size={13} className="text-green-500" />}
                        {budget.category}
                      </span>
                      <span className="text-xs text-gray-400">₹{spent.toLocaleString()} / ₹{total.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div className={`h-2 rounded-full transition-all ${isOver ? "bg-red-500" : isWarn ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${pct}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 text-right">{pct.toFixed(1)}% used</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Savings Goals */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Savings Goals</h3>
            <button onClick={() => navigate("/savings")} className="text-xs text-blue-600 hover:underline font-medium">View All →</button>
          </div>
          {savingsGoals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Target className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-400">No savings goals yet.</p>
              <button onClick={() => navigate("/savings")} className="mt-2 text-xs text-blue-600 hover:underline">Add a savings goal →</button>
            </div>
          ) : (
            <div className="space-y-4">
              {savingsGoals.map((goal) => {
                const current = Number(goal.currentAmount || 0);
                const target = Number(goal.targetAmount || 1);
                const pct = Math.min((current / target) * 100, 100);
                const achieved = current >= target;
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        {achieved ? <CheckCircle size={13} className="text-green-500" /> : <Clock size={13} className="text-blue-400" />}
                        {goal.name || goal.goalName}
                      </span>
                      <span className="text-xs text-gray-400">₹{current.toLocaleString()} / ₹{target.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div className={`h-2 rounded-full transition-all ${achieved ? "bg-green-500" : "bg-blue-500"}`} style={{ width: `${pct}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 text-right">{pct.toFixed(1)}% of goal</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
