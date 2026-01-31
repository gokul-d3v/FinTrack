import {
    Calendar,
    Plus,
    Utensils,
    Home,
    Plane,
    Music,
    Zap,
    ShoppingBag,
    Pencil,
    Bus,
    Loader2
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"

// Icon mapping
const iconMap: Record<string, any> = {
    Utensils: <Utensils className="h-5 w-5" />,
    Home: <Home className="h-5 w-5" />,
    Plane: <Plane className="h-5 w-5" />,
    Bus: <Bus className="h-5 w-5" />,
    Music: <Music className="h-5 w-5" />,
    Zap: <Zap className="h-5 w-5" />,
    ShoppingBag: <ShoppingBag className="h-5 w-5" />,
}

interface CategoryStatus {
    id: string
    name: string
    limit: number
    spent: number
    percentage: number
    status: string
    statusColor: string
    icon: string
    iconBg: string
    iconColor: string
    progressColor: string
}

interface BudgetData {
    totalBudget: number
    spentSoFar: number
    remaining: number
    percentageUsed: number
    categories: CategoryStatus[]
}

export default function BudgetPlannerPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<BudgetData | null>(null)

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/budget")
                if (!response.ok) {
                    throw new Error("Failed to fetch budget data")
                }
                const result = await response.json()
                setData(result)
            } catch (error) {
                console.error(error)
                toast.error("Failed to load budget data")
            } finally {
                setLoading(false)
            }
        }

        fetchBudget()
    }, [])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    // Default empty state if no data
    const totalBudget = data?.totalBudget || 0
    const spentSoFar = data?.spentSoFar || 0
    const remaining = data?.remaining || 0
    const percentageUsed = data?.percentageUsed || 0
    const categories = data?.categories || []

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Desktop Sidebar */}
            <AppSidebar />

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Monthly Budget</h1>
                        <p className="mt-1 text-slate-500">Manage your monthly spending limits and tracking</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            October 2023
                        </Button>
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4" />
                            New Category
                        </Button>
                    </div>
                </div>

                {/* Budget Overview Card */}
                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-12">
                        {/* Circular Progress */}
                        <div className="relative flex-shrink-0">
                            <svg className="transform -rotate-90" width="180" height="180">
                                <circle
                                    cx="90"
                                    cy="90"
                                    r="70"
                                    stroke="#E2E8F0"
                                    strokeWidth="16"
                                    fill="none"
                                />
                                <circle
                                    cx="90"
                                    cy="90"
                                    r="70"
                                    stroke="#3B82F6"
                                    strokeWidth="16"
                                    fill="none"
                                    strokeDasharray={`${percentageUsed * 4.4} ${440 - percentageUsed * 4.4} `}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-4xl font-bold text-slate-900">{percentageUsed}%</p>
                                <p className="text-xs font-medium text-slate-400 uppercase">Used</p>
                            </div>
                        </div>

                        {/* Budget Stats */}
                        <div className="flex flex-1 items-center justify-around">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-2">Total Budget</p>
                                <p className="text-3xl font-bold text-slate-900">${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-2">Spent So Far</p>
                                <p className="text-3xl font-bold text-slate-900">${spentSoFar.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-2">Remaining</p>
                                <p className={`${remaining < 0 ? 'text-red-600' : 'text-green-600'} text - 3xl font - bold`}>${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Budget Categories */}
                <div>
                    <h2 className="mb-6 text-xl font-bold text-slate-900">Budget Categories</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Category Header */}
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h - 12 w - 12 items - center justify - center rounded - xl ${category.iconBg} `}>
                                            <div className={category.iconColor}>
                                                {iconMap[category.icon] || <Utensils className="h-5 w-5" />}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{category.name}</h3>
                                            <p className="text-xs text-slate-500">{category.percentage}% of limit</p>
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Amount and Budget */}
                                <div className="mb-3">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-slate-900">${category.spent}</span>
                                        <span className="text-sm text-slate-400">/ ${category.limit}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-3">
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h - full ${category.progressColor} rounded - full transition - all duration - 500`}
                                            style={{ width: `${Math.min(category.percentage, 100)}% ` }}
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex justify-end">
                                    <span className={`text - xs font - bold ${category.statusColor} `}>
                                        {category.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
