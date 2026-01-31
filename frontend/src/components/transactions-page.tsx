import * as React from "react"
import {
    Wallet,
    Plus,
    Search,
    ChevronDown,
    ShoppingCart,
    Briefcase,
    Coffee,
    Zap,
    Music,
    Car,
    CalendarIcon,
    Loader2,
    Home,
    History,
    User,
    Delete,
    Utensils,
    Bus,
    Plane,
    X
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
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



// Removed hardcoded transactions array




export default function TransactionsPage() {
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false)
    const [transactions, setTransactions] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)

    // Fetch Transactions on Mount
    const fetchTransactions = async () => {
        try {
            setLoading(true)
            const response = await fetch("http://localhost:8080/api/transactions")
            if (!response.ok) throw new Error("Failed to fetch")
            const data = await response.json()

            // Map backend data to frontend structure
            if (Array.isArray(data)) {
                setTransactions(data.map((t: any) => ({
                    id: t.id,
                    date: new Date(t.date).toLocaleDateString(),
                    description: t.description,
                    category: t.category,
                    amount: t.amount,
                    type: t.type,
                    // Basic icon mapping logic (can be expanded)
                    icon: getCategoryIcon(t.category),
                    color: "text-slate-600",
                    bg: "bg-slate-100",
                    categoryColor: "bg-slate-100 text-slate-700"
                })))
            }
        } catch (error) {
            toast.error("Failed to load transactions")
        } finally {
            setLoading(false)
        }
    }



    // Custom Keypad State
    const [amount, setAmount] = React.useState("0")
    const [transactionType, setTransactionType] = React.useState<"expense" | "income">("expense")
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
    const [selectedCategory, setSelectedCategory] = React.useState("Food")

    const handleKeypadPress = (key: string) => {
        if (key === "backspace") {
            setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : "0")
        } else if (key === ".") {
            if (!amount.includes(".")) {
                setAmount(prev => prev + ".")
            }
        } else {
            setAmount(prev => prev === "0" ? key : prev + key)
        }
    }

    const handleCustomSubmit = async () => {
        const floatAmount = parseFloat(amount)
        if (floatAmount <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        try {
            // Basic mapping for description based on category
            const description = `${selectedCategory} ${transactionType === 'income' ? 'Received' : 'Payment'}`

            const payload = {
                amount: transactionType === "expense" ? floatAmount * -1 : floatAmount,
                description: description,
                category: selectedCategory,
                date: selectedDate,
                type: transactionType
            }

            const response = await fetch("http://localhost:8080/api/transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to save")

            setOpen(false)
            setAmount("0")
            fetchTransactions()
            toast.success("Transaction saved successfully")
        } catch (error) {
            toast.error("Failed to save transaction")
        }
    }


    React.useEffect(() => {
        fetchTransactions()
    }, [])




    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Groceries': return <ShoppingCart className="h-4 w-4" />;
            case 'Income': return <Briefcase className="h-4 w-4" />;
            case 'Dining': return <Coffee className="h-4 w-4" />;
            case 'Utilities': return <Zap className="h-4 w-4" />;
            case 'Entertainment': return <Music className="h-4 w-4" />;
            case 'Transport': return <Car className="h-4 w-4" />;
            default: return <Wallet className="h-4 w-4" />;
        }
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-zinc-50/80 backdrop-blur-md px-6 md:hidden">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                        <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">Transactions</span>
                </div>
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
            </header>



            {/* Desktop Sidebar */}
            <AppSidebar />

            {/* Main Content */}
            <main className="flex-1 p-4 md:ml-64 md:p-8 pt-20 md:pt-8 bg-slate-50">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Transactions</h1>
                        <p className="mt-1 text-slate-500">Review and manage your spending history</p>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-blue-600 font-semibold hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Transaction
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-none bg-transparent md:bg-white md:shadow-2xl h-full md:h-auto">
                            <div className="flex flex-col h-full bg-slate-50 md:rounded-3xl p-4 md:p-6 overflow-y-auto">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4 md:mb-6 sticky top-0 bg-slate-50 z-10 pb-2">
                                    <DialogClose asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </DialogClose>
                                    <h2 className="text-lg font-bold text-slate-900">Add Transaction</h2>
                                    <div className="w-8" /> {/* Spacer for centering */}
                                </div>

                                {/* Type Toggle */}
                                <div className="bg-slate-200 p-1 rounded-xl flex mb-4 md:mb-8">
                                    <button
                                        className={cn(
                                            "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                                            transactionType === "expense" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                        )}
                                        onClick={() => setTransactionType("expense")}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        className={cn(
                                            "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                                            transactionType === "income" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                        )}
                                        onClick={() => setTransactionType("income")}
                                    >
                                        Income
                                    </button>
                                </div>

                                {/* Amount Display */}
                                <div className="flex flex-col items-center justify-center mb-4 md:mb-8">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Amount</span>
                                    <div className="flex items-center justify-center">
                                        <span className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        <div className="w-1 h-10 md:h-12 bg-blue-600 ml-1 animate-pulse" />
                                    </div>
                                </div>

                                {/* Keypad */}
                                <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((key) => (
                                        <button
                                            key={key}
                                            className="bg-white rounded-2xl h-14 md:h-16 text-xl md:text-2xl font-bold text-slate-900 shadow-sm active:bg-slate-50 transition-colors"
                                            onClick={() => handleKeypadPress(key.toString())}
                                        >
                                            {key}
                                        </button>
                                    ))}
                                    <button
                                        className="bg-white rounded-2xl h-14 md:h-16 flex items-center justify-center text-slate-900 shadow-sm active:bg-slate-50 transition-colors"
                                        onClick={() => handleKeypadPress("backspace")}
                                    >
                                        <Delete className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* Date & Category */}
                                <div className="bg-slate-100 rounded-2xl p-3 md:p-4 mb-4 md:mb-6">
                                    <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Transaction Date</span>
                                        <div className="flex gap-4">
                                            <button className="text-blue-600 font-bold text-sm border-b-2 border-blue-600 pb-0.5">Today</button>
                                            <button className="text-slate-400 font-medium text-sm">Yesterday</button>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <button className="flex items-center text-slate-400 font-medium text-sm">
                                                        <CalendarIcon className="h-3 w-3 mr-1" />
                                                        {format(selectedDate, "MMM d")}
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={selectedDate}
                                                        onSelect={(date) => date && setSelectedDate(date)}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Category</span>
                                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                            {[
                                                { name: 'Food', icon: <Utensils className="h-4 w-4" /> },
                                                { name: 'Transport', icon: <Bus className="h-4 w-4" /> },
                                                { name: 'Shopping', icon: <ShoppingCart className="h-4 w-4" /> },
                                                { name: 'Entertainment', icon: <Music className="h-4 w-4" /> },
                                                { name: 'Bills', icon: <Zap className="h-4 w-4" /> }
                                            ].map((cat) => (
                                                <button
                                                    key={cat.name}
                                                    className={cn(
                                                        "flex items-center gap-2 px-4 py-3 rounded-xl border font-bold text-sm whitespace-nowrap transition-colors",
                                                        selectedCategory === cat.name
                                                            ? "bg-blue-600 border-blue-600 text-white"
                                                            : "bg-white border-slate-200 text-slate-600"
                                                    )}
                                                    onClick={() => setSelectedCategory(cat.name)}
                                                >
                                                    {cat.icon}
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button className="w-full h-12 md:h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg font-bold shadow-lg shadow-blue-200 mt-2" onClick={handleCustomSubmit}>
                                    Save Transaction
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters and Table Container */}
                <div className="md:rounded-xl md:border md:border-slate-200 bg-transparent md:bg-white md:shadow-sm">
                    {/* Filter Bar */}
                    <div className="flex flex-col gap-4 border-b border-transparent md:border-slate-100 p-0 mb-4 md:p-4 md:flex-row md:items-center md:justify-between md:mb-0">
                        {/* Mobile Search and Filter Hidden for clean look, kept desktop search */}
                        <div className="hidden md:block relative w-full md:w-96">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search by description, category..." className="pl-9 bg-slate-50 border-slate-200" />
                        </div>

                        {/* Mobile Pill Filters */}
                        <div className="flex md:hidden items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                            <Button className="h-8 rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 font-semibold px-6 text-xs">All</Button>
                            <Button variant="ghost" className="h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold px-6 text-xs">Income</Button>
                            <Button variant="ghost" className="h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold px-6 text-xs">Expenses</Button>
                        </div>


                        <div className="hidden md:flex items-center gap-3">
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

                    {/* Transaction List (Mobile Optimized) */}
                    <div className="space-y-6 md:hidden">
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pl-1">Today</h3>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-600" /></div>
                                ) : transactions.length === 0 ? (
                                    <p className="text-center text-sm text-slate-500 py-4">No transactions today.</p>
                                ) : (
                                    transactions.slice(0, 3).map((transaction) => (
                                        <div key={transaction.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${transaction.bg} ${transaction.color}`}>
                                                {transaction.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-bold text-slate-900 text-sm">{transaction.description}</p>
                                                    <span className={`font-bold text-sm ${transaction.type === 'income' ? 'text-blue-600' : 'text-slate-900'}`}>
                                                        {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="text-xs text-slate-500 font-medium">{transaction.category} • {transaction.time || "2:45 PM"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pl-1">Yesterday</h3>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-600" /></div>
                                ) : transactions.length === 0 ? (
                                    <p className="text-center text-sm text-slate-500 py-4">No transactions found.</p>
                                ) : (
                                    transactions.slice(3, 6).map((transaction) => (
                                        <div key={transaction.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${transaction.bg} ${transaction.color}`}>
                                                {transaction.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-bold text-slate-900 text-sm">{transaction.description}</p>
                                                    <span className={`font-bold text-sm ${transaction.type === 'income' ? 'text-blue-600' : 'text-slate-900'}`}>
                                                        {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="text-xs text-slate-500 font-medium">{transaction.category} • {transaction.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Desktop Table (Hidden on Mobile) */}
                    <div className="hidden md:block p-0">
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
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            <div className="flex justify-center items-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                                                Loading...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                            No transactions found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((transaction) => (
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="hidden md:flex items-center justify-between border-t border-slate-100 p-4">
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

            {/* Bottom Navigation - Mobile Only */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 h-20 px-6 pb-2 md:hidden">
                <div className="flex items-center justify-between h-full relative">
                    <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600" onClick={() => navigate('/dashboard')}>
                        <Home className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Home</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-blue-600">
                        <History className="h-6 w-6" fill="currentColor" />
                        <span className="text-[10px] font-medium">History</span>
                    </button>

                    {/* Floating Action Button */}
                    <div className="absolute left-1/2 -top-6 -translate-x-1/2">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <button className="h-14 w-14 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center text-white hover:bg-blue-700 transition-transform active:scale-95">
                                    <Plus className="h-7 w-7" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-none bg-transparent md:bg-white md:shadow-2xl h-full md:h-auto">
                                <div className="flex flex-col h-full bg-slate-50 md:rounded-3xl p-4 md:p-6 overflow-y-auto">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4 md:mb-6 sticky top-0 bg-slate-50 z-10 pb-2">
                                        <DialogClose asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </DialogClose>
                                        <h2 className="text-lg font-bold text-slate-900">Add Transaction</h2>
                                        <div className="w-8" />
                                    </div>

                                    {/* Type Toggle */}
                                    <div className="bg-slate-200 p-1 rounded-xl flex mb-4 md:mb-8">
                                        <button
                                            className={cn(
                                                "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                                                transactionType === "expense" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                            )}
                                            onClick={() => setTransactionType("expense")}
                                        >
                                            Expense
                                        </button>
                                        <button
                                            className={cn(
                                                "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                                                transactionType === "income" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                            )}
                                            onClick={() => setTransactionType("income")}
                                        >
                                            Income
                                        </button>
                                    </div>

                                    {/* Amount Display */}
                                    <div className="flex flex-col items-center justify-center mb-4 md:mb-8">
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Amount</span>
                                        <div className="flex items-center justify-center">
                                            <span className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            <div className="w-1 h-10 md:h-12 bg-blue-600 ml-1 animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Keypad */}
                                    <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((key) => (
                                            <button
                                                key={key}
                                                className="bg-white rounded-2xl h-14 md:h-16 text-xl md:text-2xl font-bold text-slate-900 shadow-sm active:bg-slate-50 transition-colors"
                                                onClick={() => handleKeypadPress(key.toString())}
                                            >
                                                {key}
                                            </button>
                                        ))}
                                        <button
                                            className="bg-white rounded-2xl h-14 md:h-16 flex items-center justify-center text-slate-900 shadow-sm active:bg-slate-50 transition-colors"
                                            onClick={() => handleKeypadPress("backspace")}
                                        >
                                            <Delete className="h-6 w-6" />
                                        </button>
                                    </div>

                                    {/* Date & Category */}
                                    <div className="bg-slate-100 rounded-2xl p-3 md:p-4 mb-4 md:mb-6">
                                        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
                                            <span className="text-xs font-bold text-slate-400 uppercase">Transaction Date</span>
                                            <div className="flex gap-4">
                                                <button className="text-blue-600 font-bold text-sm border-b-2 border-blue-600 pb-0.5">Today</button>
                                                <button className="text-slate-400 font-medium text-sm">Yesterday</button>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <button className="flex items-center text-slate-400 font-medium text-sm">
                                                            <CalendarIcon className="h-3 w-3 mr-1" />
                                                            {format(selectedDate, "MMM d")}
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={selectedDate}
                                                            onSelect={(date) => date && setSelectedDate(date)}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase">Category</span>
                                            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                                {[
                                                    { name: 'Food', icon: <Utensils className="h-4 w-4" /> },
                                                    { name: 'Transport', icon: <Bus className="h-4 w-4" /> },
                                                    { name: 'Shopping', icon: <ShoppingCart className="h-4 w-4" /> },
                                                    { name: 'Entertainment', icon: <Music className="h-4 w-4" /> },
                                                    { name: 'Bills', icon: <Zap className="h-4 w-4" /> }
                                                ].map((cat) => (
                                                    <button
                                                        key={cat.name}
                                                        className={cn(
                                                            "flex items-center gap-2 px-4 py-3 rounded-xl border font-bold text-sm whitespace-nowrap transition-colors",
                                                            selectedCategory === cat.name
                                                                ? "bg-blue-600 border-blue-600 text-white"
                                                                : "bg-white border-slate-200 text-slate-600"
                                                        )}
                                                        onClick={() => setSelectedCategory(cat.name)}
                                                    >
                                                        {cat.icon}
                                                        {cat.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button className="w-full h-12 md:h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg font-bold shadow-lg shadow-blue-200 mt-2" onClick={handleCustomSubmit}>
                                        Save Transaction
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
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
