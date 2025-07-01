// This file is just for types, not a route
export default interface User {
  location: any;
  gender: ReactNode;
  id: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export interface FavoriteContact {
  id: string;
  user: User;
  timestamp: number;
}

export interface HourlyStats {
  hour: number;
  count: number;
}
