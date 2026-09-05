import { View, Text, Pressable } from 'react-native';
import { ExpenseRecord } from '../../database/expenses';
import { colors } from '../../theme';
import { formatINR, formatRelativeDate } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';

interface ExpenseRowProps {
    expense: ExpenseRecord;
    onPress?: () => void;
}

export function ExpenseRow({ expense, onPress }: ExpenseRowProps) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center justify-between py-3 px-3.5 my-1.5 rounded-2xl"
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
    );
}