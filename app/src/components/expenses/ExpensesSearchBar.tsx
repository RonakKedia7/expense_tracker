import { View, TextInput, Pressable } from "react-native";
import { Search, X } from "lucide-react-native";
import { colors } from "@/theme";

interface ExpensesSearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
}

export function ExpensesSearchBar({ value, onChangeText, onClear }: ExpensesSearchBarProps) {
    return (
        <View className="px-5 mb-4">
            <View
                className="flex-row items-center px-4 rounded-2xl h-14 border"
                style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.default,
                }}
            >
                <Search size={20} color={colors.icon.inactive} className="mr-3" />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    selectionColor={colors.accent.primary}
                    placeholder="Search categories or notes..."
                    placeholderTextColor={colors.text.secondary}
                    className="flex-1 text-base font-medium"
                    style={{ color: colors.text.primary }}
                />
                {value.length > 0 && (
                    <Pressable onPress={onClear} className="p-1 ml-2">
                        <X size={18} color={colors.icon.inactive} />
                    </Pressable>
                )}
            </View>
        </View>
    );
}