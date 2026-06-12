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
  Info,
  ArrowRight,
  MoreVertical
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

      const sortedCategories = (categories || [])
        .map((cat) => ({
          category: cat.category || cat.name || "Unknown",
          value: cat.value || cat.amount || 0,
        }))
        .sort((a, b) => b.value - a.value);

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

  const getFilteredData = () => {
    let filteredTrends = [...trendData];
    if (timeRange === "week") {
      filteredTrends = trendData.slice(-1);
    } else if (timeRange === "month") {
      filteredTrends = trendData.slice(-1);
    } else if (timeRange === "year") {
      filteredTrends = trendData.slice(-12);
    }
    return filteredTrends;
  };

  const filteredTrendData = getFilteredData();

  const calculateMetrics = () => {
    const totalIncome = filteredTrendData.reduce((sum, t) => sum + (t.income || 0), 0);
    const totalExpenses = filteredTrendData.reduce((sum, t) => sum + (t.expense || 0), 0);
    const totalTransactions = filteredTrendData.reduce((sum, t) => sum + (t.count || 0), 0);

    let daysInPeriod = 30;
    if (timeRange === "week") daysInPeriod = 7;
    else if (timeRange === "year") daysInPeriod = 365;

    const avgDailyExpense = totalExpenses / daysInPeriod;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    const displayTransactions = totalTransactions > 0 ? totalTransactions : summary?.totalTransactions || 0;

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
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `financial-analytics-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };



  const COLORS = [
    "#ec4899", // pink
    "#8b5cf6", // purple
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // orange
    "#06b6d4", // cyan
  ];

  const totalCategoryValue = categoryData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
           style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
            <BarChart3 className="h-5 w-5" style={{ color: "var(--color-text-secondary)" }} />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: "1.375rem" }}>Advanced Analytics</h1>
            <p className="page-subtitle">Deep insights into your financial patterns and trends</p>
          </div>
        </div>
        <button onClick={exportData} className="btn-secondary w-full md:w-auto flex items-center justify-center gap-2">
          <Download className="h-4 w-4" /> Export Data
        </button>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center">
        <div className="inline-flex rounded-xl p-1" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          {["week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                timeRange === range
                  ? "shadow-sm text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              style={timeRange === range
                ? { background: "#0F172A", color: "#fff" }
                : { color: "var(--color-text-secondary)" }
              }
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-300 dark:border-gray-600 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Daily Expense</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                ₹{Math.round(metrics.avgDailyExpense).toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>12.5% vs last week</span>
          </div>
          {/* Decorative background tint */}
          <div className="absolute inset-0 bg-blue-50/30 dark:bg-blue-900/10 pointer-events-none"></div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-300 dark:border-gray-600 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Savings Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {metrics.savingsRate.toFixed(1)}%
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#22c55e] flex items-center justify-center shadow-sm">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#16a34a] dark:text-green-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>5.3% vs last week</span>
          </div>
          <div className="absolute inset-0 bg-green-50/30 dark:bg-green-900/10 pointer-events-none"></div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-300 dark:border-gray-600 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {categoryData.length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f97316] flex items-center justify-center shadow-sm">
              <PieChartIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 dark:text-orange-400">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span>No change</span>
          </div>
          <div className="absolute inset-0 bg-orange-50/30 dark:bg-orange-900/10 pointer-events-none"></div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-300 dark:border-gray-600 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {metrics.totalTransactions}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#a855f7] flex items-center justify-center shadow-sm">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>2 vs last week</span>
          </div>
          <div className="absolute inset-0 bg-purple-50/30 dark:bg-purple-900/10 pointer-events-none"></div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Income vs Expenses */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-300 dark:border-gray-600">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" /> Total Income vs Expenses
            </h3>
            <button className="text-gray-600 hover:text-gray-600"><MoreVertical className="h-5 w-5" /></button>
          </div>
          
          <div className="h-[250px] relative">
            {metrics.totalIncome > 0 || metrics.totalExpenses > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Income", value: metrics.totalIncome },
                      { name: "Expenses", value: metrics.totalExpenses },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={100}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString()}`} 
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <div className="flex h-full items-center justify-center text-gray-600">No data available</div>
            )}
            
            {/* Custom Labels overlapping the chart if needed, or we rely on Tooltips. We will just add the legend below manually to match design */}
          </div>
          <div className="flex justify-center gap-8 mt-4">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#10b981]"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Income</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#ef4444]"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expenses</span>
             </div>
          </div>
        </div>

        {/* Category-wise Spending (Top Right Donut) */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-300 dark:border-gray-600">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-blue-600" /> Category-wise Spending
            </h3>
            <button className="text-gray-600 hover:text-gray-600"><MoreVertical className="h-5 w-5" /></button>
          </div>
          
          <div className="h-[250px] relative">
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `₹${value.toLocaleString()}`} 
                      contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text for largest category */}
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                   <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {((categoryData[0].value / totalCategoryValue) * 100).toFixed(0)}%
                   </span>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-600">No data available</div>
            )}
          </div>
          
          <div className="flex justify-center gap-6 mt-4 flex-wrap">
             {categoryData.slice(0,3).map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.category}</span>
                </div>
             ))}
          </div>
        </div>

        {/* Top 6 Categories */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-300 dark:border-gray-600">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-pink-500" /> Top Categories
            </h3>
            <button className="text-gray-600 hover:text-gray-600"><MoreVertical className="h-5 w-5" /></button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-full sm:w-1/2 h-[220px]">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `₹${value.toLocaleString()}`} 
                      contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-600">No data</div>
              )}
            </div>
            
            <div className="w-full sm:w-1/2 space-y-3">
              {categoryData.slice(0, 6).map((cat, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900 dark:text-gray-100">₹{cat.value.toLocaleString()}</span>
                    <span className="text-gray-700 w-8 text-right">{((cat.value / totalCategoryValue) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
             <button className="px-5 py-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition flex items-center gap-2">
                View All Categories <ArrowRight className="h-4 w-4" />
             </button>
          </div>
        </div>

        {/* Monthly Expense Distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-300 dark:border-gray-600">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" /> Monthly Expense Distribution
            </h3>
            <button className="text-gray-600 hover:text-gray-600"><MoreVertical className="h-5 w-5" /></button>
          </div>
          
          <div className="h-[260px] w-full">
            {trendData && trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} 
                    dy={10}
                    tickFormatter={(val) => val.substring(0,3)}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                    tickFormatter={(val) => `₹${val/1000}k`}
                  />
                  <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)', boxShadow: 'var(--shadow-card)' }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, "Expense"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorExpense)" 
                    activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-600">No trend data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4 flex items-center gap-3 text-blue-700 dark:text-blue-300">
        <Info className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium">
          All data is based on your transactions and budgets. Keep tracking to get more accurate insights!
        </p>
      </div>
    </div>
  );
}
