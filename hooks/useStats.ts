import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { storageService } from "../services/StorageService";
import { timestampTrackerService } from "../services/TimestampTrackerService";
import { HourlyStats } from "../types";

export const useStats = () => {
  const [stats, setStats] = useState<HourlyStats[]>([]);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [hourlyData, favorites] = await Promise.all([
        timestampTrackerService.getHourlyStats(),
        storageService.getFavorites(),
      ]);

      setStats(hourlyData);
      setTotalFavorites(favorites.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const refetch = useCallback(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    totalFavorites,
    loading,
    error,
    refetch,
    formatHour: timestampTrackerService.formatHour,
  };
};
