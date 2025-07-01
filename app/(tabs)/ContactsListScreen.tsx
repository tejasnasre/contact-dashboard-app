import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ContactCard from "../../components/ContactCard";
import { useTheme } from "../../contexts/ThemeContext";
import { useContacts } from "../../hooks/useContacts";
import User from "../../types";

const ContactsListScreen = () => {
  const { users, loading, error, refetch } = useContacts();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const router = useRouter();
  const { colors, toggleTheme, getThemeIcon, getThemeLabel } = useTheme();

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => {
        const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
        return (
          fullName.includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchText.toLowerCase())
        );
      });
      setFilteredUsers(filtered);
    }
  }, [searchText, users]);

  const handleContactPress = (user: User) => {
    router.push(
      `/contact-detail/${user.id}?userData=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  };

  const getCardVariant = (index: number) => {
    const variants = ["primary", "secondary", "tertiary"];
    return variants[index % 3] as "primary" | "secondary" | "tertiary";
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! ☀️";
    if (hour < 17) return "Good Afternoon! 🌤️";
    return "Good Evening! 🌙";
  };

  // Animated header opacity based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  if (loading && !refreshing) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <StatusBar
          barStyle={
            colors.text === "#FFFFFF" ? "light-content" : "dark-content"
          }
          backgroundColor={colors.background}
        />
        <View className="flex-1 justify-center items-center">
          <View
            className="rounded-full p-8 mb-6"
            style={{ backgroundColor: colors.surface }}
          >
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
          <Text
            className="text-xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            Loading Contacts
          </Text>
          <Text
            className="text-center px-8"
            style={{ color: colors.textSecondary }}
          >
            Please wait while we fetch your contacts...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <StatusBar
          barStyle={
            colors.text === "#FFFFFF" ? "light-content" : "dark-content"
          }
          backgroundColor={colors.background}
        />
        <View className="flex-1 justify-center items-center p-6">
          <View
            className="rounded-full p-6 mb-6"
            style={{ backgroundColor: colors.surface }}
          >
            <Ionicons
              name="cloud-offline-outline"
              size={48}
              color={colors.textSecondary}
            />
          </View>
          <Text
            className="text-xl font-bold mb-3"
            style={{ color: colors.text }}
          >
            Unable to Load Contacts
          </Text>
          <Text
            className="text-center mb-8 leading-6"
            style={{ color: colors.textSecondary }}
          >
            {error}
          </Text>
          <TouchableOpacity
            onPress={refetch}
            className="px-8 py-4 rounded-2xl flex-row items-center"
            style={{
              backgroundColor: colors.accent,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Ionicons
              name="refresh"
              size={20}
              color={colors.text}
              style={{ marginRight: 8 }}
            />
            <Text
              className="font-bold text-base"
              style={{ color: colors.text }}
            >
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
      <StatusBar
        barStyle={colors.text === "#FFFFFF" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Animated Header */}
      <Animated.View
        className="px-6 pt-4 pb-6"
        style={{ opacity: headerOpacity }}
      >
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-1">
            <Text
              className="text-3xl font-bold mb-1"
              style={{ color: colors.text }}
            >
              {getGreetingMessage()}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-lg" style={{ color: colors.textSecondary }}>
                {users.length} contact{users.length !== 1 ? "s" : ""}
              </Text>
              {filteredUsers.length !== users.length && (
                <Text className="text-lg" style={{ color: colors.accent }}>
                  {" • "}
                  {filteredUsers.length} filtered
                </Text>
              )}
            </View>
          </View>

          {/* Theme Toggle Button */}
          <TouchableOpacity
            onPress={toggleTheme}
            className="rounded-2xl px-4 py-3 flex-row items-center"
            style={{
              backgroundColor: colors.surface,
              shadowColor: colors.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons
              name={getThemeIcon() as any}
              size={18}
              color={colors.accent}
              style={{ marginRight: 6 }}
            />
            <Text
              className="font-semibold text-sm"
              style={{ color: colors.text }}
            >
              {getThemeLabel()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Enhanced Search Bar */}
        <View className="rounded-2xl px-5 py-4 flex-row items-center border border-gray-300">
          <Ionicons
            name="search"
            size={22}
            color={searchText ? colors.accent : colors.textSecondary}
            style={{ marginRight: 12 }}
          />
          <TextInput
            placeholder="Search by name, email, or phone..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 text-base"
            style={{ color: colors.text }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText("")}
              className="ml-2 p-1"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Contacts List */}
      <Animated.FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ContactCard
            user={item}
            onPress={() => handleContactPress(item)}
            variant={getCardVariant(index)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
          paddingTop: 8,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.accent]}
            tintColor={colors.accent}
            progressBackgroundColor={colors.surface}
          />
        }
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center p-8 mt-20">
            <View
              className="rounded-full p-8 mb-6"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons
                name={searchText ? "search-outline" : "people-outline"}
                size={48}
                color={colors.textSecondary}
              />
            </View>
            <Text
              className="text-xl font-bold mb-3"
              style={{ color: colors.text }}
            >
              {searchText ? "No Results Found" : "No Contacts Yet"}
            </Text>
            <Text
              className="text-center leading-6 px-4"
              style={{ color: colors.textSecondary }}
            >
              {searchText
                ? `No contacts match "${searchText}". Try a different search term.`
                : "Your contact list is empty. Add some contacts to get started!"}
            </Text>
            {searchText && (
              <TouchableOpacity
                onPress={() => setSearchText("")}
                className="mt-6 px-6 py-3 rounded-xl"
                style={{ backgroundColor: colors.surface }}
              >
                <Text
                  className="font-semibold"
                  style={{ color: colors.accent }}
                >
                  Clear Search
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ContactsListScreen;
