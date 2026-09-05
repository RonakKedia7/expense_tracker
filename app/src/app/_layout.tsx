
import { Stack, useSegments, router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { initializeDatabase } from "../database/schema";

import "../../global.css";
import { hasCompletedOnboarding } from "@/database/user";
import { colors } from "@/theme";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

import { AppTransition } from "@/components/common/AppLoader";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  const segments = useSegments();

  // Initialize database first
  useEffect(() => {
    initializeDatabase();
    setIsReady(true);
  }, []);

  // Handle onboarding routing only after database is ready
  useEffect(() => {
    if (!isReady) return;

    const onboarded = hasCompletedOnboarding();
    const inOnboarding = segments[0] === "onboarding";

    if (!onboarded && !inOnboarding) {
      router.replace("/onboarding");
      return;
    }

    if (onboarded && inOnboarding) {
      router.replace("/(tabs)");
    }
  }, [isReady, segments]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />

      {/* ALWAYS BLUE — never gets unmounted */}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background.primary,
        }}
      >
        {!isReady ? (
          // Your loading/transition screen
          <AppTransition />
        ) : (
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "none",
              presentation: "card",
              contentStyle: {
                backgroundColor: colors.background.primary,
              },
            }}
          >
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        )}
      </View>
    </SafeAreaProvider>
  );
}

