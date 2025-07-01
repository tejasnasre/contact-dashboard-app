import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import { Colors } from "../constants/theme";

type ColorScheme = "light" | "dark" | "system";

const THEME_KEY = "user_theme_preference";

interface ThemeContextType {
  colors: typeof Colors.light;
  themePreference: ColorScheme;
  currentColorScheme: "light" | "dark";
  toggleTheme: () => Promise<void>;
  getThemeIcon: () => string;
  getThemeLabel: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themePreference, setThemePreference] = useState<ColorScheme>("system");
  const [systemColorScheme, setSystemColorScheme] = useState<"light" | "dark">(
    () => {
      const scheme = Appearance.getColorScheme();
      return scheme === "dark" ? "dark" : "light";
    }
  );

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (
          saved &&
          (saved === "light" || saved === "dark" || saved === "system")
        ) {
          setThemePreference(saved as ColorScheme);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };
    loadTheme();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme === "dark" ? "dark" : "light");
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = async () => {
    const themes: ColorScheme[] = ["system", "light", "dark"];
    const currentIndex = themes.indexOf(themePreference);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    setThemePreference(nextTheme);
    try {
      await AsyncStorage.setItem(THEME_KEY, nextTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const currentColorScheme =
    themePreference === "system"
      ? systemColorScheme
      : (themePreference as "light" | "dark");
  const colors = Colors[currentColorScheme];

  const getThemeIcon = () => {
    switch (themePreference) {
      case "light":
        return "sunny";
      case "dark":
        return "moon";
      case "system":
      default:
        return "phone-portrait";
    }
  };

  const getThemeLabel = () => {
    switch (themePreference) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
      default:
        return "System";
    }
  };

  const value: ThemeContextType = {
    colors,
    themePreference,
    currentColorScheme,
    toggleTheme,
    getThemeIcon,
    getThemeLabel,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
