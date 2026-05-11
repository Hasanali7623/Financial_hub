import { useState, useEffect } from "react";
import { analyticsService } from "../services/analyticsService";
import { transactionService } from "../services/transactionService";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  PieChart,
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

  useEffect(() => {
    loadData();
  }, [month, year]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [trans, sum] = await Promise.all([
        transactionService.getAll(),
        analyticsService.getSummary(),
      ]);
      console.log("Reports - Loaded transactions:", trans);
      console.log("Reports - Loaded summary:", sum);
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

  // Calculate filtered data first
  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.transactionDate);
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  });

  console.log(
    `Reports - Filtering for ${year}-${String(month).padStart(2, "0")}:`,
    filteredTransactions.length,
    "transactions",
  );

  const monthlyIncome = filteredTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const monthlyExpense = filteredTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const dataToExport =
      filteredTransactions.length > 0 ? filteredTransactions : transactions;

    // Format currency without rupee symbol for better PDF compatibility
    const formatAmount = (amount) => `Rs ${amount.toLocaleString("en-IN")}`;

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234);
    doc.text("Financial Health Report", 14, 22);

    // Add report period
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const periodText = new Date(year, month - 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    doc.text("Period: " + periodText, 14, 32);

    // Add summary section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Summary", 14, 45);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text("Total Income: " + formatAmount(monthlyIncome), 14, 55);
    doc.text("Total Expenses: " + formatAmount(monthlyExpense), 14, 62);
    doc.text(
      "Net Savings: " + formatAmount(monthlyIncome - monthlyExpense),
      14,
      69,
    );
    doc.text("Number of Transactions: " + dataToExport.length, 14, 76);

    // Add transactions table
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
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: 255,
        fontStyle: "bold",
        font: "helvetica",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        font: "helvetica",
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30, halign: "right" },
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      const footerText =
        "Generated on " +
        new Date().toLocaleDateString("en-US") +
        " - Page " +
        i +
        " of " +
        pageCount;
      doc.text(footerText, 14, doc.internal.pageSize.height - 10);
    }

    // Save the PDF
    doc.save(`financial-report-${year}-${String(month).padStart(2, "0")}.pdf`);
  };

  const exportToCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const dataToExport =
      filteredTransactions.length > 0 ? filteredTransactions : transactions;
    const rows = dataToExport.map((t) => [
      new Date(t.transactionDate).toLocaleDateString(),
      `"${t.description}"`,
      t.category,
      t.type,
      t.amount,
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    );

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `financial-report-${year}-${String(month).padStart(
      2,
      "0",
    )}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    const dataToExport =
      filteredTransactions.length > 0 ? filteredTransactions : transactions;
    const data = {
      report: {
        month,
        year,
        generatedAt: new Date().toISOString(),
        totalTransactions: dataToExport.length,
      },
      summary: {
        monthlyIncome,
        monthlyExpense,
        netSavings: monthlyIncome - monthlyExpense,
      },
      transactions: dataToExport,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `financial-report-${year}-${String(month).padStart(
      2,
      "0",
    )}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-hero">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
              <FileText className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-gray-700 dark:text-gray-300" />
              Financial Reports
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
              Generate and export comprehensive financial reports
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="category">Category Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2024, m - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {Array.from(
                { length: new Date().getFullYear() - 2020 + 2 },
                (_, i) => new Date().getFullYear() + 1 - i,
              ).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Export As
            </label>
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="flex-1 btn-secondary text-sm py-2"
                title="Export to CSV"
              >
                CSV
              </button>
              <button
                onClick={exportToJSON}
                className="flex-1 btn-secondary text-sm py-2"
                title="Export to JSON"
              >
                JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Total Income
            </h3>
            <div className="bg-green-500 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 break-words">
            ₹{monthlyIncome.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {filteredTransactions.filter((t) => t.type === "INCOME").length}{" "}
            transactions
          </p>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-2 border-red-200 dark:border-red-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Total Expenses
            </h3>
            <div className="bg-red-500 p-3 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 break-words">
            ₹{monthlyExpense.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {filteredTransactions.filter((t) => t.type === "EXPENSE").length}{" "}
            transactions
          </p>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Net Savings
            </h3>
            <div className="bg-blue-500 p-3 rounded-xl">
              <PieChart className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 break-words">
            ₹{(monthlyIncome - monthlyExpense).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {monthlyIncome > 0
              ? `${(
                  ((monthlyIncome - monthlyExpense) / monthlyIncome) *
                  100
                ).toFixed(1)}% savings rate`
              : "No income data"}
          </p>
        </div>
      </div>

      {/* Detailed Transactions Table */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Transaction Details
          </h3>
          <button
            onClick={generatePDFReport}
            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <p className="text-lg font-semibold mb-2">
                        No transactions found for{" "}
                        {new Date(year, month - 1).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm">
                        Total transactions available: {transactions.length}
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Try selecting a different month or year from the filters
                        above
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(
                        transaction.transactionDate,
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          transaction.type === "INCOME"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                      ₹{transaction.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
