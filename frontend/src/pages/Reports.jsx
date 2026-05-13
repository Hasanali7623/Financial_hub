import { useState, useEffect, useRef } from "react";
import { analyticsService } from "../services/analyticsService";
import { transactionService } from "../services/transactionService";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  FileJson,
  FileSpreadsheet,
  List,
  MoreVertical,
  Info,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [reportType, setReportType] = useState("summary"); // summary, detailed, category
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [month, year]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [trans, sum] = await Promise.all([
        transactionService.getAll(),
        analyticsService.getSummary(),
      ]);
      setTransactions(trans);
      setSummary(sum);
    } catch (error) {
      console.error("Error loading report data:", error);
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

  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.transactionDate);
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  });

  const incomeTransactions = filteredTransactions.filter((t) => t.type === "INCOME");
  const expenseTransactions = filteredTransactions.filter((t) => t.type === "EXPENSE");

  const monthlyIncome = incomeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const monthlyExpense = expenseTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const netSavings = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? ((netSavings / monthlyIncome) * 100).toFixed(1) : "0.0";

  const generatePDFReport = () => {
    setShowExportMenu(false);
    const doc = new jsPDF();
    const dataToExport = filteredTransactions.length > 0 ? filteredTransactions : transactions;
    const formatAmount = (amount) => `Rs ${amount.toLocaleString("en-IN")}`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234);
    doc.text("Financial Health Report", 14, 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const periodText = new Date(year, month - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    doc.text("Period: " + periodText, 14, 32);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Summary", 14, 45);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text("Total Income: " + formatAmount(monthlyIncome), 14, 55);
    doc.text("Total Expenses: " + formatAmount(monthlyExpense), 14, 62);
    doc.text("Net Savings: " + formatAmount(netSavings), 14, 69);
    doc.text("Number of Transactions: " + dataToExport.length, 14, 76);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Transaction Details", 14, 90);

    const tableData = dataToExport.map((t) => [
      new Date(t.transactionDate).toLocaleDateString("en-US"),
      t.description || t.merchant || "-",
      t.category,
      t.type,
      formatAmount(t.amount),
    ]);

    doc.autoTable({
      startY: 95,
      head: [["Date", "Description", "Category", "Type", "Amount"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [102, 126, 234], textColor: 255, fontStyle: "bold", font: "helvetica" },
      styles: { fontSize: 9, cellPadding: 3, font: "helvetica" },
      columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 50 }, 2: { cellWidth: 30 }, 3: { cellWidth: 25 }, 4: { cellWidth: 30, halign: "right" } },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      const footerText = "Generated on " + new Date().toLocaleDateString("en-US") + " - Page " + i + " of " + pageCount;
      doc.text(footerText, 14, doc.internal.pageSize.height - 10);
    }
    doc.save(`financial-report-${year}-${String(month).padStart(2, "0")}.pdf`);
  };

  const exportToCSV = () => {
    setShowExportMenu(false);
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const dataToExport = filteredTransactions.length > 0 ? filteredTransactions : transactions;
    const rows = dataToExport.map((t) => [
      new Date(t.transactionDate).toLocaleDateString(),
      `"${t.description || t.merchant || "-"}"`,
      t.category,
      t.type,
      t.amount,
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `financial-report-${year}-${String(month).padStart(2, "0")}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    setShowExportMenu(false);
    const dataToExport = filteredTransactions.length > 0 ? filteredTransactions : transactions;
    const data = {
      report: { month, year, generatedAt: new Date().toISOString(), totalTransactions: dataToExport.length },
      summary: { monthlyIncome, monthlyExpense, netSavings },
      transactions: dataToExport,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `financial-report-${year}-${String(month).padStart(2, "0")}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-indigo-800 shrink-0">
            <FileText className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Financial Reports
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Generate and export comprehensive financial reports
            </p>
          </div>
        </div>
        <div className="relative" ref={exportMenuRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="w-full md:w-auto px-5 py-2.5 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 rounded-xl font-medium transition hover:bg-indigo-50 dark:hover:bg-indigo-900/20 shadow-sm flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" /> Export Data <ChevronDown className="h-4 w-4" />
          </button>
          
          {showExportMenu && (
             <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-20">
                <button onClick={generatePDFReport} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                   <FileText className="h-4 w-4" /> Export as PDF
                </button>
                <button onClick={exportToCSV} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                   <FileSpreadsheet className="h-4 w-4" /> Export as CSV
                </button>
                <button onClick={exportToJSON} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                   <FileJson className="h-4 w-4" /> Export as JSON
                </button>
             </div>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 text-sm font-medium appearance-none outline-none"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="category">Category Report</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 text-sm font-medium appearance-none outline-none"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2024, m - 1).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 text-sm font-medium appearance-none outline-none"
            >
              {Array.from(
                { length: new Date().getFullYear() - 2020 + 2 },
                (_, i) => new Date().getFullYear() + 1 - i
              ).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
              Export As
            </label>
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" /> CSV
              </button>
              <button
                onClick={exportToJSON}
                className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
              >
                <FileJson className="h-4 w-4" /> JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="bg-[#f0fdf4] dark:bg-green-900/10 rounded-2xl p-6 shadow-sm border border-green-100 dark:border-green-900/50 relative overflow-hidden">
          {/* Subtle Background Wave Element */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-green-200/40 dark:bg-green-800/20 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200">Total Income</p>
              <p className="text-3xl font-bold text-[#16a34a] dark:text-green-400 mt-2">
                ₹{monthlyIncome.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {incomeTransactions.length} transactions
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#22c55e] flex items-center justify-center shadow-sm">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/50 text-[#16a34a] dark:text-green-400 text-xs font-bold relative z-10">
            <TrendingUp className="h-3.5 w-3.5" /> 12.5% vs last month
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-[#fef2f2] dark:bg-red-900/10 rounded-2xl p-6 shadow-sm border border-red-100 dark:border-red-900/50 relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-red-200/40 dark:bg-red-800/20 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200">Total Expenses</p>
              <p className="text-3xl font-bold text-[#dc2626] dark:text-red-400 mt-2">
                ₹{monthlyExpense.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {expenseTransactions.length} transactions
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#ef4444] flex items-center justify-center shadow-sm">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/50 text-[#dc2626] dark:text-red-400 text-xs font-bold relative z-10">
            <TrendingDown className="h-3.5 w-3.5" /> 8.2% vs last month
          </div>
        </div>

        {/* Net Savings */}
        <div className="bg-[#eff6ff] dark:bg-blue-900/10 rounded-2xl p-6 shadow-sm border border-blue-100 dark:border-blue-900/50 relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-200/40 dark:bg-blue-800/20 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200">Net Savings</p>
              <p className="text-3xl font-bold text-[#2563eb] dark:text-blue-400 mt-2">
                ₹{netSavings.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {savingsRate}% savings rate
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#3b82f6] flex items-center justify-center shadow-sm">
              <PieChart className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#2563eb] dark:text-blue-400 text-xs font-bold relative z-10">
            <TrendingUp className="h-3.5 w-3.5" /> 20.3% vs last month
          </div>
        </div>
      </div>

      {/* Transaction Details Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
              <List className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Transaction Details
            </h3>
          </div>
          <button
            onClick={generatePDFReport}
            className="px-5 py-2.5 bg-[#0f172a] text-white rounded-xl font-medium shadow-sm hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Amount
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <p className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      No transactions found for {new Date(year, month - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                    <p className="text-sm text-gray-400">Try selecting a different month or year</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => {
                  const isIncome = transaction.type === "INCOME";
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                        {new Date(transaction.transactionDate).toLocaleDateString("en-US", { day: "numeric", month: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {transaction.description || transaction.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          isIncome 
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" 
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                        isIncome ? "text-[#16a34a] dark:text-green-400" : "text-[#dc2626] dark:text-red-400"
                      }`}>
                        ₹{transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                           <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
            <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
            All reports are generated based on your transactions and budgets.<br className="hidden sm:block"/>Data is secure and confidential.
          </p>
        </div>
        
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center relative z-10 shrink-0">
           <ShieldCheck className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
           <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-300 rounded-full"></div>
           <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-indigo-200 rounded-full"></div>
        </div>
        
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 to-transparent dark:from-indigo-900/10 pointer-events-none"></div>
      </div>
    </div>
  );
}
