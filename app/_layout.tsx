import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { ThemeProvider } from "../contexts/ThemeContext";
import "./global.css";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="contact-detail/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
