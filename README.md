# Kindred Moments 🌸

> A Singapore community app designed to combat loneliness through meaningful local connections, shared experiences, and neighbourhood-based social discovery.

![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)

---

##  Overview

**Kindred Moments** is a mobile-first progressive web application built to foster genuine human connections within Singapore neighbourhoods. The app matches residents based on shared interests, location proximity, and social comfort levels, facilitating both 1-on-1 connections and interest-based group activities.

### Key Philosophy
- **Hyperlocal Focus**: All features center around Singapore neighbourhoods (Punggol, Tampines, Woodlands, etc.)
- **Low-Pressure Socializing**: Respects introvert/ambivert/extrovert preferences
- **Data-Driven Matching**: Uses interests, mood, free time slots, and languages for smart connections
- **Community Wellness**: Integrates mood tracking, journaling, and breathing exercises

---

## Features

### Explore Page - Discovery Hub
The main discovery interface with four distinct tabs:

#### **Members Tab - Tinder-Style Swiping**
- **Swipe cards** to like/pass on neighbourhood members
- **Match percentage calculation** based on shared interests
- **Comfort level indicators** (introvert 🌙, ambivert ⛅, extrovert ☀️)
- **Language compatibility badges**
- **Available time slots** display
- **Persistent swipe state** - progress saved to sessionStorage
- **AI-generated conversation starters** - Get personalized icebreakers based on shared interests
- **Post-swipe summary** showing all liked users with quick-contact buttons

#### **Clans Tab - Interest Groups**
- **Searchable group directory** with themed icons
- **"For You" recommendations** based on user interests
- **Join/Leave functionality** with visual "Joined" badges
- **Member counts and neighbourhood info**
- **Quick navigation to group chats** after joining

#### **Areas Tab - Neighbourhood Leaderboard**
- **Activity rankings** showing most active neighbourhoods
- **Engagement metrics** and trending interests per area
- **Mood indicators** for community wellness tracking

#### **Globe Tab - 3D Community Network Visualization** 
An interactive Three.js-powered 3D visualization of your community network:
- **Your node at the center** — you are the focal point of the network
- **Pink dots** represent groups you've joined, positioned closest to you with glowing connection lines back to your node
- **Purple dots** represent groups matching your interests, positioned at a medium distance
- **Green dots** represent all other community groups, placed furthest away
- **Small dots** represent individual users scattered throughout the network
- **Spatial proximity = relevance** — the closer a node is to you, the stronger its relationship to your profile
- **Tap any pink node** to open a detail panel — scroll down to navigate directly to that group's page
- **Drag-to-rotate and zoom controls** for exploring the full network
- **Pulsing central core** with orbiting rings for atmospheric depth
- **Floating background particles** for ambiance

###  Chat Page - Living Conversations
A fully-featured chat system that feels alive:

#### **Group Chats**
- **Color-coded senders** for visual distinction
- **Group information panel** with trust & safety guidelines
- **Quick-join popup** when accessing new groups

#### **Direct Messages**
- **Liked users integration** - Users you swiped right on appear with "Liked" badge
- **AI draft messages** carried over from Explore page
- **Seamless navigation** from Explore → Chat

#### **Smart Features**
- **Visual timestamps** and message history
- **Typing indicators** and read receipts simulation
- **Attachment/camera buttons** (UI ready)

### Home Page
- **Personalized greeting** based on time of day with animated hand wave
- **Neighbourhood mood display** showing your area's community mood average
- **Daily steps tracking** synced with Wellness page via localStorage
- **Weather integration** with real Singapore conditions
- **Live status feed** showing what neighbours are doing
- **What's happening** section with upcoming events and attendee counts
- **Quick action cards** for Chat, Wellness, Explore, and Goals
- **Coffee invite connections** linking to suggested chat partners
- **Guided tour overlay** for first-time users with curvy arrow navigation
- **"Guide" button** to restart the interactive tutorial anytime

### Profile Page
- **Avatar and bio management**
- **Interest tags** (selectable up to 6)
- **Neighbourhood selection**
- **Language preferences**
- **Comfort level setting**
- **Availability schedule**

### Wellness Features
- **Mood tracking** with weekly trends
- **Journaling** for personal reflection
- **Breathing exercises** with guided patterns
- **Community mood pulse** aggregation

### Goals System
- **Neighbourhood community goals** (collective achievements)
- **Personal wellness objectives**
- **Progress tracking** with visual indicators

### Onboarding Flow
Multi-step onboarding experience:
1. **Welcome Screen** - App introduction
2. **SingPass Auth** - Singapore identity verification (mocked)
3. **Profile Setup** - Avatar, name, bio
4. **Neighbourhood Select** - Primary and secondary areas
5. **Interest Selection** - Choose up to 6 interests
6. **Mood Check-in** - Initial wellness baseline

---

## 🛠 Technical Architecture

### Framework & Build
```
React 18.3 + TypeScript
Vite 7.x (fast HMR, modern bundling)
Vitest (testing)
ESLint (linting)
```

### Styling
```
Tailwind CSS (utility-first)
shadcn/ui (Radix-based components)
Framer Motion (animations)
```

### 3D Visualization
```
Three.js (WebGL 3D graphics)
@react-three/fiber (React renderer for Three.js)
@react-three/drei (helpers: OrbitControls, Float, Trail, Text, etc.)
```

### State Management
```
React hooks (useState, useEffect, useMemo)
SessionStorage (persistence for swipe state, joined groups, contacts)
Custom event system (cross-component communication)
```

