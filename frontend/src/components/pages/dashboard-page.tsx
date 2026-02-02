import { useState, useEffect } from "react"
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CreditCard, Activity, Calendar, Download } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDashboardData, type DashboardData } from "@/lib/api"
import { toast } from "sonner"

const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
    { name: 'Jul', value: 7000 },
]

const barData = [
    { name: 'Mon', income: 500, expense: 300 },
    { name: 'Tue', income: 400, expense: 450 },
    { name: 'Wed', income: 600, expense: 200 },
    { name: 'Thu', income: 800, expense: 500 },
    { name: 'Fri', income: 1000, expense: 800 },
    { name: 'Sat', income: 200, expense: 400 },
    { name: 'Sun', income: 100, expense: 150 },
]

const categoryData = [
    { name: 'Housing', value: 2450, color: '#ef4444' }, // red
    { name: 'Food & Dining', value: 980, color: '#f97316' }, // orange
    { name: 'Transportation', value: 450, color: '#eab308' }, // yellow
    { name: 'Technology', value: 1299, color: '#3b82f6' }, // blue
    { name: 'Entertainment', value: 180, color: '#8b5cf6' }, // purple
    { name: 'Others', value: 350, color: '#64748b' }, // slate
]

const trendData = [
    { month: 'Jan', income: 8500, expense: 4200 },
    { month: 'Feb', income: 8500, expense: 5700 },
    { month: 'Mar', income: 9000, expense: 4100 },
    { month: 'Apr', income: 8700, expense: 4800 },
    { month: 'May', income: 9200, expense: 6000 },
    { month: 'Jun', income: 8800, expense: 5200 },
]

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [processedChartData, setProcessedChartData] = useState<any>({
        netWorth: [],
        dailyActivity: [],
        categories: [],
        trends: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDashboardData();
                setDashboardData(data);

                // Process Net Worth & Trends (Monthly)
                const trends = (data.monthlyStats || []).map(stat => ({
                    month: new Date(stat._id.year, stat._id.month - 1).toLocaleString('default', { month: 'short' }),
                    income: stat.income,
                    expense: Math.abs(stat.expense)
                }));

                // Process Daily Activity
                const daily = (data.dailyStats || []).map(stat => ({
                    name: new Date(stat._id.year, stat._id.month - 1, stat._id.day).toLocaleString('default', { weekday: 'short' }),
                    income: stat.income,
                    expense: Math.abs(stat.expense)
                }));

                // Process Categories
                const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#64748b'];
                const categories = (data.categoryStats || []).map((stat, index) => ({
                    name: stat._id,
                    value: Math.abs(stat.value),
                    color: COLORS[index % COLORS.length]
                }));

                setProcessedChartData({
                    netWorth: trends.map(t => ({ name: t.month, value: t.income - t.expense })), // Simplified net worth
                    trends: trends,
                    dailyActivity: daily,
                    categories: categories
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    // Use real data if available, otherwise fallbacks (zeros) to avoid crashes
    const stats = dashboardData ? [
        {
            title: "Total Balance",
            value: `$${dashboardData.stats.totalBalance.toLocaleString()}`,
            change: "+12.5%", // These would need historical data to calculate real trends
            icon: Wallet,
            trend: "up",
            color: "text-blue-600"
        },
        {
            title: "Total Income",
            value: `$${dashboardData.stats.totalIncome.toLocaleString()}`,
            change: "+2.1%",
            icon: DollarSign,
            trend: "up",
            color: "text-green-600"
        },
        {
            title: "Total Expenses",
            value: `$${Math.abs(dashboardData.stats.totalExpense).toLocaleString()}`,
            change: "-4.3%",
            icon: CreditCard,
            trend: "down",
            color: "text-red-500"
        },
        {
            title: "Savings Rate",
            value: dashboardData.stats.totalIncome > 0
                ? `${Math.round(((dashboardData.stats.totalIncome + dashboardData.stats.totalExpense) / dashboardData.stats.totalIncome) * 100)}%`
                : "0%",
            change: "+1.2%",
            icon: Activity,
            trend: "up",
            color: "text-purple-600"
        },
    ] : [];

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mono-text uppercase">Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Real-time financial overview and analytics</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Last 30 Days</span>
                    </Button>
                    <Button variant="outline" className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span>Export Report</span>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold mono-text">{stat.value}</div>
                            <div className="flex items-center text-xs mt-1">
                                {stat.trend === "up" ? (
                                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                                )}
                                <span className={stat.trend === "up" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                                    {stat.change}
                                </span>
                                <span className="text-slate-400 ml-1">last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section with Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="spending">Spending Breakdown</TabsTrigger>
                        <TabsTrigger value="trends">Trends</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Chart */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="mono-text uppercase tracking-tight text-lg">Net Worth Growth</CardTitle>
                                <CardDescription>6 Month trend analysis</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={processedChartData.netWorth && processedChartData.netWorth.length > 0 ? processedChartData.netWorth : data}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: '#64748b' }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: '#64748b' }}
                                                tickFormatter={(value) => `$${value}`}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#2563eb"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorValue)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Weekly Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="mono-text uppercase tracking-tight text-lg">Weekly Activity</CardTitle>
                                <CardDescription>Income vs Expenses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={processedChartData.dailyActivity && processedChartData.dailyActivity.length > 0 ? processedChartData.dailyActivity : barData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#64748b' }}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="spending" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle className="mono-text uppercase tracking-tight text-lg">Spending by Category</CardTitle>
                                <CardDescription>Where your money goes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={processedChartData.categories && processedChartData.categories.length > 0 ? processedChartData.categories : categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {(processedChartData.categories && processedChartData.categories.length > 0 ? processedChartData.categories : categoryData).map((entry: any, index: any) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                formatter={(value: any) => [`$${value}`, "Amount"]}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="lg:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {(processedChartData.categories && processedChartData.categories.length > 0 ? processedChartData.categories : categoryData).map((item: any) => (
                                        <div key={item.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full" style={{ width: `${(item.value / (dashboardData?.stats?.totalExpense ? Math.abs(dashboardData.stats.totalExpense) : 1)) * 100}%`, backgroundColor: item.color }}></div>
                                                </div>
                                                <span className="text-sm font-bold mono-text">${item.value.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="trends" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="mono-text uppercase tracking-tight text-lg">Income vs Expenses Analysis</CardTitle>
                            <CardDescription>6 Month comparison trend</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={processedChartData.trends && processedChartData.trends.length > 0 ? processedChartData.trends : trendData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="income"
                                            name="Income"
                                            stroke="#22c55e"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#22c55e' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="expense"
                                            name="Expenses"
                                            stroke="#ef4444"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#ef4444' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
