import { useTheme } from "@/components/theme-provider"

export function Header() {
    const { setTheme, theme } = useTheme()

    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors md:hidden">
                    <span className="material-symbols-outlined text-slate-500">menu</span>
                </button>
                <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    <span className="text-sm mono-text uppercase tracking-widest text-[10px]">Real-time Sync Active</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    <span className="material-symbols-outlined text-slate-500">dark_mode</span>
                </button>
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600">
                    <img alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA64BeiGEKS7mc2h3biQyLcMjQugYRMuTPnhoza597dU6mqTfCfFuMZIFmSyuRA5_lFhJPubhI10aABPJNupiml03Imru2EZ4NKtXShDbaKixKvk1H9Zi5rSj7npOYSsGqP5DPFg0wZiB60W4fEa_IXcr-eVd4XovzYOXV-hPxU1crcx8mjhdQVX4PH0gz1exaMRrwPZkNACGH5VDlJokA5IvI0AYjsag0fiw-e4Y-gNzyppP7nddsGb2ALWEy59qj7ONW_plJFaVY" />
                </div>
            </div>
        </header>
    )
}
