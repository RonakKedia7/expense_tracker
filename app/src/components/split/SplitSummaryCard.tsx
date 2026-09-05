import React from "react";
import { View, Text } from "react-native";
import { Users, ArrowDownLeft } from "lucide-react-native";
import { colors } from "@/theme";
import { formatINR } from "@/utils/formatters";
import { SplitSummary } from "@/database/splitBill";

interface SplitSummaryCardProps {
    summary: SplitSummary;
}

export function SplitSummaryCard({ summary }: SplitSummaryCardProps) {
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
                    Total Owed to You
                </Text>
                <View
                    className="px-2.5 py-1 rounded-full flex-row items-center"
                    style={{ backgroundColor: colors.background.primary }}
                >
                    <Users size={12} color={colors.accent.primary} />
                    <Text className="text-xs font-semibold ml-1.5" style={{ color: colors.accent.primary }}>
                        {summary.pendingBillsCount} Pending
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center space-x-2" style={{ gap: 8 }}>
                <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.accent.light }}
                >
                    <ArrowDownLeft size={18} color={colors.accent.primary} />
                </View>
                <Text className="text-3xl font-extrabold tracking-tight" style={{ color: colors.text.primary }}>
                    {formatINR(summary.totalOwedToYou)}
                </Text>
            </View>
        </View>
    );
}