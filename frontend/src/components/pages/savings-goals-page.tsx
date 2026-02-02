import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getGoals, updateGoal, deleteGoal } from "@/lib/api";
import type { Goal } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SavingsGoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [adjustmentAmount, setAdjustmentAmount] = useState("");
    const [activeTab, setActiveTab] = useState("deposit");

    // Close menu when clicking outside
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpenId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            const data = await getGoals();
            setGoals(data);
        } catch (error) {
            console.error("Failed to load goals:", error);
            toast.error("Failed to load goals");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (goal: Goal) => {
        setEditingGoal(goal);
        setAdjustmentAmount("");
        setActiveTab("deposit");
        setMenuOpenId(null);
    };

    const handleSaveEdit = async () => {
        if (!editingGoal) return;

        const amount = parseFloat(adjustmentAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid positive amount");
            return;
        }

        let newTotal = editingGoal.current_amount;
        if (activeTab === "deposit") {
            newTotal += amount;
        } else {
            newTotal -= amount;
            if (newTotal < 0) newTotal = 0; // Prevent negative savings
        }

        try {
            await updateGoal(editingGoal.id, { current_amount: newTotal });
            toast.success(activeTab === "deposit" ? "Deposit successful!" : "Withdrawal successful!");
            setEditingGoal(null);
            loadGoals();
        } catch (error) {
            console.error("Failed to update goal:", error);
            toast.error("Failed to update goal");
        }
    };

    const handleDeleteClick = async (id: string) => {
        if (!confirm("Are you sure you want to delete this goal?")) return;

        try {
            await deleteGoal(id);
            toast.success("Goal deleted successfully");
            loadGoals();
        } catch (error) {
            console.error("Failed to delete goal:", error);
            toast.error("Failed to delete goal");
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
    const goalsReached = goals.filter(g => g.current_amount >= g.target_amount).length;

    return (
        <div className="p-8 space-y-6 relative">
            {/* Edit Modal Overlay */}
            {editingGoal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
                        <CardHeader>
                            <CardTitle>Update Balance</CardTitle>
                            <CardDescription>
                                Current Balance: <span className="font-bold text-foreground">${editingGoal.current_amount.toLocaleString()}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Tabs defaultValue="deposit" value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="deposit">Deposit (+)</TabsTrigger>
                                    <TabsTrigger value="withdraw">Withdraw (-)</TabsTrigger>
                                </TabsList>
                                <TabsContent value="deposit" className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="deposit-amount">Amount to Deposit</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                            <Input
                                                id="deposit-amount"
                                                type="number"
                                                placeholder="0.00"
                                                className="pl-7"
                                                value={adjustmentAmount}
                                                onChange={(e) => setAdjustmentAmount(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            New Balance will be: <span className="font-bold">${(editingGoal.current_amount + (parseFloat(adjustmentAmount) || 0)).toLocaleString()}</span>
                                        </p>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button variant="outline" onClick={() => setEditingGoal(null)}>Cancel</Button>
                                        <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700 text-white">Confirm Deposit</Button>
                                    </div>
                                </TabsContent>
                                <TabsContent value="withdraw" className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="withdraw-amount">Amount to Withdraw</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                            <Input
                                                id="withdraw-amount"
                                                type="number"
                                                placeholder="0.00"
                                                className="pl-7"
                                                value={adjustmentAmount}
                                                onChange={(e) => setAdjustmentAmount(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            New Balance will be: <span className="font-bold">${Math.max(0, editingGoal.current_amount - (parseFloat(adjustmentAmount) || 0)).toLocaleString()}</span>
                                        </p>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button variant="outline" onClick={() => setEditingGoal(null)}>Cancel</Button>
                                        <Button onClick={handleSaveEdit} variant="destructive">Confirm Withdraw</Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mono-text uppercase">Savings & Goals</h1>
                    <p className="text-slate-500 text-sm mt-1">Track your progress towards financial freedom</p>
                </div>
                <Link
                    to="/savings-goals/new"
                    className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add New Goal
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Total Saved</h3>
                    </div>
                    <p className="text-3xl font-bold mono-text">${totalSaved.toLocaleString()}</p>
                    <p className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        Active
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                            <span className="material-symbols-outlined">calendar_today</span>
                        </div>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Active Goals</h3>
                    </div>
                    <p className="text-3xl font-bold mono-text">{goals.length}</p>
                    <p className="text-xs text-slate-400 font-bold mt-2">
                        Tracking
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                            <span className="material-symbols-outlined">flag</span>
                        </div>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Goals Reached</h3>
                    </div>
                    <p className="text-3xl font-bold mono-text">{goalsReached} / {goals.length}</p>
                    <p className="text-xs text-slate-400 font-bold mt-2">
                        Keep up the momentum!
                    </p>
                </div>
            </div>

            <h2 className="text-xl font-bold tracking-tight">Active Goals</h2>
            {goals.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <p>No goals yet. Create one to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                    {goals.map((goal) => (
                        <div key={goal.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${goal.color} bg-opacity-10 flex items-center justify-center text-primary`}>
                                        <span className={`material-symbols-outlined ${goal.color.replace('bg-', 'text-')}`}>{goal.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{goal.name}</h3>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Target: ${goal.target_amount.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuOpenId(menuOpenId === goal.id ? null : goal.id);
                                        }}
                                        className="text-slate-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>

                                    {menuOpenId === goal.id && (
                                        <div ref={menuRef} className="absolute right-0 top-8 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                            <button
                                                onClick={() => handleEditClick(goal)}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-base">edit</span>
                                                Edit Amount
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(goal.id)}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                                Delete Goal
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-2xl font-bold mono-text">${goal.current_amount.toLocaleString()}</span>
                                    <span className="text-xs font-bold text-slate-500">{Math.round((goal.current_amount / goal.target_amount) * 100)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${goal.color} rounded-full transition-all duration-1000`}
                                        style={{ width: `${Math.min(100, (goal.current_amount / goal.target_amount) * 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400 font-medium uppercase tracking-wider pt-2">
                                    <span>Last contribution: Just now</span>
                                    <span>${Math.max(0, goal.target_amount - goal.current_amount).toLocaleString()} to go</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
