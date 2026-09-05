import React, { useState } from "react";
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
import { ArrowRight, Check, User, Wallet } from "lucide-react-native";
import { colors } from "@/theme";
import { saveUserSettings } from "@/database/user";

export default function OnboardingScreen() {
    const [step, setStep] = useState<number>(1);
    const [name, setName] = useState<string>("");
    const [budgetInput, setBudgetInput] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Validation checks
    const isStep1Valid = name.trim().length > 0;
    const numericBudget = parseFloat(budgetInput);
    const isStep2Valid = !isNaN(numericBudget) && numericBudget > 0;

    const handleNext = () => {
        setError(null);
        if (step === 1 && isStep1Valid) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setError(null);
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleComplete = () => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            setError(null);

            const finalBudget = parseFloat(budgetInput);
            if (isNaN(finalBudget) || finalBudget <= 0) {
                setError("Please enter a valid monthly budget.");
                setIsSubmitting(false);
                return;
            }

            // Saves user settings defaulting currency to "INR"
            saveUserSettings(name.trim(), finalBudget, "INR");

            // Redirects directly to main tabs
            router.replace("/(tabs)");
        } catch (err) {
            console.error("Failed to save onboarding settings:", err);
            setError("Unable to save your settings. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: colors.background.primary }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* TOP BAR / PROGRESS INDICATOR (2 STEPS) */}
                    <View className="flex-row items-center justify-between mb-8">
                        {step > 1 ? (
                            <Pressable
                                onPress={handleBack}
                                className="px-3 py-1.5 rounded-full"
                                style={{ backgroundColor: colors.background.secondary }}
                            >
                                <Text className="text-xs font-semibold" style={{ color: colors.text.secondary }}>
                                    Back
                                </Text>
                            </Pressable>
                        ) : (
                            <View />
                        )}

                        <View className="flex-row items-center space-x-2" style={{ gap: 8 }}>
                            <View
                                className="h-2 rounded-full transition-all"
                                style={{
                                    width: step === 1 ? 24 : 8,
                                    backgroundColor: step >= 1 ? colors.accent.primary : colors.border.default,
                                }}
                            />
                            <View
                                className="h-2 rounded-full transition-all"
                                style={{
                                    width: step === 2 ? 24 : 8,
                                    backgroundColor: step >= 2 ? colors.accent.primary : colors.border.default,
                                }}
                            />
                        </View>
                    </View>

                    {/* CONTENT CONTAINER */}
                    <View className="flex-1 justify-center max-w-md w-full mx-auto">
                        {step === 1 && (
                            <View className="space-y-6" style={{ gap: 24 }}>
                                <View
                                    className="size-16 rounded-full items-center justify-center mb-2"
                                    style={{
                                        backgroundColor: colors.accent.primary,
                                        borderColor: colors.border.default,
                                        borderWidth: 1,
                                    }}
                                >
                                    <User size={28} color={colors.accent.light} />
                                </View>

                                <View>
                                    <Text className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: colors.text.primary }}>
                                        What should we call you?
                                    </Text>
                                    <Text className="text-base" style={{ color: colors.text.secondary }}>
                                        Let's personalize your expense tracker experience.
                                    </Text>
                                </View>

                                <View>
                                    <TextInput
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Enter your name"
                                        placeholderTextColor={colors.text.secondary}
                                        autoFocus
                                        autoCapitalize="words"
                                        selectionColor={colors.accent.primary}
                                        className="w-full h-14 px-4 rounded-2xl text-base font-medium"
                                        style={{
                                            backgroundColor: colors.background.secondary,
                                            color: colors.text.primary,
                                            borderColor: colors.border.default,
                                            borderWidth: 1,
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {step === 2 && (
                            <View className="space-y-6" style={{ gap: 24 }}>
                                <View
                                    className="w-14 h-14 rounded-2xl items-center justify-center mb-2"
                                    style={{
                                        backgroundColor: colors.accent.primary,
                                        borderColor: colors.border.default,
                                        borderWidth: 1,
                                    }}
                                >
                                    <Wallet size={28} color={colors.accent.light} />
                                </View>

                                <View>
                                    <Text className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: colors.text.primary }}>
                                        Set your monthly budget
                                    </Text>
                                    <Text className="text-base" style={{ color: colors.text.secondary }}>
                                        How much do you plan to spend each month? You can change this anytime.
                                    </Text>
                                </View>

                                <View>
                                    <View
                                        className="flex-row items-center w-full h-14 px-4 rounded-2xl"
                                        style={{
                                            backgroundColor: colors.background.secondary,
                                            borderColor: colors.border.default,
                                            borderWidth: 1,
                                        }}
                                    >
                                        <Text className="text-lg font-bold mr-2" style={{ color: colors.text.secondary }}>
                                            ₹
                                        </Text>
                                        <TextInput
                                            value={budgetInput}
                                            onChangeText={setBudgetInput}
                                            placeholder="30000"
                                            placeholderTextColor={colors.text.secondary}
                                            keyboardType="numeric"
                                            autoFocus
                                            className="flex-1 text-lg font-semibold"
                                            selectionColor={colors.accent.primary}
                                            style={{
                                                color: colors.text.primary,
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        {error && (
                            <View className="mt-4 p-3 rounded-xl bg-red-500/10">
                                <Text className="text-xs font-medium text-red-500 text-center">
                                    {error}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* FOOTER ACTION BUTTON */}
                    <View className="pt-6">
                        {step === 1 ? (
                            <Pressable
                                onPress={handleNext}
                                disabled={!isStep1Valid}
                                className="w-full h-14 rounded-2xl flex-row items-center justify-center space-x-2"
                                style={{
                                    backgroundColor: isStep1Valid
                                        ? colors.accent.primary
                                        : colors.background.secondary,
                                    opacity: isStep1Valid ? 1 : 0.5,
                                }}
                            >
                                <Text className="text-base font-semibold mr-2" style={{ color: colors.accent.light }}>
                                    Continue
                                </Text>
                                <ArrowRight size={18} color={colors.accent.light} />
                            </Pressable>
                        ) : (
                            <Pressable
                                onPress={handleComplete}
                                disabled={!isStep2Valid || isSubmitting}
                                className="w-full h-14 rounded-2xl flex-row items-center justify-center space-x-2"
                                style={{
                                    backgroundColor: isStep2Valid
                                        ? colors.accent.primary
                                        : colors.background.secondary,
                                    opacity: isStep2Valid && !isSubmitting ? 1 : 0.5,
                                }}
                            >
                                <Text className="text-base font-semibold mr-2" style={{ color: colors.accent.light }}>
                                    {isSubmitting ? "Setting up..." : "Get Started"}
                                </Text>
                                <Check size={18} color={colors.accent.light} strokeWidth={2.5} />
                            </Pressable>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}