import { db } from "./index";

export interface CategoryStat {
    category: string;
    totalAmount: number;
}

export interface SplitStatusCount {
    status: string;
    count: number;
}

export interface ParticipantDebt {
    name: string;
    totalOwed: number;
}

export interface AnalyticsData {
    currentMonthSpend: number;
    prevMonthSpend: number;
    transactionCount: number;
    topExpenses: any[];
    categoryBreakdown: CategoryStat[];
    dailyExpenses: { date: number; amount: number }[];
    splitStatusCounts: SplitStatusCount[];
    participantOwed: ParticipantDebt[];
    totalOutstanding: number;
    daysInMonth: number;
    elapsedDays: number;
}

export function getAnalyticsData(): AnalyticsData {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const startOfMonth = new Date(year, month, 1).getTime();
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();

    const startOfPrevMonth = new Date(year, month - 1, 1).getTime();
    const endOfPrevMonth = new Date(year, month, 0, 23, 59, 59, 999).getTime();

    // Current month spend & transaction count
    const currentSummary = db.getFirstSync<{ total: number; count: number }>(
        `SELECT SUM(amount) as total, COUNT(*) as count FROM expenses WHERE date >= ? AND date <= ?`,
        [startOfMonth, endOfMonth]
    );

    // Previous month spend
    const prevMonthSpendRow = db.getFirstSync<{ total: number }>(
        `SELECT SUM(amount) as total FROM expenses WHERE date >= ? AND date <= ?`,
        [startOfPrevMonth, endOfPrevMonth]
    );

    // Top 5 Expenses
    const topExpenses = db.getAllSync<any>(
        `SELECT * FROM expenses ORDER BY amount DESC LIMIT 5`
    );

    // Category-wise Breakdown
    const categoryBreakdown = db.getAllSync<CategoryStat>(
        `SELECT category, SUM(amount) as totalAmount FROM expenses WHERE date >= ? AND date <= ? GROUP BY category ORDER BY totalAmount DESC`,
        [startOfMonth, endOfMonth]
    );

    // Daily Expenses for Trend Chart
    const dailyExpenses = db.getAllSync<{ date: number; amount: number }>(
        `SELECT date, amount FROM expenses WHERE date >= ? AND date <= ? ORDER BY date ASC`,
        [startOfMonth, endOfMonth]
    );

    // Split Bill Status Counts
    const splitStatusCounts = db.getAllSync<SplitStatusCount>(
        `SELECT status, COUNT(*) as count FROM split_bills GROUP BY status`
    );

    // Participant Owed Balances
    const participantOwed = db.getAllSync<ParticipantDebt>(
        `SELECT p.name, SUM(p.share_amount) as totalOwed 
         FROM split_participants p 
         JOIN split_bills b ON p.split_bill_id = b.id 
         WHERE b.paid_by = 'You' AND p.name != 'You' AND p.is_paid = 0 
         GROUP BY p.name`
    );

    const totalOutstandingRow = db.getFirstSync<{ total: number }>(
        `SELECT SUM(p.share_amount) as total 
         FROM split_participants p 
         JOIN split_bills b ON p.split_bill_id = b.id 
         WHERE b.paid_by = 'You' AND p.name != 'You' AND p.is_paid = 0`
    );

    return {
        currentMonthSpend: currentSummary?.total ?? 0,
        prevMonthSpend: prevMonthSpendRow?.total ?? 0,
        transactionCount: currentSummary?.count ?? 0,
        topExpenses,
        categoryBreakdown,
        dailyExpenses,
        splitStatusCounts,
        participantOwed,
        totalOutstanding: totalOutstandingRow?.total ?? 0,
        daysInMonth: new Date(year, month + 1, 0).getDate(),
        elapsedDays: Math.max(now.getDate(), 1),
    };
}