/**
 * Inventory store — offline-first state management backed by SQLite.
 */

import { create } from "zustand";
import {
  getAllInventoryItems,
  insertInventoryItem,
  updateInventoryItem as dbUpdate,
  deleteInventoryItem as dbDelete,
  seedDemoData,
} from "../services/database";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  sku: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface InventoryState {
  items: InventoryItem[];
  categories: string[];
  activeFilter: string;
  searchQuery: string;
  isLoading: boolean;
  setFilter: (filter: string) => void;
  setSearch: (query: string) => void;
  loadItems: () => Promise<void>;
  addItem: (item: Omit<InventoryItem, "created_at" | "updated_at">) => Promise<void>;
  updateItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  addFromReceipt: (items: { name: string; quantity: number; sku?: string; price: number }[]) => Promise<void>;
  getFilteredItems: () => InventoryItem[];
  getTotalValuation: () => number;
  getLowStockCount: () => number;
}

function generateId() {
  return `inv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  categories: ["All Items", "Groceries", "Electronics", "Home"],
  activeFilter: "All Items",
  searchQuery: "",
  isLoading: false,

  setFilter: (filter) => set({ activeFilter: filter }),
  setSearch: (query) => set({ searchQuery: query }),

  loadItems: async () => {
    set({ isLoading: true });
    await seedDemoData();
    const items = await getAllInventoryItems();
    const categorySet = new Set(["All Items", ...items.map((i) => i.category)]);
    set({ items, categories: Array.from(categorySet), isLoading: false });
  },

  addItem: async (item) => {
    await insertInventoryItem(item);
    await get().loadItems();
  },

  updateItem: async (id, updates) => {
    await dbUpdate(id, updates);
    await get().loadItems();
  },

  removeItem: async (id) => {
    await dbDelete(id);
    await get().loadItems();
  },

  addFromReceipt: async (receiptItems) => {
    for (const ri of receiptItems) {
      await insertInventoryItem({
        id: generateId(),
        name: ri.name,
        category: "Uncategorized",
        quantity: ri.quantity,
        price: ri.price,
        sku: ri.sku,
      });
    }
    await get().loadItems();
  },

  getFilteredItems: () => {
    const { items, activeFilter, searchQuery } = get();
    let filtered = items;

    if (activeFilter !== "All Items") {
      filtered = filtered.filter((i) => i.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) => i.name.toLowerCase().includes(q) || i.sku?.toLowerCase().includes(q)
      );
    }

    return filtered;
  },

  getTotalValuation: () => {
    return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  getLowStockCount: () => {
    return get().items.filter((i) => i.quantity <= 5).length;
  },
}));
