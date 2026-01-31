import {
    LayoutDashboard,
    CreditCard,
    Wallet,
    BarChart3,
    Settings,
    Plus,
    TrendingUp,
    TrendingDown,
    Bell,
    ArrowDownLeft,
    Home,
    History,
    User,
    ChevronDown,
    MoreHorizontal,
    Loader2,
    PiggyBank,
    ArrowUpRight
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
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
import { AppSidebar } from "@/components/app-sidebar"

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
    const navigate = useNavigate()
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
            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-zinc-50/80 backdrop-blur-md px-6 md:hidden">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">Dashboard</span>
                </div>
                <div className="flex items-center gap-4">
                    <Bell className="h-6 w-6 text-slate-600" />
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <AppSidebar />

            {/* Main Content */}
            <main className="flex-1 p-4 md:ml-64 md:p-8 pt-20 md:pt-8 bg-slate-50 pb-24 md:pb-8">
                {/* Header - Desktop Only */}
                <div className="hidden md:flex mb-8 flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

                {/* Total Balance Card - Updated style for Mobile */}
                <Card className="mb-6 overflow-hidden border-none shadow-lg md:shadow-sm ring-1 ring-slate-200 bg-gradient-to-br from-blue-600 to-blue-700 text-white md:bg-white md:bg-none md:text-slate-900">
                    <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:p-0">
                        <div className="flex-1 md:p-8">
                            <div className="flex justify-between items-start">
                                <p className="text-xs font-medium uppercase tracking-wider text-blue-100 md:text-slate-500">Total Balance</p>
                                <span className="rounded-full bg-blue-500/30 px-2 py-0.5 text-xs font-semibold text-white md:hidden">+2.5%</span>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-4xl font-bold md:text-5xl">${stats.totalBalance.toFixed(2)}</span>
                            </div>

                            {/* Mobile Actions */}
                            <div className="mt-6 grid grid-cols-2 gap-3 md:hidden">
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold h-10 rounded-xl border-none">Deposit</Button>
                                <Button className="bg-blue-500/30 text-white hover:bg-blue-500/40 font-semibold h-10 rounded-xl border-none">Transfer</Button>
                            </div>

                            {/* Desktop Stats */}
                            <div className="mt-4 hidden md:flex items-center gap-2">
                                <span className="flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-bold text-green-700">
                                    <TrendingUp className="mr-1 h-3 w-3" />
                                    +2.4%
                                </span>
                                <span className="text-sm font-medium text-slate-500">vs last month</span>
                            </div>
                        </div>

                        {/* Desktop Chart Area */}
                        <div className="relative hidden h-48 w-full bg-gradient-to-l from-blue-50 to-transparent md:block md:w-96">
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

                {/* Mobile Income/Expense Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6 md:hidden">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                <ArrowDownLeft className="h-3 w-3 text-green-600" />
                            </div>
                            <span className="text-xs font-medium text-slate-500">Income</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">${stats.totalIncome.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                                <ArrowUpRight className="h-3 w-3 text-red-600" />
                            </div>
                            <span className="text-xs font-medium text-slate-500">Expenses</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">${stats.totalExpense.toFixed(2)}</p>
                    </div>
                </div>

                {/* KPI Grid (Desktop Only) */}
                <div className="hidden mb-8 md:grid gap-6 md:grid-cols-3">
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
                            <p className="mt-1 text-2xl font-bold text-slate-900">${(stats.totalIncome - stats.totalExpense).toFixed(2)}</p>
                            <div className="mt-2 flex items-center text-sm">
                                <div className="h-2 w-2 rounded-full bg-blue-600 mr-2" />
                                <span className="font-bold text-blue-600">On track for goals</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Spending Breakdown (Mobile & Desktop) */}
                <Card className="border-none shadow-sm ring-1 ring-slate-200 mb-6">
                    <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                        <CardTitle className="text-lg font-bold text-slate-900">Spending Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="flex flex-col items-center">
                            <div className="relative h-[200px] w-full max-w-[200px] my-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={spendingData}
                                            innerRadius={60}
                                            outerRadius={80}
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
                                    <span className="text-xs font-medium text-slate-400 uppercase">Total Spent</span>
                                    <span className="text-xl font-bold text-slate-900">${stats.totalExpense.toFixed(0)}</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full max-w-xs mt-2">
                                {spendingData.map((item) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-xs text-slate-500">{item.name} ({item.value}%)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-none shadow-sm ring-1 ring-slate-200 h-full">
                        <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
                            <CardTitle className="text-lg font-bold text-slate-900">Recent Activity</CardTitle>
                            <Button variant="ghost" className="h-8 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2" onClick={() => navigate('/transactions')}>
                                See All
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="space-y-4">
                                {recentParams.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center gap-4 group cursor-pointer py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 rounded-lg transition-colors">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg`}>
                                            {transaction.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 truncate">{transaction.name}</p>
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <span className="truncate">{transaction.time || "Today, 8:45 AM"}</span>
                                            </div>
                                        </div>
                                        <span className={`font-bold whitespace-nowrap ${transaction.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {transaction.amount > 0 ? '+' : ''}{parseFloat(transaction.amount).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Bottom Navigation - Mobile Only */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 h-20 px-6 pb-2 md:hidden">
                <div className="flex items-center justify-between h-full relative">
                    <button className="flex flex-col items-center gap-1 text-blue-600">
                        <Home className="h-6 w-6" fill="currentColor" />
                        <span className="text-[10px] font-medium">Home</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600" onClick={() => navigate('/transactions')}>
                        <History className="h-6 w-6" />
                        <span className="text-[10px] font-medium">History</span>
                    </button>

                    {/* Floating Action Button */}
                    <div className="absolute left-1/2 -top-6 -translate-x-1/2">
                        <button className="h-14 w-14 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center text-white hover:bg-blue-700 transition-transform active:scale-95" onClick={() => navigate('/transactions')}>
                            <Plus className="h-7 w-7" />
                        </button>
                    </div>

                    <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600" onClick={() => navigate('/budget')}>
                        <Wallet className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Budget</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
                        <User className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Profile</span>
                    </button>
                </div>
            </nav>
        </div>
    )
}
