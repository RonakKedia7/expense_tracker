import React from "react";
import { View, Text, Pressable } from "react-native";
import { X } from "lucide-react-native";
import { router } from "expo-router";
import { colors } from "@/theme";

export function AddSplitHeader() {
    return (
        <View className="flex-row items-center justify-between px-5 py-4">
            <Text className="text-xl font-bold" style={{ color: colors.text.primary }}>
                New Split Bill
            </Text>
            <Pressable
                onPress={() => router.back()}
                className="w-9 h-9 rounded-full items-center justify-center active:opacity-70"
                style={{ backgroundColor: colors.background.secondary }}
            >
                <X size={20} color={colors.icon.inactive} />
            </Pressable>
        </View>
    );
}