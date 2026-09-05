import { View, Text } from "react-native";
import { Receipt } from "lucide-react-native";
import { colors } from "@/theme";
import { formatINR } from "@/utils/formatters";

interface ExpensesSummaryCardProps {
    itemCount: number;
    totalPaise: number;
}

export function ExpensesSummaryCard({ itemCount, totalPaise }: ExpensesSummaryCardProps) {
    return (
        <View
            className="mx-5 mb-5 rounded-3xl p-5 border"
            style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.default,
            }}
        >
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm font-medium" style={{ color: colors.text.secondary }}>
                    Filtered Total
                </Text>
                <View
                    className="px-2.5 py-1 rounded-full flex-row items-center"
                    style={{ backgroundColor: colors.background.primary }}
                >
                    <Receipt size={12} color={colors.accent.primary} />
                    <Text className="text-xs font-semibold ml-1" style={{ color: colors.accent.primary }}>
                        {itemCount} Items
                    </Text>
                </View>
            </View>

            <Text className="text-3xl font-extrabold tracking-tight" style={{ color: colors.text.primary }}>
                {formatINR(totalPaise)}
            </Text>
        </View>
    );
}