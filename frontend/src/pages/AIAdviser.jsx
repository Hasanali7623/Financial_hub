import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  Brain,
  TrendingUp,
  DollarSign,
  PiggyBank,
  Target,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import api from "../services/api";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

// Quick suggestions for common questions
const quickSuggestions = [
  {
    icon: DollarSign,
    text: "How to save money?",
    gradient: "from-green-400 to-emerald-600",
  },
  {
    icon: TrendingUp,
    text: "Investment tips for beginners",
    gradient: "from-blue-400 to-indigo-600",
  },
  {
    icon: PiggyBank,
    text: "Best budgeting strategies",
    gradient: "from-purple-400 to-pink-600",
  },
  {
    icon: Target,
    text: "How to set financial goals?",
    gradient: "from-orange-400 to-red-600",
  },
];

export default function AIAdviser() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Financial Adviser powered by Google Gemini. Ask me anything about personal finance, investments, budgeting, savings, or money management!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [financialData, setFinancialData] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch user's financial data
    const fetchFinancialData = async () => {
      try {
        const [transactions, budgets, goals] = await Promise.all([
          api.get("/transactions"),
          api.get("/budgets"),
          api.get("/goals"),
        ]);

        setFinancialData({
          transactions: transactions.data.data || [],
          budgets: budgets.data.data || [],
          goals: goals.data.data || [],
        });
      } catch (error) {
        console.error("Error fetching financial data:", error);
        // Set empty data on error so AI can still work
        setFinancialData({
          transactions: [],
          budgets: [],
          goals: [],
        });
      }
    };

    fetchFinancialData();
  }, []);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);

    // Add empty assistant message for streaming
    const assistantMsgIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      // Prepare financial context
      let contextMessage = message;
      if (financialData) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const monthlyTransactions = financialData.transactions.filter((t) => {
          const tDate = new Date(t.transactionDate);
          return (
            tDate.getMonth() + 1 === currentMonth &&
            tDate.getFullYear() === currentYear
          );
        });

        const totalIncome = monthlyTransactions
          .filter((t) => t.type === "INCOME")
          .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = monthlyTransactions
          .filter((t) => t.type === "EXPENSE")
          .reduce((sum, t) => sum + t.amount, 0);

        const context = `\n\nUser's Financial Data Context:\n- Total transactions this month: ${
          monthlyTransactions.length
        }\n- Total income this month: Rs ${totalIncome.toLocaleString()}\n- Total expenses this month: Rs ${totalExpenses.toLocaleString()}\n- Active budgets: ${
          financialData.budgets.length
        }\n- Savings goals: ${
          financialData.goals.length
        }\n\nUse this data to provide personalized advice. Answer the user's question directly based on their actual financial data.`;

        contextMessage = message + context;
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction:
          "You are a financial adviser with access to the user's financial data. Give SHORT, CONCISE answers (3-5 sentences max). Be direct and to the point. Use the provided financial data to give personalized advice. Only provide essential information without lengthy explanations.",
      });

      const result = await model.generateContentStream(contextMessage);
      let fullText = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;

        // Update the assistant message with streaming text
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[assistantMsgIndex] = {
            role: "assistant",
            content: fullText,
          };
          return newMessages;
        });
      }

      if (!fullText) {
        throw new Error("No response from AI");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[assistantMsgIndex] = {
          role: "assistant",
          content: `Error: ${err.message}. Please try again.`,
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="page-hero mb-6">
        <div>
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 dark:text-gray-200" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                AI Financial Adviser
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Powered by Google Gemini AI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Quick Questions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickSuggestions.map((suggestion, idx) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={idx}
                  onClick={() => sendMessage(suggestion.text)}
                  className={`group flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r ${suggestion.gradient} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                >
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{suggestion.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 mb-4 h-[75vh] sm:h-[600px] min-h-[460px] flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex animate-fade-in ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-3xl px-4 sm:px-5 py-3 sm:py-4 shadow-lg transform transition-all duration-300 hover:scale-[1.02] ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white shadow-blue-500/50"
                    : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100 shadow-gray-300/50 dark:shadow-gray-900/50"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 rounded-lg">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      AI Financial Adviser
                    </span>
                  </div>
                )}
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {msg.content.split("\n").map((line, i) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return null;

                    // Handle bullet points (*, -, •)
                    if (/^[\*\-•]\s+/.test(trimmedLine)) {
                      return (
                        <li key={i} className="ml-4 mb-1">
                          {trimmedLine.replace(/^[\*\-•]\s+/, "")}
                        </li>
                      );
                    }

                    // Handle bold text **text**
                    const boldText = trimmedLine.replace(
                      /\*\*(.+?)\*\*/g,
                      "<strong>$1</strong>",
                    );

                    return (
                      <p
                        key={i}
                        className="mb-2 leading-relaxed last:mb-0"
                        dangerouslySetInnerHTML={{ __html: boldText }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl px-6 py-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400 relative" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="border-t-2 border-gradient-to-r from-blue-500 to-purple-500 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm p-5"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about finance..."
              className="flex-1 px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-inner transition-all duration-300"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              <Send className="h-5 w-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