### Data Layer
```
JSON files (users, clans, activities, pulse data, matches)
Custom hooks (useUsers, useClans, usePulseData, etc.)
Type-safe interfaces (User, Clan, Match, PulseData, etc.)
```

---

## Project Structure

```
src/
├── components/
│   ├── explore/                    # Explore page components
│   │   ├── GlobeVisualization.tsx  # 3D Three.js globe (650+ lines)
│   │   ├── MembersNearby.tsx       # Tinder-style swipe cards (600+ lines)
│   │   ├── InterestGroupDirectory.tsx # Groups with search (215+ lines)
│   │   ├── NeighbourhoodDirectory.tsx # Area leaderboard
│   │   └── index.ts                # Barrel exports
│   ├── onboarding/                 # Onboarding flow steps
│   │   ├── WelcomeScreen.tsx
│   │   ├── SingPassAuth.tsx
│   │   ├── ProfileSetup.tsx
│   │   ├── NeighbourhoodSelect.tsx
│   │   ├── InterestSelect.tsx
│   │   └── MoodCheckin.tsx
│   ├── ui/                         # shadcn/ui components (50+ files)
│   ├── ActivityCard.tsx
│   ├── AvatarBubble.tsx
│   ├── BottomNav.tsx
│   ├── FloatingAIChat.tsx
│   └── StatusFeed.tsx
├── pages/
│   ├── HomePage.tsx                # Main dashboard
│   ├── ExplorePage.tsx             # Discovery hub (4 tabs)
│   ├── ChatPage.tsx                # Messaging (1000+ lines)
│   ├── ProfilePage.tsx             # User profile
│   ├── WellnessPage.tsx            # Mood & journaling
│   ├── GoalsPage.tsx               # Community goals
│   ├── EventsPage.tsx              # Upcoming events
│   ├── OnboardingPage.tsx          # Multi-step onboarding
│   └── ...
├── hooks/
│   ├── use-data.ts                 # Data fetching hooks
│   ├── use-chat-connections.ts     # Chat state management
│   ├── use-user-profile.ts         # Profile persistence
│   └── use-community-goals.ts      # Goals tracking
├── data/
│   ├── users.json                  # 20+ mock users with full profiles
│   ├── clans.json                  # Interest groups per neighbourhood
│   ├── activities.json             # Available activities
│   ├── pulse.json                  # Neighbourhood activity data
│   └── matches.json                # Connection history
├── types/
│   └── index.ts                    # TypeScript interfaces
└── lib/
    └── utils.ts                    # Utility functions
```

---

## Design System

### Color Palette
- **Primary**: Purple (`#8b5cf6`) - Community, connection
- **Sakura**: Pink (`#ec4899`) - Personal connections, likes
- **Emerald**: Green (`#22c55e`) - Positive mood, activity
- **Amber**: Yellow (`#eab308`) - Neutral, attention
- **Muted**: Slate tones - UI backgrounds

---

## Getting Started

### Prerequisites
- Node.js 18+ (or Bun)
- npm, yarn, or bun package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd kindred-moments

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run preview   # Preview production build
npm run test      # Run tests
npm run lint      # Run ESLint
```

---

## Data Models

### User Profile
```typescript
interface User {
  id: string;
  name: string;
  age: number;
  neighbourhood: string;
  languages: string[];           // ["English", "Mandarin", "Malay"]
  interests: string[];           // ["cycling", "cooking", "photography"]
  comfort_level: "introvert" | "ambivert" | "extrovert";
  free_slots: string[];          // ["weekday-morning", "weekend-afternoon"]
  joined_clans: string[];
  mood_last_week: number[];      // [4, 5, 3, 4, 5, 4, 4]
  avatar: string;
}
```

### Interest Group (Clan)
```typescript
interface Clan {
  id: string;
  name: string;
  neighbourhood: string;
  theme: string;                 // "cycling", "cooking", etc.
  members: string[];
  weekly_goal: string;
  events_planned: number;
}
```

### Neighbourhood Pulse
```typescript
interface PulseData {
  neighbourhood: string;
  active_today: number;
  avg_mood: number;              // 1-5 scale
  top_interests: string[];
}
```

---

## Key Technical Decisions

1. **SessionStorage for State** - Enables state persistence without backend, simulates real user experience
2. **Custom Event System** - Allows cross-component communication (e.g., chat updates)
3. **Component-First Architecture** - Explore page split into focused components for maintainability
4. **Three.js Integration** - Full 3D scene for unique, memorable visualization
5. **AI Message Generation** - Context-aware icebreakers based on shared interests

---

## Singapore-Specific Features

- **15 HDB Neighbourhoods** mapped (Punggol, Tampines, Woodlands, Bedok, etc.)
- **SingPass Integration** (mocked) for identity verification
- **Multilingual Support** (English, Mandarin, Malay, Tamil, Hokkien)
- **Local Activities** (kopi sessions, hawker food hunts, void deck gatherings)
- **Cultural Sensitivity** in comfort level settings

---

## Future Roadmap

- [ ] Backend API integration (Supabase/Firebase)
- [ ] Real-time chat with WebSockets
- [ ] Push notifications
- [ ] Event creation and RSVP
- [ ] Photo sharing in chats
- [ ] Voice messages
- [ ] Community achievements system
- [ ] Admin moderation tools

---

## Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Framer Motion** for buttery-smooth animations
- **Three.js community** for 3D inspiration
- **Singapore Government** for neighbourhood data
- **Pravatar** for placeholder avatars
- **Unsplash** for community photos

---

## License

This project is for demonstration purposes. All rights reserved.

---

<div align="center">

**Built with 💜 for Singapore communities**

*Connecting neighbours, one moment at a time*

</div>