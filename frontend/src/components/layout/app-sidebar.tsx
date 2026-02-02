import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AppSidebar({ className }: SidebarProps) {
    const location = useLocation()
    const pathname = location.pathname

    const isActive = (path: string) => pathname === path

    return (
        <aside className={cn("w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 sticky top-0 h-screen", className)}>
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                </div>
                <span className="font-bold text-lg tracking-tight">WealthAI</span>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                <Link
                    to="/dashboard"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive("/dashboard")
                            ? "text-primary bg-blue-50 dark:bg-blue-900/20"
                            : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                >
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="font-medium">Dashboard</span>
                </Link>

                <Link
                    to="/tracker"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive("/tracker")
                            ? "text-primary bg-blue-50 dark:bg-blue-900/20"
                            : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                >
                    <span className="material-symbols-outlined">receipt_long</span>
                    <span className="font-medium">Financial Tracker</span>
                </Link>
                <Link
                    to="/budget"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive("/budget")
                            ? "text-primary bg-blue-50 dark:bg-blue-900/20"
                            : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                >
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                    <span className="font-medium">Budget</span>
                </Link>
                <Link
                    to="/savings-goals"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive("/savings-goals")
                            ? "text-primary bg-blue-50 dark:bg-blue-900/20"
                            : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                >
                    <span className="material-symbols-outlined">savings</span>
                    <span className="font-medium">Savings & Goals</span>
                </Link>
                <Link
                    to="/settings"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive("/settings")
                            ? "text-primary bg-blue-50 dark:bg-blue-900/20"
                            : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                >
                    <span className="material-symbols-outlined">settings</span>
                    <span className="font-medium">Settings</span>
                </Link>
            </nav>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                <div className="mb-4">
                    <p className="font-semibold uppercase tracking-wider mb-2">Support</p>
                    <ul className="space-y-1">
                        <li className="mb-1"><a className="hover:underline" href="#">Documentation</a></li>
                        <li><a className="hover:underline" href="#">Help Center</a></li>
                    </ul>
                </div>
                <p>© 2025 WealthAI Lab</p>
            </div>
        </aside>
    )
}
