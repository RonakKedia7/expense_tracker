import { db } from "./index";

export type SplitStatus = "unsettled" | "partially_settled" | "settled";

export interface SplitParticipant {
    id: number;
    splitBillId: number;
    name: string;
    shareAmount: number; // Stored in Paise
    isPaid: boolean;
    paidAt: number | null;
    createdAt: number;
    updatedAt: number;
}

export interface SplitBill {
    id: number;
    title: string;
    totalAmount: number; // Stored in Paise
    paidBy: string;
    date: number;
    notes: string | null;
    status: SplitStatus;
    createdAt: number;
    updatedAt: number;
}

export interface SplitBillWithParticipants extends SplitBill {
    participants: SplitParticipant[];
}

export interface ParticipantInput {
    name: string;
    shareInRupees: number;
    isPaid?: boolean;
}

export interface CreateSplitBillInput {
    title: string;
    totalAmountInRupees: number;
    category?: string; // Optional category for recent expenses
    paidBy?: string;
    date?: number;
    notes?: string | null;
    participants: ParticipantInput[];
}

export interface SplitSummary {
    totalOwedToYou: number; // in Paise
    pendingBillsCount: number;
}

/**
 * Creates a split bill and its associated participants.
 * Inputs are passed in Rupees and converted internally to Paise.
 */
