# Contact Dashboard App

## Assignment Overview

I was tasked with building a complete **Contact Dashboard** mobile application using React Native and Expo. The assignment required implementing a multi-screen app with contacts management, favorites functionality, and analytics.

## 🎯 Assignment Requirements & Implementation

### 1. **Contacts List Screen** ✅

**Requirement**: Display a list of contacts fetched from an API with search functionality

- **Implementation**:
  - Used RandomUser API to fetch 10 random contacts
  - Implemented search functionality with real-time filtering
  - Created `ContactCard` component with different color variants
  - Added pull-to-refresh functionality
  - Animated header with scroll effects

### 2. **Contact Details Screen** ✅

**Requirement**: Show detailed information about a selected contact

- **Implementation**:
  - Dynamic routing using Expo Router `[id].tsx`
  - Displays contact's full information with profile picture
  - Toggle favorite functionality with visual feedback
  - Custom modal for user interactions
  - Proper navigation with back button

### 3. **Favorites Management** ✅

**Requirement**: Allow users to mark contacts as favorites and view them separately

- **Implementation**:
  - Dedicated Favorites screen with filtered view
  - Persistent storage using AsyncStorage
  - Export favorites to JSON file functionality
  - Real-time updates when favorites are added/removed
  - Timestamp tracking for analytics

### 4. **Statistics & Analytics** ✅

**Requirement**: Show usage statistics and data visualization

- **Implementation**:
  - Created comprehensive stats dashboard
  - Bar chart showing hourly favorite additions (last 6 hours)
  - Total favorites counter
  - Interactive charts using `react-native-chart-kit`
  - Hourly breakdown of user activity

### 5. **Theme Management** ✅

**Requirement**: Implement light/dark theme switching

- **Implementation**:
  - Context-based theme management
  - Three theme modes: Light, Dark, System
  - Persistent theme preference storage
  - Dynamic color scheme based on system settings
  - Smooth theme transitions

## 🏗️ Architecture & Project Structure

### **Services Layer**

```
services/
├── ApiService.ts          # API calls to RandomUser
├── StorageService.ts      # AsyncStorage management
└── TimestampTrackerService.ts  # Analytics tracking
```

### **State Management**

```
hooks/
├── useContacts.ts         # Contacts data fetching
├── useFavorites.ts        # Favorites management
└── useStats.ts           # Statistics calculations
```

### **UI Components**

```
components/
├── ContactCard.tsx        # Reusable contact display
├── CustomModal.tsx        # Custom modal dialogs
└── Graph.tsx             # Chart visualization
```

### **Navigation Structure**

```
app/
├── _layout.tsx           # Root layout with ThemeProvider
├── (tabs)/              # Tab navigation
│   ├── _layout.tsx      # Tabs configuration
│   ├── ContactsListScreen.tsx
│   ├── FavoritesScreen.tsx
│   └── StatsScreen.tsx
└── contact-detail/[id].tsx  # Dynamic contact details
```

## 🔧 Technical Implementation Details

### **Data Management**

- **API Integration**: RandomUser API for fetching contacts
- **Local Storage**: AsyncStorage for favorites and preferences
- **State Management**: React hooks with Context API
- **Data Persistence**: JSON export functionality

### **UI/UX Features**

- **Responsive Design**: TailwindCSS with NativeWind
- **Animations**: Smooth transitions and scroll effects
- **Theme System**: Dynamic color schemes
- **Custom Components**: Reusable UI elements
- **Error Handling**: Comprehensive error states

### **Performance Optimizations**

- **Lazy Loading**: Efficient data fetching
- **Memoization**: Preventing unnecessary re-renders
- **Image Caching**: Optimized profile picture loading
- **Background Tasks**: Non-blocking favorite operations

## 🚀 Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npx expo start
   ```

3. **Run on device/simulator**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app

## 📱 Features Implemented

- ✅ Contact list with search functionality
- ✅ Contact details with favorite toggle
- ✅ Favorites management and export
- ✅ Statistics dashboard with charts
- ✅ Light/Dark/System theme switching
- ✅ Persistent data storage
- ✅ Error handling and loading states
- ✅ Responsive design
- ✅ Pull-to-refresh functionality
- ✅ Custom modal dialogs

## 🛠️ Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **TailwindCSS + NativeWind** - Styling
- **AsyncStorage** - Local data persistence
- **React Native Chart Kit** - Data visualization
- **Expo Router** - File-based routing
- **RandomUser API** - Mock contact data

## 📊 Assignment Completion Status

| Feature          | Status      | Implementation              |
| ---------------- | ----------- | --------------------------- |
| Contacts List    | ✅ Complete | Search, filters, cards      |
| Contact Details  | ✅ Complete | Full info, favorite toggle  |
| Favorites        | ✅ Complete | Storage, export, management |
| Statistics       | ✅ Complete | Charts, analytics           |
| Themes           | ✅ Complete | Light/Dark/System modes     |
| Navigation       | ✅ Complete | Tab + stack navigation      |
| Data Persistence | ✅ Complete | AsyncStorage integration    |
| Error Handling   | ✅ Complete | Comprehensive error states  |

## 🎨 Design Decisions

1. **Color Variants**: Different card colors for visual variety
2. **Animation**: Smooth transitions for better UX
3. **Modular Architecture**: Separated concerns for maintainability
4. **Type Safety**: Full TypeScript implementation
5. **Responsive Design**: Adaptive layouts for different screen sizes

This assignment helped me understand React Native development, state management, API integration, and building production-ready mobile applications with proper architecture and user experience considerations.
