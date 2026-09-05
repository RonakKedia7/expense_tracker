import React, { useState, useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import {
    Receipt,
} from "lucide-react-native";

import { colors } from "@/theme";
import { getAllExpenses, ExpenseRecord } from "@/database/expenses";
import { ExpenseRow } from "@/components/home/ExpenseRow";

import { ExpensesHeader } from "@/components/expenses/ExpensesHeader";
import { ExpensesSearchBar } from "@/components/expenses/ExpensesSearchBar";
import { ExpensesFilterBar } from "@/components/expenses/ExpensesFilterBar";
import { ExpensesSummaryCard } from "@/components/expenses/ExpensesSummaryCard";
import { CategoryFilterModal } from "@/components/expenses/CategoryFilterModal";
import { DateRangeModal } from "@/components/expenses/DateRangeModal";
import { CATEGORIES } from "@/utils/categoryItems";

export default function ExpensesScreen() {
    const insets = useSafeAreaInsets();

    const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showDateModal, setShowDateModal] = useState(false);

    const loadExpenses = () => {
        try {
            const data = getAllExpenses(500, 0);
            setExpenses(data);
        } catch (error) {
            console.error("Failed to load expenses:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadExpenses();
        }, [])
    );

    const filteredExpenses = useMemo(() => {
        return expenses.filter((item) => {
            const matchesSearch =
                searchQuery.trim() === "" ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
            if (!matchesSearch) return false;

            if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
                return false;
            }

            const itemDate = new Date(item.date);
            itemDate.setHours(0, 0, 0, 0);

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                if (itemDate < start) return false;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                if (itemDate > end) return false;
            }

            return true;
        });
    }, [expenses, searchQuery, selectedCategories, startDate, endDate]);

    const filteredTotalPaise = useMemo(() => {
        return filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
    }, [filteredExpenses]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background.primary, paddingTop: insets.top }}>
            <ExpensesHeader />

            <ExpensesSearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onClear={() => setSearchQuery("")}
            />

            <ExpensesFilterBar
                startDate={startDate}
                endDate={endDate}
                selectedCategoriesCount={selectedCategories.length}
                onOpenDateModal={() => setShowDateModal(true)}
                onOpenCategoryModal={() => setShowCategoryModal(true)}
            />

            <ExpensesSummaryCard
                itemCount={filteredExpenses.length}
                totalPaise={filteredTotalPaise}
            />

            <FlatList
                data={filteredExpenses}
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
                            <Receipt size={28} color={colors.icon.inactive} />
                        </View>
                        <Text className="text-lg font-bold text-center mb-1" style={{ color: colors.text.primary }}>
                            No expenses found
                        </Text>
                        <Text className="text-sm text-center" style={{ color: colors.text.secondary }}>
                            Try adjusting your filters or date range.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <ExpenseRow
                        expense={item}
                        onDelete={(deletedId) => {
                            setExpenses((prev) => prev.filter((exp) => exp.id !== deletedId));
                        }}
                    />
                )}
            />

            <CategoryFilterModal
                visible={showCategoryModal}
                categories={CATEGORIES}
                selectedCategories={selectedCategories}
                onClose={() => setShowCategoryModal(false)}
                onApply={(selected) => {
                    setSelectedCategories(selected);
                    setShowCategoryModal(false);
                }}
            />

            <DateRangeModal
                visible={showDateModal}
                startDate={startDate}
                endDate={endDate}
                onClose={() => setShowDateModal(false)}
                onApply={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                    setShowDateModal(false);
                }}
                onClear={() => {
                    setStartDate(null);
                    setEndDate(null);
                    setShowDateModal(false);
                }}
            />
        </View>
    );
}