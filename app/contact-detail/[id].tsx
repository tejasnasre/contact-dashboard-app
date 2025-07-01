import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomModal from "../../components/CustomModal";
import { useTheme } from "../../contexts/ThemeContext";
import { storageService } from "../../services/StorageService";
import User from "../../types";

const ContactDetailScreen = () => {
  const { id, userData } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "info" as "success" | "error" | "warning" | "info",
    buttons: [{ text: "OK", onPress: () => setModalVisible(false) }],
  });

  const showModal = (config: typeof modalConfig) => {
    setModalConfig(config);
    setModalVisible(true);
  };

  useEffect(() => {
    if (userData && typeof userData === "string") {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        checkFavoriteStatus(parsedUser.id);
      } catch (error) {
        console.error("Error parsing user data:", error);
        showModal({
          title: "Error",
          message: "Invalid contact data",
          type: "error",
          buttons: [
            {
              text: "Go Back",
              onPress: () => {
                setModalVisible(false);
                router.back();
              },
            },
          ],
        });
      }
    }
  }, [userData]);

  const checkFavoriteStatus = async (userId: string) => {
    try {
      setLoading(true);
      const favorite = await storageService.isFavorite(userId);
      setIsFavorite(favorite);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user || favoriteLoading) return;

    try {
      setFavoriteLoading(true);
      const newFavoriteStatus = await storageService.toggleFavorite(user);
      setIsFavorite(newFavoriteStatus);

      showModal({
        title: newFavoriteStatus
          ? "Added to Favorites ❤️"
          : "Removed from Favorites",
        message: newFavoriteStatus
          ? `${user.name.first} ${user.name.last} has been added to your favorites.`
          : `${user.name.first} ${user.name.last} has been removed from your favorites.`,
        type: newFavoriteStatus ? "success" : "info",
        buttons: [
          {
            text: "OK",
            onPress: () => setModalVisible(false),
          },
        ],
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      showModal({
        title: "Error",
        message: "Failed to update favorite status. Please try again.",
        type: "error",
        buttons: [
          {
            text: "Try Again",
            onPress: () => {
              setModalVisible(false);
              toggleFavorite();
            },
          },
          {
            text: "Cancel",
            onPress: () => setModalVisible(false),
          },
        ],
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.accent} />
          <Text
            className="mt-4 text-lg"
            style={{ color: colors.textSecondary }}
          >
            Loading contact...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 pt-10"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-xl"
          style={{
            backgroundColor: colors.surface,
            shadowColor: "rgba(0, 0, 0, 0.06)",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text className="text-xl font-semibold" style={{ color: colors.text }}>
          Contact Details
        </Text>

        <View className="w-10" />
      </View>

      {/* Contact Card */}
      <View className="px-6 mt-6">
        <View
          className="rounded-3xl p-8 items-center"
          style={{
            backgroundColor: colors.surface,
            shadowColor: "rgba(0, 0, 0, 0.06)",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 1,
            shadowRadius: 24,
            elevation: 12,
          }}
        >
          {/* Profile Picture */}
          <View
            className="mb-6"
            style={{
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
            }}
          >
            <Image
              source={{ uri: user.picture.large }}
              className="w-32 h-32 rounded-full"
            />
          </View>

          {/* Name */}
          <Text
            className="text-2xl font-bold mb-2 text-center"
            style={{ color: colors.text }}
          >
            {user.name.first} {user.name.last}
          </Text>

          {/* Contact Info */}
          <View className="w-full mt-6 flex flex-col gap-8">
            {/* Email */}
            <View
              className="flex-row items-center p-4 rounded-2xl"
              style={{ backgroundColor: colors.background }}
            >
              <Ionicons
                name="mail"
                size={20}
                color={colors.accent}
                style={{ marginRight: 12 }}
              />
              <View className="flex-1">
                <Text
                  className="text-xs font-medium mb-1"
                  style={{ color: colors.textSecondary }}
                >
                  EMAIL
                </Text>
                <Text className="text-base" style={{ color: colors.text }}>
                  {user.email}
                </Text>
              </View>
            </View>

            {/* Phone */}
            <View
              className="flex-row items-center p-4 rounded-2xl"
              style={{ backgroundColor: colors.background }}
            >
              <Ionicons
                name="call"
                size={20}
                color={colors.accent}
                style={{ marginRight: 12 }}
              />
              <View className="flex-1">
                <Text
                  className="text-xs font-medium mb-1"
                  style={{ color: colors.textSecondary }}
                >
                  PHONE
                </Text>
                <Text className="text-base" style={{ color: colors.text }}>
                  {user.phone}
                </Text>
              </View>
            </View>
          </View>

          {/* Favorite Button */}
          <TouchableOpacity
            onPress={toggleFavorite}
            disabled={loading || favoriteLoading}
            className="mt-8 w-full py-4 px-6 rounded-2xl flex-row items-center justify-center"
            style={{
              backgroundColor: isFavorite ? colors.accent : colors.accent,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            {favoriteLoading ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={24}
                  color={colors.surface}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className="text-lg font-semibold"
                  style={{ color: colors.surface }}
                >
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        buttons={modalConfig.buttons}
      />
    </SafeAreaView>
  );
};

export default ContactDetailScreen;
