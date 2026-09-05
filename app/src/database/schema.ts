import { db } from "./index";

export function initializeDatabase() {
    db.execSync(`PRAGMA foreign_keys = ON;`);

    db.execSync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Stored in PAISE to avoid floating-point math errors
      -- Amount in ₹ × 100
      amount INTEGER NOT NULL CHECK (amount > 0),

      category TEXT NOT NULL,

      date INTEGER NOT NULL,

      notes TEXT,

      receipt_uri TEXT,

      created_at INTEGER NOT NULL,

      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_expenses_date
      ON expenses(date);

    CREATE INDEX IF NOT EXISTS idx_expenses_category
      ON expenses(category);

    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),

      name TEXT NOT NULL,

      monthly_budget INTEGER NOT NULL CHECK (monthly_budget >= 0),

      currency TEXT NOT NULL DEFAULT 'INR',

      onboarding_completed INTEGER NOT NULL DEFAULT 0,

      created_at INTEGER NOT NULL,

      updated_at INTEGER NOT NULL
    );
  `);
}