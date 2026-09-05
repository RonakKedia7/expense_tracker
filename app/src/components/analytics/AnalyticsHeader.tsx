import { View, Text, Pressable } from "react-native";
import { colors } from "@/theme";

export function AnalyticsHeader() {
    return (
        <View className="px-5 py-4">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                Analytics
            </Text>
            <Text className="text-sm font-medium mt-0.5" style={{ color: colors.text.secondary }}>
                Manage your financial health
            </Text>
        </View>
    );
}