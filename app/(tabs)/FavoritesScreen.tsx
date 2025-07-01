import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ContactCard from "../../components/ContactCard";
import CustomModal from "../../components/CustomModal";
import { useTheme } from "../../contexts/ThemeContext";
import { useFavorites } from "../../hooks/useFavorites";
import { FavoriteContact } from "../../types";

const FavoritesScreen = () => {
  const { favorites, loading, error, refetch } = useFavorites();
  const router = useRouter();
  const { colors } = useTheme();

  // Modal state
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalConfig, setModalConfig] = React.useState({
    title: "",
    message: "",
    type: "info" as "success" | "error" | "warning" | "info",
    buttons: [{ text: "OK", onPress: () => setModalVisible(false) }],
  });

  const showModal = (config: typeof modalConfig) => {
    setModalConfig(config);
    setModalVisible(true);
  };

  const handleContactPress = (favorite: FavoriteContact) => {
    router.push(
      `/contact-detail/${favorite.user.id}?userData=${encodeURIComponent(
        JSON.stringify(favorite.user)
      )}`
    );
  };

  const exportFavorites = async () => {
    try {
      if (favorites.length === 0) {
        showModal({
          title: "No Favorites",
          message: "You don't have any favorite contacts to export.",
          type: "warning",
          buttons: [
            {
              text: "OK",
              onPress: () => setModalVisible(false),
            },
          ],
        });
        return;
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        totalFavorites: favorites.length,
        favorites: favorites.map((fav) => ({
          id: fav.user.id,
          name: `${fav.user.name.first} ${fav.user.name.last}`,
          email: fav.user.email,
          phone: fav.user.phone,
          favoritedAt: new Date(fav.timestamp).toISOString(),
        })),
      };

      const fileName = `favorites_export_${
        new Date().toISOString().split("T")[0]
      }.json`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(exportData, null, 2)
      );

      showModal({
        title: "Export Successful",
        message: `Your favorites have been exported successfully!\n\nFile: ${fileName}`,
        type: "success",
        buttons: [
          {
            text: "OK",
            onPress: () => setModalVisible(false),
          },
        ],
      });
    } catch (error) {
      console.error("Error exporting favorites:", error);
      showModal({
        title: "Export Failed",
        message: "Failed to export favorites. Please try again.",
        type: "error",
        buttons: [
          {
            text: "Try Again",
            onPress: () => {
              setModalVisible(false);
              exportFavorites();
            },
          },
          {
            text: "Cancel",
            onPress: () => setModalVisible(false),
          },
        ],
      });
    }
  };

  const getCardVariant = (index: number) => {
    const variants = ["primary", "secondary", "tertiary"];
    return variants[index % 3] as "primary" | "secondary" | "tertiary";
  };

  if (error) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <View className="flex-1 justify-center items-center p-4">
          <Ionicons
            name="alert-circle"
            size={64}
            color={colors.textSecondary}
          />
          <Text
            className="mt-4 text-lg font-bold"
            style={{ color: colors.text }}
          >
            Error Loading Favorites
          </Text>
          <Text
            className="mt-2 text-center"
            style={{ color: colors.textSecondary }}
          >
            {error}
          </Text>
          <TouchableOpacity
            onPress={refetch}
            className="mt-4 px-6 py-3 rounded-lg"
            style={{ backgroundColor: colors.accent }}
          >
            <Text className="font-bold" style={{ color: colors.text }}>
              Try Again
            </Text>
          </TouchableOpacity>
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
      <View className="px-6 pt-8 pb-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: colors.text }}
            >
              Favorites ❤️
            </Text>
            <Text className="text-lg" style={{ color: colors.textSecondary }}>
              {favorites.length} contact{favorites.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {favorites.length > 0 && (
            <TouchableOpacity
              onPress={exportFavorites}
              className="rounded-[16px] px-4 py-3 flex-row items-center"
              style={{
                backgroundColor: colors.accent,
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Ionicons
                name="download"
                size={16}
                color={colors.text}
                style={{ marginRight: 6 }}
              />
              <Text
                className="font-bold text-sm"
                style={{ color: colors.text }}
              >
                Export
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Favorites List */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ContactCard
            user={item.user}
            onPress={() => handleContactPress(item)}
            variant={getCardVariant(index)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center p-8">
            <View className="items-center">
              <Ionicons
                name="heart-outline"
                size={64}
                color={colors.textSecondary}
              />
              <Text
                className="text-xl font-bold mt-4 mb-2"
                style={{ color: colors.text }}
              >
                No Favorites Yet
              </Text>
              <Text
                className="text-center text-base leading-6"
                style={{ color: colors.textSecondary }}
              >
                Start adding contacts to your favorites to see them here!
              </Text>
            </View>
          </View>
        )}
      />

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

export default FavoritesScreen;
