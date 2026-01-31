import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Wallet, Mail, ArrowLeft } from "lucide-react"
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

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
})

export default function ForgotPasswordPage() {
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real app: await fetch("http://localhost:8080/api/auth/forgot-password", ...)

            toast.success("Password reset link sent to your email!");

            // Optional: navigate back to login after delay
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="flex h-screen w-full flex-col lg:flex-row">
            {/* Left Side - Branding */}
            <div className="relative flex h-full w-full flex-col justify-between bg-blue-600 p-10 text-white lg:w-1/2">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "40px 40px"
                    }}
                />

                <div className="relative z-10">
                    <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <Wallet className="h-6 w-6 text-white" />
                    </div>

                    <div className="mt-20 max-w-lg">
                        <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                            Don't worry, we've got you covered.
                        </h1>
                        <p className="mt-6 text-lg text-blue-100">
                            Enter your email and we'll send you instructions to reset your password.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex h-full w-full items-center justify-center bg-white p-8 lg:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            className="pl-0 hover:bg-transparent hover:text-blue-600 mb-4"
                            onClick={() => navigate("/login")}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Button>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Forgot Password?</h2>
                        <p className="text-slate-500">No worries, we'll send you reset instructions.</p>
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
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    placeholder="name@company.com"
                                                    {...field}
                                                    className="pl-10 h-11 bg-slate-50 border-slate-200"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base font-semibold">
                                Reset Password
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
