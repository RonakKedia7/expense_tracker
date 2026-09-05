import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { AlertCircle, X } from "lucide-react-native";
import { colors } from "@/theme";

interface DeleteConfirmationModalProps {
    visible: boolean;
    title: string;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteConfirmationModal({
    visible,
    title,
    onClose,
    onConfirm,
}: DeleteConfirmationModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 justify-center items-center p-5"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                onPress={onClose}
            >
                <Pressable
                    className="w-full max-w-sm rounded-3xl p-6 border"
                    style={{
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.default,
                    }}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View className="flex-row justify-between items-start mb-4">
                        <View
                            className="w-12 h-12 rounded-2xl items-center justify-center"
                            style={{ backgroundColor: colors.background.secondary }}
                        >
                            <AlertCircle size={24} color={colors.accent.primary} />
                        </View>
                        <Pressable
                            onPress={onClose}
                            className="w-9 h-9 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.background.secondary }}
                        >
                            <X size={18} color={colors.icon.inactive} />
                        </Pressable>
                    </View>

                    <Text
                        className="text-xl font-bold mb-2"
                        style={{ color: colors.text.primary }}
                    >
                        Delete Split Bill
                    </Text>

                    <Text
                        className="text-sm font-medium mb-6 leading-5"
                        style={{ color: colors.text.secondary }}
                    >
                        Are you sure you want to delete <Text className="font-bold">"{title}"</Text>? This action cannot be undone.
                    </Text>

                    <View className="flex-row space-x-3" style={{ gap: 12 }}>
                        <Pressable
                            onPress={onClose}
                            className="flex-1 h-12 rounded-2xl items-center justify-center border"
                            style={{
                                backgroundColor: colors.background.secondary,
                                borderColor: colors.border.default,
                            }}
                        >
                            <Text
                                className="text-sm font-semibold"
                                style={{ color: colors.text.primary }}
                            >
                                Cancel
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={onConfirm}
                            className="flex-1 h-12 rounded-2xl items-center justify-center"
                            style={{ backgroundColor: colors.accent.primary }}
                        >
                            <Text
                                className="text-sm font-semibold"
                                style={{ color: colors.accent.light }}
                            >
                                Delete
                            </Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}