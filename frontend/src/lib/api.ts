import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Transaction {
    id: string;
    description: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
}

export interface DashboardData {
    stats: {
        totalBalance: number;
        totalIncome: number;
        totalExpense: number;
    };
    transactions: Transaction[];
    monthlyStats: {
        _id: { year: number; month: number };
        income: number;
        expense: number;
    }[];
    categoryStats: {
        _id: string;
        value: number;
    }[];
    dailyStats: {
        _id: { year: number; month: number; day: number };
        income: number;
        expense: number;
    }[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
    const response = await api.get('/dashboard');
    return response.data;
};

export const getTransactions = async (): Promise<Transaction[]> => {
    const response = await api.get('/transactions');
    return response.data;
};

export const createTransaction = async (data: Omit<Transaction, 'id'>) => {
    const response = await api.post('/transactions', data);
    return response.data;
};

export const seedData = async () => {
    const response = await api.get('/seed');
    return response.data;
};

export interface Goal {
    id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    color: string;
    icon: string;
}

export const getGoals = async (): Promise<Goal[]> => {
    const response = await api.get('/goals');
    return response.data;
};

export const createGoal = async (data: Omit<Goal, 'id'>) => {
    console.log("Sending create goal request:", data);
    try {
        const response = await api.post('/goals', data);
        console.log("Create goal response:", response);
        return response.data;
    } catch (error) {
        console.error("Create goal error:", error);
        throw error;
    }
};

export const updateGoal = async (id: string, data: Partial<Goal>) => {
    const response = await api.put(`/goals/${id}`, data);
    return response.data;
};

export const deleteGoal = async (id: string) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
};

export interface CategoryStatus {
    id: string;
    name: string;
    limit: number;
    spent: number;
    percentage: number;
    status: string;
    statusColor: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    progressColor: string;
}

export interface BudgetOverviewResponse {
    totalBudget: number;
    spentSoFar: number;
    remaining: number;
    percentageUsed: number;
    categories: CategoryStatus[];
}

export interface BudgetCategory {
    id: string;
    userId: string;
    name: string;
    limit: number;
    icon: string;
    color: string;
}

export const getBudgetOverview = async (): Promise<BudgetOverviewResponse> => {
    const response = await api.get('/budget');
    return response.data;
};

export const createBudgetCategory = async (data: Omit<BudgetCategory, 'id' | 'userId'>) => {
    const response = await api.post('/budget/category', data);
    return response.data;
};

export const updateBudgetCategory = async (id: string, data: Partial<BudgetCategory>) => {
    const response = await api.put(`/budget/category/${id}`, data);
    return response.data;
};

export const deleteBudgetCategory = async (id: string) => {
    const response = await api.delete(`/budget/category/${id}`);
    return response.data;
};

export default api;
