import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Graph from "../../components/Graph";
import { useTheme } from "../../contexts/ThemeContext";
import { useStats } from "../../hooks/useStats";

const StatsScreen = () => {
  const { stats, totalFavorites, loading, error, refetch, formatHour } =
    useStats();
  const { colors } = useTheme();

  const totalFavoritesLast6Hours = stats.reduce(
    (sum, stat) => sum + stat.count,
    0
  );

  const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    bgColor,
    iconColor,
  }: {
    icon: string;
    title: string;
    value: string | number;
    subtitle: string;
    bgColor: string;
    iconColor: string;
  }) => (
    <View
      className="rounded-[20px] p-4"
      style={{
        width: 160,
        height: 160,
        backgroundColor: bgColor,
        shadowColor: "rgba(0, 0, 0, 0.15)",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      <View className="items-center justify-center h-full">
        <Ionicons
          name={icon as any}
          size={24}
          color={iconColor}
          style={{ marginBottom: 8 }}
        />
        <Text
          className="text-sm font-semibold text-center mb-1"
          style={{ color: iconColor }}
        >
          {title}
        </Text>
        <Text
          className="text-3xl font-bold text-center mb-1"
          style={{ color: iconColor }}
        >
          {value}
        </Text>
        <Text
          className="text-xs text-center opacity-70"
          style={{ color: iconColor }}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );

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
            Error Loading Stats
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
      >
        {/* Header */}
        <View className="px-6 pt-8 pb-6">
          <Text
            className="text-2xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            Statistics 📊
          </Text>
          <Text className="text-lg" style={{ color: colors.textSecondary }}>
            Your Activity Overview
          </Text>
        </View>

        {/* Stats Cards Grid */}
        <View className="px-8 mb-6">
          <View className="flex-row justify-between mb-3">
            <StatCard
              icon="heart"
              title="Total Favorites"
              value={totalFavorites}
              subtitle="contacts"
              bgColor={colors.cardGreen}
              iconColor={colors.text}
            />
            <StatCard
              icon="time"
              title="Last 6 Hours"
              value={totalFavoritesLast6Hours}
              subtitle="added"
              bgColor={colors.cardBlue}
              iconColor={colors.text}
            />
          </View>

          <View className="flex-row justify-between">
            <StatCard
              icon="trending-up"
              title="Activity"
              value={stats.length > 0 ? "Active" : "Quiet"}
              subtitle="status"
              bgColor={colors.cardPink}
              iconColor={colors.text}
            />
            <StatCard
              icon="bar-chart"
              title="Peak Hour"
              value={
                stats.reduce(
                  (prev, current) =>
                    prev.count > current.count ? prev : current,
                  { hour: 0, count: 0 }
                ).count > 0
                  ? formatHour(
                      stats.reduce((prev, current) =>
                        prev.count > current.count ? prev : current
                      ).hour
                    ).split(" ")[0]
                  : "N/A"
              }
              subtitle="most active"
              bgColor={colors.cardGreen}
              iconColor={colors.text}
            />
          </View>
        </View>

        {/* Chart */}
        <View className="px-4 mb-6">
          <View
            className="rounded-[20px] p-6"
            style={{
              backgroundColor: colors.surface,
              shadowColor: "rgba(0, 0, 0, 0.2)",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 1,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              Activity Chart
            </Text>
            <Graph data={stats} />
          </View>
        </View>

        {/* Activity Summary */}
        <View className="px-4 mb-32">
          <View
            className="rounded-[20px] p-6"
            style={{
              backgroundColor: colors.surface,
              shadowColor: "rgba(0, 0, 0, 0.2)",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 1,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              Hourly Breakdown
            </Text>

            {stats.length > 0 ? (
              <View className="space-y-3">
                {stats.map((stat, index) => (
                  <View
                    key={index}
                    className="flex-row justify-between items-center py-2"
                  >
                    <Text
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {formatHour(stat.hour)}
                    </Text>
                    <View className="flex-row items-center">
                      <Text
                        className="text-sm font-bold mr-2"
                        style={{ color: colors.text }}
                      >
                        {stat.count}
                      </Text>
                      <Text
                        className="text-xs"
                        style={{ color: colors.textSecondary }}
                      >
                        {stat.count === 1 ? "favorite" : "favorites"}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text
                className="text-center"
                style={{ color: colors.textSecondary }}
              >
                No recent activity
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatsScreen;
