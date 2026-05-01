/**
 * Offline-first SQLite database layer.
 * All inventory, receipts, and budget data is stored locally.
 */

import * as SQLite from "expo-sqlite";

const DB_NAME = "smartinventory.db";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DB_NAME);
  await initializeTables(db);
  return db;
}

async function initializeTables(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS inventory_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Uncategorized',
      quantity INTEGER NOT NULL DEFAULT 0,
      price REAL NOT NULL DEFAULT 0.0,
      sku TEXT,
      image_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      store_name TEXT,
      date TEXT,
      total REAL NOT NULL DEFAULT 0.0,
      raw_text TEXT,
      image_uri TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS receipt_items (
      id TEXT PRIMARY KEY,
      receipt_id TEXT NOT NULL,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      sku TEXT,
      price REAL NOT NULL DEFAULT 0.0,
      FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS budget_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      budget_limit REAL NOT NULL DEFAULT 0.0,
      spent REAL NOT NULL DEFAULT 0.0,
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS savings_goals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      target REAL NOT NULL DEFAULT 0.0,
      current REAL NOT NULL DEFAULT 0.0
    );
  `);
}

// ─── Inventory Operations ────────────────────────────────────────────────────

export async function insertInventoryItem(item: {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  sku?: string;
  image_url?: string;
}) {
  const database = await getDatabase();
  const now = new Date().toISOString();
  await database.runAsync(
    `INSERT INTO inventory_items (id, name, category, quantity, price, sku, image_url, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [item.id, item.name, item.category, item.quantity, item.price, item.sku ?? null, item.image_url ?? null, now, now]
  );
}

export async function getAllInventoryItems() {
  const database = await getDatabase();
  return await database.getAllAsync<{
    id: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    sku: string | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
  }>("SELECT * FROM inventory_items ORDER BY updated_at DESC");
}

export async function updateInventoryItem(
  id: string,
  updates: Partial<{ name: string; category: string; quantity: number; price: number; sku: string; image_url: string }>
) {
  const database = await getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return;

  fields.push("updated_at = ?");
  values.push(new Date().toISOString());
  values.push(id);

  await database.runAsync(
    `UPDATE inventory_items SET ${fields.join(", ")} WHERE id = ?`,
    values
  );
}

export async function deleteInventoryItem(id: string) {
  const database = await getDatabase();
  await database.runAsync("DELETE FROM inventory_items WHERE id = ?", [id]);
}

// ─── Receipt Operations ──────────────────────────────────────────────────────

export async function insertReceipt(receipt: {
  id: string;
  store_name?: string;
  date?: string;
  total: number;
  raw_text?: string;
  image_uri?: string;
  items: { id: string; name: string; quantity: number; sku?: string; price: number }[];
}) {
  const database = await getDatabase();
  const now = new Date().toISOString();

  await database.runAsync(
    `INSERT INTO receipts (id, store_name, date, total, raw_text, image_uri, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [receipt.id, receipt.store_name ?? null, receipt.date ?? null, receipt.total, receipt.raw_text ?? null, receipt.image_uri ?? null, now]
  );

  for (const item of receipt.items) {
    await database.runAsync(
      `INSERT INTO receipt_items (id, receipt_id, name, quantity, sku, price)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [item.id, receipt.id, item.name, item.quantity, item.sku ?? null, item.price]
    );
  }
}

export async function getAllReceipts() {
  const database = await getDatabase();
  return await database.getAllAsync<{
    id: string;
    store_name: string | null;
    date: string | null;
    total: number;
    image_uri: string | null;
    created_at: string;
  }>("SELECT * FROM receipts ORDER BY created_at DESC");
}

// ─── Budget Operations ───────────────────────────────────────────────────────

export async function getBudgetCategories() {
  const database = await getDatabase();
  return await database.getAllAsync<{
    id: string;
    name: string;
    budget_limit: number;
    spent: number;
    color: string | null;
  }>("SELECT * FROM budget_categories");
}

export async function upsertBudgetCategory(category: {
  id: string;
  name: string;
  budget_limit: number;
  spent: number;
  color?: string;
}) {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO budget_categories (id, name, budget_limit, spent, color)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET name=?, budget_limit=?, spent=?, color=?`,
    [category.id, category.name, category.budget_limit, category.spent, category.color ?? null,
     category.name, category.budget_limit, category.spent, category.color ?? null]
  );
}

export async function getSavingsGoals() {
  const database = await getDatabase();
  return await database.getAllAsync<{
    id: string;
    name: string;
    target: number;
    current: number;
  }>("SELECT * FROM savings_goals");
}

export async function upsertSavingsGoal(goal: {
  id: string;
  name: string;
  target: number;
  current: number;
}) {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO savings_goals (id, name, target, current)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET name=?, target=?, current=?`,
    [goal.id, goal.name, goal.target, goal.current,
     goal.name, goal.target, goal.current]
  );
}

// ─── Seed Demo Data ──────────────────────────────────────────────────────────

export async function seedDemoData() {
  const database = await getDatabase();
  const count = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM inventory_items"
  );

  if (count && count.count > 0) return; // Already seeded

  // Demo inventory items
  const items = [
    { id: "demo-1", name: "ProBook 14 Gen 2", category: "Electronics", quantity: 2, price: 1299.0, sku: "PB14G2" },
    { id: "demo-2", name: "Fresh Bell Peppers", category: "Groceries", quantity: 45, price: 2.5, sku: "FBP001" },
    { id: "demo-3", name: "Artisan Olive Oil", category: "Groceries", quantity: 18, price: 24.95, sku: "AOO001" },
    { id: "demo-4", name: "Audio-X Wireless", category: "Electronics", quantity: 1, price: 299.0, sku: "AXW001" },
    { id: "demo-5", name: "Ergonomic Office Chair", category: "Home", quantity: 4, price: 249.0, sku: "EOC001" },
    { id: "demo-6", name: "Wireless Mouse M510", category: "Electronics", quantity: 12, price: 29.99, sku: "WMM510" },
  ];

  for (const item of items) {
    await insertInventoryItem(item);
  }

  // Demo budget categories
  const categories = [
    { id: "bcat-1", name: "Inventory", budget_limit: 10000, spent: 4500, color: Colors.primary },
    { id: "bcat-2", name: "Logistics", budget_limit: 5000, spent: 1500, color: Colors.secondary },
    { id: "bcat-3", name: "Operations", budget_limit: 3000, spent: 750, color: Colors.tertiary },
    { id: "bcat-4", name: "Raw Materials", budget_limit: 8000, spent: 7200, color: Colors.error },
    { id: "bcat-5", name: "Shipping Fees", budget_limit: 3500, spent: 3850, color: Colors.warning },
  ];

  for (const cat of categories) {
    await upsertBudgetCategory(cat);
  }

  // Demo savings goals
  await upsertSavingsGoal({ id: "sg-1", name: "New Warehouse", target: 50000, current: 42500 });
}

// Import Colors for seed data
import { Colors } from "../constants/theme";
