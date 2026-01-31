import * as React from "react"
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
    Car,
    CalendarIcon,
    X,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { toast } from "sonner"

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

const formSchema = z.object({
    amount: z.string().min(1, "Amount is required"),
    description: z.string().min(2, "Description is required"),
    category: z.string().min(1, "Category is required"),
    date: z.date({
        required_error: "Date is required",
    }),
})

export default function TransactionsPage() {
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: "",
            description: "",
            category: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const payload = {
                ...values,
                amount: parseFloat(values.amount) * -1, // Defaulting to expense for now as per UI implication
                type: "expense"
            }

            const response = await fetch("http://localhost:8080/api/transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to save")

            toast.success("Transaction saved successfully")
            setOpen(false)
            form.reset()
            // In a real app, refetch transactions here
        } catch (error) {
            toast.error("Failed to save transaction")
        }
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

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-blue-600 font-semibold hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Transaction
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-0 shadow-2xl">
                            <div className="p-6 pb-0">
                                <DialogHeader className="flex flex-row items-center justify-between mb-4">
                                    <DialogTitle className="text-xl font-bold">Add Transaction</DialogTitle>
                                </DialogHeader>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        {/* Amount Field */}
                                        <FormField
                                            control={form.control}
                                            name="amount"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1">
                                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Amount</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-300">$</span>
                                                            <Input
                                                                placeholder="0.00"
                                                                {...field}
                                                                className="border-0 border-b border-blue-600 rounded-none px-6 text-4xl font-bold text-slate-900 placeholder:text-slate-200 focus-visible:ring-0 focus-visible:border-blue-700 h-16"
                                                                type="number"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Description Field */}
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1">
                                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="e.g. Weekly Groceries"
                                                            {...field}
                                                            className="bg-slate-50 border-slate-200 h-11"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Category Field */}
                                            <FormField
                                                control={form.control}
                                                name="category"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1">
                                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="bg-slate-50 border-slate-200 h-11">
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Groceries">Groceries</SelectItem>
                                                                <SelectItem value="Dining">Dining</SelectItem>
                                                                <SelectItem value="Utilities">Utilities</SelectItem>
                                                                <SelectItem value="Entertainment">Entertainment</SelectItem>
                                                                <SelectItem value="Transport">Transport</SelectItem>
                                                                <SelectItem value="Income">Income</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Date Field */}
                                            <FormField
                                                control={form.control}
                                                name="date"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1">
                                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Date</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-full pl-3 text-left font-normal bg-slate-50 border-slate-200 h-11",
                                                                            !field.value && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        {field.value ? (
                                                                            format(field.value, "MM/dd/yyyy")
                                                                        ) : (
                                                                            <span>Pick a date</span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value}
                                                                    onSelect={field.onChange}
                                                                    disabled={(date) =>
                                                                        date > new Date() || date < new Date("1900-01-01")
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <DialogFooter className="py-4">
                                            <DialogClose asChild>
                                                <Button type="button" variant="ghost" className="h-11 px-8">
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button type="submit" className="h-11 bg-blue-600 hover:bg-blue-700 w-full md:w-auto font-semibold">
                                                Save Transaction
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </div>
                        </DialogContent>
                    </Dialog>
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
