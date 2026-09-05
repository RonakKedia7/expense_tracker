import { View, Text } from "react-native";
import { colors } from "@/theme";
import { formatINR } from "@/utils/formatters";
import { TrendingUp, TrendingDown, Activity } from "lucide-react-native";

interface ComparisonCardProps {
    currentSpend: number;
    prevSpend: number;
    transactionCount: number;
    elapsedDays: number;
}

export function ComparisonCard({ currentSpend, prevSpend, transactionCount, elapsedDays }: ComparisonCardProps) {
    const hasPrevData = prevSpend > 0;
    const diff = currentSpend - prevSpend;
    const diffPercent = hasPrevData ? Math.round((Math.abs(diff) / prevSpend) * 100) : 0;
    const isIncreased = diff > 0;

    const avgDaily = elapsedDays > 0 ? Math.round(currentSpend / elapsedDays) : 0;
    const avgTxn = transactionCount > 0 ? Math.round(currentSpend / transactionCount) : 0;

    return (
        <View
            className="p-5 rounded-3xl border mb-4"
            style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.default, borderWidth: 1 }}
        >
            <Text className="text-base font-bold mb-3" style={{ color: colors.text.primary }}>
                Overview & Pace
            </Text>

            {/* MoM Comparison */}
            <View className="flex-row items-center justify-between py-2.5 border-b" style={{ borderColor: colors.border.default }}>
                <View className="flex-row items-center" style={{ gap: 8 }}>
                    <Activity size={18} color={colors.text.secondary} />
                    <Text className="text-sm font-medium" style={{ color: colors.text.secondary }}>vs Last Month</Text>
                </View>
                {hasPrevData ? (
                    <View className="flex-row items-center" style={{ gap: 6 }}>
                        {isIncreased ? <TrendingUp size={16} color={colors.text.primary} /> : <TrendingDown size={16} color={colors.accent.primary} />}
                        <Text className="text-sm font-bold" style={{ color: colors.text.primary }}>
                            {diffPercent}% {isIncreased ? 'more' : 'less'} ({formatINR(Math.abs(diff))})
                        </Text>
                    </View>
                ) : (
                    <Text className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
                        No prior data
                    </Text>
                )}
            </View>

            {/* Averages */}
            <View className="flex-row justify-between pt-3">
                <View className="flex-1 pr-2">
                    <Text className="text-xs" style={{ color: colors.text.secondary }}>Avg. Daily Spend</Text>
                    <Text className="text-base font-bold mt-0.5" style={{ color: colors.text.primary }}>{formatINR(avgDaily)}</Text>
                </View>
                <View className="flex-1 pl-2 border-l" style={{ borderColor: colors.border.default }}>
                    <Text className="text-xs" style={{ color: colors.text.secondary }}>Avg. Per Transaction</Text>
                    <Text className="text-base font-bold mt-0.5" style={{ color: colors.text.primary }}>{formatINR(avgTxn)}</Text>
                </View>
            </View>
        </View>
    );
}