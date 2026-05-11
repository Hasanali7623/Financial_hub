import { useState, useEffect } from "react";
import { analyticsService } from "../services/analyticsService";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  Download,
  Filter,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month"); // week, month, year
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [categories, trends, summaryData] = await Promise.all([
        analyticsService.getCategorySpending(),
        analyticsService.getMonthlyTrends(),
        analyticsService.getSummary(),
      ]);

      console.log("Analytics - Category Data:", categories);
      console.log("Analytics - Trend Data:", trends);
      console.log("Analytics - Summary Data:", summaryData);

      // Sort categories by value (highest first) and ensure data structure
      const sortedCategories = (categories || [])
        .map((cat) => ({
          category: cat.category || cat.name || "Unknown",
          value: cat.value || cat.amount || 0,
        }))
        .sort((a, b) => b.value - a.value);

      // Normalize trend data structure
      const normalizedTrends = (trends || []).map((trend) => ({
        month: trend.month || trend.name || "Unknown",
        income: trend.income || trend.totalIncome || 0,
        expense: trend.expense || trend.expenses || trend.totalExpenses || 0,
        count: trend.count || trend.transactionCount || 0,
      }));

      setCategoryData(sortedCategories);
      setTrendData(normalizedTrends);
      setSummary(summaryData);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on time range
  const getFilteredData = () => {
    const now = new Date();
    let filteredTrends = [...trendData];

    if (timeRange === "week") {
      // Show last 7 days of data
      filteredTrends = trendData.slice(-1);
    } else if (timeRange === "month") {
      // Show last 30 days / 1 month
      filteredTrends = trendData.slice(-1);
    } else if (timeRange === "year") {
      // Show last 12 months
      filteredTrends = trendData.slice(-12);
    }

    return filteredTrends;
  };

  const filteredTrendData = getFilteredData();

  // Calculate metrics based on filtered data
  const calculateMetrics = () => {
    const totalIncome = filteredTrendData.reduce(
      (sum, t) => sum + (t.income || 0),
      0,
    );
    const totalExpenses = filteredTrendData.reduce(
      (sum, t) => sum + (t.expense || 0),
      0,
    );
    const totalTransactions = filteredTrendData.reduce(
      (sum, t) => sum + (t.count || 0),
      0,
    );

    let daysInPeriod = 30; // default for month
    if (timeRange === "week") daysInPeriod = 7;
    else if (timeRange === "year") daysInPeriod = 365;

    const avgDailyExpense = totalExpenses / daysInPeriod;
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Use summary total transactions if filtered data doesn't have counts
    const displayTransactions =
      totalTransactions > 0
        ? totalTransactions
        : summary?.totalTransactions || 0;

    return {
      totalIncome,
      totalExpenses,
      totalTransactions: displayTransactions,
      avgDailyExpense,
      savingsRate,
    };
  };

  const metrics = calculateMetrics();

  const exportData = () => {
    const data = {
      summary,
      categoryData,
      trendData,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `financial-analytics-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
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
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3 text-gray-900 dark:text-gray-100">
              <BarChart3 className="h-8 w-8 text-gray-700 dark:text-gray-300" />
              Advanced Analytics
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Deep insights into your financial patterns and trends
            </p>
          </div>
          <button
            onClick={exportData}
            className="hidden md:inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Download className="h-5 w-5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-3">
        {["week", "month", "year"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              timeRange === range
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 shadow-md"
                : "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Avg Daily Expense
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹{Math.round(metrics.avgDailyExpense).toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Savings Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {metrics.savingsRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 border-2 border-orange-200 dark:border-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Categories
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {categoryData.length}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-xl">
              <PieChartIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {metrics.totalTransactions}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trend */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            Total Income vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Income", value: metrics.totalIncome },
                  { name: "Expenses", value: metrics.totalExpenses },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Comparison */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <PieChartIcon className="h-6 w-6 text-blue-600" />
            Category-wise Spending
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  percent > 0.05
                    ? `${name}: ${(percent * 100).toFixed(0)}%`
                    : ""
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="category"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      [
                        "#3b82f6",
                        "#10b981",
                        "#f59e0b",
                        "#ef4444",
                        "#8b5cf6",
                        "#ec4899",
                        "#06b6d4",
                        "#f97316",
                      ][index % 8]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Pattern */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <PieChartIcon className="h-6 w-6 text-pink-600" />
            Top 6 Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData.slice(0, 6)}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                nameKey="category"
                label={({ name }) => name}
              >
                {categoryData.slice(0, 6).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      [
                        "#ec4899",
                        "#8b5cf6",
                        "#3b82f6",
                        "#10b981",
                        "#f59e0b",
                        "#ef4444",
                      ][index % 6]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Distribution */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-green-600" />
            Monthly Expense Distribution
          </h3>
          {filteredTrendData &&
          filteredTrendData.length > 0 &&
          filteredTrendData.some((t) => t.expense > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredTrendData.filter((t) => t.expense > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  nameKey="month"
                  label={({ name, percent }) =>
                    percent > 0.05
                      ? `${name}: ${(percent * 100).toFixed(0)}%`
                      : ""
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="expense"
                >
                  {filteredTrendData
                    .filter((t) => t.expense > 0)
                    .map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [
                            "#10b981",
                            "#3b82f6",
                            "#8b5cf6",
                            "#ec4899",
                            "#f59e0b",
                            "#ef4444",
                            "#06b6d4",
                            "#f97316",
                            "#84cc16",
                            "#14b8a6",
                            "#f43f5e",
                            "#a855f7",
                          ][index % 12]
                        }
                      />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No expense data available</p>
                <p className="text-sm mt-1">
                  Add transactions to see the distribution
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Insights Section */}
      <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          💡 Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Highest Spending
            </p>
            <p className="text-lg font-bold text-purple-600">
              {categoryData[0]?.category || "N/A"}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ₹{(categoryData[0]?.value || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-green-200 dark:border-green-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Best Savings Month
            </p>
            <p className="text-lg font-bold text-green-600">
              {filteredTrendData.length > 0
                ? filteredTrendData.reduce(
                    (max, item) =>
                      (item.income || 0) - (item.expense || 0) >
                      (max.income || 0) - (max.expense || 0)
                        ? item
                        : max,
                    filteredTrendData[0],
                  ).month
                : "N/A"}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ₹
              {filteredTrendData.length > 0
                ? Math.max(
                    0,
                    ...filteredTrendData.map(
                      (t) => (t.income || 0) - (t.expense || 0),
                    ),
                  ).toLocaleString()
                : "0"}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Avg{" "}
              {timeRange === "week"
                ? "Weekly"
                : timeRange === "month"
                  ? "Monthly"
                  : "Yearly"}{" "}
              Spending
            </p>
            <p className="text-lg font-bold text-blue-600">
              Last {filteredTrendData.length || 0}{" "}
              {timeRange === "week"
                ? "Week(s)"
                : timeRange === "month"
                  ? "Month(s)"
                  : "Year(s)"}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ₹
              {(filteredTrendData.length > 0
                ? Math.round(metrics.totalExpenses / filteredTrendData.length)
                : 0
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
