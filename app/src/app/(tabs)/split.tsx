import React, { useState, useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Users } from "lucide-react-native";

import { colors } from "@/theme";
import {
    getAllSplitBills,
    getSplitSummary,
    SplitBillWithParticipants,
    SplitSummary,
} from "@/database/splitBill";

import { SplitHeader } from "@/components/split/SplitHeader";
import { SplitSummaryCard } from "@/components/split/SplitSummaryCard";
import { SplitFilterBar, FilterStatus } from "@/components/split/SplitFilterBar";
import { SplitBillCard } from "@/components/split/SplitBillCard";

export default function SplitBillsScreen() {
    const insets = useSafeAreaInsets();

    const [bills, setBills] = useState<SplitBillWithParticipants[]>([]);
    const [summary, setSummary] = useState<SplitSummary>({
        totalOwedToYou: 0,
        pendingBillsCount: 0,
    });
    const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

    const loadData = () => {
        try {
            const fetchedBills = getAllSplitBills();
            const fetchedSummary = getSplitSummary();
            setBills(fetchedBills);
            setSummary(fetchedSummary);
        } catch (error) {
            console.error("Failed to load split bills:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const filteredBills = useMemo(() => {
        if (activeFilter === "all") return bills;
        return bills.filter((b) => b.status === activeFilter);
    }, [bills, activeFilter]);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background.primary,
                paddingTop: insets.top,
            }}
        >
            <SplitHeader />

            <SplitSummaryCard summary={summary} />

            <SplitFilterBar
                activeFilter={activeFilter}
                onSelectFilter={setActiveFilter}
            />

            <FlatList
                data={filteredBills}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View
                        className="py-12 px-4 rounded-3xl items-center justify-center mt-2 border"
                        style={{
                            backgroundColor: colors.background.secondary,
                            borderColor: colors.border.default,
                        }}
                    >
                        <View
                            className="w-14 h-14 rounded-2xl items-center justify-center mb-4"
                            style={{ backgroundColor: colors.background.primary }}
                        >
                            <Users size={28} color={colors.icon.inactive} />
                        </View>
                        <Text className="text-lg font-bold text-center mb-1" style={{ color: colors.text.primary }}>
                            No split bills found
                        </Text>
                        <Text className="text-sm text-center" style={{ color: colors.text.secondary }}>
                            Tap "New Split" above to split an expense with friends.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <SplitBillCard bill={item} onRefresh={loadData} />
                )}
            />
        </View>
    );
}