import {
    LayoutDashboard,
    Wallet,
    BarChart3,
    Settings,
    Plus,
    PiggyBank,
    Search,
    ChevronDown,
    Filter,
    Download,
    ShoppingCart,
    Briefcase,
    Coffee,
    Zap,
    Music,
    Car
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

const transactions = [
    {
        id: 1,
        date: "Oct 24, 2023",
        description: "Whole Foods Market",
        category: "Groceries",
        amount: -124.50,
        type: "expense",
        icon: <ShoppingCart className="h-4 w-4" />,
        color: "text-orange-600",
        bg: "bg-orange-100",
        categoryColor: "bg-orange-100 text-orange-700 hover:bg-orange-100"
    },
    {
        id: 2,
        date: "Oct 23, 2023",
        description: "Monthly Salary",
        category: "Income",
        amount: 4500.00,
        type: "income",
        icon: <Briefcase className="h-4 w-4" />,
        color: "text-green-600",
        bg: "bg-green-100",
        categoryColor: "bg-green-100 text-green-700 hover:bg-green-100"
    },
    {
        id: 3,
        date: "Oct 22, 2023",
        description: "Starbucks Coffee",
        category: "Dining",
        amount: -6.75,
        type: "expense",
        icon: <Coffee className="h-4 w-4" />,
        color: "text-blue-600",
        bg: "bg-blue-100",
        categoryColor: "bg-blue-100 text-blue-700 hover:bg-blue-100"
    },
    {
        id: 4,
        date: "Oct 21, 2023",
        description: "Pacific Gas & Electric",
        category: "Utilities",
        amount: -85.00,
        type: "expense",
        icon: <Zap className="h-4 w-4" />,
        color: "text-purple-600",
        bg: "bg-purple-100",
        categoryColor: "bg-purple-100 text-purple-700 hover:bg-purple-100"
    },
    {
        id: 5,
        date: "Oct 20, 2023",
        description: "Apple Music Subscription",
        category: "Entertainment",
        amount: -10.99,
        type: "expense",
        icon: <Music className="h-4 w-4" />,
        color: "text-pink-600",
        bg: "bg-pink-100",
        categoryColor: "bg-pink-100 text-pink-700 hover:bg-pink-100"
    },
    {
        id: 6,
        date: "Oct 19, 2023",
        description: "Uber Ride",
        category: "Transport",
        amount: -22.40,
        type: "expense",
        icon: <Car className="h-4 w-4" />,
        color: "text-slate-600",
        bg: "bg-slate-100",
        categoryColor: "bg-slate-100 text-slate-700 hover:bg-slate-100"
    },
]

export default function TransactionsPage() {
    const navigate = useNavigate()

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
                <div className="flex h-full flex-col">
                    <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">FinTracker</span>
                    </div>

                    <nav className="flex-1 space-y-1 px-4 py-6">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            onClick={() => navigate("/dashboard")}
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            Dashboard
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-600"
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
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Transactions</h1>
                        <p className="mt-1 text-slate-500">Review and manage your spending history</p>
                    </div>
                    <Button className="h-10 bg-blue-600 font-semibold hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Transaction
                    </Button>
                </div>

                {/* Filters and Table Container */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    {/* Filter Bar */}
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search by description, category..." className="pl-9 bg-slate-50 border-slate-200" />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-lg bg-slate-100 p-1">
                                <Button variant="ghost" size="sm" className="h-8 rounded-md bg-white text-slate-900 shadow-sm hover:bg-white">All</Button>
                                <Button variant="ghost" size="sm" className="h-8 rounded-md text-slate-500 hover:text-slate-900">Income</Button>
                                <Button variant="ghost" size="sm" className="h-8 rounded-md text-slate-500 hover:text-slate-900">Expenses</Button>
                            </div>
                            <Select defaultValue="30">
                                <SelectTrigger className="w-[160px] bg-white border-slate-200">
                                    <SelectValue placeholder="Period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7">Last 7 Days</SelectItem>
                                    <SelectItem value="30">Last 30 Days</SelectItem>
                                    <SelectItem value="90">Last 3 Months</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[150px] font-semibold text-slate-500">DATE</TableHead>
                                    <TableHead className="font-semibold text-slate-500">DESCRIPTION</TableHead>
                                    <TableHead className="font-semibold text-slate-500">CATEGORY</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-500">AMOUNT</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow key={transaction.id} className="hover:bg-slate-50/50">
                                        <TableCell className="font-medium text-slate-600">{transaction.date}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${transaction.bg} ${transaction.color}`}>
                                                    {transaction.icon}
                                                </div>
                                                <span className="font-semibold text-slate-900">{transaction.description}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={`${transaction.categoryColor} border-none font-medium`}>
                                                {transaction.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-slate-900'}`}>
                                                {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-slate-100 p-4">
                        <p className="text-sm text-slate-500">Showing 1 to 6 of 124 transactions</p>
                        <Pagination className="w-auto mx-0">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" className="hover:bg-slate-50" />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white">1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" className="hover:bg-slate-50">2</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" className="hover:bg-slate-50">3</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href="#" className="hover:bg-slate-50" />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </main>
        </div>
    )
}
