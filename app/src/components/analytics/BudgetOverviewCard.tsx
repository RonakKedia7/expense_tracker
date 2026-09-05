import { View, Text } from "react-native";
import { colors } from "@/theme";
import { formatINR } from "@/utils/formatters";

interface BudgetOverviewProps {
    spent: number;
    budget: number;
    elapsedDays: number;
    daysInMonth: number;
}

export function BudgetOverviewCard({ spent, budget, elapsedDays, daysInMonth }: BudgetOverviewProps) {
    const remaining = Math.max(budget - spent, 0);
    const utilization = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
    const dailyPace = elapsedDays > 0 ? spent / elapsedDays : 0;
    const projectedSpend = Math.round(dailyPace * daysInMonth);

    return (
        <View
            className="p-5 rounded-3xl border mb-4"
            style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.default, borderWidth: 1 }}
        >
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm font-medium" style={{ color: colors.text.secondary }}>
                    Budget Utilization
                </Text>
                <Text className="text-sm font-bold" style={{ color: colors.text.primary }}>
                    {utilization}%
                </Text>
            </View>

            {/* Progress Bar */}
            <View className="h-3 rounded-full overflow-hidden mb-4" style={{ backgroundColor: colors.background.primary }}>
                <View
                    className="h-full rounded-full"
                    style={{
                        width: `${utilization}%`,
                        backgroundColor: colors.accent.primary
                    }}
                />
            </View>

            <View className="flex-row justify-between pt-3 border-t" style={{ borderColor: colors.border.default }}>
                <View>
                    <Text className="text-xs" style={{ color: colors.text.secondary }}>Spent</Text>
                    <Text className="text-base font-bold" style={{ color: colors.text.primary }}>{formatINR(spent)}</Text>
                </View>
                <View>
                    <Text className="text-xs" style={{ color: colors.text.secondary }}>Remaining</Text>
                    <Text className="text-base font-bold" style={{ color: colors.text.primary }}>{formatINR(remaining)}</Text>
                </View>
                <View>
                    <Text className="text-xs" style={{ color: colors.text.secondary }}>Projected</Text>
                    <Text className="text-base font-bold" style={{ color: colors.accent.primary }}>{formatINR(projectedSpend)}</Text>
                </View>
            </View>
        </View>
    );
}