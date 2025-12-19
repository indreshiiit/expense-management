import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  AuthResponse,
  Expense,
  ExpenseFormData,
  MonthlySummary,
  CategoryStats,
} from '@types/index';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async createExpense(data: ExpenseFormData): Promise<Expense> {
    const response = await this.client.post<Expense>('/expenses', data);
    return response.data;
  }

  async getExpenses(startDate?: string, endDate?: string): Promise<Expense[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await this.client.get<Expense[]>('/expenses', { params });
    return response.data;
  }

  async getExpense(id: string): Promise<Expense> {
    const response = await this.client.get<Expense>(`/expenses/${id}`);
    return response.data;
  }

  async updateExpense(id: string, data: Partial<ExpenseFormData>): Promise<Expense> {
    const response = await this.client.put<Expense>(`/expenses/${id}`, data);
    return response.data;
  }

  async deleteExpense(id: string): Promise<void> {
    await this.client.delete(`/expenses/${id}`);
  }

  async getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    const response = await this.client.get<MonthlySummary>('/expenses/summary', {
      params: { year, month },
    });
    return response.data;
  }

  async getCategoryStats(startDate?: string, endDate?: string): Promise<CategoryStats[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await this.client.get<CategoryStats[]>('/expenses/stats', { params });
    return response.data;
  }
}

export const api = new ApiService();
