import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Check, Clock, Minus } from "lucide-react-native";
import { colors } from "@/theme";
import { formatINR, formatRelativeDate } from "@/utils/formatters";
import {
    SplitBillWithParticipants,
    updateParticipantPaymentStatus,
    deleteSplitBill,
} from "@/database/splitBill";
import { DeleteConfirmationModal } from "@/components/split/DeleteConfirmationModal";

interface SplitBillCardProps {
    bill: SplitBillWithParticipants;
    onRefresh: () => void;
}

export function SplitBillCard({ bill, onRefresh }: SplitBillCardProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleToggleParticipant = (participantId: number, currentPaidStatus: boolean) => {
        updateParticipantPaymentStatus(participantId, !currentPaidStatus);
        onRefresh();
    };

    const handleConfirmDelete = () => {
        setShowDeleteModal(false);
        deleteSplitBill(bill.id);
        onRefresh();
    };

    const getStatusLabel = () => {
        switch (bill.status) {
            case "settled":
                return "Settled";
            case "partially_settled":
                return "Partial";
            default:
                return "Unsettled";
        }
    };

    return (
        <>
            <View
                className="mb-4 rounded-3xl p-5 border"
                style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.default,
                }}
            >
                {/* CARD TOP HEADER */}
                <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1 mr-3">
                        <Text className="text-lg font-bold" style={{ color: colors.text.primary }}>
                            {bill.title}
                        </Text>
                        <Text className="text-xs font-medium mt-0.5" style={{ color: colors.text.secondary }}>
                            Paid by {bill.paidBy} · {formatRelativeDate(bill.date)}
                        </Text>
                    </View>

                    <View className="flex-row items-start space-x-2" style={{ gap: 10 }}>
                        <View className="items-end">
                            <Text className="text-lg font-extrabold" style={{ color: colors.text.primary }}>
                                {formatINR(bill.totalAmount)}
                            </Text>

                            {/* BORDERLESS STATUS BADGE */}
                            <View
                                className="px-2.5 py-1 rounded-full mt-1"
                                style={{ backgroundColor: colors.background.primary }}
                            >
                                <Text className="text-[10px] font-bold" style={{ color: colors.text.secondary }}>
                                    {getStatusLabel()}
                                </Text>
                            </View>
                        </View>

                        {/* MINUS DELETE BUTTON */}
                        <Pressable
                            onPress={() => setShowDeleteModal(true)}
                            className="w-8 h-8 rounded-full items-center justify-center active:opacity-60"
                            style={{ backgroundColor: colors.background.primary }}
                        >
                            <Minus size={16} color={colors.text.secondary} strokeWidth={2.5} />
                        </Pressable>
                    </View>
                </View>

                {bill.notes && (
                    <Text className="text-xs italic mb-3 mt-1" style={{ color: colors.text.muted }}>
                        "{bill.notes}"
                    </Text>
                )}

                {/* PARTICIPANTS BREAKDOWN */}
                <View className="mt-3 pt-3 border-t" style={{ borderColor: colors.border.default }}>
                    <Text className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.text.secondary }}>
                        Participants
                    </Text>

                    <View className="space-y-2" style={{ gap: 8 }}>
                        {bill.participants.map((p) => (
                            <View
                                key={p.id}
                                className="flex-row items-center justify-between py-2.5 px-3.5 rounded-2xl"
                                style={{ backgroundColor: colors.background.primary }}
                            >
                                {/* PARTICIPANT NAME */}
                                <Text
                                    className="text-sm font-semibold flex-1 mr-2"
                                    numberOfLines={1}
                                    style={{ color: colors.text.primary }}
                                >
                                    {p.name}
                                </Text>

                                {/* ALIGNED AMOUNT & FIXED-WIDTH TOGGLE BUTTON */}
                                <View className="flex-row items-center space-x-3" style={{ gap: 12 }}>
                                    <Text
                                        className="text-sm font-bold text-right"
                                        style={{ color: colors.text.primary }}
                                    >
                                        {formatINR(p.shareAmount)}
                                    </Text>

                                    <Pressable
                                        onPress={() => handleToggleParticipant(p.id, p.isPaid)}
                                        className="w-[76px] h-8 flex-row items-center justify-center rounded-xl active:opacity-80"
                                        style={{
                                            backgroundColor: p.isPaid
                                                ? colors.status.successBackground
                                                : colors.background.secondary,
                                        }}
                                    >
                                        {p.isPaid ? (
                                            <>
                                                <Check size={12} color={colors.status.success} strokeWidth={3} />
                                                <Text className="text-xs font-bold ml-1" style={{ color: colors.status.success }}>
                                                    Paid
                                                </Text>
                                            </>
                                        ) : (
                                            <>
                                                <Clock size={12} color={colors.text.secondary} />
                                                <Text className="text-xs font-medium ml-1" style={{ color: colors.text.secondary }}>
                                                    Unpaid
                                                </Text>
                                            </>
                                        )}
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* CUSTOM DELETE CONFIRMATION MODAL */}
            <DeleteConfirmationModal
                visible={showDeleteModal}
                title={bill.title}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}