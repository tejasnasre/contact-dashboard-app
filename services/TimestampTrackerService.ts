import { HourlyStats } from "../types";
import { storageService } from "./StorageService";

export class TimestampTrackerService {
  private static instance: TimestampTrackerService;

  static getInstance(): TimestampTrackerService {
    if (!TimestampTrackerService.instance) {
      TimestampTrackerService.instance = new TimestampTrackerService();
    }
    return TimestampTrackerService.instance;
  }

  // Get stats for the last 6 hours
  async getHourlyStats(): Promise<HourlyStats[]> {
    try {
      const favorites = await storageService.getFavorites();
      const now = new Date();
      const currentHour = now.getHours();

      // Initialize stats for last 6 hours
      const stats: HourlyStats[] = [];
      for (let i = 5; i >= 0; i--) {
        const hour = (currentHour - i + 24) % 24;
        stats.push({
          hour,
          count: 0,
        });
      }

      // Count favorites by hour
      favorites.forEach((fav) => {
        const favDate = new Date(fav.timestamp);
        const favHour = favDate.getHours();

        // Only count if it's within the last 6 hours
        const hourDiff = (currentHour - favHour + 24) % 24;
        if (hourDiff < 6) {
          const statIndex = stats.findIndex((stat) => stat.hour === favHour);
          if (statIndex !== -1) {
            stats[statIndex].count++;
          }
        }
      });

      return stats;
    } catch (error) {
      console.error("Error getting hourly stats:", error);
      return [];
    }
  }

  // Format hour for display (12-hour format)
  formatHour(hour: number): string {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  }
}

export const timestampTrackerService = TimestampTrackerService.getInstance();
