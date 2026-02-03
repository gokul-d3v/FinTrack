import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const data = JSON.parse(userStr);
                // Check if data has token (new format) or is just user object
                // We'll standardize on storing { token: "...", user: {...} } or similar
                if (data.token) {
                    config.headers.Authorization = `Bearer ${data.token}`;
                }
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            // Optional: Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

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
    return response.data || [];
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
    return response.data || [];
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

export const register = async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

export const login = async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};



export default api;
