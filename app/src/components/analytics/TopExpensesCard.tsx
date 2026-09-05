import { View, Text } from "react-native";
import { colors } from "@/theme";
import { formatINR, formatRelativeDate } from "@/utils/formatters";
import { getCategoryIcon } from "@/utils/categoryIcons";
import { ExpenseRecord } from "@/database/expenses";

interface TopExpensesProps {
    expenses: ExpenseRecord[];
}

export function TopExpensesCard({ expenses }: TopExpensesProps) {
    if (expenses.length === 0) return null;

    return (
        <View
            className="p-5 rounded-3xl border mb-6"
            style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.default }}
        >
            <Text className="text-base font-bold mb-3" style={{ color: colors.text.primary }}>
                Top Expenses
            </Text>

            <View className="space-y-3" style={{ gap: 10 }}>
                {expenses.map((exp) => (
                    <View key={exp.id} className="flex-row items-center justify-between py-1.5">
                        <View className="flex-row items-center" style={{ gap: 12 }}>
                            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: colors.background.primary }}>
                                {getCategoryIcon(exp.category, colors.icon.inactive, 20)}
                            </View>
                            <View>
                                <Text className="text-sm font-semibold" style={{ color: colors.text.primary }}>{exp.category}</Text>
                                <Text className="text-xs" style={{ color: colors.text.secondary }}>
                                    {formatRelativeDate(exp.date)}{exp.notes ? ` · ${exp.notes}` : ''}
                                </Text>
                            </View>
                        </View>
                        <Text className="text-sm font-bold" style={{ color: colors.text.primary }}>{formatINR(exp.amount)}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}