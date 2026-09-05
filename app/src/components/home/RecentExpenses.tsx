import { View, Text, Pressable } from 'react-native';
import { ExpenseRecord } from '../../database/expenses';
import { ExpenseRow } from './ExpenseRow';
import { colors } from '../../theme';
import { router } from 'expo-router';

interface RecentExpensesProps {
    expenses: ExpenseRecord[];
    onExpenseDeleted?: () => void;
}

export function RecentExpenses({ expenses, onExpenseDeleted }: RecentExpensesProps) {
    return (
        <View className="mt-4 mb-6">
            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold" style={{ color: colors.text.primary }}>
                    Recent Expenses
                </Text>
                <Pressable onPress={() => router.push('/expenses' as any)}>
                    <Text className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
                        See All
                    </Text>
                </Pressable>
            </View>

            {expenses.length === 0 ? (
                <View
                    className="py-8 px-4 rounded-3xl items-center justify-center"
                    style={{
                        backgroundColor: colors.background.secondary,
                        borderColor: colors.border.default,
                        borderWidth: 1,
                    }}
                >
                    <Text className="text-base font-semibold text-center mb-1" style={{ color: colors.text.primary }}>
                        No expenses yet
                    </Text>
                    <Text className="text-xs text-center mb-4" style={{ color: colors.text.secondary }}>
                        Start tracking your spending by adding your first expense.
                    </Text>
                </View>
            ) : (
                expenses.map((expense) => (
                    <ExpenseRow
                        key={expense.id}
                        expense={expense}
                        onDelete={onExpenseDeleted}
                    />
                ))
            )}
        </View>
    );
}