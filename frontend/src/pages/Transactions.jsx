import { useState, useEffect } from "react";
import { transactionService } from "../services/transactionService";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Plus,
  Upload,
  Edit,
  Trash2,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  DollarSign,
  X,
  SlidersHorizontal,
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
    } catch (error) {
      console.error("Error uploading receipt:", error);
      alert("Failed to upload receipt");
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    // Search filter
    const searchMatch =
      !searchQuery ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.merchant?.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    const typeMatch = !filters.type || t.type === filters.type;

    // Category filter
    const categoryMatch =
      !filters.category ||
      t.category?.toLowerCase().includes(filters.category.toLowerCase());

    // Date range filter
    const startDateMatch =
      !filters.startDate ||
      new Date(t.transactionDate) >= new Date(filters.startDate);
    const endDateMatch =
      !filters.endDate ||
      new Date(t.transactionDate) <= new Date(filters.endDate);

    // Amount range filter
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 shadow-lg backdrop-blur-sm">
        <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Transactions
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Track, filter, and manage your financial activity
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-4 py-2.5 font-semibold transition hover:opacity-90"
              >
                <Plus className="h-5 w-5" />
                Add Transaction
              </button>
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Upload className="h-5 w-5" />
                Upload Receipt
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 sm:p-6">
          <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
            <p className="text-xs uppercase tracking-wide text-green-700 dark:text-green-300 font-semibold">
              Total Income
            </p>
            <p className="mt-2 text-2xl font-bold text-green-700 dark:text-green-300">
              ₹{summary.income.toLocaleString()}
            </p>
            <p className="text-xs mt-1 text-green-700/80 dark:text-green-300/80">
              {summary.incomeCount} entries
            </p>
          </div>

          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-xs uppercase tracking-wide text-red-700 dark:text-red-300 font-semibold">
              Total Expenses
            </p>
            <p className="mt-2 text-2xl font-bold text-red-700 dark:text-red-300">
              ₹{summary.expense.toLocaleString()}
            </p>
            <p className="text-xs mt-1 text-red-700/80 dark:text-red-300/80">
              {summary.expenseCount} entries
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
            <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300 font-semibold">
              Net Balance
            </p>
            <p
              className={`mt-2 text-2xl font-bold ${
                net >= 0
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              ₹{net.toLocaleString()}
            </p>
            <p className="text-xs mt-1 text-blue-700/80 dark:text-blue-300/80">
              {filteredTransactions.length} filtered transactions
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by category, description, or merchant"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-11"
            />
            <DollarSign className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Advanced Filters"}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 dark:border-red-800 px-4 py-2.5 font-medium text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Transaction Type
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
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
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
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
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
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
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
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
                onChange={(e) =>
                  setFilters({ ...filters, minAmount: e.target.value })
                }
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
                onChange={(e) =>
                  setFilters({ ...filters, maxAmount: e.target.value })
                }
                className="input-field w-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`rounded-xl border p-4 sm:p-5 transition-all duration-200 hover:shadow-md ${
              transaction.type === "INCOME"
                ? "border-green-200 bg-green-50/70 dark:border-green-800 dark:bg-green-900/10"
                : "border-red-200 bg-red-50/70 dark:border-red-800 dark:bg-red-900/10"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div
                  className={`p-3 rounded-xl ${
                    transaction.type === "INCOME"
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  }`}
                >
                  {transaction.type === "INCOME" ? (
                    <ArrowUpCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDownCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 break-words">
                      {transaction.description || transaction.category}
                    </h3>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">
                      {transaction.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(
                        new Date(transaction.transactionDate),
                        "MMM dd, yyyy",
                      )}
                    </div>
                    {transaction.merchant && (
                      <div className="flex items-center">
                        <span className="font-medium">
                          {transaction.merchant}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div
                    className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                      transaction.type === "INCOME"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {transaction.type === "INCOME" ? "Income" : "Expense"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 lg:ml-4 self-end lg:self-auto">
                <button
                  onClick={() => handleEdit(transaction)}
                  className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  title="Edit"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="p-2.5 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-center py-16 bg-white dark:bg-gray-900">
            <DollarSign className="h-20 w-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              No transactions found
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              Add your first transaction to get started!
            </p>
          </div>
        )}
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
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="input-field"
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
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="input-field"
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
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="input-field"
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
                onChange={(e) =>
                  setFormData({ ...formData, transactionDate: e.target.value })
                }
                className="input-field"
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
              onChange={(e) =>
                setFormData({ ...formData, merchant: e.target.value })
              }
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="input-field"
              rows="3"
            />
          </div>

          {/* Recurring Transaction Fields */}
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
                    recurringFrequency: e.target.checked
                      ? formData.recurringFrequency
                      : "",
                  })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label
                htmlFor="isRecurring"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurringFrequency: e.target.value,
                    })
                  }
                  className="input-field"
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

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
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
            Upload a receipt image to automatically extract transaction details
            using OCR.
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="input-field"
          />
          <div className="flex justify-end">
            <button
              onClick={() => setShowUpload(false)}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
