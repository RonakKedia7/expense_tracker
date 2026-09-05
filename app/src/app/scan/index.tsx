import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, X } from "lucide-react-native";
import { colors } from "@/theme";
import { router } from "expo-router";

export default function Scan() {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-1 px-5 justify-center items-center"
            style={{ backgroundColor: colors.background.primary, paddingTop: insets.top }}
        >
            <View
                className="w-full max-w-sm py-12 px-6 rounded-3xl items-center justify-center border relative"
                style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.default,
                }}
            >
                {/* Close Button */}
                <Pressable
                    onPress={() => router.back()}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.background.primary }}
                >
                    <X size={18} color={colors.text.secondary} />
                </Pressable>

                <View
                    className="w-16 h-16 rounded-2xl items-center justify-center mb-5 mt-2"
                    style={{ backgroundColor: colors.background.primary }}
                >
                    <Camera size={32} color={colors.accent.primary} />
                </View>

                <Text className="text-xl font-bold text-center mb-2" style={{ color: colors.text.primary }}>
                    Scan Receipt
                </Text>

                <Text className="text-sm text-center mb-6 px-2" style={{ color: colors.text.secondary }}>
                    Automatically extract and log expense details using smart camera scanning.
                </Text>

                <View
                    className="py-2.5 px-4 rounded-full border"
                    style={{
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.default,
                    }}
                >
                    <Text className="text-xs font-semibold" style={{ color: colors.text.primary }}>
                        Feature Coming Soon
                    </Text>
                </View>
            </View>
        </View>
    );
}