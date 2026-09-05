import { View, Text, Pressable } from "react-native";
import { Calendar as CalendarIcon, Filter } from "lucide-react-native";
import { colors } from "@/theme";

interface ExpensesFilterBarProps {
    startDate: Date | null;
    endDate: Date | null;
    selectedCategoriesCount: number;
    onOpenDateModal: () => void;
    onOpenCategoryModal: () => void;
}

export function ExpensesFilterBar({
    startDate,
    endDate,
    selectedCategoriesCount,
    onOpenDateModal,
    onOpenCategoryModal,
}: ExpensesFilterBarProps) {
    const getDateFilterLabel = () => {
        if (startDate && endDate) {
            if (startDate.getTime() === endDate.getTime()) {
                return startDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
            }
            return `${startDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`;
        }
        return "Date Range";
    };

    const hasDate = Boolean(startDate || endDate);
    const hasCategory = selectedCategoriesCount > 0;

    return (
        <View className="px-5 flex-row space-x-3 mb-5" style={{ gap: 12 }}>
            <Pressable
                onPress={onOpenDateModal}
                className="flex-1 flex-row items-center justify-center h-12 rounded-2xl px-3 border"
                style={{
                    backgroundColor: hasDate ? colors.accent.primary : colors.background.secondary,
                    borderColor: hasDate ? colors.accent.primary : colors.border.default,
                }}
            >
                <CalendarIcon size={16} color={hasDate ? colors.accent.light : colors.icon.inactive} />
                <Text
                    className="text-sm font-semibold ml-2"
                    numberOfLines={1}
                    style={{ color: hasDate ? colors.accent.light : colors.text.secondary }}
                >
                    {getDateFilterLabel()}
                </Text>
            </Pressable>

            <Pressable
                onPress={onOpenCategoryModal}
                className="flex-1 flex-row items-center justify-center h-12 rounded-2xl px-3 border"
                style={{
                    backgroundColor: hasCategory ? colors.accent.primary : colors.background.secondary,
                    borderColor: hasCategory ? colors.accent.primary : colors.border.default,
                }}
            >
                <Filter size={16} color={hasCategory ? colors.accent.light : colors.icon.inactive} />
                <Text
                    className="text-sm font-semibold ml-2"
                    numberOfLines={1}
                    style={{ color: hasCategory ? colors.accent.light : colors.text.secondary }}
                >
                    {hasCategory ? `${selectedCategoriesCount} Selected` : "Categories"}
                </Text>
            </Pressable>
        </View>
    );
}