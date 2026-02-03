import { useState, useEffect } from "react";
import { getBudgetOverview, createBudgetCategory, updateBudgetCategory, deleteBudgetCategory, type BudgetOverviewResponse, type CategoryStatus } from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BudgetPage() {
    const [budgetData, setBudgetData] = useState<BudgetOverviewResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", limit: "", icon: "Tag", color: "blue" });

    const fetchBudgets = async () => {
        try {
            const data = await getBudgetOverview();
            setBudgetData(data);
        } catch (error) {
            console.error("Failed to fetch budgets:", error);
            toast.error("Failed to load budgets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData({ name: "", limit: "", icon: "Tag", color: "blue" });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (category: CategoryStatus) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            limit: category.limit.toString(),
            icon: category.icon,
            color: category.iconBg.split('-')[1] || "blue"
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.limit) {
            toast.error("Please fill in all fields");
            return;
        }

        const payload = {
            name: formData.name,
            limit: parseFloat(formData.limit),
            icon: formData.icon,
            color: formData.color
        };

        try {
            if (editingId) {
                await updateBudgetCategory(editingId, payload);
                toast.success("Budget updated!");
            } else {
                await createBudgetCategory(payload);
                toast.success("Budget created!");
            }
            setIsModalOpen(false);
            fetchBudgets();
        } catch (error) {
            toast.error("Failed to save budget");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this budget category?")) return;
        try {
            await deleteBudgetCategory(id);
            toast.success("Budget deleted");
            fetchBudgets();
        } catch (error) {
            toast.error("Failed to delete budget");
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mono-text uppercase">Budget Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Set and track monthly spending limits per category</p>
                </div>
                <Button onClick={handleOpenCreate} className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
                    <span className="material-symbols-outlined text-lg">add</span>
                    New Category
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Summary Card */}
                <div className="col-span-1 md:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Total Monthly Budget</h2>
                        <span className="text-2xl font-bold mono-text">
                            {budgetData ? budgetData.totalBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00'}
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${budgetData && budgetData.percentageUsed > 100 ? 'bg-red-500' : 'bg-primary'}`}
                            style={{ width: `${Math.min(budgetData?.percentageUsed || 0, 100)}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-slate-500 font-medium">
                        <span>Spent: {budgetData ? budgetData.spentSoFar.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00'}</span>
                        <span>{budgetData ? (100 - budgetData.percentageUsed).toFixed(1) : 0}% Remaining</span>
                    </div>
                </div>

                {/* Categories List */}
                {loading ? (
                    <div className="col-span-3 text-center p-12 text-slate-500">Loading budgets...</div>
                ) : (budgetData?.categories || []).map((cat) => (
                    <div key={cat.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat.iconBg} ${cat.iconColor}`}>
                                    <span className="material-symbols-outlined text-xl">{cat.icon || 'category'}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{cat.name}</h3>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cat.status}</div>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenEdit(cat)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-blue-500 transition-colors">
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button onClick={() => handleDelete(cat.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-red-500 transition-colors">
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-slate-500">Spent</span>
                                <span className={`font-bold mono-text ${cat.statusColor}`}>
                                    {cat.spent.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${cat.progressColor || 'bg-blue-500'}`}
                                    style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                                <span>{cat.percentage.toFixed(0)}% Used</span>
                                <span>Limit: {cat.limit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Card (Empty State) */}
                <button onClick={handleOpenCreate} className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors min-h-[180px]">
                    <span className="material-symbols-outlined text-4xl mb-2">add_circle</span>
                    <span className="font-bold text-sm">Add Category</span>
                </button>
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Budget' : 'New Budget Category'}</DialogTitle>
                        <DialogDescription>Set a monthly spending limit for this category.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Category Name</Label>
                            <Input
                                placeholder="e.g. Dining Out"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Monthly Limit ($)</Label>
                            <Input
                                type="number"
                                placeholder="300.00"
                                value={formData.limit}
                                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Icon</Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, icon: v })} defaultValue={formData.icon}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Icon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="home">Home</SelectItem>
                                        <SelectItem value="restaurant">Food</SelectItem>
                                        <SelectItem value="directions_bus">Transport</SelectItem>
                                        <SelectItem value="music_note">Entertainment</SelectItem>
                                        <SelectItem value="bolt">Bills</SelectItem>
                                        <SelectItem value="shopping_bag">Shopping</SelectItem>
                                        <SelectItem value="label">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Color</Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, color: v })} defaultValue={formData.color}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="blue">Blue</SelectItem>
                                        <SelectItem value="green">Green</SelectItem>
                                        <SelectItem value="red">Red</SelectItem>
                                        <SelectItem value="orange">Orange</SelectItem>
                                        <SelectItem value="purple">Purple</SelectItem>
                                        <SelectItem value="pink">Pink</SelectItem>
                                        <SelectItem value="yellow">Yellow</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Budget</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
