import React from "react";

import { View, Pressable, StyleSheet } from "react-native";

import {
    House,
    ChartPie,
    Users,
    MoreHorizontal,
    ScanLine,
} from "lucide-react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { router } from "expo-router";

import { colors } from "../../theme";

export default function CustomTabBar({ state, navigation }: any) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.wrapper,
                {
                    paddingBottom: insets.bottom,
                },
            ]}
        >
            <View style={styles.bar}>
                {/* HOME */}
                <TabButton
                    focused={state.index === 0}
                    Icon={House}
                    onPress={() => navigation.navigate("index")}
                />

                {/* ANALYTICS */}
                <TabButton
                    focused={state.index === 1}
                    Icon={ChartPie}
                    onPress={() => navigation.navigate("analytics")}
                />

                {/* SCAN */}
                <View style={styles.scanSlot}>
                    <Pressable
                        onPress={() => router.push("/scan")}
                        style={({ pressed }) => [
                            styles.scanButton,
                            pressed && styles.scanPressed,
                        ]}
                    >
                        <ScanLine
                            size={40}
                            color={colors.icon.inactive}
                            strokeWidth={1.7}
                        />
                    </Pressable>
                </View>

                {/* SPLIT */}
                <TabButton
                    focused={state.index === 2}
                    Icon={Users}
                    onPress={() => navigation.navigate("split")}
                />

                {/* MORE */}
                <TabButton
                    focused={state.index === 3}
                    Icon={MoreHorizontal}
                    onPress={() => navigation.navigate("more")}
                />
            </View>
        </View>
    );
}

/* =====================================================
   TAB BUTTON
   ===================================================== */

function TabButton({
    focused,
    Icon,
    onPress,
}: {
    focused: boolean;
    Icon: React.ComponentType<any>;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.tabButton,
                pressed && styles.tabPressed,
            ]}
        >
            <Icon
                size={focused ? 28 : 26}
                color={
                    focused
                        ? colors.accent.primary
                        : colors.icon.inactive
                }
                strokeWidth={focused ? 2.3 : 1.7}
            />
        </Pressable>
    );
}

/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({
    /* ---------------------------------------------------
       OUTER WRAPPER
       --------------------------------------------------- */

    wrapper: {
        width: "100%",
        backgroundColor: colors.background.secondary,
        borderTopWidth: 1,
        borderTopColor: colors.border.default,
        zIndex: 1000,
        elevation: 1000,
    },

    /* ---------------------------------------------------
       NAVIGATION BAR
       --------------------------------------------------- */

    bar: {
        height: 72,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.background.secondary,
        paddingHorizontal: 20,
    },

    /* ---------------------------------------------------
       NORMAL TAB
       --------------------------------------------------- */

    tabButton: {
        width: 56,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
    },

    /* ---------------------------------------------------
       PRESSED STATE
       --------------------------------------------------- */

    tabPressed: {
        backgroundColor: colors.background.pressed,
        transform: [{ scale: 0.92 }],
    },

    /* ---------------------------------------------------
       SCAN SLOT
       --------------------------------------------------- */

    scanSlot: {
        width: 64,
        height: 64,
        alignItems: "center",
        justifyContent: "center",
    },

    /* ---------------------------------------------------
       SCAN BUTTON
       --------------------------------------------------- */

    scanButton: {
        width: 64,
        height: 64,
        alignItems: "center",
        justifyContent: "center",
    },

    /* ---------------------------------------------------
       SCAN PRESSED
       --------------------------------------------------- */

    scanPressed: {
        backgroundColor: colors.background.pressed,
        borderRadius: 16,
        transform: [{ scale: 0.92 }],
    },
});

