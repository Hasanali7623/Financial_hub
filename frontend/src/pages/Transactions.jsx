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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
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
    setFormError("");
    setIsSubmitting(true);
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
      setFormError(error.response?.data?.message || "Failed to save transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
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
    setFormError("");
    setIsSubmitting(false);
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
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Track, filter, and manage your financial activity</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button onClick={() => setShowModal(true)} className="btn-dark flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Transaction
          </button>
          <button onClick={() => setShowUpload(true)} className="btn-secondary flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload Receipt
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Income", value: `₹${summary.income.toLocaleString()}`, sub: `${summary.incomeCount} entries`, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-900/40", icon: <Wallet className="h-5 w-5 text-emerald-500" /> },
          { label: "Total Expenses", value: `₹${summary.expense.toLocaleString()}`, sub: `${summary.expenseCount} entries`, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-100 dark:border-rose-900/40", icon: <ArrowDownRight className="h-5 w-5 text-rose-500" /> },
          { label: "Net Balance", value: `₹${net.toLocaleString()}`, sub: `${filteredTransactions.length} filtered transactions`, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-100 dark:border-blue-900/40", icon: <Wallet className="h-5 w-5 text-blue-500" /> },
        ].map(({ label, value, sub, color, bg, border, icon }) => (
          <div key={label} className={`rounded-2xl border ${border} ${bg} p-5 flex justify-between items-center`}>
            <div>
              <p className="section-label mb-1.5">{label}</p>
              <p className={`text-2xl font-extrabold tracking-tight ${color}`}>{value}</p>
              <p className="text-xs mt-1.5" style={{ color: "var(--color-text-muted)" }}>{sub}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border" style={{ borderColor: "var(--color-border)" }}>
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-center w-full">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
          <input
            type="text"
            placeholder="Search by category, description, or merchant…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full pl-10"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary w-full md:w-auto flex items-center gap-2 ${showFilters ? "ring-2 ring-primary-400" : ""}`}
        >
          <Settings2 className="h-4 w-4" /> Advanced Filters
        </button>
      </div>

      {showFilters && (
        <div className="p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
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
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => {
          const isIncome = transaction.type === "INCOME";
          return (
            <div
              key={transaction.id}
              className="rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-150 hover:shadow-md"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isIncome ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400"}`}>
                  {isIncome ? <ArrowUpCircle size={19} /> : <ArrowDownCircle size={19} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
                      {transaction.description || transaction.category}
                    </p>
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full" style={{ background: "var(--color-bg)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
                      {transaction.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                    <Calendar size={12} />{" "}
                    {format(new Date(transaction.transactionDate), "MMM dd, yyyy")}
                  </div>
                </div>
              </div>

              <div className="flex items-center w-full md:w-auto justify-between md:justify-end gap-4 ml-14 md:ml-0">
                <div className="text-left md:text-right">
                  <p className={`text-base font-bold ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {isIncome ? "+" : "−"}₹{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                    {isIncome ? "Income" : "Expense"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleEdit(transaction)} className="p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700" style={{ color: "var(--color-text-secondary)" }} title="Edit">
                    <Edit size={15} />
                  </button>
                  <button onClick={() => handleDelete(transaction.id)} className="p-2 rounded-lg transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3" style={{ background: "var(--color-bg)" }}>
              <Wallet className="h-7 w-7" style={{ color: "var(--color-text-muted)" }} />
            </div>
            <p className="text-base font-semibold" style={{ color: "var(--color-text-secondary)" }}>No transactions found</p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* Bottom Feature Banner */}
      <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(16,185,129,0.04) 100%)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <SlidersHorizontal size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Smart Filtering</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
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
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
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
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
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
          {formError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
              {formError}
            </div>
          )}
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

          <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
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

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
            <button type="button" onClick={handleCloseModal} className="btn-secondary" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : editingTransaction ? "Update Transaction" : "Add Transaction"}
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
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Upload a receipt image to automatically extract transaction details using OCR.
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-2"
          />
          <div className="flex justify-end gap-3 mt-4 border-t border-gray-300 dark:border-gray-600 pt-4">
            <button onClick={() => setShowUpload(false)} className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition">
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
