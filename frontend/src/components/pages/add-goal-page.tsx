import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createGoal } from "@/lib/api";

export default function AddGoalPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        target_amount: "",
        initial_amount: "",
        color: "bg-blue-500",
        icon: "savings"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSelectChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        if (!formData.name) {
            toast.error("Please enter a goal name");
            return;
        }
        if (!formData.target_amount) {
            toast.error("Please enter a target amount");
            return;
        }

        const target = parseFloat(formData.target_amount);
        if (isNaN(target) || target <= 0) {
            toast.error("Please enter a valid target amount greater than 0");
            return;
        }

        const current = parseFloat(formData.initial_amount);

        setLoading(true);
        try {
            console.log("Submitting goal to API...");
            await createGoal({
                name: formData.name,
                target_amount: target,
                current_amount: isNaN(current) ? 0 : current,
                color: formData.color,
                icon: formData.icon
            });
            console.log("Goal created successfully, navigating...");
            toast.success("Savings goal created successfully!");
            navigate("/savings-goals");
        } catch (error) {
            console.error("Failed to create goal:", error);
            toast.error("Failed to save goal. Please check the console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mono-text uppercase">New Savings Goal</h1>
                    <p className="text-slate-500 text-sm mt-1">Set a target and start saving</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Goal Details</CardTitle>
                    <CardDescription>Define what you are saving for.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Goal Name</Label>
                        <Input id="name" placeholder="e.g. Dream Vacation" value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="target_amount">Target Amount</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <Input id="target_amount" type="number" placeholder="0.00" className="pl-7" value={formData.target_amount} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="initial_amount">Initial Savings</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <Input id="initial_amount" type="number" placeholder="0.00" className="pl-7" value={formData.initial_amount} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Color Code</Label>
                            <Select value={formData.color} onValueChange={(val) => handleSelectChange("color", val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bg-blue-500">Blue</SelectItem>
                                    <SelectItem value="bg-green-500">Green</SelectItem>
                                    <SelectItem value="bg-purple-500">Purple</SelectItem>
                                    <SelectItem value="bg-orange-500">Orange</SelectItem>
                                    <SelectItem value="bg-red-500">Red</SelectItem>
                                    <SelectItem value="bg-pink-500">Pink</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Icon</Label>
                            <Select value={formData.icon} onValueChange={(val) => handleSelectChange("icon", val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="savings">Savings Piggy</SelectItem>
                                    <SelectItem value="house">House</SelectItem>
                                    <SelectItem value="directions_car">Car</SelectItem>
                                    <SelectItem value="flight">Travel</SelectItem>
                                    <SelectItem value="school">Education</SelectItem>
                                    <SelectItem value="favorite">Wellness</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button className="w-full bg-primary text-white" size="lg" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Saving..." : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Goal
                                </>
                            )}
                        </Button>
                        <Button variant="outline" className="w-full" size="lg" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
