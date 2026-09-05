import { db } from "./index";

export function initializeDatabase() {
  db.execSync(`PRAGMA foreign_keys = ON;`);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount INTEGER NOT NULL CHECK (amount > 0),
      category TEXT NOT NULL,
      date INTEGER NOT NULL,
      notes TEXT,
      receipt_uri TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
    CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      monthly_budget INTEGER NOT NULL CHECK (monthly_budget >= 0),
      currency TEXT NOT NULL DEFAULT 'INR',
      onboarding_completed INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- SPLIT BILLS TABLE
    CREATE TABLE IF NOT EXISTS split_bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      total_amount INTEGER NOT NULL CHECK (total_amount > 0),
      paid_by TEXT NOT NULL DEFAULT 'You',
      date INTEGER NOT NULL,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'unsettled' CHECK (status IN ('unsettled', 'partially_settled', 'settled')),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- SPLIT PARTICIPANTS TABLE
    CREATE TABLE IF NOT EXISTS split_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      split_bill_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      share_amount INTEGER NOT NULL CHECK (share_amount >= 0),
      is_paid INTEGER NOT NULL DEFAULT 0 CHECK (is_paid IN (0, 1)),
      paid_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (split_bill_id) REFERENCES split_bills(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_split_bills_date ON split_bills(date);
    CREATE INDEX IF NOT EXISTS idx_split_participants_bill_id ON split_participants(split_bill_id);
  `);
}