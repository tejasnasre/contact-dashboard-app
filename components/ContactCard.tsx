import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import User from "../types";

interface ContactCardProps {
  user: User;
  onPress: () => void;
  variant?: "primary" | "secondary" | "tertiary";
}

const ContactCard: React.FC<ContactCardProps> = ({
  user,
  onPress,
  variant = "primary",
}) => {
  const { colors } = useTheme();

  const getCardBackground = () => {
    switch (variant) {
      case "secondary":
        return colors.cardBlue;
      case "tertiary":
        return colors.cardPink;
      default:
        return colors.cardGreen;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="mx-4 mb-4 rounded-[20px] p-4"
      style={{
        backgroundColor: getCardBackground(),
        shadowColor: "rgba(0, 0, 0, 0.15)",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 8,
      }}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center">
        {/* Profile Picture */}
        <View
          className="mr-4"
          style={{
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 8,
          }}
        >
          <Image
            source={{ uri: user.picture.large }}
            className="w-16 h-16 rounded-full"
          />
        </View>

        {/* Contact Info */}
        <View className="flex-1">
          <Text
            className="text-lg font-bold mb-1"
            style={{ color: colors.text }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {user.name.first} {user.name.last}
          </Text>

          <Text
            className="text-sm mb-1"
            style={{ color: colors.text, opacity: 0.8 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {user.email}
          </Text>

          <Text
            className="text-sm"
            style={{ color: colors.text, opacity: 0.7 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {user.phone}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ContactCard;