export function createSplitBill(input: CreateSplitBillInput): number {
    const now = Date.now();
    const totalAmountPaise = Math.round(input.totalAmountInRupees * 100);
    const paidBy = input.paidBy?.trim() || "You";
    const date = input.date || now;
    const splitTitle = input.title.trim() !== "Split Bill" ? `${input.title?.trim()} (split)` : "Split Bill";

    // Determine initial status based on participants' paid state
    const allPaid = input.participants.every((p) => p.isPaid);
    const somePaid = input.participants.some((p) => p.isPaid);
    const initialStatus: SplitStatus = allPaid
        ? "settled"
        : somePaid
            ? "partially_settled"
            : "unsettled";

    let createdBillId = 0;

    db.withTransactionSync(() => {
        // 1. Insert the parent split bill
        const billResult = db.runSync(
            `INSERT INTO split_bills (title, total_amount, paid_by, date, notes, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                splitTitle,
                totalAmountPaise,
                paidBy,
                date,
                input.notes?.trim() || null,
                initialStatus,
                now,
                now,
            ]
        );

        createdBillId = billResult.lastInsertRowId;

        // 2. Insert participants and log "You" share as an expense
        for (const p of input.participants) {
            const sharePaise = Math.round(p.shareInRupees * 100);
            const isPaidVal = p.isPaid ? 1 : 0;
            const paidAtVal = p.isPaid ? now : null;
            const participantName = p.name.trim();

            db.runSync(
                `INSERT INTO split_participants (split_bill_id, name, share_amount, is_paid, paid_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
                [createdBillId, participantName, sharePaise, isPaidVal, paidAtVal, now, now]
            );

            // If this participant is "You", log to expenses
            if (participantName.toLowerCase() === "you") {
                const expenseCategory = splitTitle; // Category name = split title
                const expenseNotes = input.notes?.trim() || null; // Notes = split notes

                db.runSync(
                    `INSERT INTO expenses (amount, category, date, notes, receipt_uri, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        sharePaise,
                        expenseCategory,
                        date,
                        expenseNotes,
                        null,
                        now,
                        now,
                    ]
                );
            }
        }
    });

    return createdBillId;
}

/**
 * Retrieves all split bills with their complete participant lists.
 */
export function getAllSplitBills(limit: number = 100, offset: number = 0): SplitBillWithParticipants[] {
    const billsRaw = db.getAllSync<any>(
        `SELECT id, title, total_amount as totalAmount, paid_by as paidBy, date, notes, status, created_at as createdAt, updated_at as updatedAt
     FROM split_bills
     ORDER BY date DESC
     LIMIT ? OFFSET ?;`,
        [limit, offset]
    );

    return billsRaw.map((bill) => {
        const participantsRaw = db.getAllSync<any>(
            `SELECT id, split_bill_id as splitBillId, name, share_amount as shareAmount, is_paid as isPaid, paid_at as paidAt, created_at as createdAt, updated_at as updatedAt
       FROM split_participants
       WHERE split_bill_id = ?
       ORDER BY id ASC;`,
            [bill.id]
        );

        return {
            ...bill,
            participants: participantsRaw.map((p) => ({
                ...p,
                isPaid: Boolean(p.isPaid),
            })),
        };
    });
}

/**
 * Gets a single split bill with its participants.
 */
export function getSplitBillById(id: number): SplitBillWithParticipants | null {
    const bill = db.getFirstSync<any>(
        `SELECT id, title, total_amount as totalAmount, paid_by as paidBy, date, notes, status, created_at as createdAt, updated_at as updatedAt
     FROM split_bills
     WHERE id = ?;`,
        [id]
    );

    if (!bill) return null;

    const participantsRaw = db.getAllSync<any>(
        `SELECT id, split_bill_id as splitBillId, name, share_amount as shareAmount, is_paid as isPaid, paid_at as paidAt, created_at as createdAt, updated_at as updatedAt
     FROM split_participants
     WHERE split_bill_id = ?
     ORDER BY id ASC;`,
        [id]
    );

    return {
        ...bill,
        participants: participantsRaw.map((p) => ({
            ...p,
            isPaid: Boolean(p.isPaid),
        })),
    };
}

/**
 * Toggles or updates a participant's payment status and updates the parent bill's status accordingly.
 */
export function updateParticipantPaymentStatus(participantId: number, isPaid: boolean): void {
    const now = Date.now();
    const isPaidVal = isPaid ? 1 : 0;
    const paidAtVal = isPaid ? now : null;

    db.withTransactionSync(() => {
        // Get participant to identify parent bill
        const participant = db.getFirstSync<{ split_bill_id: number }>(
            `SELECT split_bill_id FROM split_participants WHERE id = ?;`,
            [participantId]
        );

        if (!participant) return;

        // Update participant state
        db.runSync(
            `UPDATE split_participants
       SET is_paid = ?, paid_at = ?, updated_at = ?
       WHERE id = ?;`,
            [isPaidVal, paidAtVal, now, participantId]
        );

        // Recalculate parent bill status
        const allParticipants = db.getAllSync<{ is_paid: number }>(
            `SELECT is_paid FROM split_participants WHERE split_bill_id = ?;`,
            [participant.split_bill_id]
        );

        const total = allParticipants.length;
        const paidCount = allParticipants.filter((p) => p.is_paid === 1).length;

        let newStatus: SplitStatus = "unsettled";
        if (paidCount === total) {
            newStatus = "settled";
        } else if (paidCount > 0) {
            newStatus = "partially_settled";
        }

        db.runSync(
            `UPDATE split_bills
       SET status = ?, updated_at = ?
       WHERE id = ?;`,
            [newStatus, now, participant.split_bill_id]
        );
    });
}

/**
 * Deletes a split bill (associated participants are auto-deleted via CASCADE).
 */
/**
 * Deletes a split bill, its associated participants, and its corresponding individual expense.
 */
export function deleteSplitBill(id: number): void {
    db.withTransactionSync(() => {
        // 1. Get the split bill title before deleting it
        const bill = db.getFirstSync<{ title: string }>(
            `SELECT title FROM split_bills WHERE id = ?;`,
            [id]
        );

        if (!bill) return;

        // 2. Delete the split bill (participants auto-delete via CASCADE)
        db.runSync(`DELETE FROM split_bills WHERE id = ?;`, [id]);

        // 3. Delete the corresponding personal share from the expenses table
        // Matching by category name which stores the formatted split title
        db.runSync(
            `DELETE FROM expenses WHERE category = ?;`,
            [bill.title]
        );
    });
}

/**
 * Returns overall summary of pending split amounts owed to the user (in Paise).
 */
export function getSplitSummary(): SplitSummary {
    const result = db.getFirstSync<{ totalOwed: number | null; pendingCount: number }>(
        `SELECT 
        SUM(p.share_amount) as totalOwed,
        COUNT(DISTINCT b.id) as pendingCount
     FROM split_participants p
     JOIN split_bills b ON p.split_bill_id = b.id
     WHERE b.paid_by = 'You' 
       AND p.name != 'You' 
       AND p.is_paid = 0;`
    );

    return {
        totalOwedToYou: result?.totalOwed || 0,
        pendingBillsCount: result?.pendingCount || 0,
    };
}