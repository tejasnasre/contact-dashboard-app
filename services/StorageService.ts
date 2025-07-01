import AsyncStorage from "@react-native-async-storage/async-storage";
import User, { FavoriteContact } from "../types";

const FAVORITES_KEY = "contact_favorites";

export class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Get all favorite contacts
  async getFavorites(): Promise<FavoriteContact[]> {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error("Error getting favorites:", error);
      return [];
    }
  }

  // Check if a contact is favorite
  async isFavorite(userId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some((fav) => fav.id === userId);
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  }

  // Add a contact to favorites
  async addFavorite(user: User): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const newFavorite: FavoriteContact = {
        id: user.id,
        user,
        timestamp: Date.now(),
      };

      // Check if already exists
      const existingIndex = favorites.findIndex((fav) => fav.id === user.id);
      if (existingIndex === -1) {
        favorites.push(newFavorite);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  }

  // Remove a contact from favorites
  async removeFavorite(userId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const filteredFavorites = favorites.filter((fav) => fav.id !== userId);
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(filteredFavorites)
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  }

  // Toggle favorite status
  async toggleFavorite(user: User): Promise<boolean> {
    try {
      const isCurrentlyFavorite = await this.isFavorite(user.id);

      if (isCurrentlyFavorite) {
        await this.removeFavorite(user.id);
        return false;
      } else {
        await this.addFavorite(user);
        return true;
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  }
}

export const storageService = StorageService.getInstance();
