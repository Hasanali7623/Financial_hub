import { useState } from "react";
import { analyticsService } from "../services/analyticsService";
import { ArrowRightLeft } from "lucide-react";

const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "CHF"];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConvert = async (e) => {
    setError(null);
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      const response = await analyticsService.convertCurrency(
        parseFloat(amount),
        fromCurrency,
        toCurrency,
      );
      setResult(response);
    } catch (error) {
      console.error("Error converting currency:", error);
      alert("Failed to convert currency. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="page-hero text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <ArrowRightLeft className="h-8 w-8 text-gray-700 dark:text-gray-300" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          💱 Currency Converter
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Real-time exchange rates for instant currency conversion
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleConvert} className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field text-2xl font-bold"
              placeholder="0.00"
              required
            />
          </div>

          {/* From Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="input-field"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={swapCurrencies}
              className="p-4 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-110 hover:rotate-180 shadow-sm"
            >
              <ArrowRightLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="input-field"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {/* Result */}
          {result && result.convertedAmount && (
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-teal-200 dark:from-green-900 dark:to-teal-900 blur-2xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl p-8 text-center shadow-2xl border-4 border-white/20">
                <p className="text-sm font-semibold opacity-90 mb-3">
                  💰 Converted Amount
                </p>
                <p className="text-5xl font-bold mb-2">
                  {Number(result.convertedAmount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xl font-semibold opacity-90">{toCurrency}</p>

                <div className="mt-6 pt-6 border-t border-white/30">
                  <p className="text-sm opacity-90">
                    {amount} {fromCurrency} ≈{" "}
                    {Number(result.convertedAmount).toFixed(2)} {toCurrency}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 rounded-xl p-4 text-red-800 dark:text-red-200 text-center">
              {error}
            </div>
          )}

          {/* Convert Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-5 rounded-xl text-lg font-bold shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "🔄 Converting..." : "✨ Convert Currency"}
          </button>
        </form>
      </div>

      {/* Info Card */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Real-time Exchange Rates
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Exchange rates are updated in real-time from reliable financial
              data sources. Rates may vary slightly from actual bank rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
