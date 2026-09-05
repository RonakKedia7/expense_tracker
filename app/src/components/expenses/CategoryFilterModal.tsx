import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { X } from "lucide-react-native";
import { colors } from "@/theme";
import { CategoryItem } from "@/utils/categoryItems";

interface CategoryFilterModalProps {
    visible: boolean;
    categories: CategoryItem[];
    selectedCategories: string[];
    onClose: () => void;
    onApply: (selected: string[]) => void;
}

export function CategoryFilterModal({
    visible,
    categories,
    selectedCategories,
    onClose,
    onApply,
}: CategoryFilterModalProps) {
    const [tempCategories, setTempCategories] = useState<string[]>([]);

    useEffect(() => {
        if (visible) {
            setTempCategories([...selectedCategories]);
        }
    }, [visible, selectedCategories]);

    const toggleCategory = (id: string) => {
        if (tempCategories.includes(id)) {
            setTempCategories(tempCategories.filter((cat) => cat !== id));
        } else {
            setTempCategories([...tempCategories, id]);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            statusBarTranslucent
            onRequestClose={onClose}
        >
            {/* Pressing backdrop closes modal with fade transition */}
            <Pressable className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onPress={onClose}>
                {/* Prevent clicks inside modal from closing it */}
                <Pressable
                    className="rounded-t-3xl p-6"
                    style={{ backgroundColor: colors.background.primary, maxHeight: "80%" }}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold" style={{ color: colors.text.primary }}>
                            Filter by Category
                        </Text>
                        <Pressable
                            onPress={onClose}
                            className="w-9 h-9 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.background.secondary }}
                        >
                            <X size={20} color={colors.icon.inactive} />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="flex-row flex-wrap justify-between" style={{ gap: 10 }}>
                            {categories.map((cat) => {
                                const IconComponent = cat.icon;
                                const isSelected = tempCategories.includes(cat.id);

                                return (
                                    <Pressable
                                        key={cat.id}
                                        onPress={() => toggleCategory(cat.id)}
                                        className="w-[31%] py-4 px-2 rounded-2xl items-center justify-center border"
                                        style={{
                                            backgroundColor: isSelected ? colors.accent.primary : colors.background.secondary,
                                            borderColor: isSelected ? colors.accent.primary : colors.border.default,
                                        }}
                                    >
                                        <IconComponent
                                            size={24}
                                            color={isSelected ? colors.accent.light : colors.icon.inactive}
                                        />
                                        <Text
                                            className="text-xs font-semibold mt-2 text-center"
                                            style={{ color: isSelected ? colors.accent.light : colors.text.secondary }}
                                            numberOfLines={1}
                                        >
                                            {cat.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </ScrollView>

                    <View className="pt-6 flex-row space-x-3" style={{ gap: 12 }}>
                        <Pressable
                            onPress={() => setTempCategories([])}
                            className="flex-1 h-14 rounded-2xl items-center justify-center border"
                            style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.default }}
                        >
                            <Text className="text-base font-semibold" style={{ color: colors.text.primary }}>
                                Clear
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => onApply(tempCategories)}
                            className="flex-1 h-14 rounded-2xl items-center justify-center"
                            style={{ backgroundColor: colors.accent.primary }}
                        >
                            <Text className="text-base font-semibold" style={{ color: colors.accent.light }}>
                                Apply
                            </Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}