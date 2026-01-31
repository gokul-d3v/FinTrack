import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Wallet, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { FaApple } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

export default function LoginPage() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to sign in");
                return;
            }

            toast.success("Signed in successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        }
    }

    const handleSocialLogin = (provider: string) => {
        toast.success(`Successfully logged in with ${provider}`);
        navigate("/dashboard");
    }

    return (
        <div className="flex h-screen w-full flex-col lg:flex-row">
            {/* Left Side - Branding */}
            <div className="relative flex h-full w-full flex-col justify-between bg-blue-600 p-10 text-white lg:w-1/2">
                {/* Grid Background Pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "40px 40px"
                    }}
                />

                {/* Content */}
                <div className="relative z-10">
                    {/* Logo Icon */}
                    <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <Wallet className="h-6 w-6 text-white" />
                    </div>

                    <div className="mt-20 max-w-lg">
                        <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                            Financial freedom is available to those who learn about it and work for it.
                        </h1>
                        <div className="mt-8 flex items-center gap-4">
                            <Separator className="w-10 bg-white/50" />
                            <p className="text-lg font-medium italic text-blue-100">Robert Kiyosaki</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex h-full w-full items-center justify-center bg-white p-8 lg:w-1/2">
                <div className="w-full max-w-lg space-y-8">
                    <div className="space-y-2">
                        <div className="mb-6 flex items-center gap-2 lg:hidden">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                                <Wallet className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">FinTracker</span>
                        </div>

                        <div className="hidden lg:flex items-center gap-2 mb-10">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                <Wallet className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">FinTracker</span>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
                        <p className="text-slate-500">Please enter your details to sign in.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Email Address
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="name@company.com"
                                                {...field}
                                                className="bg-slate-50 h-11 border-slate-200"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Password
                                            </FormLabel>
                                            <Button
                                                variant="link"
                                                className="h-auto p-0 text-xs font-semibold text-blue-600"
                                                type="button"
                                                onClick={() => navigate("/forgot-password")}
                                            >
                                                Forgot Password?
                                            </Button>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    {...field}
                                                    className="bg-slate-50 h-11 border-slate-200 tracking-widest pr-10"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-slate-400" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-slate-400" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base font-semibold">
                                Sign In
                            </Button>
                        </form>
                    </Form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-slate-500 font-bold tracking-wide">
                                Or Continue With
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            className="w-full h-11 border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
                            type="button"
                            onClick={() => handleSocialLogin('Google')}
                        >
                            <FcGoogle className="mr-2 h-5 w-5" />
                            Google
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-11 border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
                            type="button"
                            onClick={() => handleSocialLogin('Apple')}
                        >
                            <FaApple className="mr-2 h-5 w-5" />
                            Apple
                        </Button>
                    </div>

                    <div className="text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <span
                            onClick={() => navigate("/signup")}
                            className="font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                            Sign Up
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
