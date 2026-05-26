import { useState, useEffect } from "react";
import { transactionService } from "../services/transactionService";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Plus,
  Upload,
  Edit,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  X,
  SlidersHorizontal,
  ArrowDownRight,
  Wallet,
  ShieldCheck,
  FileText,
  Settings2,
  Search
} from "lucide-react";
import { format } from "date-fns";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    type: "EXPENSE",
    description: "",
    transactionDate: new Date().toISOString().split("T")[0],
    merchant: "",
    paymentMethod: "CASH",
    isRecurring: false,
    recurringFrequency: "",
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await transactionService.update(editingTransaction.id, formData);
      } else {
        await transactionService.create(formData);
      }
      loadTransactions();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.delete(id);
        loadTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      description: transaction.description || "",
      transactionDate: transaction.transactionDate,
      merchant: transaction.merchant || "",
      paymentMethod: transaction.paymentMethod || "CASH",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setFormData({
      amount: "",
      category: "",
      type: "EXPENSE",
      description: "",
      transactionDate: new Date().toISOString().split("T")[0],
      merchant: "",
      paymentMethod: "CASH",
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await transactionService.uploadReceipt(file);
      alert("Receipt uploaded successfully! Check OCR logs for details.");
      setShowUpload(false);
      loadTransactions();
    } catch (error) {
      console.error("Error uploading receipt:", error);
      alert("Failed to upload receipt");
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const searchMatch =
      !searchQuery ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.merchant?.toLowerCase().includes(searchQuery.toLowerCase());

    const typeMatch = !filters.type || t.type === filters.type;
    const categoryMatch =
      !filters.category ||
      t.category?.toLowerCase().includes(filters.category.toLowerCase());
    const startDateMatch =
      !filters.startDate ||
      new Date(t.transactionDate) >= new Date(filters.startDate);
    const endDateMatch =
      !filters.endDate ||
      new Date(t.transactionDate) <= new Date(filters.endDate);
    const minAmountMatch =
      !filters.minAmount || t.amount >= parseFloat(filters.minAmount);
    const maxAmountMatch =
      !filters.maxAmount || t.amount <= parseFloat(filters.maxAmount);

    return (
      searchMatch &&
      typeMatch &&
      categoryMatch &&
      startDateMatch &&
      endDateMatch &&
      minAmountMatch &&
      maxAmountMatch
    );
  });

  const clearFilters = () => {
    setFilters({
      type: "",
      category: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
    setSearchQuery("");
  };

  const hasActiveFilters =
    filters.type ||
    filters.category ||
    filters.startDate ||
    filters.endDate ||
    filters.minAmount ||
    filters.maxAmount ||
    searchQuery;

  const summary = filteredTransactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount) || 0;
      if (transaction.type === "INCOME") {
        acc.income += amount;
        acc.incomeCount += 1;
      } else {
        acc.expense += amount;
        acc.expenseCount += 1;
      }
      return acc;
    },
    { income: 0, expense: 0, incomeCount: 0, expenseCount: 0 },
  );

  const net = summary.income - summary.expense;



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Transactions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track, filter, and manage your financial activity
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e293b] text-white px-5 py-2.5 font-medium transition hover:bg-slate-800 shadow-sm"
          >
            <Plus className="h-5 w-5" /> Add Transaction
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-2.5 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
          >
            <Upload className="h-5 w-5" /> Upload Receipt
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-green-100 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10 p-6 flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1">
              Total Income
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ₹{summary.income.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {summary.incomeCount} entries
            </p>
          </div>
          <div className="w-12 h-12 rounded-full border border-green-200 dark:border-green-800 flex items-center justify-center bg-white dark:bg-gray-800 z-10 shadow-sm">
            <Wallet className="h-5 w-5 text-green-500" />
          </div>
        </div>

        <div className="rounded-2xl border border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 p-6 flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
              Total Expenses
            </p>
            <p className="text-3xl font-bold text-red-500">
              ₹{summary.expense.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {summary.expenseCount} entries
            </p>
          </div>
          <div className="w-12 h-12 rounded-full border border-red-200 dark:border-red-800 flex items-center justify-center bg-white dark:bg-gray-800 z-10 shadow-sm">
            <ArrowDownRight className="h-5 w-5 text-red-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-[#f4f7fc] dark:bg-blue-900/10 p-6 flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400 mb-1">
              Net Balance
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              ₹{net.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredTransactions.length} filtered transactions
            </p>
          </div>
          <div className="w-12 h-12 rounded-full border border-blue-200 dark:border-blue-800 flex items-center justify-center bg-white dark:bg-gray-800 z-10 shadow-sm">
            <Wallet className="h-5 w-5 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by category, description, or merchant"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-800 dark:text-gray-200"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full md:w-auto px-6 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 transition shadow-sm whitespace-nowrap"
        >
          <Settings2 className="h-5 w-5" /> Advanced Filters
        </button>
      </div>

      {showFilters && (
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Transaction Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input-field w-full"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g., Food, Transport"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Min Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={filters.minAmount}
              onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Max Amount
            </label>
            <input
              type="number"
              placeholder="10000.00"
              value={filters.maxAmount}
              onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
              className="input-field w-full"
            />
          </div>
          
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end mt-2">
            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 dark:border-red-800 px-4 py-2 font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => {
          const isIncome = transaction.type === "INCOME";
          return (
            <div
              key={transaction.id}
              className={`rounded-2xl border ${
                isIncome
                  ? "border-green-100 bg-green-50/50 dark:border-green-900/50 dark:bg-green-900/10"
                  : "border-red-100 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10"
              } p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-sm`}
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center bg-white dark:bg-gray-800 ${
                    isIncome
                      ? "border-green-500 text-green-600"
                      : "border-red-500 text-red-500"
                  }`}
                >
                  {isIncome ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {transaction.description || transaction.category}
                    </p>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-800 text-white dark:bg-gray-700">
                      {transaction.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                    <Calendar size={14} />{" "}
                    {format(new Date(transaction.transactionDate), "MMM dd, yyyy")}
                  </div>
                </div>
              </div>

              <div className="flex items-center w-full md:w-auto justify-between md:justify-end gap-6 ml-14 md:ml-0">
                <div className="text-left md:text-right">
                  <p
                    className={`text-lg sm:text-xl font-bold ${
                      isIncome ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {isIncome ? "Income" : "Expense"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition bg-white/50 dark:bg-gray-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-2 rounded-lg border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition bg-white/50 dark:bg-gray-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <Wallet className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              No transactions found
            </p>
          </div>
        )}
      </div>

      {/* Bottom Feature Banner */}
      <div className="mt-8 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-gray-100 dark:border-gray-700 p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <SlidersHorizontal size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Smart Filtering</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Find transactions instantly with advanced filters
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Easy Management</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Add, edit, and delete transactions with clicks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Secure & Private</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your financial data is encrypted and protected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Transaction Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field w-full"
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-field w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.transactionDate}
                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                className="input-field w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Merchant
            </label>
            <input
              type="text"
              value={formData.merchant}
              onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field w-full"
              rows="3"
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isRecurring: e.target.checked,
                    recurringFrequency: e.target.checked ? formData.recurringFrequency : "",
                  })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                This is a recurring transaction
              </label>
            </div>

            {formData.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  value={formData.recurringFrequency}
                  onChange={(e) => setFormData({ ...formData, recurringFrequency: e.target.value })}
                  className="input-field w-full"
                  required={formData.isRecurring}
                >
                  <option value="">Select frequency</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
              {editingTransaction ? "Update" : "Add"} Transaction
            </button>
          </div>
        </form>
      </Modal>

      {/* Upload Receipt Modal */}
      <Modal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        title="Upload Receipt"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload a receipt image to automatically extract transaction details using OCR.
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-2"
          />
          <div className="flex justify-end gap-3 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <button onClick={() => setShowUpload(false)} className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition">
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
