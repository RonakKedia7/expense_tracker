import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Plus, FileText, Check, Receipt, Divide } from "lucide-react-native";

import { colors } from "@/theme";
import { createSplitBill, ParticipantInput } from "@/database/splitBill";
import { AddSplitHeader } from "@/components/split/AddSplitHeader";
import { ParticipantRow } from "@/components/split/ParticipantRow";

interface LocalParticipant {
    id: string;
    name: string;
    shareInput: string;
    isPaid: boolean;
}

export default function AddSplitModal() {
    const insets = useSafeAreaInsets();

    const [title, setTitle] = useState("");
    const [totalAmountInput, setTotalAmountInput] = useState("");
    const [paidBy, setPaidBy] = useState("You");
    const [notes, setNotes] = useState("");
    const [isEqualSplit, setIsEqualSplit] = useState(true);

    const [participants, setParticipants] = useState<LocalParticipant[]>([
        { id: "1", name: "You", shareInput: "", isPaid: true },
        { id: "2", name: "", shareInput: "", isPaid: false },
    ]);

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalAmount = parseFloat(totalAmountInput) || 0;

    // Distribute equal shares when total amount or participant count changes
    useEffect(() => {
        if (!isEqualSplit || totalAmount <= 0 || participants.length === 0) return;

        const rawShare = totalAmount / participants.length;
        const cleanShare = parseFloat(rawShare.toFixed(2)).toString();

        setParticipants((prev) =>
            prev.map((p) => ({
                ...p,
                shareInput: cleanShare,
            }))
        );
    }, [totalAmountInput, participants.length, isEqualSplit]);

    const handleAddParticipant = () => {
        const newId = Date.now().toString();
        setParticipants((prev) => [
            ...prev,
            { id: newId, name: "", shareInput: "", isPaid: false },
        ]);
    };

    const handleRemoveParticipant = (id: string) => {
        if (participants.length <= 2) return;
        setError(null);

        const remainingParticipants = participants.filter((p) => p.id !== id);
        setParticipants(remainingParticipants);

        // Re-balance remaining participants instantly
        if (totalAmount > 0 && remainingParticipants.length > 0) {
            const rawShare = totalAmount / remainingParticipants.length;
            const cleanShare = parseFloat(rawShare.toFixed(2)).toString();
            setParticipants(
                remainingParticipants.map((p) => ({ ...p, shareInput: cleanShare }))
            );
        }
    };

    const handleUpdateParticipantName = (id: string, name: string) => {
        setParticipants((prev) =>
            prev.map((p) => (p.id === id ? { ...p, name } : p))
        );
    };

    // INSTANT REAL-TIME SPLIT ADJUSTMENT
    const handleUpdateParticipantShare = (id: string, shareInput: string) => {
        setIsEqualSplit(false);

        const numericShare = parseFloat(shareInput) || 0;
        const otherParticipants = participants.filter((p) => p.id !== id);
        const otherCount = otherParticipants.length;

        if (totalAmount > 0 && otherCount > 0) {
            const remainingAmount = Math.max(0, totalAmount - numericShare);
            const sharePerOther = (remainingAmount / otherCount).toFixed(2);
            const cleanShareForOthers = parseFloat(sharePerOther).toString();

            setParticipants((prev) =>
                prev.map((p) => {
                    if (p.id === id) {
                        return { ...p, shareInput };
                    }
                    return { ...p, shareInput: cleanShareForOthers };
                })
            );
        } else {
            setParticipants((prev) =>
                prev.map((p) => (p.id === id ? { ...p, shareInput } : p))
            );
        }
    };

    const handleDistributeEqually = () => {
        setIsEqualSplit(true);
        if (totalAmount > 0 && participants.length > 0) {
            const rawShare = totalAmount / participants.length;
            const cleanShare = parseFloat(rawShare.toFixed(2)).toString();
            setParticipants((prev) =>
                prev.map((p) => ({ ...p, shareInput: cleanShare }))
            );
        }
    };

    const handleSubmit = () => {
        if (isSubmitting) return;

        try {
            setError(null);

            if (isNaN(totalAmount) || totalAmount <= 0) {
                setError("Please enter a valid total bill amount.");
                return;
            }

            const finalTitle = title.trim() || "Split Bill";
            const formattedParticipants: ParticipantInput[] = [];
            let calculatedSum = 0;

            for (let i = 0; i < participants.length; i++) {
                const p = participants[i];
                const defaultName = i === 0 && p.id === "1" ? "You" : `Person ${i + 1}`;
                const finalName = p.name.trim() || defaultName;
                const shareNum = parseFloat(p.shareInput);

                if (isNaN(shareNum) || shareNum < 0) {
                    setError(`Please enter a valid share amount for ${finalName}.`);
                    return;
                }

                calculatedSum += shareNum;
                formattedParticipants.push({
                    name: finalName,
                    shareInRupees: shareNum,
                    isPaid: p.isPaid,
                });
            }

            if (Math.abs(calculatedSum - totalAmount) > 1) {
                setError(
                    `Participant shares (₹${calculatedSum.toFixed(2)}) must equal total bill (₹${totalAmount}).`
                );
                return;
            }

            setIsSubmitting(true);

            createSplitBill({
                title: finalTitle,
                totalAmountInRupees: totalAmount,
                paidBy: paidBy.trim() || "You",
                notes: notes.trim() || null,
                participants: formattedParticipants,
            });

            router.back();
        } catch (err) {
            console.error("Failed to save split bill:", err);
            setError("Failed to create split bill. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
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
                <AddSplitHeader />

                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingBottom: 60,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    {/* TITLE INPUT */}
                    <View className="mb-4">
                        <Text className="text-xs font-semibold uppercase tracking-wider mb-2 ml-1" style={{ color: colors.text.secondary }}>
                            Split Title (Optional)
                        </Text>
                        <View
                            className="flex-row items-center px-4 rounded-2xl h-14 border"
                            style={{
                                backgroundColor: colors.background.secondary,
                                borderColor: colors.border.default,
                            }}
                        >
                            <Receipt size={20} color={colors.icon.inactive} className="mr-3" />
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                selectionColor={colors.accent.primary}
                                placeholder="e.g. Dinner, Goa Trip (Optional)"
                                placeholderTextColor={colors.text.secondary}
                                className="flex-1 text-base font-medium"
                                style={{ color: colors.text.primary }}
                            />
                        </View>
                    </View>

                    {/* TOTAL AMOUNT INPUT */}
                    <View className="mb-5">
                        <Text className="text-xs font-semibold uppercase tracking-wider mb-2 ml-1" style={{ color: colors.text.secondary }}>
                            Total Bill Amount
                        </Text>
                        <View
                            className="flex-row items-center px-4 rounded-2xl h-14 border"
                            style={{
                                backgroundColor: colors.background.secondary,
                                borderColor: colors.border.default,
                            }}
                        >
                            <Text className="text-xl font-bold mr-2" style={{ color: colors.text.secondary }}>
                                ₹
                            </Text>
                            <TextInput
                                value={totalAmountInput}
                                onChangeText={setTotalAmountInput}
                                keyboardType="decimal-pad"
                                selectionColor={colors.accent.primary}
                                placeholder="0"
                                placeholderTextColor={colors.text.secondary}
                                className="flex-1 text-lg font-bold"
                                style={{ color: colors.text.primary }}
                            />
                        </View>
                    </View>

                    {/* PARTICIPANTS LIST */}
                    <View className="mb-5">
                        <View className="flex-row justify-between items-center mb-3 ml-1">
                            <Text className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.text.secondary }}>
                                Split Between ({participants.length})
                            </Text>
                            <Pressable
                                onPress={handleDistributeEqually}
                                className="flex-row items-center px-2.5 py-1 rounded-full"
                                style={{ backgroundColor: colors.background.secondary }}
                            >
                                <Divide size={12} color={colors.accent.primary} />
                                <Text className="text-xs font-semibold ml-1" style={{ color: colors.accent.primary }}>
                                    Split Equally
                                </Text>
                            </Pressable>
                        </View>

                        <View className="space-y-3" style={{ gap: 10 }}>
                            {participants.map((p, index) => (
                                <ParticipantRow
                                    key={p.id}
                                    id={p.id}
                                    name={p.name}
                                    shareInput={p.shareInput}
                                    index={index}
                                    canRemove={index >= 2}
                                    onUpdateName={handleUpdateParticipantName}
                                    onUpdateShare={handleUpdateParticipantShare}
                                    onRemove={handleRemoveParticipant}
                                />
                            ))}
                        </View>

                        <Pressable
                            onPress={handleAddParticipant}
                            className="flex-row items-center justify-center h-12 rounded-2xl border border-dashed mt-3 active:opacity-80"
                            style={{
                                backgroundColor: colors.background.secondary,
                                borderColor: colors.accent.primary,
                            }}
                        >
                            <Plus size={18} color={colors.accent.primary} strokeWidth={2.5} />
                            <Text className="text-sm font-semibold ml-2" style={{ color: colors.accent.primary }}>
                                Add Person
                            </Text>
                        </Pressable>
                    </View>

                    {/* NOTES INPUT */}
                    <View className="mb-5">
                        <Text className="text-xs font-semibold uppercase tracking-wider mb-2 ml-1" style={{ color: colors.text.secondary }}>
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
                                placeholder="e.g. Paid via UPI, includes drinks"
                                placeholderTextColor={colors.text.secondary}
                                className="flex-1 text-base font-medium"
                                style={{ color: colors.text.primary }}
                            />
                        </View>
                    </View>

                    {/* PLAIN ERROR TEXT */}
                    {error && (
                        <Text className="text-xs font-medium text-red-500 text-center mb-4">
                            {error}
                        </Text>
                    )}

                    {/* SAVE BUTTON */}
                    <Pressable
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full h-14 rounded-2xl flex-row items-center justify-center space-x-2 active:opacity-80 mt-2"
                        style={{
                            backgroundColor: colors.accent.primary,
                            opacity: isSubmitting ? 0.7 : 1,
                        }}
                    >
                        <Text className="text-base font-semibold mr-2" style={{ color: colors.accent.light }}>
                            {isSubmitting ? "Creating Split..." : "Save Split Bill"}
                        </Text>
                        <Check size={20} color={colors.accent.light} strokeWidth={2.5} />
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}