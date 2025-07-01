import User from "../types";

interface RandomUserResponse {
  results: {
    login: { uuid: string };
    name: { first: string; last: string };
    email: string;
    phone: string;
    picture: {
      large: string;
      medium: string;
      thumbnail: string;
    };
  }[];
}

export class ApiService {
  private static instance: ApiService;

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async fetchUsers(count: number = 10): Promise<User[]> {
    try {
      const response = await fetch(
        `https://randomuser.me/api/?results=${count}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RandomUserResponse = await response.json();

      return data.results.map((userResult) => ({
        id: userResult.login.uuid,
        name: userResult.name,
        email: userResult.email,
        phone: userResult.phone,
        picture: userResult.picture,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
}

export const apiService = ApiService.getInstance();
