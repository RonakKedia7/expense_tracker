import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { User, Wallet, Coins, Check } from "lucide-react-native";

import { colors } from "@/theme";
import {
    getUserSettings,
    updateUserName,
    updateMonthlyBudget,
} from "@/database/user";

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();

    // Current input state
    const [name, setName] = useState("");
    const [budgetInput, setBudgetInput] = useState("");

    // Original state loaded from DB
    const [originalName, setOriginalName] = useState("");
    const [originalBudgetInput, setOriginalBudgetInput] = useState("");

    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch user settings when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            try {
                const settings = getUserSettings();
                if (settings) {
                    const fetchedName = settings.name;
                    const fetchedBudget = (settings.monthlyBudget / 100).toString();

                    setName(fetchedName);
                    setBudgetInput(fetchedBudget);

                    // Track original values to determine change state
                    setOriginalName(fetchedName);
                    setOriginalBudgetInput(fetchedBudget);
                }
            } catch (err) {
                console.error("Failed to load user settings:", err);
            }
        }, [])
    );

    // Determine if form values have changed
    const hasChanges =
        name.trim() !== originalName ||
        budgetInput.trim() !== originalBudgetInput;

    const handleSave = () => {
        if (!hasChanges) return;

        Keyboard.dismiss();
        setError(null);

        const trimmedName = name.trim();
        const numericBudget = parseFloat(budgetInput);

        if (!trimmedName) {
            setError("Please enter a valid name.");
            return;
        }

        if (isNaN(numericBudget) || numericBudget <= 0) {
            setError("Please enter a valid monthly budget.");
            return;
        }

        try {
            updateUserName(trimmedName);
            updateMonthlyBudget(numericBudget);

            // Update original baseline values
            setOriginalName(trimmedName);
            setOriginalBudgetInput(numericBudget.toString());

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (err) {
            console.error("Failed to update settings:", err);
            setError("Failed to save settings. Please try again.");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.background.primary,
                    paddingTop: insets.top,
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    {/* HEADER */}
                    <View className="px-5 py-4">
                        <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                            Settings
                        </Text>
                        <Text className="text-sm font-medium mt-0.5" style={{ color: colors.text.secondary }}>
                            Manage your profile & budget
                        </Text>
                    </View>

                    <ScrollView
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                            paddingBottom: 40,
                        }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* PERSONAL INFO / NAME SECTION */}
                        <View className="mb-5">
                            <Text className="text-xs font-semibold uppercase tracking-wider mb-2 ml-1" style={{ color: colors.text.secondary }}>
                                Personal Info
                            </Text>
                            <View
                                className="p-4 rounded-3xl border"
                                style={{
                                    backgroundColor: colors.background.secondary,
                                    borderColor: colors.border.default,
                                }}
                            >
                                <View className="flex-row items-center mb-3">
                                    <View
                                        className="w-10 h-10 rounded-2xl items-center justify-center mr-3"
                                        style={{ backgroundColor: colors.background.primary }}
                                    >
                                        <User size={20} color={colors.icon.inactive} />
                                    </View>
                                    <Text className="text-sm font-semibold" style={{ color: colors.text.primary }}>
                                        Your Name
                                    </Text>
                                </View>

                                <TextInput
                                    value={name}
                                    onChangeText={(text) => {
                                        setName(text);
                                        setIsSaved(false);
                                    }}
                                    placeholder="Enter your name"
                                    placeholderTextColor={colors.text.secondary}
                                    selectionColor={colors.accent.primary}
                                    className="w-full h-12 px-4 rounded-2xl text-base font-medium border"
                                    style={{
                                        backgroundColor: colors.background.primary,
                                        color: colors.text.primary,
                                        borderColor: colors.border.default,
                                    }}
                                />
                            </View>
                        </View>

                        {/* BUDGET SECTION */}
                        <View className="mb-5">
                            <Text className="text-xs font-semibold uppercase tracking-wider mb-2 ml-1" style={{ color: colors.text.secondary }}>
                                Monthly Budget
                            </Text>
                            <View
                                className="p-4 rounded-3xl border"
                                style={{
                                    backgroundColor: colors.background.secondary,
                                    borderColor: colors.border.default,
                                }}
                            >
                                <View className="flex-row items-center mb-3">
                                    <View
                                        className="w-10 h-10 rounded-2xl items-center justify-center mr-3"
                                        style={{ backgroundColor: colors.background.primary }}
                                    >
                                        <Wallet size={20} color={colors.icon.inactive} />
                                    </View>
                                    <Text className="text-sm font-semibold" style={{ color: colors.text.primary }}>
                                        Budget Target
                                    </Text>
                                </View>

                                <View
                                    className="flex-row items-center w-full h-12 px-4 rounded-2xl border"
                                    style={{
                                        backgroundColor: colors.background.primary,
                                        borderColor: colors.border.default,
                                    }}
                                >
                                    <Text className="text-base font-bold mr-2" style={{ color: colors.text.secondary }}>
                                        ₹
                                    </Text>
                                    <TextInput
                                        value={budgetInput}
                                        onChangeText={(text) => {
                                            setBudgetInput(text);
                                            setIsSaved(false);
                                        }}
                                        placeholder="30000"
                                        placeholderTextColor={colors.text.secondary}
                                        keyboardType="numeric"
                                        selectionColor={colors.accent.primary}
                                        className="flex-1 text-base font-semibold"
                                        style={{ color: colors.text.primary }}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* CURRENCY SECTION (READ-ONLY) */}
                        <View className="mb-6">
                            <Text className="text-xs font-semibold uppercase tracking-wider mb-2 ml-1" style={{ color: colors.text.secondary }}>
                                Currency
                            </Text>
                            <View
                                className="p-4 rounded-3xl border flex-row items-center justify-between"
                                style={{
                                    backgroundColor: colors.background.secondary,
                                    borderColor: colors.border.default,
                                }}
                            >
                                <View className="flex-row items-center">
                                    <View
                                        className="w-10 h-10 rounded-2xl items-center justify-center mr-3"
                                        style={{ backgroundColor: colors.background.primary }}
                                    >
                                        <Coins size={20} color={colors.icon.inactive} />
                                    </View>
                                    <View>
                                        <Text className="text-base font-bold" style={{ color: colors.text.primary }}>
                                            INR (₹)
                                        </Text>
                                        <Text className="text-xs font-medium" style={{ color: colors.text.secondary }}>
                                            Indian Rupee
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center px-3 py-1.5 rounded-full" style={{ backgroundColor: colors.background.primary }}>
                                    <Text className="text-base mr-1.5">🇮🇳</Text>
                                    <Text className="text-xs font-bold" style={{ color: colors.text.primary }}>
                                        India
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {error && (
                            <View className="mb-4 p-3 rounded-xl bg-red-500/10">
                                <Text className="text-xs font-medium text-red-500 text-center">
                                    {error}
                                </Text>
                            </View>
                        )}

                        {/* SAVE BUTTON */}
                        <Pressable
                            onPress={handleSave}
                            disabled={!hasChanges && !isSaved}
                            className="w-full h-14 rounded-2xl flex-row items-center justify-center space-x-2 mt-2"
                            style={{
                                backgroundColor: isSaved
                                    ? colors.status.success
                                    : hasChanges
                                        ? colors.accent.primary
                                        : colors.background.secondary,
                                opacity: hasChanges || isSaved ? 1 : 0.5,
                            }}
                        >
                            <Text
                                className="text-base font-semibold mr-2"
                                style={{
                                    color: hasChanges || isSaved
                                        ? colors.accent.light
                                        : colors.text.secondary,
                                }}
                            >
                                {isSaved ? "Saved Successfully!" : "Save Changes"}
                            </Text>
                            <Check
                                size={20}
                                color={
                                    hasChanges || isSaved
                                        ? colors.accent.light
                                        : colors.text.secondary
                                }
                                strokeWidth={2.5}
                            />
                        </Pressable>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}