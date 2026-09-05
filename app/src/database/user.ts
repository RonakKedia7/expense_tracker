import { db } from "./index";

export type UserSettings = {
    id: number;
    name: string;
    monthlyBudget: number;
    currency: string;
    onboardingCompleted: boolean;
    createdAt: number;
    updatedAt: number;
};

/**
 * Get the current user's settings.
 */
export function getUserSettings(): UserSettings | null {
    const result = db.getFirstSync<{
        id: number;
        name: string;
        monthly_budget: number;
        currency: string;
        onboarding_completed: number;
        created_at: number;
        updated_at: number;
    }>(`
    SELECT *
    FROM user_settings
    WHERE id = 1
    LIMIT 1;
  `);

    if (!result) {
        return null;
    }

    return {
        id: result.id,
        name: result.name,
        monthlyBudget: result.monthly_budget,
        currency: result.currency,
        onboardingCompleted: result.onboarding_completed === 1,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
    };
}

/**
 * Check whether the user has completed onboarding.
 */
export function hasCompletedOnboarding(): boolean {
    const result = db.getFirstSync<{
        onboarding_completed: number;
    }>(`
    SELECT onboarding_completed
    FROM user_settings
    WHERE id = 1
    LIMIT 1;
  `);

    return result?.onboarding_completed === 1;
}

/**
 * Create or update the user's settings during onboarding.
 *
 * monthlyBudget is provided in rupees.
 * It is converted to paise before storing.
 */
export function saveUserSettings(
    name: string,
    monthlyBudget: number,
    currency: string = "INR"
): void {
    const now = Date.now();

    // Convert ₹ to paise
    const budgetInPaise = Math.round(monthlyBudget * 100);

    db.runSync(
        `
      INSERT INTO user_settings (
        id,
        name,
        monthly_budget,
        currency,
        onboarding_completed,
        created_at,
        updated_at
      )
      VALUES (1, ?, ?, ?, 1, ?, ?)

      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        monthly_budget = excluded.monthly_budget,
        currency = excluded.currency,
        onboarding_completed = 1,
        updated_at = excluded.updated_at;
    `,
        [name.trim(), budgetInPaise, currency, now, now]
    );
}

/**
 * Update only the user's name.
 */
export function updateUserName(name: string): void {
    db.runSync(
        `
      UPDATE user_settings
      SET
        name = ?,
        updated_at = ?
      WHERE id = 1;
    `,
        [name.trim(), Date.now()]
    );
}

/**
 * Update the monthly budget.
 *
 * budget is provided in rupees.
 */
export function updateMonthlyBudget(monthlyBudget: number): void {
    const budgetInPaise = Math.round(monthlyBudget * 100);

    db.runSync(
        `
      UPDATE user_settings
      SET
        monthly_budget = ?,
        updated_at = ?
      WHERE id = 1;
    `,
        [budgetInPaise, Date.now()]
    );
}

/**
 * Update the user's currency.
 */
export function updateCurrency(currency: string): void {
    db.runSync(
        `
      UPDATE user_settings
      SET
        currency = ?,
        updated_at = ?
      WHERE id = 1;
    `,
        [currency, Date.now()]
    );
}

/**
 * Mark onboarding as completed.
 */
export function completeOnboarding(): void {
    db.runSync(
        `
      UPDATE user_settings
      SET
        onboarding_completed = 1,
        updated_at = ?
      WHERE id = 1;
    `,
        [Date.now()]
    );
}

/**
 * Reset onboarding.
 *
 * Useful if the user wants to redo the initial setup.
 */
export function resetOnboarding(): void {
    db.runSync(
        `
      UPDATE user_settings
      SET
        onboarding_completed = 0,
        updated_at = ?
      WHERE id = 1;
    `,
        [Date.now()]
    );
}