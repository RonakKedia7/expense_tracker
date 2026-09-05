import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react-native";
import { colors } from "@/theme";

interface DateRangeModalProps {
    visible: boolean;
    startDate: Date | null;
    endDate: Date | null;
    onClose: () => void;
    onApply: (start: Date | null, end: Date | null) => void;
    onClear: () => void;
}

export function DateRangeModal({
    visible,
    startDate,
    endDate,
    onClose,
    onApply,
    onClear,
}: DateRangeModalProps) {
    const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
    const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
    const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

    useEffect(() => {
        if (visible) {
            setTempStartDate(startDate);
            setTempEndDate(endDate);
            setCalendarMonth(startDate || new Date());
        }
    }, [visible, startDate, endDate]);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handleDayPress = (day: number) => {
        const selectedDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
        selectedDate.setHours(0, 0, 0, 0);

        if (!tempStartDate || (tempStartDate && tempEndDate)) {
            setTempStartDate(selectedDate);
            setTempEndDate(null);
        } else if (tempStartDate && !tempEndDate) {
            if (selectedDate < tempStartDate) {
                setTempStartDate(selectedDate);
            } else {
                setTempEndDate(selectedDate);
            }
        }
    };

    const renderCalendar = () => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<View key={`empty-${i}`} className="w-[14.28%] aspect-square" />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);
            currentDate.setHours(0, 0, 0, 0);

            let isSelected = false;
            let isStart = false;
            let isEnd = false;
            let isInRange = false;

            if (tempStartDate && currentDate.getTime() === tempStartDate.getTime()) {
                isSelected = true;
                isStart = true;
            }
            if (tempEndDate) {
                if (currentDate.getTime() === tempEndDate.getTime()) {
                    isSelected = true;
                    isEnd = true;
                }
                if (tempStartDate && currentDate > tempStartDate && currentDate < tempEndDate) {
                    isInRange = true;
                }
            }

            days.push(
                <Pressable
                    key={i}
                    onPress={() => handleDayPress(i)}
                    className="w-[14.28%] aspect-square items-center justify-center relative"
                >
                    {isInRange && (
                        <View className="absolute top-1 bottom-1 left-0 right-0 opacity-20" style={{ backgroundColor: colors.accent.primary }} />
                    )}
                    {isStart && tempEndDate && (
                        <View className="absolute top-1 bottom-1 left-1/2 right-0 opacity-20" style={{ backgroundColor: colors.accent.primary }} />
                    )}
                    {isEnd && tempStartDate && (
                        <View className="absolute top-1 bottom-1 left-0 right-1/2 opacity-20" style={{ backgroundColor: colors.accent.primary }} />
                    )}

                    <View
                        className="w-10 h-10 rounded-full items-center justify-center z-10"
                        style={{
                            backgroundColor: isSelected ? colors.accent.primary : "transparent",
                        }}
                    >
                        <Text
                            className="text-sm font-semibold"
                            style={{ color: isSelected ? colors.accent.light : colors.text.primary }}
                        >
                            {i}
                        </Text>
                    </View>
                </Pressable>
            );
        }

        return days;
    };

    return (
        <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={onClose}>
            {/* Pressing backdrop closes modal */}
            <Pressable className="flex-1 justify-center p-5" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onPress={onClose}>
                {/* Prevent clicks inside modal from closing it */}
                <Pressable
                    className="rounded-3xl p-5"
                    style={{ backgroundColor: colors.background.primary }}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold" style={{ color: colors.text.primary }}>
                            Select Date Range
                        </Text>
                        <Pressable
                            onPress={onClose}
                            className="w-9 h-9 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.background.secondary }}
                        >
                            <X size={20} color={colors.icon.inactive} />
                        </Pressable>
                    </View>

                    {/* Calendar Month Header */}
                    <View className="flex-row justify-between items-center mb-4 px-2">
                        <Pressable
                            onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                            className="p-2"
                        >
                            <ChevronLeft size={24} color={colors.text.primary} />
                        </Pressable>
                        <Text className="text-base font-bold" style={{ color: colors.text.primary }}>
                            {calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </Text>
                        <Pressable
                            onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                            className="p-2"
                        >
                            <ChevronRight size={24} color={colors.text.primary} />
                        </Pressable>
                    </View>

                    {/* Days of Week */}
                    <View className="flex-row mb-2">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                            <Text key={i} className="w-[14.28%] text-center text-xs font-bold" style={{ color: colors.text.secondary }}>
                                {day}
                            </Text>
                        ))}
                    </View>

                    {/* Calendar Grid */}
                    <View className="flex-row flex-wrap mb-6">{renderCalendar()}</View>

                    {/* Actions */}
                    <View className="flex-row space-x-3" style={{ gap: 12 }}>
                        <Pressable
                            onPress={onClear}
                            className="flex-1 h-14 rounded-2xl items-center justify-center border"
                            style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.default }}
                        >
                            <Text className="text-base font-semibold" style={{ color: colors.text.primary }}>
                                Clear
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => onApply(tempStartDate, tempEndDate || tempStartDate)}
                            className="flex-1 h-14 rounded-2xl flex-row items-center justify-center"
                            style={{ backgroundColor: colors.accent.primary }}
                        >
                            <Text className="text-base font-semibold mr-2" style={{ color: colors.accent.light }}>
                                Apply
                            </Text>
                            <Check size={18} color={colors.accent.light} />
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}