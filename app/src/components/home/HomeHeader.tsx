import { View, Text, Pressable } from "react-native";
import { colors } from "../../theme";
import { getUserSettings } from "../../database/user";

export function HomeHeader() {
    const user = getUserSettings();
    const userName = user?.name || "";

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour < 12) return `Easy morning, ${userName}.`;
        if (hour < 17) return `Hope the day's treating you well, ${userName}.`;
        if (hour < 21) return `Day's almost done, ${userName}. Take it easy.`;

        return `Late night coffee hits different, ${userName}.`;
    };

    const currentDate = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <View className="flex-row items-center justify-between pt-4 pb-2">
            <View>
                <Text
                    className="text-sm font-medium"
                    style={{ color: colors.text.secondary }}
                >
                    {getGreeting()}
                </Text>

                <Text
                    className="text-xl font-bold mt-0.5"
                    style={{ color: colors.text.primary }}
                >
                    {currentDate}
                </Text>
            </View>
        </View>
    );
}

