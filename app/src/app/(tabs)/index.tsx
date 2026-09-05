import React, { useState } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../theme";

import {
  getAllExpenses,
  getTotalSpend,
  ExpenseRecord,
} from "../../database/expenses";

import { getUserSettings } from "../../database/user";

import { HomeHeader } from "../../components/home/HomeHeader";
import { MonthlySummaryCard } from "../../components/home/MonthlySummaryCard";
import { QuickActions } from "../../components/home/QuickActions";
import { RecentExpenses } from "../../components/home/RecentExpenses";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [totalSpent, setTotalSpent] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(0);

  const [recentExpenses, setRecentExpenses] = useState<ExpenseRecord[]>([]);

  const loadHomeData = () => {
    try {
      const now = new Date();

      const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).getTime();

      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      ).getTime();

      // Get user's settings from SQLite
      const userSettings = getUserSettings();

      if (userSettings) {
        // monthlyBudget is already stored in paise
        setMonthlyBudget(userSettings.monthlyBudget);
      }

      // Get this month's spending
      const monthSpend = getTotalSpend(
        startOfMonth,
        endOfMonth
      );

      setTotalSpent(monthSpend);

      // Get 5 most recent expenses
      const expenses = getAllExpenses(5, 0);

      setRecentExpenses(expenses);
    } catch (error) {
      console.error("Failed to load home screen data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadHomeData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadHomeData();
  };

  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{
          backgroundColor: colors.background.primary,
        }}
      >
        <ActivityIndicator
          size="large"
          color={colors.accent.primary}
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: colors.background.primary,
      }}
    >
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent.primary}
          />
        }
      >
        <HomeHeader />

        <MonthlySummaryCard
          totalSpent={totalSpent}
          monthlyBudget={monthlyBudget}
        />

        <QuickActions />

        <RecentExpenses expenses={recentExpenses} onExpenseDeleted={loadHomeData} />
      </ScrollView>
    </SafeAreaView>
  );
}

