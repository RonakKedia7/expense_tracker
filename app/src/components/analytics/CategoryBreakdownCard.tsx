import { View, Text } from "react-native";
import { colors } from "@/theme";
import { formatINR } from "@/utils/formatters";
import { getCategoryIcon } from "@/utils/categoryIcons";
import { CategoryStat } from "@/database/analyticsService";

interface CategoryBreakdownProps {
    breakdown: CategoryStat[];
    totalSpend: number;
}

export function CategoryBreakdownCard({ breakdown, totalSpend }: CategoryBreakdownProps) {
    if (breakdown.length === 0) return null;

    return (
        <View
            className="p-5 rounded-3xl border mb-4"
            style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.default }}
        >
            <Text className="text-base font-bold mb-4" style={{ color: colors.text.primary }}>
                Category Breakdown
            </Text>

            <View className="space-y-3" style={{ gap: 12 }}>
                {breakdown.map((item) => {
                    const percentage = totalSpend > 0 ? Math.round((item.totalAmount / totalSpend) * 100) : 0;

                    return (
                        <View key={item.category} className="flex-col">
                            <View className="flex-row items-center justify-between mb-1.5">
                                <View className="flex-row items-center" style={{ gap: 10 }}>
                                    <View className="w-8 h-8 rounded-xl items-center justify-center" style={{ backgroundColor: colors.background.primary }}>
                                        {getCategoryIcon(item.category, colors.icon.inactive, 16)}
                                    </View>
                                    <Text className="text-sm font-semibold" style={{ color: colors.text.primary }}>
                                        {item.category}
                                    </Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-sm font-bold" style={{ color: colors.text.primary }}>
                                        {formatINR(item.totalAmount)}
                                    </Text>
                                    <Text className="text-xs" style={{ color: colors.text.secondary }}>
                                        {percentage}%
                                    </Text>
                                </View>
                            </View>
                            <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.background.primary }}>
                                <View className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: colors.accent.primary }} />
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}