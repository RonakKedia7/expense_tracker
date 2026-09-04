import { db } from "./index";

/* ===================================================== */
/* TYPES                                                 */
/* ===================================================== */

export interface ExpenseRecord {
    id: number;
    amount: number; // Stored in Paise
    category: string;
    date: number; // Unix timestamp
    notes: string | null;
    receipt_uri: string | null;
    created_at: number;
    updated_at: number;
}

export interface ExpenseInput {
    amountInRupees: number;
    category: string;
    date?: number; // Defaults to current time if not provided
    notes?: string | null;
    receiptUri?: string | null;
}

export interface CategoryBreakdown {
    category: string;
    totalAmount: number; // Stored in Paise
}

/* ===================================================== */
/* CREATE                                                */
/* ===================================================== */

export function addExpense({
    amountInRupees,
    category,
    date,
    notes = null,
    receiptUri = null,
}: ExpenseInput): number {
    const amountInPaise = Math.round(amountInRupees * 100);
    const expenseDate = date ?? Date.now();
    const now = Date.now();

    const result = db.runSync(
        `INSERT INTO expenses (amount, category, date, notes, receipt_uri, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [amountInPaise, category, expenseDate, notes, receiptUri, now, now]
    );

    return result.lastInsertRowId;
}

/* ===================================================== */
/* READ (QUERIES)                                        */
/* ===================================================== */

// Get all expenses, ordered by most recent first
export function getAllExpenses(limit: number = 50, offset: number = 0): ExpenseRecord[] {
    return db.getAllSync<ExpenseRecord>(
        `SELECT * FROM expenses ORDER BY date DESC LIMIT ? OFFSET ?`,
        [limit, offset]
    );
}

// Get a single expense by ID
export function getExpenseById(id: number): ExpenseRecord | null {
    return db.getFirstSync<ExpenseRecord>(
        `SELECT * FROM expenses WHERE id = ?`,
        [id]
    );
}

// Get expenses within a specific date range (Useful for "This Month" views)
export function getExpensesByDateRange(startDateMs: number, endDateMs: number): ExpenseRecord[] {
    return db.getAllSync<ExpenseRecord>(
        `SELECT * FROM expenses WHERE date >= ? AND date <= ? ORDER BY date DESC`,
        [startDateMs, endDateMs]
    );
}

/* ===================================================== */
/* ANALYTICS & AGGREGATIONS                              */
/* ===================================================== */

// Get total spend within a timeframe (Returns Paise)
export function getTotalSpend(startDateMs: number, endDateMs: number): number {
    const result = db.getFirstSync<{ total: number | null }>(
        `SELECT SUM(amount) as total FROM expenses WHERE date >= ? AND date <= ?`,
        [startDateMs, endDateMs]
    );

    return result?.total ?? 0;
}

// Get total spend grouped by category (Perfect for your Pie Chart tab)
export function getCategoryBreakdown(startDateMs: number, endDateMs: number): CategoryBreakdown[] {
    return db.getAllSync<CategoryBreakdown>(
        `SELECT category, SUM(amount) as totalAmount 
         FROM expenses 
         WHERE date >= ? AND date <= ? 
         GROUP BY category 
         ORDER BY totalAmount DESC`,
        [startDateMs, endDateMs]
    );
}

/* ===================================================== */
/* UPDATE                                                */
/* ===================================================== */

export function updateExpense(
    id: number,
    { amountInRupees, category, date, notes = null, receiptUri = null }: ExpenseInput
): void {
    const amountInPaise = Math.round(amountInRupees * 100);
    const expenseDate = date ?? Date.now();
    const now = Date.now();

    db.runSync(
        `UPDATE expenses 
         SET amount = ?, category = ?, date = ?, notes = ?, receipt_uri = ?, updated_at = ? 
         WHERE id = ?`,
        [amountInPaise, category, expenseDate, notes, receiptUri, now, id]
    );
}

/* ===================================================== */
/* DELETE                                                */
/* ===================================================== */

export function deleteExpense(id: number): void {
    db.runSync(`DELETE FROM expenses WHERE id = ?`, [id]);
}