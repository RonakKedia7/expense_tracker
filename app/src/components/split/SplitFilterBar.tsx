import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { colors } from "@/theme";
import { SplitStatus } from "@/database/splitBill";

export type FilterStatus = "all" | SplitStatus;

interface SplitFilterBarProps {
    activeFilter: FilterStatus;
    onSelectFilter: (filter: FilterStatus) => void;
}

const FILTERS: { id: FilterStatus; label: string }[] = [
    { id: "all", label: "All" },
    { id: "unsettled", label: "Unsettled" },
    { id: "partially_settled", label: "Partial" },
    { id: "settled", label: "Settled" },
];

export function SplitFilterBar({ activeFilter, onSelectFilter }: SplitFilterBarProps) {
    return (
        <View className="mb-4">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
            >
                {FILTERS.map((item) => {
                    const isSelected = activeFilter === item.id;
                    return (
                        <Pressable
                            key={item.id}
                            onPress={() => onSelectFilter(item.id)}
                            className="px-4 py-2.5 rounded-2xl border items-center justify-center active:opacity-80"
                            style={{
                                backgroundColor: isSelected
                                    ? colors.accent.primary
                                    : colors.background.secondary,
                                borderColor: isSelected
                                    ? colors.accent.primary
                                    : colors.border.default,
                            }}
                        >
                            <Text
                                className="text-xs font-semibold"
                                numberOfLines={1}
                                style={{
                                    color: isSelected
                                        ? colors.accent.light
                                        : colors.text.secondary,
                                }}
                            >
                                {item.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}