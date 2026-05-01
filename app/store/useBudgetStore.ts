import { create } from "zustand";
import { getBudgetCategories, getSavingsGoals, seedDemoData } from "../services/database";

export interface BudgetCategory {
  id: string;
  name: string;
  budget_limit: number;
  spent: number;
  color: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
}

interface BudgetState {
  categories: BudgetCategory[];
  goals: SavingsGoal[];
  isLoading: boolean;
  loadBudget: () => Promise<void>;
  getTotalBudget: () => number;
  getTotalSpent: () => number;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  categories: [],
  goals: [],
  isLoading: false,

  loadBudget: async () => {
    set({ isLoading: true });
    await seedDemoData();
    const categories = await getBudgetCategories();
    const goals = await getSavingsGoals();
    set({
      categories: categories as BudgetCategory[],
      goals: goals as SavingsGoal[],
      isLoading: false,
    });
  },

  getTotalBudget: () => {
    return get().categories.reduce((sum, cat) => sum + cat.budget_limit, 0);
  },

  getTotalSpent: () => {
    return get().categories.reduce((sum, cat) => sum + cat.spent, 0);
  },
}));
