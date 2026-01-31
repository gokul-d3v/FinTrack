import {
    LayoutDashboard,
    CreditCard,
    Wallet,
    BarChart3,
    Settings,
    Plus,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    Search,
    Bell,
    ChevronDown,
    MoreHorizontal,
    Loader2
} from "lucide-react"
import { useEffect, useState } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const activityData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 500 },
    { name: 'Thu', value: 200 },
    { name: 'Fri', value: 450 },
    { name: 'Sat', value: 600 },
    { name: 'Sun', value: 550 },
];

const spendingData = [
    { name: 'Housing', value: 40, color: '#3b82f6' },
    { name: 'Food', value: 25, color: '#22c55e' },
    { name: 'Entertainment', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 20, color: '#6366f1' },
];

const recentTransactions = [
    {
        id: 1,
        name: "Starbucks Coffee",
        category: "Food & Drink",
        time: "2 hours ago",
        amount: -12.50,
        icon: "☕",
        bg: "bg-orange-100",
        color: "text-orange-600"
    },
    {
        id: 2,
        name: "Apple Store",
        category: "Electronics",
        time: "Yesterday",
        amount: -1200.00,
        icon: "🛍️",
        bg: "bg-blue-100",
        color: "text-blue-600"
    },
    {
        id: 3,
        name: "Monthly Salary",
        category: "Income",
        time: "2 days ago",
        amount: 5200.00,
        icon: "💰",
        bg: "bg-green-100",
        color: "text-green-600"
    },
    {
        id: 4,
        name: "Netflix Subscription",
        category: "Entertainment",
        time: "3 days ago",
        amount: -15.99,
        icon: "🎬",
        bg: "bg-purple-100",
        color: "text-purple-600"
    },
    {
        id: 5,
        name: "Shell Gas Station",
        category: "Transport",
        time: "4 days ago",
        amount: -45.00,
        bg: "bg-slate-100",
        color: "text-slate-600",
        icon: "⛽"
    },
]

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalBalance: 0,
        totalIncome: 0,
        totalExpense: 0
    })
    const [recentParams, setRecentParams] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/dashboard")
                if (!response.ok) throw new Error("Failed to fetch")
                const data = await response.json()

                if (data.stats) {
                    setStats({
                        totalBalance: data.stats.totalBalance || 0,
                        totalIncome: data.stats.totalIncome || 0,
                        totalExpense: Math.abs(data.stats.totalExpense || 0)
                    })
                }

                if (data.transactions) {
                    setRecentParams(data.transactions.map((t: any) => ({
                        id: t.id,
                        name: t.description,
                        category: t.category,
                        time: new Date(t.date).toLocaleDateString(),
                        amount: t.amount,
                        icon: "💰", // Default icon for now
                        bg: "bg-slate-100",
                        color: "text-slate-600"
                    })))
                }
            } catch (error) {
                console.error("Error loading dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
                <div className="flex h-full flex-col">
                    <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">FinTrack</span>
                    </div>

                    <nav className="flex-1 space-y-1 px-4 py-6">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            Dashboard
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            onClick={() => window.location.href = '/transactions'}
                        >
                            <Wallet className="h-5 w-5" />
                            Transactions
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        >
                            <PiggyBank className="h-5 w-5" />
                            Budgets
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        >
                            <BarChart3 className="h-5 w-5" />
                            Reports
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        >
                            <Settings className="h-5 w-5" />
                            Settings
                        </Button>
                    </nav>

                    <div className="border-t border-slate-100 p-4">
                        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-semibold text-slate-900">John Doe</p>
                                <p className="truncate text-xs text-slate-500">Premium Member</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Overview</h1>
                        <p className="mt-1 text-slate-500">Welcome back, here's what's happening today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-10 border-slate-200 bg-white font-medium hover:bg-slate-50">
                            Last 30 Days
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                        <Button className="h-10 bg-blue-600 font-semibold hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Transaction
                        </Button>
                    </div>
                </div>

                {/* Total Balance Card */}
                <Card className="mb-8 overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
                    <CardContent className="flex flex-col gap-6 p-0 md:flex-row">
                        <div className="flex-1 p-8">
                            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Total Balance</p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-slate-900">${stats.totalBalance.toFixed(2)}</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-bold text-green-700">
                                    <TrendingUp className="mr-1 h-3 w-3" />
                                    +2.4%
                                </span>
                                <span className="text-sm font-medium text-slate-500">vs last month</span>
                            </div>
                        </div>
                        <div className="relative h-48 w-full bg-gradient-to-l from-blue-50 to-transparent md:w-96">
                            {/* Placeholder for a nice gradient area chart */}
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activityData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* KPI Grid */}
                <div className="mb-8 grid gap-6 md:grid-cols-3">
                    <Card className="border-none shadow-sm ring-1 ring-slate-200 transition-all hover:ring-2 hover:ring-blue-100">
                        <CardHeader className="p-6 pb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                                <TrendingDown className="h-6 w-6 text-green-600 rotate-180" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            <p className="text-sm font-medium text-slate-500">Monthly Income</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900">${stats.totalIncome.toFixed(2)}</p>
                            <div className="mt-2 flex items-center text-sm">
                                <span className="font-bold text-green-600">↑ 12%</span>
                                <span className="ml-1 text-slate-400">increase</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-200 transition-all hover:ring-2 hover:ring-red-100">
                        <CardHeader className="p-6 pb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                                <TrendingUp className="h-6 w-6 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            <p className="text-sm font-medium text-slate-500">Monthly Expenses</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900">${stats.totalExpense.toFixed(2)}</p>
                            <div className="mt-2 flex items-center text-sm">
                                <span className="font-bold text-red-600">↓ 5%</span>
                                <span className="ml-1 text-slate-400">decrease</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-200 transition-all hover:ring-2 hover:ring-blue-100">
                        <CardHeader className="p-6 pb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                                <PiggyBank className="h-6 w-6 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            <p className="text-sm font-medium text-slate-500">Total Savings</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900">$3,100.00</p>
                            <div className="mt-2 flex items-center text-sm">
                                <div className="h-2 w-2 rounded-full bg-blue-600 mr-2" />
                                <span className="font-bold text-blue-600">On track for goals</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Lower Section Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Spending Overview */}
                    <Card className="border-none shadow-sm ring-1 ring-slate-200 h-full">
                        <CardHeader className="flex flex-row items-center justify-between p-6">
                            <CardTitle className="text-lg font-bold text-slate-900">Spending Overview</CardTitle>
                            <Button variant="ghost" className="h-8 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                Details
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="flex h-[300px] w-full items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={spendingData}
                                            innerRadius={80}
                                            outerRadius={110}
                                            paddingAngle={0}
                                            dataKey="value"
                                        >
                                            {spendingData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-sm font-medium text-slate-500">TOTAL</span>
                                    <span className="text-3xl font-bold text-slate-900">$2,100</span>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                {spendingData.map((item) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm font-medium text-slate-600">{item.name} ({item.value}%)</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="border-none shadow-sm ring-1 ring-slate-200 h-full">
                        <CardHeader className="flex flex-row items-center justify-between p-6">
                            <CardTitle className="text-lg font-bold text-slate-900">Recent Activity</CardTitle>
                            <Button variant="ghost" className="h-8 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                View All
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="space-y-6">
                                <div className="space-y-6">
                                    {recentParams.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center gap-4 group cursor-pointer">
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-xl group-hover:bg-blue-50 group-hover:scale-105 transition-all`}>
                                                {transaction.icon}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900">{transaction.name}</p>
                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                    <span>{transaction.category}</span>
                                                    <span>•</span>
                                                    <span>{transaction.time}</span>
                                                </div>
                                            </div>
                                            <span className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                                                {transaction.amount > 0 ? '+' : ''}{parseFloat(transaction.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
