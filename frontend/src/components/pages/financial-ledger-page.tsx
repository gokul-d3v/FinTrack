import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTransactions, type Transaction, getBudgetOverview, type BudgetOverviewResponse, createBudgetCategory } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FinancialLedgerPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgetData, setBudgetData] = useState<BudgetOverviewResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Budget Modal State
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [newBudget, setNewBudget] = useState({ name: "", limit: "", icon: "Tag", color: "blue" });

    const fetchData = async () => {
        try {
            const [txData, bData] = await Promise.all([
                getTransactions(),
                getBudgetOverview()
            ]);
            setTransactions(txData);
            setBudgetData(bData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateBudget = async () => {
        if (!newBudget.name || !newBudget.limit) {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            await createBudgetCategory({
                name: newBudget.name,
                limit: parseFloat(newBudget.limit),
                icon: newBudget.icon,
                color: newBudget.color
            });
            toast.success("Budget category created!");
            setIsBudgetModalOpen(false);

        } catch (error) {
            console.error(error);
            toast.error("Failed to create budget");
        }
    };

    const filteredTransactions = transactions.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mono-text uppercase">Financial Ledger</h1>
                    <p className="text-slate-500 text-sm mt-1">Detailed transaction history with active budget tracking</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors text-sm font-medium">
                        <span className="material-symbols-outlined text-lg">file_download</span>
                        Export
                    </button>

                    <Link to="/budget" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-900 dark:text-slate-100">
                        <span className="material-symbols-outlined text-lg">pie_chart</span>
                        Manage Budget
                    </Link>

                    <Link to="/add-transaction" className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add Transaction
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Monthly Budget Card - Now Dynamic */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-primary">account_balance_wallet</span>
                    </div>
                    <div className="flex items-center justify-between mb-2 relative z-10">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Budget</span>
                        <span className={`text-xs font-bold ${budgetData && budgetData.percentageUsed >= 100 ? 'text-red-500' : 'text-green-500'}`}>
                            {budgetData ? `${(100 - budgetData.percentageUsed).toFixed(1)}% Left` : 'Loading...'}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2 relative z-10">
                        <span className="text-2xl font-bold mono-text">
                            {budgetData ? budgetData.remaining.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00'}
                        </span>
                        <span className="text-xs text-slate-400">
                            / {budgetData ? budgetData.totalBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00'}
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden relative z-10">
                        <div
                            className={`h-full transition-all duration-500 ${budgetData && budgetData.percentageUsed > 100 ? 'bg-red-500' : 'bg-primary'}`}
                            style={{ width: `${Math.min(budgetData?.percentageUsed || 0, 100)}%` }}
                        ></div>
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-slate-400 font-medium relative z-10">
                        <span>Spent: {budgetData ? budgetData.spentSoFar.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00'}</span>
                        <span>{new Date().toLocaleString('default', { month: 'long' })}</span>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="flex-1 relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 ring-primary/20"
                            placeholder="Filter by merchant, category, tag or goal..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-slate-500">tune</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex gap-4">
                        <button className="px-3 py-1 text-xs font-bold bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 rounded-lg">All</button>
                        <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">Income</button>
                        <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">Expenses</button>
                    </div>
                    <div className="flex gap-2">
                        <select className="text-xs font-bold bg-transparent border-none focus:ring-0 text-slate-500 cursor-pointer">
                            <option>Date: Newest first</option>
                            <option>Amount: High to Low</option>
                            <option>Amount: Low to High</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left border-b border-slate-100 dark:border-slate-800">
                                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction</th>
                                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tags / Goals</th>
                                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">Loading transactions...</td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">No transactions found.</td>
                                </tr>
                            ) : (
                                filteredTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    <span className="material-symbols-outlined text-lg">
                                                        {t.type === 'income' ? 'payments' : 'shopping_cart'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{t.description}</p>
                                                    <p className="text-[10px] text-slate-400 mono-text">{t.id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-bold uppercase text-slate-500">{t.category}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs font-medium text-slate-500">{new Date(t.date).toLocaleDateString()}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-1">
                                                <span className="px-2 py-0.5 border border-slate-200 dark:border-slate-700 text-slate-400 rounded-full text-[9px] font-bold uppercase">Personal</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className={`text-sm font-bold mono-text ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                                {t.type === 'income' ? '+' : ''}{t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
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
