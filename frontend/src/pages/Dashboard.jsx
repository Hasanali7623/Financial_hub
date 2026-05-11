import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analyticsService } from "../services/analyticsService";
import { transactionService } from "../services/transactionService";
import { budgetService } from "../services/budgetService";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart as PieChartIcon,
  Plus,
  Upload,
  Calendar,
  ArrowRight,
  Clock,
  RefreshCw,
  Gauge,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [topBudgets, setTopBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const totalIncome = summary?.totalIncome || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  const expenseToIncome =
    totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const topCategory = categoryData.length > 0 ? categoryData[0] : null;
  const totalBudgetItems = topBudgets.length;
  const overBudgetItems = topBudgets.filter(
    (budget) => ((budget.spentAmount || 0) / budget.amount) * 100 >= 100,
  ).length;
  const budgetHealth =
    totalBudgetItems > 0
      ? Math.max(
          0,
          ((totalBudgetItems - overBudgetItems) / totalBudgetItems) * 100,
        )
      : 100;
  const healthScore = Math.min(
    100,
    Math.max(0, Math.round(savingsRate * 1.8 + budgetHealth * 0.5)),
  );

  const loadData = async () => {
    try {
      const [summaryData, categorySpending, trends, transactions, budgets] =
        await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getCategorySpending(),
          analyticsService.getMonthlyTrends(),
          transactionService.getAll(),
          budgetService.getAll(),
        ]);

      setSummary(summaryData);
      setCategoryData(categorySpending);
      setMonthlyData(trends);
      setRecentTransactions(transactions.slice(0, 5)); // Get last 5 transactions
      setTopBudgets(budgets.slice(0, 3)); // Get top 3 budgets
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
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
      <div className="page-hero">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Welcome back! Here's your financial overview
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              Updated {new Date().toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
            <button
              onClick={loadData}
              className="btn-secondary w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="btn-primary w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4" />
              View Insights
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold">
              Savings Rate
            </p>
            <p
              className={`text-2xl font-bold mt-2 ${
                savingsRate >= 20
                  ? "text-green-600 dark:text-green-400"
                  : savingsRate >= 0
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-red-600 dark:text-red-400"
              }`}
            >
              {savingsRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Net savings divided by income
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold">
              Expense Ratio
            </p>
            <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
              {expenseToIncome.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Share of income currently spent
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold">
                Financial Health
              </p>
              <Gauge className="h-4 w-4 text-gray-500 dark:text-gray-300" />
            </div>
            <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
              {healthScore}/100
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-2 rounded-full ${
                  healthScore >= 70
                    ? "bg-green-600"
                    : healthScore >= 45
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={`₹${summary?.totalBalance?.toLocaleString() || 0}`}
          icon={DollarSign}
          color="primary"
          trend="+12% from last month"
        />
        <StatCard
          title="Total Income"
          value={`₹${summary?.totalIncome?.toLocaleString() || 0}`}
          icon={TrendingUp}
          color="success"
          trend="This month"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${summary?.totalExpenses?.toLocaleString() || 0}`}
          icon={TrendingDown}
          color="danger"
          trend="This month"
        />
        <StatCard
          title="Savings Goals"
          value={`${summary?.savingsGoalsCount || 0}`}
          icon={Target}
          color="black"
          trend={`${summary?.achievedGoals || 0} achieved`}
        />
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Comparison */}
        <div className="rounded-lg shadow-md p-6 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Income Overview
            </h3>
            <ArrowUpRight className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            ₹{summary?.totalIncome?.toLocaleString() || 0}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total income this period
          </p>
        </div>

        <div className="rounded-lg shadow-md p-6 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-300 dark:border-red-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Expenses Overview
            </h3>
            <ArrowDownRight className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
            ₹{summary?.totalExpenses?.toLocaleString() || 0}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total expenses this period
          </p>
        </div>

        <div className="rounded-lg shadow-md p-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Net Savings
            </h3>
            <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            ₹{netSavings.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {totalIncome > totalExpenses
              ? "Positive cash flow"
              : "Negative cash flow"}
          </p>
        </div>
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Top Spending Category
            </h3>
            <Wallet className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          {topCategory ? (
            <>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {topCategory.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ₹{topCategory.value.toLocaleString()} spent in this category
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add more transactions to see category insights.
            </p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Budget Compliance
            </h3>
            {overBudgetItems > 0 ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <Target className="h-4 w-4 text-green-600" />
            )}
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(budgetHealth)}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {overBudgetItems} of {totalBudgetItems} tracked budgets over limit
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Cash Position
            </h3>
            <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <p
            className={`text-xl font-bold ${
              netSavings >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            ₹{Math.abs(netSavings).toLocaleString()}{" "}
            {netSavings >= 0 ? "surplus" : "deficit"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Based on current period income and expenses
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Spending Pie Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Spending by Category
            </h2>
            <PieChartIcon className="h-5 w-5 text-gray-400" />
          </div>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {categoryData.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {item.name}: ₹{item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No expense data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Comparison Pie Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Income vs Expenses
            </h2>
            <PieChartIcon className="h-5 w-5 text-gray-400" />
          </div>
          {monthlyData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Total Income",
                        value: monthlyData.reduce(
                          (sum, m) => sum + m.income,
                          0,
                        ),
                      },
                      {
                        name: "Total Expenses",
                        value: monthlyData.reduce(
                          (sum, m) => sum + m.expenses,
                          0,
                        ),
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name.split(" ")[1]}: ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Total Income
                    </span>
                  </div>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    ₹
                    {monthlyData
                      .reduce((sum, m) => sum + m.income, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Total Expenses
                    </span>
                  </div>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                    ₹
                    {monthlyData
                      .reduce((sum, m) => sum + m.expenses, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No monthly data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions & Budget Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Clock className="h-5 w-5 text-black dark:text-white" />
              Recent Transactions
            </h2>
            <button
              onClick={() => navigate("/transactions")}
              className="text-sm text-black dark:text-white hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === "INCOME"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}
                    >
                      {transaction.type === "INCOME" ? (
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.category} •{" "}
                        {new Date(
                          transaction.transactionDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-bold ${
                      transaction.type === "INCOME"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No transactions yet</p>
              <button
                onClick={() => navigate("/transactions")}
                className="mt-4 text-black dark:text-white hover:underline"
              >
                Add your first transaction
              </button>
            </div>
          )}
        </div>

        {/* Budget Progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Budget Progress
            </h2>
            <button
              onClick={() => navigate("/budgets")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {topBudgets.length > 0 ? (
            <div className="space-y-4">
              {topBudgets.map((budget) => {
                const percentage =
                  ((budget.spentAmount || 0) / budget.amount) * 100;
                const isWarning = percentage >= 80 && percentage < 100;
                const isOver = percentage >= 100;
                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {budget.category}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ₹{(budget.spentAmount || 0).toLocaleString()} / ₹
                        {budget.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          isOver
                            ? "bg-red-600"
                            : isWarning
                              ? "bg-yellow-600"
                              : "bg-green-600"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-medium ${
                          isOver
                            ? "text-red-600 dark:text-red-400"
                            : isWarning
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        {percentage.toFixed(1)}% used
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        ₹
                        {(
                          budget.amount - (budget.spentAmount || 0)
                        ).toLocaleString()}{" "}
                        left
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No budgets set</p>
              <button
                onClick={() => navigate("/budgets")}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Create your first budget
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg shadow-md p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900/20 dark:to-gray-800/20 border-2 border-gray-300 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5 text-black dark:text-white" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/transactions")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="bg-gradient-to-r from-gray-800 to-black p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              Add Transaction
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Record income or expense
            </p>
          </button>
          <button
            onClick={() => navigate("/transactions")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              Upload Receipt
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Scan and add automatically
            </p>
          </button>
          <button
            onClick={() => navigate("/budgets")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-green-200 dark:border-green-700 hover:border-green-500 dark:hover:border-green-500 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              Set Budget
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Control your spending
            </p>
          </button>
          <button
            onClick={() => navigate("/savings")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-orange-200 dark:border-orange-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              Create Goal
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Save for your future
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
