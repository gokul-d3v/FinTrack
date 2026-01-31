import { zodResolver } from "@hookform/resolvers/zod"
import signupImage from "@/assets/signup-image.png"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Wallet, User, Mail, Lock, Check, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"
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
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and privacy policy.",
    }),
})

export default function SignupPage() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            terms: false,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to create account");
                return;
            }

            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="flex h-screen w-full flex-col lg:flex-row">
            {/* Left Side - Branding */}
            <div className="relative flex h-full w-full flex-col justify-center items-center bg-blue-50/50 p-10 lg:w-1/2">
                <div className="absolute top-10 left-10 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                        <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900">FinTracker</span>
                </div>

                <div className="relative w-full max-w-md">
                    <div className="aspect-[4/5] w-full rounded-2xl bg-white p-2 shadow-2xl rotate-[-2deg] transition-transform hover:rotate-0">
                        <div className="h-full w-full overflow-hidden rounded-xl bg-green-100 relative group">
                            <img
                                src={signupImage}
                                alt="Money growth"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <h2 className="text-3xl font-bold text-slate-900">Master your personal finance</h2>
                    <p className="mt-4 text-slate-500 max-w-sm mx-auto">
                        Join thousands of users who have taken control of their spending habits and started saving for their dreams today.
                    </p>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="flex h-full w-full items-center justify-center bg-white p-8 lg:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
                        <p className="text-slate-500">Start your 14-day free trial today.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Full Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    placeholder="John Doe"
                                                    {...field}
                                                    className="pl-10 h-11 bg-white border-slate-200"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Email address</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    placeholder="john@example.com"
                                                    {...field}
                                                    className="pl-10 h-11 bg-white border-slate-200"
                                                />
                                            </div>
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
                                        <FormLabel className="text-slate-700 font-semibold">Create Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    {...field}
                                                    className="pl-10 pr-10 h-11 bg-white border-slate-200"
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

                            <FormField
                                control={form.control}
                                name="terms"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-slate-500 font-normal">
                                                I agree to the <a href="#" className="text-blue-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 font-semibold hover:underline">Privacy Policy</a>.
                                            </FormLabel>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base font-semibold group">
                                Create Account
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Button>
                        </form>
                    </Form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-slate-500 font-medium">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" className="w-full h-11 border-slate-200 text-slate-700 font-medium hover:bg-slate-50" type="button">
                            <FcGoogle className="mr-2 h-5 w-5" />
                            Google
                        </Button>
                        <Button variant="outline" className="w-full h-11 border-slate-200 text-slate-700 font-medium hover:bg-slate-50" type="button">
                            <FaFacebook className="mr-2 h-5 w-5 text-blue-600" />
                            Facebook
                        </Button>
                    </div>

                    <div className="text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                            Log In
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
