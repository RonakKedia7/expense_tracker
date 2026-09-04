import { Stack } from "expo-router";

import { useEffect } from "react";
import { initializeDatabase } from "../database/schema";

import "../../global.css";

export default function RootLayout() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}