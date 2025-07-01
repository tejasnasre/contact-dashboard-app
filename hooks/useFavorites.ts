import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { storageService } from "../services/StorageService";
import { FavoriteContact } from "../types";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storageService.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error loading favorites:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const refetch = useCallback(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    loading,
    error,
    refetch,
  };
};
