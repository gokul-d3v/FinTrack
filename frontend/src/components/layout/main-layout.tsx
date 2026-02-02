import { AppSidebar } from "./app-sidebar"
import { Header } from "./header"

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 min-h-screen flex font-display">
            <div className="hidden md:block">
                <AppSidebar className="" />
            </div>
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <div className="flex-1 overflow-auto bg-background-light dark:bg-background-dark">
                    {children}
                </div>
            </main>
        </div>
    )
}
