import { View, Text } from 'react-native';
import { colors } from '../../theme';
import { formatINR } from '../../utils/formatters';
import { TrendingUp, AlertCircle } from 'lucide-react-native';

interface MonthlySummaryCardProps {
    totalSpent: number;
    monthlyBudget: number;
}

export function MonthlySummaryCard({ totalSpent, monthlyBudget }: MonthlySummaryCardProps) {
    const remaining = monthlyBudget - totalSpent;
    const percentage = Math.min(Math.max(totalSpent / monthlyBudget, 0), 1);
    const percentageDisplay = Math.round((totalSpent / monthlyBudget) * 100);

    const isOverBudget = remaining < 0;
    const isNearBudget = percentageDisplay >= 80 && !isOverBudget;

    return (
        <View
            className="rounded-3xl p-5 my-3 shadow-lg"
            style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.default,
                borderWidth: 1,
            }}
        >
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm font-medium" style={{ color: colors.text.secondary }}>
                    Total Monthly Spent
                </Text>
                <View
                    className="px-2.5 py-1 rounded-full flex-row items-center"
                    style={{ backgroundColor: colors.background.primary }}
                >
                    <TrendingUp size={12} color={colors.accent.primary} />
                    <Text className="text-xs font-semibold ml-1" style={{ color: colors.accent.primary }}>
                        {percentageDisplay}% used
                    </Text>
                </View>
            </View>

            <Text className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: colors.text.primary }}>
                {formatINR(totalSpent)}
            </Text>

            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-sm font-medium" style={{ color: colors.text.secondary }}>
                    {isOverBudget
                        ? `${formatINR(Math.abs(remaining))} over budget`
                        : `${formatINR(remaining)} left`}
                </Text>
                <Text className="text-xs" style={{ color: colors.text.secondary }}>
                    Budget: {formatINR(monthlyBudget)}
                </Text>
            </View>

            <View
                className="h-2.5 w-full rounded-full overflow-hidden mb-2"
                style={{ backgroundColor: colors.background.primary }}
            >
                <View
                    className="h-full rounded-full"
                    style={{
                        width: `${percentage * 100}%`,
                        backgroundColor: colors.accent.primary,
                    }}
                />
            </View>

            {isNearBudget && !isOverBudget && (
                <Text
                    className="text-xs mt-2 font-medium"
                    style={{ color: "#F59E0B" }}
                >
                    You're close to your monthly budget.
                </Text>
            )}

            {isOverBudget && (
                <Text
                    className="text-xs mt-2 font-medium"
                    style={{ color: "#EF4444" }}
                >
                    You've exceeded your monthly budget.
                </Text>
            )}


        </View>
    );
}