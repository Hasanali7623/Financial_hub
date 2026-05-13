import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analyticsService } from "../services/analyticsService";
import { transactionService } from "../services/transactionService";
import { budgetService } from "../services/budgetService";
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
  ArrowDownRight
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
  Area
} from "recharts";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];
const DUMMY_SPARKLINE = [{v:10},{v:15},{v:12},{v:20},{v:18},{v:25},{v:30}];
const DUMMY_BARS = [{v:10},{v:15},{v:8},{v:20},{v:14},{v:25},{v:22},{v:30},{v:18},{v:35}];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const expenseToIncome = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  
  const topCategory = categoryData.length > 0 ? categoryData[0] : null;
  const totalBudgetItems = topBudgets.length;
  const overBudgetItems = topBudgets.filter(
    (b) => ((b.spentAmount || 0) / b.amount) * 100 >= 100
  ).length;
  const budgetHealth = totalBudgetItems > 0 
    ? Math.max(0, ((totalBudgetItems - overBudgetItems) / totalBudgetItems) * 100) 
    : 100;
  const healthScore = Math.min(100, Math.max(0, Math.round(savingsRate * 1.8 + budgetHealth * 0.5)));

  const loadData = async () => {
    try {
      const [summaryData, categorySpending, trends, transactions, budgets] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getCategorySpending(),
        analyticsService.getMonthlyTrends(),
        transactionService.getAll(),
        budgetService.getAll(),
      ]);
      setSummary(summaryData);
      setCategoryData(categorySpending);
      setMonthlyData(trends);
      setRecentTransactions(transactions.slice(0, 5));
      setTopBudgets(budgets.slice(0, 3));
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.name || "User"}!</span> 👋 <br/>
            Here's your financial overview
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
              <p className="text-xs text-gray-400 mt-1">You're in great shape!</p>
            </div>
            <Activity className="text-blue-500" size={24} />
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${healthScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Colored Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={`₹${summary?.totalBalance?.toLocaleString() || 0}`}
          icon={Wallet}
          color="primary"
          trend="+12% from last month"
        />
        <StatCard
          title="Total Income"
          value={`₹${totalIncome.toLocaleString()}`}
          icon={TrendingUp}
          color="success"
          trend="This month"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString()}`}
          icon={TrendingDown}
          color="danger"
          trend="This month"
        />
        <StatCard
          title="Savings Goals"
          value={`${summary?.savingsGoalsCount || 0}`}
          icon={Target}
          color="purple"
          trend={`${summary?.achievedGoals || 0} achieved`}
        />
      </div>

      {/* Row 3: Overview Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Income Overview</p>
              <p className="text-3xl font-bold text-green-500 mt-2">₹{totalIncome.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Total income this period</p>
            </div>
            <ArrowUpRight className="text-green-500" size={24} />
          </div>
          <div className="absolute bottom-0 left-4 right-4 h-20 opacity-30">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DUMMY_BARS}>
                <Bar dataKey="v" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expenses Overview</p>
              <p className="text-3xl font-bold text-red-500 mt-2">₹{totalExpenses.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Total expenses this period</p>
            </div>
            <ArrowDownRight className="text-red-500" size={24} />
          </div>
          <div className="absolute bottom-0 left-4 right-4 h-20 opacity-30">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DUMMY_BARS}>
                <Bar dataKey="v" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Net Savings</p>
              <p className="text-3xl font-bold text-blue-500 mt-2">₹{netSavings.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Positive cash flow</p>
            </div>
            <Activity className="text-blue-500" size={24} />
          </div>
          <div className="absolute bottom-0 left-4 right-4 h-20 opacity-30">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DUMMY_BARS}>
                <Bar dataKey="v" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Spending Category */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Top Spending Category</h3>
            <Wallet className="text-blue-600" size={20} />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <div className="w-32 h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.length > 0 ? categoryData : [{name: 'Empty', value: 1}]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.length > 0 ? categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    )) : <Cell fill="#e5e7eb" />}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 ml-4">
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{topCategory?.name || "None"}</p>
              <p className="text-sm text-gray-500 mt-1">₹{topCategory?.value?.toLocaleString() || 0} spent</p>
              <p className="text-xs text-gray-400 mt-1">
                {totalExpenses > 0 && topCategory ? Math.round((topCategory.value / totalExpenses) * 100) : 0}% of total expenses
              </p>
            </div>
          </div>
        </div>

        {/* Budget Compliance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Budget Compliance</h3>
            <Target className="text-green-500" size={20} />
          </div>
          <div className="flex-1 flex items-center justify-between">
             <div className="w-32 h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{value: budgetHealth}, {value: 100 - budgetHealth}]}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#e5e7eb" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{Math.round(budgetHealth)}%</span>
              </div>
            </div>
            <div className="flex-1 ml-4">
               <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{overBudgetItems} of {totalBudgetItems}</p>
               <p className="text-sm text-gray-500 mt-1">tracked budgets</p>
               <p className="text-xs text-gray-400 mt-1">over limit</p>
            </div>
          </div>
        </div>

        {/* Cash Position */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-64 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cash Position</h3>
              <p className={`text-2xl font-bold mt-2 ${netSavings >= 0 ? "text-green-500" : "text-red-500"}`}>
                ₹{Math.abs(netSavings).toLocaleString()} {netSavings >= 0 ? "surplus" : "deficit"}
              </p>
              <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Based on current period income and expenses</p>
            </div>
            <Activity className="text-gray-400" size={20} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DUMMY_SPARKLINE}>
                <defs>
                  <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorCash)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
