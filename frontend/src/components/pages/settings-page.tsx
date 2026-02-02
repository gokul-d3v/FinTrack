import { User, Bell, Shield, Wallet, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight mono-text uppercase">Settings</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your account preferences and app configuration</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Nav (Local) */}
                <nav className="space-y-1 lg:col-span-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-lg font-medium text-sm">
                        <User className="h-4 w-4" />
                        Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium text-sm transition-colors">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium text-sm transition-colors">
                        <Wallet className="h-4 w-4" />
                        Currency & Region
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium text-sm transition-colors">
                        <Shield className="h-4 w-4" />
                        Security
                    </button>
                </nav>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Profile Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Profile Information</CardTitle>
                            <CardDescription>Update your personal details and public profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <img alt="User avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA64BeiGEKS7mc2h3biQyLcMjQugYRMuTPnhoza597dU6mqTfCfFuMZIFmSyuRA5_lFhJPubhI10aABPJNupiml03Imru2EZ4NKtXShDbaKixKvk1H9Zi5rSj7npOYSsGqP5DPFg0wZiB60W4fEa_IXcr-eVd4XovzYOXV-hPxU1crcx8mjhdQVX4PH0gz1exaMRrwPZkNACGH5VDlJokA5IvI0AYjsag0fiw-e4Y-gNzyppP7nddsGb2ALWEy59qj7ONW_plJFaVY" />
                                </div>
                                <div className="space-y-2">
                                    <Button variant="outline" size="sm">Change Avatar</Button>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">JPG, GIF or PNG. Max size 800K</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" defaultValue="Richu" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" defaultValue="User" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" defaultValue="richu@example.com" type="email" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Input id="bio" defaultValue="Building the future of finance." />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Preferences */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">App Preferences</CardTitle>
                            <CardDescription>Customize your experience.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Dark Mode</Label>
                                    <p className="text-sm text-slate-500">Toggle dark mode manually or sync with system.</p>
                                </div>
                                <Switch checked={true} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Compact Mode</Label>
                                    <p className="text-sm text-slate-500">Show more data on the screen by reducing spacing.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button className="bg-primary text-white flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
