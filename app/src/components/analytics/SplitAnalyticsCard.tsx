import { View, Text } from "react-native";
import { colors } from "@/theme";
import { formatINR } from "@/utils/formatters";
import { Users, CheckCircle2, Clock, AlertCircle } from "lucide-react-native";
import { SplitStatusCount, ParticipantDebt } from "@/database/analyticsService";

interface SplitAnalyticsProps {
    totalOutstanding: number;
    statusCounts: SplitStatusCount[];
    participantOwed: ParticipantDebt[];
}

export function SplitAnalyticsCard({ totalOutstanding, statusCounts, participantOwed }: SplitAnalyticsProps) {
    const getCount = (status: string) => statusCounts.find(s => s.status === status)?.count || 0;

    return (
        <View
            className="p-5 rounded-3xl border mb-4"
            style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.default, borderWidth: 1 }}
        >
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center" style={{ gap: 8 }}>
                    <Users size={20} color={colors.accent.primary} />
                    <Text className="text-base font-bold" style={{ color: colors.text.primary }}>
                        Split Bill Insights
                    </Text>
                </View>
                <Text className="text-sm font-bold" style={{ color: colors.text.primary }}>
                    Owed: {formatINR(totalOutstanding)}
                </Text>
            </View>

            {/* Status pills */}
            <View className="flex-row justify-between mb-4">
                <View className="flex-1 p-3 rounded-2xl border mr-1.5 items-center" style={{ backgroundColor: colors.background.primary, borderColor: colors.border.default }}>
                    <Clock size={16} color={colors.icon.inactive} />
                    <Text className="text-xs mt-1" style={{ color: colors.text.secondary }}>Unsettled</Text>
                    <Text className="text-base font-bold mt-0.5" style={{ color: colors.text.primary }}>{getCount('unsettled')}</Text>
                </View>
                <View className="flex-1 p-3 rounded-2xl border mx-1.5 items-center" style={{ backgroundColor: colors.background.primary, borderColor: colors.border.default }}>
                    <AlertCircle size={16} color={colors.icon.inactive} />
                    <Text className="text-xs mt-1" style={{ color: colors.text.secondary }}>Partial</Text>
                    <Text className="text-base font-bold mt-0.5" style={{ color: colors.text.primary }}>{getCount('partially_settled')}</Text>
                </View>
                <View className="flex-1 p-3 rounded-2xl border ml-1.5 items-center" style={{ backgroundColor: colors.background.primary, borderColor: colors.border.default }}>
                    <CheckCircle2 size={16} color={colors.icon.inactive} />
                    <Text className="text-xs mt-1" style={{ color: colors.text.secondary }}>Settled</Text>
                    <Text className="text-base font-bold mt-0.5" style={{ color: colors.text.primary }}>{getCount('settled')}</Text>
                </View>
            </View>

            {/* Participant Balances */}
            {participantOwed.length > 0 && (
                <View className="pt-3 border-t" style={{ borderColor: colors.border.default, gap: 8 }}>
                    <Text className="text-xs font-semibold mb-1" style={{ color: colors.text.secondary }}>PENDING FROM FRIENDS</Text>
                    {participantOwed.map((debt) => (
                        <View key={debt.name} className="flex-row justify-between items-center">
                            <Text className="text-sm font-medium" style={{ color: colors.text.primary }}>{debt.name}</Text>
                            <Text className="text-sm font-bold" style={{ color: colors.text.primary }}>{formatINR(debt.totalOwed)}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}