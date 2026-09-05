import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
    X,
    Check,
    FileText,
} from "lucide-react-native";
import { addExpense } from "@/database/expenses";
import { colors } from "@/theme";
import { CATEGORIES } from "@/utils/categoryItems";

export default function AddExpenseModal() {
    const [amountInput, setAmountInput] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Food & Dining");
    const [notes, setNotes] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const numericAmount = parseFloat(amountInput);
    const isValidAmount = !isNaN(numericAmount) && numericAmount > 0;

    const handleSubmit = () => {
        if (isSubmitting) return;

        try {
            setError(null);
            if (!isValidAmount) {
                setError("Please enter a valid amount greater than ₹0.");
                return;
            }

            setIsSubmitting(true);

            // Calls database function with value in Rupees
            addExpense({
                amountInRupees: numericAmount,
                category: selectedCategory,
                notes: notes.trim() || null,
            });

            // Return back to previous screen (Home/Analytics)
            router.back();
        } catch (err) {
            console.error("Failed to add expense:", err);
            setError("Failed to save expense. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                {/* MODAL HEADER */}
                <View
                    className="flex-row items-center justify-between px-5 py-4"
                    style={{ borderColor: colors.border.default }}
                >

                    <Pressable
                        onPress={() => router.back()}
                        className="w-9 h-9 rounded-full items-center justify-center active:opacity-70"
                        style={{ backgroundColor: colors.background.secondary }}
                    >
                        <X size={20} color={colors.icon.inactive} />
                    </Pressable>
                </View>

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 16 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* AMOUNT INPUT SECTION */}
                    <View className="items-center my-4">
                        <Text className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.text.secondary }}>
                            Amount Spent
                        </Text>
                        <View className="flex-row items-center justify-center">
                            <Text className="text-5xl font-semibold" style={{ color: colors.text.secondary }}>
                                ₹
                            </Text>
                            <TextInput
                                value={amountInput}
                                onChangeText={setAmountInput}
                                placeholder="500"
                                selectionColor={colors.accent.primary}
                                placeholderTextColor={colors.text.secondary}
                                keyboardType="decimal-pad"
                                autoFocus
                                className="text-5xl font-extrabold text-center min-w-[120px]"
                                style={{ color: colors.text.primary }}
                            />
                        </View>
                    </View>

                    {/* CATEGORY SELECTION GRID */}
                    <View className="mt-4">
                        <Text className="text-sm font-semibold mb-3" style={{ color: colors.text.secondary }}>
                            Category
                        </Text>
                        <View className="flex-row flex-wrap justify-between" style={{ gap: 10 }}>
                            {CATEGORIES.filter((c) => (c.id !== "Split")).map((cat) => {
                                const IconComponent = cat.icon;
                                const isSelected = selectedCategory === cat.id;

                                return (
                                    <Pressable
                                        key={cat.id}
                                        onPress={() => setSelectedCategory(cat.id)}
                                        className="w-[23%] py-3 px-1 rounded-2xl items-center justify-center border"
                                        style={{
                                            backgroundColor: isSelected
                                                ? colors.accent.primary
                                                : colors.background.secondary,
                                            borderColor: isSelected
                                                ? colors.accent.primary
                                                : colors.border.default,
                                        }}
                                    >
                                        <IconComponent
                                            size={22}
                                            color={isSelected ? colors.accent.light : colors.icon.inactive}
                                        />
                                        <Text
                                            className="text-xs font-semibold mt-1.5 text-center"
                                            style={{
                                                color: isSelected ? colors.accent.light : colors.text.secondary,
                                            }}
                                            numberOfLines={1}
                                        >
                                            {cat.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* OPTIONAL NOTES INPUT */}
                    <View className="mt-6">
                        <Text className="text-sm font-semibold mb-2" style={{ color: colors.text.secondary }}>
                            Notes (Optional)
                        </Text>
                        <View
                            className="flex-row items-center px-4 rounded-2xl h-14 border"
                            style={{
                                backgroundColor: colors.background.secondary,
                                borderColor: colors.border.default,
                            }}
                        >
                            <FileText size={20} color={colors.icon.inactive} className="mr-3" />
                            <TextInput
                                value={notes}
                                onChangeText={setNotes}
                                selectionColor={colors.accent.primary}
                                placeholder="e.g. Dinner with team, Taxi fare"
                                placeholderTextColor={colors.text.secondary}
                                className="flex-1 text-base font-medium"
                                style={{ color: colors.text.primary }}
                            />
                        </View>
                    </View>

                    {error && (
                        <View className="mt-4 p-3 rounded-xl bg-red-500/10">
                            <Text className="text-xs font-medium text-red-500 text-center">
                                {error}
                            </Text>
                        </View>
                    )}

                    {/* SAVE BUTTON */}
                    <View className="mt-auto pt-6 pb-2">
                        <Pressable
                            onPress={handleSubmit}
                            disabled={!isValidAmount || isSubmitting}
                            className="w-full h-14 rounded-2xl flex-row items-center justify-center space-x-2 active:opacity-80"
                            style={{
                                backgroundColor: isValidAmount
                                    ? colors.accent.primary
                                    : colors.background.secondary,
                                opacity: isValidAmount && !isSubmitting ? 1 : 0.5,
                            }}
                        >
                            <Text className="text-base font-semibold mr-2" style={{ color: colors.accent.light }}>
                                {isSubmitting ? "Saving..." : "Save Expense"}
                            </Text>
                            <Check size={20} color={colors.accent.light} strokeWidth={2.5} />
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}