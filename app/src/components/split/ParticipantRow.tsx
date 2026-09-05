import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Users, Minus } from "lucide-react-native";
import { colors } from "@/theme";

interface ParticipantRowProps {
    id: string;
    name: string;
    shareInput: string;
    index: number;
    canRemove: boolean;
    onUpdateName: (id: string, name: string) => void;
    onUpdateShare: (id: string, share: string) => void;
    onRemove: (id: string) => void;
}

export function ParticipantRow({
    id,
    name,
    shareInput,
    index,
    canRemove,
    onUpdateName,
    onUpdateShare,
    onRemove,
}: ParticipantRowProps) {
    return (
        <View
            className="flex-row items-center justify-between p-3.5 rounded-2xl border"
            style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.default,
            }}
        >
            {/* NAME INPUT */}
            <View className="flex-row items-center flex-1 mr-2">
                <View
                    className="w-9 h-9 rounded-xl items-center justify-center mr-2.5"
                    style={{ backgroundColor: colors.background.primary }}
                >
                    <Users size={18} color={colors.icon.inactive} />
                </View>
                <TextInput
                    value={name}
                    onChangeText={(text) => onUpdateName(id, text)}
                    placeholder={index === 0 && id === "1" ? "You" : `Person ${index + 1}`}
                    placeholderTextColor={colors.text.secondary}
                    selectionColor={colors.accent.primary}
                    className="flex-1 text-base font-semibold"
                    style={{ color: colors.text.primary }}
                />
            </View>

            {/* AMOUNT INPUT & FIXED ACTION SLOT */}
            <View className="flex-row items-center">
                <Text className="text-base font-bold mr-1" style={{ color: colors.text.secondary }}>
                    ₹
                </Text>
                <TextInput
                    value={shareInput}
                    onChangeText={(text) => onUpdateShare(id, text)}
                    keyboardType="decimal-pad"
                    selectionColor={colors.accent.primary}
                    placeholder="0"
                    placeholderTextColor={colors.text.secondary}
                    className="w-20 text-base font-bold text-right"
                    style={{ color: colors.text.primary }}
                />

                {/* FIXED SLOT PRESERVES ALIGNMENT FOR PERSON 1 & PERSON 2 */}
                <View className="w-8 h-8 ml-2 items-center justify-center">
                    {canRemove && (
                        <Pressable
                            onPress={() => onRemove(id)}
                            className="w-8 h-8 rounded-full items-center justify-center active:opacity-60"
                            style={{ backgroundColor: colors.background.primary }}
                        >
                            <Minus size={16} color={colors.text.secondary} strokeWidth={2.5} />
                        </Pressable>
                    )}
                </View>
            </View>
        </View>
    );
}