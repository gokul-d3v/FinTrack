import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createTransaction, getBudgetOverview, type CategoryStatus } from "@/lib/api"
import { toast } from "sonner"

export default function AddTransactionPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<CategoryStatus[]>([])

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getBudgetOverview()
                setCategories(data.categories)
            } catch (error) {
                console.error("Failed to fetch categories:", error)
                // Don't block the UI, just maybe show a toast or default to empty
                // toast.error("Failed to load categories")
            }
        }
        fetchCategories()
    }, [])

    const [formData, setFormData] = useState({
        amount: "",
        date: new Date().toISOString().split('T')[0],
        category: "",
        description: "",
        type: "expense" as "income" | "expense"
    })

    const handleSave = async () => {
        if (!formData.amount || isNaN(parseFloat(formData.amount))) {
            toast.error("Please enter a valid amount")
            return
        }
        if (!formData.category) {
            toast.error("Please select a category")
            return
        }
        if (!formData.description) {
            toast.error("Please enter a description")
            return
        }

        setLoading(true)
        try {
            // Ensure positive amount for income, negative for expense? 
            // The backend/logic usually expects signed values or a separate type field.
            // Based on visual inspection, we send absolute amount and a type.
            // Let's check backend logic: It sets type based on amount if missing.
            // So we should probably send signed amount if we want to rely on that, 
            // OR send pure amount + type. The backend CreateTransaction respects .Type.

            // Let's send signed amount just to be safe and consistent with other views
            let finalAmount = parseFloat(formData.amount)
            if (formData.type === 'expense') {
                finalAmount = -Math.abs(finalAmount)
            } else {
                finalAmount = Math.abs(finalAmount)
            }

            await createTransaction({
                amount: finalAmount,
                date: new Date(formData.date).toISOString(),
                category: formData.category,
                description: formData.description,
                type: formData.type
            })

            toast.success("Transaction saved successfully")
            navigate(-1) // Go back
        } catch (error) {
            console.error("Failed to save transaction", error)
            toast.error("Failed to save transaction")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mono-text uppercase">Add Transaction</h1>
                    <p className="text-slate-500 text-sm mt-1">Record a new income or expense</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction Details</CardTitle>
                    <CardDescription>Enter the details of your transaction below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Type Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="space-y-0.5">
                            <Label className="text-base">Transaction Type</Label>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className={formData.type === 'expense' ? "font-bold text-red-500" : ""}>Expense</span>
                                <Switch
                                    checked={formData.type === 'income'}
                                    onCheckedChange={(checked) => setFormData({ ...formData, type: checked ? 'income' : 'expense' })}
                                />
                                <span className={formData.type === 'income' ? "font-bold text-green-500" : ""}>Income</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-7 font-mono text-lg"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="uncategorized" disabled>No budgets found</SelectItem>
                                )}
                                {/* Keep one 'Other' just in case? Or rely strictly on budgets? User requested "need the budget in add transaction category" implying restrict directly? 
                                    Let's allow user to see budgets. Maybe keep "Income" / etc if type is income? 
                                    Actually budgets are usually expense categories. 
                                    If type is Income, maybe we shouldn't force budget categories? 
                                    But user said "budget should track with financial tracker". 
                                    Let's stick to showing budget categories. 
                                */}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="e.g. Weekly Groceries"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button className="w-full bg-primary text-white" size="lg" onClick={handleSave} disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Transaction
                        </Button>
                        <Button variant="outline" className="w-full" size="lg" onClick={() => navigate(-1)} disabled={loading}>
                            Cancel
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
