import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { register } from "@/lib/api";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
};

const requirements = [
    { regex: /.{8,}/, label: "At least 8 characters" },
    { regex: /[A-Z]/, label: "One uppercase letter" },
    { regex: /[0-9]/, label: "One number" },
    { regex: /[^A-Za-z0-9]/, label: "One special character" },
];

export function RegisterPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register: registerField, handleSubmit, setError, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema)
    });

    const passwordValue = watch("password", "");
    const strength = getPasswordStrength(passwordValue);

    const getStrengthColor = (s: number) => {
        if (s === 0) return "bg-slate-200";
        if (s <= 2) return "bg-red-500";
        if (s === 3) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getStrengthText = (s: number) => {
        if (s === 0) return "";
        if (s <= 2) return "Weak";
        if (s === 3) return "Medium";
        return "Strong";
    };

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await register({ name: data.name, email: data.email, password: data.password });
            toast.success("Account created successfully!");
            navigate("/login");
        } catch (error: any) {
            if (error.response?.status === 409) {
                setError("email", { type: "manual", message: "Email already exists" });
            } else {
                toast.error(error.response?.data?.error || "Failed to create account");
            }
        }
    };

    return (
        <div className="bg-white text-slate-900 min-h-screen font-sans">
            <div className="flex min-h-screen">
                <div className="hidden lg:flex lg:w-1/2 bg-[#f0f7ff] relative items-center justify-center p-12 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-30">
                        <svg height="100%" viewBox="0 0 800 800" width="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb" strokeWidth="0.5"></path>
                                </pattern>
                            </defs>
                            <rect fill="url(#grid)" height="100%" width="100%"></rect>
                        </svg>
                    </div>
                    <div className="relative z-10 w-full max-w-lg">
                        <div className="mb-12">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-6">
                                <span className="material-symbols-outlined text-3xl">auto_graph</span>
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Master your wealth with <span className="text-primary">AI-driven</span> precision.</h2>
                            <p className="text-lg text-slate-600">Join thousands of high-net-worth individuals who rely on WealthAI for sophisticated financial management and growth tracking.</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white shadow-2xl relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portfolio Growth</p>
                                    <p className="text-2xl font-bold font-mono text-slate-900">+$24,850.00</p>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                                    <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                </div>
                            </div>
                            <div className="h-48 w-full relative">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
                                    <path className="fill-blue-50/50" d="M0,150 L0,110 Q50,105 100,120 T200,80 T300,90 T400,30 L400,150 Z"></path>
                                    <path className="drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]" d="M0,110 Q50,105 100,120 T200,80 T300,90 T400,30" fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="3"></path>
                                    <circle cx="100" cy="120" fill="white" r="4" stroke="#2563eb" strokeWidth="2"></circle>
                                    <circle cx="200" cy="80" fill="white" r="4" stroke="#2563eb" strokeWidth="2"></circle>
                                    <circle cx="400" cy="30" fill="#2563eb" r="5"></circle>
                                </svg>
                            </div>
                            <div className="grid grid-cols-4 mt-6">
                                <div className="h-1 bg-slate-100 rounded-full"></div>
                                <div className="h-1 bg-slate-100 rounded-full mx-1"></div>
                                <div className="h-1 bg-slate-100 rounded-full mx-1"></div>
                                <div className="h-1 bg-primary rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                    <div className="w-full max-w-md">
                        <div className="lg:hidden flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight">WealthAI</span>
                        </div>
                        <div className="mb-10">
                            <div className="hidden lg:flex items-center gap-2 mb-8 text-slate-400">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                                </div>
                                <span className="font-bold text-lg tracking-tight text-slate-900">WealthAI</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your Account</h1>
                            <p className="text-slate-500">Start your journey to financial freedom today.</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="fullname">Full Name</label>
                                <input {...registerField("name")} className={`w-full px-4 py-3 rounded-2xl border ${errors.name ? 'border-red-500' : 'border-slate-200'} focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-900 placeholder:text-slate-400`} id="fullname" placeholder="John Doe" type="text" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">Email Address</label>
                                <input {...registerField("email")} className={`w-full px-4 py-3 rounded-2xl border ${errors.email ? 'border-red-500' : 'border-slate-200'} focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-900 placeholder:text-slate-400`} id="email" placeholder="name@company.com" type="email" />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">Password</label>
                                <div className="relative">
                                    <input {...registerField("password")} className={`w-full px-4 py-3 rounded-2xl border ${errors.password ? 'border-red-500' : 'border-slate-200'} focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-900 placeholder:text-slate-400`} id="password" placeholder="••••••••" type={showPassword ? "text" : "password"} />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" type="button" onClick={() => setShowPassword(!showPassword)}>
                                        <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                                    </button>
                                </div>
                                {passwordValue && (
                                    <div className="mt-2 text-xs">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-slate-500">Password strength: <span className={`font-semibold ${strength <= 2 ? 'text-red-500' : strength === 3 ? 'text-yellow-500' : 'text-green-500'}`}>{getStrengthText(strength)}</span></span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                                            <div className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`} style={{ width: `${(strength / 4) * 100}%` }}></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {requirements.map((req, index) => (
                                                <div key={index} className="flex items-center gap-1.5">
                                                    <span className={`material-symbols-outlined text-[14px] ${req.regex.test(passwordValue) ? 'text-green-500' : 'text-slate-300'}`}>
                                                        {req.regex.test(passwordValue) ? 'check_circle' : 'radio_button_unchecked'}
                                                    </span>
                                                    <span className={`${req.regex.test(passwordValue) ? 'text-slate-700' : 'text-slate-400'}`}>{req.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                                <p className="mt-2 text-[11px] text-slate-500">Must be at least 8 characters long.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="confirm-password">Confirm Password</label>
                                <div className="relative">
                                    <input {...registerField("confirmPassword")} className={`w-full px-4 py-3 rounded-2xl border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-900 placeholder:text-slate-400`} id="confirm-password" placeholder="••••••••" type={showConfirmPassword ? "text" : "password"} />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <span className="material-symbols-outlined text-xl">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" id="terms" type="checkbox" required />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label className="text-slate-500" htmlFor="terms">
                                        I agree to the <a className="text-primary font-medium hover:underline" href="#">Terms of Service</a> and <a className="text-primary font-medium hover:underline" href="#">Privacy Policy</a>.
                                    </label>
                                </div>
                            </div>
                            <button disabled={isSubmitting} className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
                                {isSubmitting ? "Creating Account..." : "Create Account"}
                                {!isSubmitting && <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                            </button>
                        </form>
                        <div className="mt-10 text-center">
                            <p className="text-slate-500 text-sm">
                                Already have an account?
                                <Link className="text-primary font-bold hover:underline ml-1" to="/login">Log in</Link>
                            </p>
                        </div>
                        <div className="mt-12 flex justify-center gap-6">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">lock</span> Secure Encryption
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">verified_user</span> GDPR Compliant
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
