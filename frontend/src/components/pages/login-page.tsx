

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { login } from "@/lib/api";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await login(data);
            toast.success("Login successful!");
            // Store full response (includes user + token) so api interceptor can find .token
            localStorage.setItem("user", JSON.stringify(response));
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Invalid email or password");
        }
    };

    return (
        <div className="bg-white text-slate-900 min-h-screen flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-6xl h-[800px] flex overflow-hidden rounded-[32px] shadow-2xl shadow-blue-100 border border-slate-100">
                <div className="hidden lg:flex w-1/2 bg-soft-blue relative p-16 flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 grid-bg opacity-40" style={{
                        backgroundSize: '40px 40px',
                        backgroundImage: 'radial-gradient(circle, #3b82f620 1px, transparent 1px)'
                    }}></div>
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-slate-900">WealthAI</span>
                    </div>
                    <div className="relative z-10 max-w-md">
                        <span className="material-symbols-outlined text-6xl text-primary/20 mb-6">format_quote</span>
                        <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-6">
                            Financial freedom is a mental, emotional and educational process.
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-0.5 bg-primary/30"></div>
                            <p className="text-slate-500 font-medium tracking-wide uppercase text-sm">WealthAI Intelligence</p>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                            <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                        </div>
                    </div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl"></div>
                </div>
                <div className="flex-1 bg-white flex flex-col justify-center items-center px-8 lg:px-24">
                    <div className="w-full max-w-md">
                        <div className="lg:hidden flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                            </div>
                            <span className="font-bold text-2xl tracking-tight">WealthAI</span>
                        </div>
                        <div className="mb-10 pt-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome Back</h2>
                            <p className="text-slate-500">Access your personalized financial intelligence dashboard.</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">Email Address</label>
                                <input {...register("email")} className={`w-full px-4 py-3 bg-white border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-900`} id="email" placeholder="name@company.com" type="email" />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                                    <a className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors" href="#">Forgot Password?</a>
                                </div>
                                <div className="relative">
                                    <input {...register("password")} className={`w-full px-4 py-3 bg-white border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-900`} id="password" placeholder="••••••••" type={showPassword ? "text" : "password"} />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" type="button" onClick={() => setShowPassword(!showPassword)}>
                                        <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>
                            <div className="flex items-center">
                                <input className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary/20" id="remember" type="checkbox" />
                                <label className="ml-2 text-sm text-slate-600" htmlFor="remember">Remember for 30 days</label>
                            </div>
                            <button disabled={isSubmitting} className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? "Logging In..." : "Log In"}
                            </button>
                        </form>
                        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center gap-6">
                            <p className="text-slate-500 text-sm">
                                Don't have an account?
                                <Link className="text-primary font-bold hover:underline ml-1" to="/register">Sign up for free</Link>
                            </p>
                            <div className="flex items-center gap-4 w-full">
                                <div className="h-px bg-slate-100 flex-1"></div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
                                <div className="h-px bg-slate-100 flex-1"></div>
                            </div>
                            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-medium">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                Log in with Google
                            </button>
                        </div>
                    </div>
                    <div className="mt-auto py-8 text-[11px] text-slate-400 font-medium uppercase tracking-widest text-center">
                        © 2025 WealthAI Lab. Securely encrypted.
                    </div>
                </div>
            </div>
        </div>
    );
}
