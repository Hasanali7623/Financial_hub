import api from "./api";

export const analyticsService = {
  getSummary: async () => {
    try {
      const [transResponse, goalsResponse] = await Promise.all([
        api.get("/transactions"),
        api.get("/goals"),
      ]);

      const transactions = transResponse.data.data || [];
      const goals = goalsResponse.data.data || [];

      // Calculate summary from transactions
      const income = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const expenses = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      // Count achieved goals (where current >= target)
      const achievedGoals = goals.filter(
        (g) => (g.currentAmount || 0) >= (g.targetAmount || 0)
      ).length;

      return {
        totalBalance: income - expenses,
        totalIncome: income,
        totalExpenses: expenses,
        savingsGoalsCount: goals.length,
        achievedGoals: achievedGoals,
        totalTransactions: transactions.length,
      };
    } catch (error) {
      console.error("Error fetching summary:", error);
      return {
        totalBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        savingsGoalsCount: 0,
        achievedGoals: 0,
        totalTransactions: 0,
      };
    }
  },

  getCategorySpending: async () => {
    try {
      const response = await api.get("/transactions");
      const transactions = response.data.data || [];

      // Group by category
      const categoryMap = {};
      transactions
        .filter((t) => t.type === "EXPENSE")
        .forEach((t) => {
          const category = t.category || "Other";
          categoryMap[category] =
            (categoryMap[category] || 0) + (t.amount || 0);
        });

      return Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value,
      }));
    } catch (error) {
      return [];
    }
  },

  getMonthlyTrends: async () => {
    try {
      const response = await api.get("/transactions");
      const transactions = response.data.data || [];

      // Group by month and year
      const monthMap = {};
      transactions.forEach((t) => {
        const date = new Date(t.transactionDate || t.date);
        const year = date.getFullYear();
        const monthNum = date.getMonth(); // 0-11
        const monthName = date.toLocaleString("default", { month: "short" });
        const key = `${year}-${monthNum.toString().padStart(2, "0")}`;

        if (!monthMap[key]) {
          monthMap[key] = {
            month: monthName,
            income: 0,
            expenses: 0,
            sortKey: `${year}-${monthNum.toString().padStart(2, "0")}`,
          };
        }

        if (t.type === "INCOME") {
          monthMap[key].income += t.amount || 0;
        } else {
          monthMap[key].expenses += t.amount || 0;
        }
      });

      // Sort by date and return last 6 months
      return Object.values(monthMap)
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
        .slice(-6)
        .map(({ month, income, expenses }) => ({
          month,
          income: Math.round(income),
          expenses: Math.round(expenses),
        }));
    } catch (error) {
      return [];
    }
  },

  getAIAdvice: async (prompt) => {
    const response = await api.post("/ml/advice", { query: prompt });
    return response.data.data;
  },

  convertCurrency: async (amount, from, to) => {
    const response = await api.get("/currency/convert", {
      params: { amount, from, to },
    });
    // Backend returns BigDecimal, wrap it in an object for consistency
    return {
      convertedAmount: response.data.data,
      fromCurrency: from,
      toCurrency: to,
      originalAmount: amount,
    };
  },
};
