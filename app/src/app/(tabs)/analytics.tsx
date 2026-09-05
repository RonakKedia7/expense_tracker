import React, { useState } from "react";
import { ScrollView, View, Text, ActivityIndicator, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import { colors } from "@/theme";
import { getUserSettings } from "@/database/user";
import { getAnalyticsData, AnalyticsData } from "@/database/analyticsService";

import { BudgetOverviewCard } from "@/components/analytics/BudgetOverviewCard";
import { ComparisonCard } from "@/components/analytics/ComparisonCard";
import { CategoryBreakdownCard } from "@/components/analytics/CategoryBreakdownCard";
import { SplitAnalyticsCard } from "@/components/analytics/SplitAnalyticsCard";
import { TopExpensesCard } from "@/components/analytics/TopExpensesCard";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";

export default function AnalyticsScreen() {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [budget, setBudget] = useState(0);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

    const loadData = () => {
        try {
            const settings = getUserSettings();
            if (settings) {
                setBudget(settings.monthlyBudget);
            }
            const data = getAnalyticsData();
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to load analytics:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    if (loading || !analytics) {
        return (
            <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background.primary }}>
                <ActivityIndicator size="large" color={colors.accent.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.background.primary, paddingTop: insets.top }}>


            <ScrollView
                className="flex-1 px-5 pt-4"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent.primary} />
                }
            >
                <AnalyticsHeader />
                <BudgetOverviewCard
                    spent={analytics.currentMonthSpend}
                    budget={budget}
                    elapsedDays={analytics.elapsedDays}
                    daysInMonth={analytics.daysInMonth}
                />

                <ComparisonCard
                    currentSpend={analytics.currentMonthSpend}
                    prevSpend={analytics.prevMonthSpend}
                    transactionCount={analytics.transactionCount}
                    elapsedDays={analytics.elapsedDays}
                />

                <CategoryBreakdownCard
                    breakdown={analytics.categoryBreakdown}
                    totalSpend={analytics.currentMonthSpend}
                />

                <SplitAnalyticsCard
                    totalOutstanding={analytics.totalOutstanding}
                    statusCounts={analytics.splitStatusCounts}
                    participantOwed={analytics.participantOwed}
                />

                <TopExpensesCard expenses={analytics.topExpenses} />
            </ScrollView>
        </View>
    );
}