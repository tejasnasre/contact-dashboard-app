import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Modal, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  buttons?: {
    text: string;
    onPress: () => void;
    style?: "default" | "destructive";
  }[];
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  message,
  type = "info",
  buttons = [{ text: "OK", onPress: onClose }],
}) => {
  const { colors } = useTheme();
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const getIconName = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "warning":
        return "warning";
      default:
        return "information-circle";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#10B981";
      case "error":
        return "#EF4444";
      case "warning":
        return "#F59E0B";
      default:
        return colors.accent;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <Animated.View
          style={{
            transform: [{ scale: scaleValue }],
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 24,
            width: "100%",
            maxWidth: 320,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* Icon */}
          <View className="items-center mb-4">
            <Ionicons name={getIconName()} size={48} color={getIconColor()} />
          </View>

          {/* Title */}
          <Text
            className="text-xl font-bold text-center mb-3"
            style={{ color: colors.text }}
          >
            {title}
          </Text>

          {/* Message */}
          <Text
            className="text-base text-center mb-6 leading-6"
            style={{ color: colors.textSecondary }}
          >
            {message}
          </Text>

          {/* Buttons */}
          <View className="flex-row gap-3">
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={button.onPress}
                className="flex-1 py-3 rounded-lg"
                style={{
                  backgroundColor:
                    button.style === "destructive" ? "#EF4444" : colors.accent,
                }}
              >
                <Text
                  className="text-center font-bold"
                  style={{ color: colors.text }}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CustomModal;
