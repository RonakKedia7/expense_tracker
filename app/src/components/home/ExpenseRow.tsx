import { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { ExpenseRecord, deleteExpense } from '../../database/expenses';
import { colors } from '../../theme';
import { formatINR, formatRelativeDate } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { Minus, X } from 'lucide-react-native';

interface ExpenseRowProps {
    expense: ExpenseRecord;
    onDelete?: (id: number) => void;
}

export function ExpenseRow({ expense, onDelete }: ExpenseRowProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const handleDelete = () => {
        setModalVisible(false);
        deleteExpense(expense.id);
        if (onDelete) {
            onDelete(expense.id);
        }
    };

    return (
        <>
            <Pressable
                onPress={() => setModalVisible(true)}
                className="flex-row items-center justify-between py-3 px-3.5 my-1.5 rounded-2xl active:opacity-70"
                style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.default,
                    borderWidth: 1,
                }}
            >
                <View className="flex-row items-center space-x-3" style={{ gap: 12 }}>
                    <View
                        className="w-11 h-11 rounded-xl items-center justify-center"
                        style={{ backgroundColor: colors.background.primary }}
                    >
                        {getCategoryIcon(expense.category, colors.icon.inactive, 22)}
                    </View>
                    <View>
                        <Text className="text-base font-semibold" style={{ color: colors.text.primary }}>
                            {expense.category}
                        </Text>
                        <Text className="text-xs mt-0.5" style={{ color: colors.text.secondary }}>
                            {formatRelativeDate(expense.date)}
                            {expense.notes ? ` · ${expense.notes}` : ''}
                        </Text>
                    </View>
                </View>

                <Text className="text-base font-bold" style={{ color: colors.text.primary }}>
                    {formatINR(expense.amount)}
                </Text>
            </Pressable>

            {/* Expense Details Bottom Sheet Modal */}
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent
                statusBarTranslucent
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    className="flex-1 justify-end"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    onPress={() => setModalVisible(false)}
                >
                    <Pressable
                        className="rounded-t-3xl p-6"
                        style={{ backgroundColor: colors.background.primary, maxHeight: "80%" }}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <View className="flex-row justify-between items-center mb-6">
                            <View className="flex-row items-center" style={{ gap: 12 }}>
                                <View
                                    className="w-11 h-11 rounded-xl items-center justify-center border"
                                    style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.default }}
                                >
                                    {getCategoryIcon(expense.category, colors.icon.active || colors.text.primary, 22)}
                                </View>
                                <View>
                                    <Text className="text-xl font-bold" style={{ color: colors.text.primary }}>
                                        {expense.category}
                                    </Text>
                                    <Text className="text-xs" style={{ color: colors.text.secondary }}>
                                        Expense Details
                                    </Text>
                                </View>
                            </View>
                            <Pressable
                                onPress={() => setModalVisible(false)}
                                className="w-9 h-9 rounded-full items-center justify-center"
                                style={{ backgroundColor: colors.background.secondary }}
                            >
                                <X size={20} color={colors.icon.inactive} />
                            </Pressable>
                        </View>

                        {/* Content */}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="space-y-4" style={{ gap: 12 }}>
                                <View
                                    className="p-4 rounded-2xl border flex-row items-center justify-between"
                                    style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.default }}
                                >
                                    <Text className="text-sm font-medium" style={{ color: colors.text.secondary }}>Amount</Text>
                                    <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                                        {formatINR(expense.amount)}
                                    </Text>
                                </View>

                                <View
                                    className="p-4 rounded-2xl border flex-row items-center justify-between"
                                    style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.default }}
                                >
                                    <Text className="text-sm font-medium" style={{ color: colors.text.secondary }}>Date</Text>
                                    <Text className="text-sm font-semibold" style={{ color: colors.text.primary }}>
                                        {new Date(expense.date).toLocaleString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </Text>
                                </View>

                                {expense.notes && (
                                    <View
                                        className="p-4 rounded-2xl border"
                                        style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.default, gap: 4 }}
                                    >
                                        <Text className="text-sm font-medium" style={{ color: colors.text.secondary }}>Notes</Text>
                                        <Text className="text-base font-normal" style={{ color: colors.text.primary }}>
                                            {expense.notes}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>

                        {/* Footer Action */}
                        <View className="pt-6">
                            <Pressable
                                onPress={handleDelete}
                                className="h-14 rounded-2xl items-center justify-center border flex-row"
                                style={{
                                    backgroundColor: colors.background.secondary,
                                    borderColor: colors.border.default,
                                    gap: 8
                                }}
                            >
                                <Minus size={18} color={colors.text.primary} />
                                <Text className="text-base font-semibold" style={{ color: colors.text.primary }}>
                                    Remove Expense
                                </Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}