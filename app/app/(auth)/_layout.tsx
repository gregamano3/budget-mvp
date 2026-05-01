/**
 * Auth layout — Stack navigator for login/signup screens.
 * No bottom tab bar visible here.
 */

import { Stack } from "expo-router";
import { Colors } from "../../constants/theme";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: "slide_from_right",
      }}
    />
  );
}
