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
  Clock,
  CalendarClock,
  Plus,
  Upload,
  Bell,
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
  const [upcomingBills, setUpcomingBills] = useState([]);
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
      const [summaryData, categorySpending, trends, transactions, budgets, goals, bills] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getCategorySpending(),
        analyticsService.getMonthlyTrends(),
        transactionService.getAll(),
        budgetService.getAll(),
        savingsGoalService.getAll(),
        transactionService.getUpcomingRecurring().catch(() => []),
      ]);
      setSummary(summaryData);
      setCategoryData(categorySpending);
      setMonthlyData(trends);
      setRecentTransactions(transactions.slice(0, 5));
      setTopBudgets(budgets.slice(0, 4));
      setSavingsGoals(goals.slice(0, 3));
      setUpcomingBills(bills);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back,{" "}
            <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
              {user?.name || "User"}
            </span>{" "}
            👋 Here's your financial overview
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button
            onClick={() => navigate("/analytics")}
            className="btn-primary flex items-center gap-2"
          >
            <Sparkles size={15} /> View Insights
          </button>
        </div>
      </div>

      {/* ── Row 1: KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Savings Rate */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
            minHeight: "10rem",
          }}
        >
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <p className="section-label mb-1.5">Savings Rate</p>
              <p className="text-3xl font-extrabold text-emerald-500 tracking-tight">{savingsRate.toFixed(1)}%</p>
              <p className="text-xs mt-1.5" style={{ color: "var(--color-text-muted)" }}>Net savings ÷ income</p>
            </div>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
              <Leaf className="text-emerald-500" size={20} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-14 opacity-30 z-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DUMMY_SPARKLINE}>
                <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Ratio */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
            minHeight: "10rem",
          }}
        >
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <p className="section-label mb-1.5">Expense Ratio</p>
              <p className="text-3xl font-extrabold text-rose-500 tracking-tight">{expenseToIncome.toFixed(1)}%</p>
              <p className="text-xs mt-1.5" style={{ color: "var(--color-text-muted)" }}>Share of income spent</p>
            </div>
            <div className="p-2.5 bg-rose-50 dark:bg-rose-900/30 rounded-xl">
              <PieChartIcon className="text-rose-500" size={20} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-14 opacity-30 z-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DUMMY_SPARKLINE}>
                <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Health */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
            minHeight: "10rem",
          }}
        >
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <p className="section-label mb-1.5">Financial Health</p>
              <p className="text-3xl font-extrabold text-blue-500 tracking-tight">{healthScore}<span className="text-lg font-semibold text-slate-600">/100</span></p>
              <p className="text-xs mt-1.5" style={{ color: "var(--color-text-muted)" }}>
                {healthScore >= 70 ? "You're in great shape! 🎉" : healthScore >= 40 ? "Room for improvement" : "Needs attention"}
              </p>
            </div>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <Activity className="text-blue-500" size={20} />
            </div>
          </div>
          <div className="absolute bottom-5 left-5 right-5 z-10">
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: 6, background: "var(--color-border)" }}
            >
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Balance"  value={`₹${(summary?.totalBalance || 0).toLocaleString()}`}   icon={Wallet}     color="primary" trend={`${recentTransactions.length} recent transactions`} />
        <StatCard title="Total Income"   value={`₹${totalIncome.toLocaleString()}`}                     icon={TrendingUp}  color="success" trend="All time" />
        <StatCard title="Total Expenses" value={`₹${totalExpenses.toLocaleString()}`}                   icon={TrendingDown} color="danger"  trend="All time" />
        <StatCard title="Savings Goals"  value={`${summary?.savingsGoalsCount || 0}`}                   icon={Target}      color="purple" trend={`${summary?.achievedGoals || 0} achieved`} />
      </div>

      {/* ── Row 3: Income / Expense / Net Overview ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          {
            label: "Income Overview",
            value: `₹${totalIncome.toLocaleString()}`,
            sub: "Total income",
            color: "#22c55e",
            icon: <ArrowUpRight className="text-emerald-500" size={20} />,
            iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
            dataKey: "income",
            chartColor: "#22c55e",
          },
          {
            label: "Expenses Overview",
            value: `₹${totalExpenses.toLocaleString()}`,
            sub: "Total expenses",
            color: "#ef4444",
            icon: <ArrowDownRight className="text-rose-500" size={20} />,
            iconBg: "bg-rose-50 dark:bg-rose-900/30",
            dataKey: "expenses",
            chartColor: "#ef4444",
          },
          {
            label: "Net Savings",
            value: `₹${Math.abs(netSavings).toLocaleString()}`,
            sub: netSavings >= 0 ? "Positive cash flow" : "Deficit",
            color: netSavings >= 0 ? "#3b82f6" : "#ef4444",
            icon: <Activity className="text-blue-500" size={20} />,
            iconBg: "bg-blue-50 dark:bg-blue-900/30",
            dataKey: "v",
            chartColor: "#3b82f6",
          },
        ].map(({ label, value, sub, color, icon, iconBg, dataKey, chartColor }, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
              minHeight: "12rem",
            }}
          >
            <div className="flex justify-between items-start z-10 relative">
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>{label}</p>
                <p className="text-2xl font-extrabold tracking-tight" style={{ color }}>{value}</p>
                <p className="text-xs mt-1.5" style={{ color: "var(--color-text-muted)" }}>{sub}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${iconBg}`}>{icon}</div>
            </div>
            <div className="absolute bottom-0 left-4 right-4 h-16 opacity-25 z-0">
              <ResponsiveContainer width="100%" height="100%">
                {idx < 2 ? (
                  <BarChart data={monthlyData.length > 0 ? monthlyData : DUMMY_SPARKLINE.map(d => ({ [dataKey]: d.v }))}>
                    <Bar dataKey={dataKey} fill={chartColor} radius={[3, 3, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={DUMMY_SPARKLINE}>
                    <defs>
                      <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="url(#netGrad)" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 4: Recent Transactions + Spending Pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Transactions */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
              Recent Transactions
            </h3>
            <button
              onClick={() => navigate("/transactions")}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
            >
              View All →
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-3">
                <Wallet className="h-7 w-7" style={{ color: "var(--color-text-muted)" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>No transactions yet.</p>
              <button
                onClick={() => navigate("/transactions")}
                className="mt-3 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Add your first transaction →
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-3.5 rounded-xl transition-all duration-150 hover:shadow-sm cursor-default"
                  style={{
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                        txn.type === "INCOME"
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                      }`}
                    >
                      {txn.type === "INCOME" ? "+" : "−"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
                        {txn.category}
                      </p>
                      <p className="text-xs truncate mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                        {txn.description || txn.merchant || "No description"} · {txn.transactionDate}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-bold shrink-0 ml-3 ${
                      txn.type === "INCOME"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {txn.type === "INCOME" ? "+" : "−"}₹{Number(txn.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Spending by Category */}
        <div
          className="rounded-2xl p-5 flex flex-col"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
              Spending by Category
            </h3>
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <PieChartIcon className="text-blue-500" size={16} />
            </div>
          </div>

          {categoryData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-2">
                <PieChartIcon className="h-6 w-6" style={{ color: "var(--color-text-muted)" }} />
              </div>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>No expense data yet</p>
            </div>
          ) : (
            <>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={42} outerRadius={66} dataKey="value" stroke="none">
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => `₹${Number(v).toLocaleString()}`}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--color-border)",
                        background: "var(--color-surface)",
                        color: "var(--color-text-primary)",
                        fontSize: 12,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2.5">
                {categoryData.slice(0, 4).map((cat, index) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: COLORS[index % COLORS.length] }}
                      />
                      <span className="truncate max-w-[100px] font-medium" style={{ color: "var(--color-text-secondary)" }}>
                        {cat.name}
                      </span>
                    </div>
                    <span className="font-semibold shrink-0" style={{ color: "var(--color-text-primary)" }}>
                      ₹{Number(cat.value).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Row 5: Upcoming Bills + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Upcoming Bills Widget */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
              <CalendarClock size={16} className="text-orange-500" />
              Upcoming Bills
            </h3>
            <button
              onClick={() => navigate("/transactions")}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
            >
              View All →
            </button>
          </div>

          {upcomingBills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-2">
                <Bell className="h-6 w-6" style={{ color: "var(--color-text-muted)" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>No upcoming bills</p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>No recurring payments due in the next 3 days</p>
              <button
                onClick={() => navigate("/transactions")}
                className="mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Add recurring transaction →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBills.map((bill) => {
                const dueDate = new Date(bill.nextDueDate);
                const today = new Date();
                today.setHours(0,0,0,0);
                dueDate.setHours(0,0,0,0);
                const daysUntilDue = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));
                const isUrgent = daysUntilDue <= 1;
                const urgentBg = isUrgent
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
                return (
                  <div
                    key={bill.id}
                    className={`flex items-center justify-between p-3 rounded-xl border ${urgentBg} transition-all`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${isUrgent ? "bg-red-500" : "bg-orange-500"}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
                          {bill.description || bill.merchant || bill.category}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                          {bill.category} · {bill.recurringFrequency}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className={`text-sm font-bold ${isUrgent ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"}`}>
                        ₹{Number(bill.amount).toLocaleString()}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                        {daysUntilDue === 0 ? "Today" : daysUntilDue === 1 ? "Tomorrow" : `In ${daysUntilDue} days`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Add Transaction",
                icon: Plus,
                gradient: "from-purple-500 to-pink-500",
                path: "/transactions",
              },
              {
                label: "Upload Receipt",
                icon: Upload,
                gradient: "from-blue-500 to-cyan-500",
                path: "/transactions",
              },
              {
                label: "Set Budget",
                icon: Target,
                gradient: "from-green-500 to-emerald-500",
                path: "/budgets",
              },
              {
                label: "Create Goal",
                icon: Sparkles,
                gradient: "from-orange-500 to-red-500",
                path: "/savings",
              },
            ].map(({ label, icon: Icon, gradient, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-200 hover:scale-[1.03] hover:shadow-lg bg-gradient-to-br ${gradient}`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon className="h-6 w-6 text-white mb-2 transition-transform group-hover:scale-110" />
                <p className="text-xs font-bold text-white leading-tight">{label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 5: Budgets + Savings Goals ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Active Budgets */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>Active Budgets</h3>
            <button
              onClick={() => navigate("/budgets")}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
            >
              Manage →
            </button>
          </div>

          {topBudgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-2">
                <Target className="h-6 w-6" style={{ color: "var(--color-text-muted)" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>No budgets created yet.</p>
              <button onClick={() => navigate("/budgets")} className="mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                Create a budget →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {topBudgets.map((budget) => {
                const spent = Number(budget.spentAmount || 0);
                const total = Number(budget.amount || 1);
                const pct = Math.min((spent / total) * 100, 100);
                const isOver = pct >= 100;
                const isWarn = pct >= 80 && !isOver;
                const barColor = isOver ? "#ef4444" : isWarn ? "#f59e0b" : "#22c55e";
                return (
                  <div key={budget.id}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "var(--color-text-primary)" }}>
                        {isOver ? (
                          <AlertCircle size={13} className="text-rose-500" />
                        ) : isWarn ? (
                          <AlertCircle size={13} className="text-amber-500" />
                        ) : (
                          <CheckCircle size={13} className="text-emerald-500" />
                        )}
                        {budget.category}
                      </span>
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        ₹{spent.toLocaleString()} / ₹{total.toLocaleString()}
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-bar"
                        style={{ width: `${pct}%`, background: barColor }}
                      />
                    </div>
                    <p className="text-[11px] mt-1 text-right" style={{ color: "var(--color-text-muted)" }}>
                      {pct.toFixed(1)}% used
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Savings Goals */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>Savings Goals</h3>
            <button
              onClick={() => navigate("/savings")}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
            >
              View All →
            </button>
          </div>

          {savingsGoals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-2">
                <Target className="h-6 w-6" style={{ color: "var(--color-text-muted)" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>No savings goals yet.</p>
              <button onClick={() => navigate("/savings")} className="mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                Add a savings goal →
              </button>
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
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "var(--color-text-primary)" }}>
                        {achieved ? (
                          <CheckCircle size={13} className="text-emerald-500" />
                        ) : (
                          <Clock size={13} className="text-blue-400" />
                        )}
                        {goal.name || goal.goalName}
                      </span>
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        ₹{current.toLocaleString()} / ₹{target.toLocaleString()}
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-bar"
                        style={{ width: `${pct}%`, background: achieved ? "#22c55e" : "#6366f1" }}
                      />
                    </div>
                    <p className="text-[11px] mt-1 text-right" style={{ color: "var(--color-text-muted)" }}>
                      {pct.toFixed(1)}% of goal
                    </p>
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
