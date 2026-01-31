import {
    LayoutDashboard,
    Wallet,
    BarChart3,
    Settings,
    PiggyBank,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname

    const isActive = (path: string) => pathname === path

    return (
        <aside className="hidden fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white md:block">
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
                        className={`w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium ${isActive('/dashboard')
                                ? "bg-blue-50 text-blue-600 font-semibold"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        onClick={() => navigate("/dashboard")}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Button>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium ${isActive('/transactions')
                                ? "bg-blue-50 text-blue-600 font-semibold"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        onClick={() => navigate("/transactions")}
                    >
                        <Wallet className="h-5 w-5" />
                        Transactions
                    </Button>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium ${isActive('/budget')
                                ? "bg-blue-50 text-blue-600 font-semibold"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        onClick={() => navigate("/budget")}
                    >
                        <PiggyBank className="h-5 w-5" />
                        Budget
                    </Button>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium ${isActive('/reports')
                                ? "bg-blue-50 text-blue-600 font-semibold"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                    >
                        <BarChart3 className="h-5 w-5" />
                        Reports
                    </Button>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium ${isActive('/settings')
                                ? "bg-blue-50 text-blue-600 font-semibold"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}
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
    )
}
