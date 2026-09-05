import { View, Text, Pressable } from "react-native";
import { colors } from "@/theme";
import { Download } from "lucide-react-native";

interface AnalyticsHeaderProps {
    onExport: () => void;
}

export function AnalyticsHeader({ onExport }: AnalyticsHeaderProps) {
    return (
        <View className="flex-row items-center justify-between mb-4 px-1">
            <View>
                <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                    Analytics
                </Text>
                <Text className="text-sm font-medium mt-0.5" style={{ color: colors.text.secondary }}>
                    Your spending insights and financial health
                </Text>
            </View>
            <Pressable
                onPress={onExport}
                className="w-11 h-11 rounded-2xl items-center justify-center border active:opacity-70"
                style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.default,
                    borderWidth: 1,
                }}
            >
                <Download size={20} color={colors.icon.inactive} />
            </Pressable>
        </View>
    );
}