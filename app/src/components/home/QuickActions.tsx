import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus, ScanLine } from 'lucide-react-native';
import { colors } from '../../theme';
import { router } from 'expo-router';

export function QuickActions() {
    return (
        <View className="flex-row space-x-3 my-2" style={{ gap: 12 }}>
            <Pressable
                onPress={() => router.push('/add-expense')}
                className="flex-1 flex-row items-center justify-center py-3.5 px-4 rounded-2xl active:opacity-80"
                style={{ backgroundColor: colors.accent.primary }}
            >
                <Plus size={20} color={colors.accent.light} strokeWidth={2.5} />
                <Text className="font-semibold ml-2 text-sm" style={{ color: colors.accent.light }}>
                    Add Expense
                </Text>
            </Pressable>

            <Pressable
                onPress={() => router.push('/scan')}
                className="flex-1 flex-row items-center justify-center py-3.5 px-4 rounded-2xl active:opacity-80"
                style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.default,
                    borderWidth: 1,
                }}
            >
                <ScanLine size={20} color={colors.icon.inactive} strokeWidth={2.2} />
                <Text className="font-semibold ml-2 text-sm" style={{ color: colors.text.primary }}>
                    Scan Receipt
                </Text>
            </Pressable>
        </View>
    );
}