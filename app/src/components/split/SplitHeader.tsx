import React from "react";
import { View, Text, Pressable } from "react-native";
import { Plus } from "lucide-react-native";
import { router } from "expo-router";
import { colors } from "@/theme";

export function SplitHeader() {
    return (
        <View className="flex-row items-center justify-between px-5 py-4">
            <View>
                <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                    Split Bills
                </Text>
                <Text className="text-sm font-medium mt-0.5" style={{ color: colors.text.secondary }}>
                    Track shared expenses & settlements
                </Text>
            </View>

            <Pressable
                onPress={() => router.push("/add-split")}
                className="flex-row items-center px-4 py-2.5 rounded-2xl active:opacity-80"
                style={{ backgroundColor: colors.accent.primary }}
            >
                <Plus size={18} color={colors.accent.light} strokeWidth={2.5} />
                <Text className="text-sm font-semibold ml-1.5" style={{ color: colors.accent.light }}>
                    New Split
                </Text>
            </Pressable>
        </View>
    );
}