import { View, Text, Pressable } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { colors } from "@/theme";

interface ExpensesHeaderProps {
    title?: string;
}

export function ExpensesHeader({ title = "All Expenses" }: ExpensesHeaderProps) {
    return (
        <View className="flex-row items-center justify-between px-5 py-4">
            <Pressable
                onPress={() => router.back()}
                className="w-9 h-9 rounded-full items-center justify-center active:opacity-70"
                style={{ backgroundColor: colors.background.secondary }}
            >
                <ArrowLeft size={20} color={colors.icon.inactive} />
            </Pressable>
            <Text className="text-xl font-bold" style={{ color: colors.text.primary }}>
                {title}
            </Text>
            <View className="w-9" />
        </View>
    );
}