import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { House, ChartPie, Users, MoreHorizontal, ScanLine } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

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
                            size={40} /* Increased size to stand out */
                            color="#60A5FA" /* Matches the other icons */
                            strokeWidth={2.2}
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

/* ===================================================== */
/* TAB BUTTON                                            */
/* ===================================================== */

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
                color={focused ? "#FFFFFF" : "#60A5FA"}
                strokeWidth={focused ? 2.8 : 2.2}
            />
        </Pressable>
    );
}

/* ===================================================== */
/* STYLES                                                */
/* ===================================================== */

const styles = StyleSheet.create({
    /* --------------------------------------------------- */
    /* OUTER WRAPPER                                       */
    /* --------------------------------------------------- */
    wrapper: {
        width: "100%",
        backgroundColor: "#1E3A8A",
        borderTopWidth: 1,
        borderTopColor: "#172554",
        zIndex: 1000,
        elevation: 1000,
    },

    /* --------------------------------------------------- */
    /* NAVIGATION BAR                                      */
    /* --------------------------------------------------- */
    bar: {
        height: 72,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1E3A8A",
        paddingHorizontal: 20,
    },

    /* --------------------------------------------------- */
    /* NORMAL TAB                                          */
    /* --------------------------------------------------- */
    tabButton: {
        width: 56,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
    },

    /* --------------------------------------------------- */
    /* PRESSED STATE                                       */
    /* --------------------------------------------------- */
    tabPressed: {
        backgroundColor: "#1E40AF",
        transform: [{ scale: 0.92 }],
    },

    /* --------------------------------------------------- */
    /* SCAN SLOT                                           */
    /* --------------------------------------------------- */
    scanSlot: {
        width: 64,
        height: 64,
        alignItems: "center",
        justifyContent: "center",
    },

    /* --------------------------------------------------- */
    /* SCAN BUTTON                                         */
    /* --------------------------------------------------- */
    scanButton: {
        width: 64,
        height: 64,
        alignItems: "center",
        justifyContent: "center",
        // Removed background color and shadows to match the flat icon style
    },

    /* --------------------------------------------------- */
    /* SCAN PRESSED                                        */
    /* --------------------------------------------------- */
    scanPressed: {
        backgroundColor: "#1E40AF", // Adds the same press-highlight as the other tabs
        borderRadius: 16,
        transform: [{ scale: 0.92 }],
    },
});