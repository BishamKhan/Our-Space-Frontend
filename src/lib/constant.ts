// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  LOGOUT: "/api/auth/logout",
  REFRESH_TOKEN: "/api/auth/refresh",
  GET_USER: "/api/auth/user",
} as const

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/signup",
  PROFILE: "/profile",
  MESSAGES: "/messages",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
} as const


// Gender Options
export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const

// Mock User Data (for development)
export const MOCK_CURRENT_USER = {
  id: "1",
  username: "johndoe",
  fullName: "John Doe",
  email: "john@example.com",
  dateOfBirth: "1990-01-15",
  gender: "male",
  bio: "Software developer | Tech enthusiast | Love to connect with people",
  avatar: "/man.jpg",
  coverImage: "/coverpic.jpg",
  followers: 1234,
  following: 567,
  posts: 89,
}

// Mock posts data
const mockPosts = [
  {
    id: 1,
    author: {
      name: "Sarah Johnson",
      avatar: "/diverse-woman-portrait.png",
      title: "Senior Product Designer",
    },
    content:
      "Just launched our new design system! 🎨 It's been months of hard work but seeing everything come together is so rewarding. Big thanks to the entire team!",
    image: "/design-system-abstract.png",
    likes: 124,
    comments: 18,
    shares: 7,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    author: {
      name: "Michael Chen",
      avatar: "/man.jpg",
      title: "Full Stack Developer",
    },
    content: "Who else is excited about the new React features? The Server Components are a game changer! 🚀",
    likes: 89,
    comments: 24,
    shares: 12,
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    author: {
      name: "Emma Williams",
      avatar: "/diverse-woman-portrait.png",
      title: "Marketing Manager",
    },
    content: "Coffee and productivity ☕️ What's your favorite way to stay focused during work?",
    image: "/coffee-workspace.jpg",
    likes: 203,
    comments: 45,
    shares: 5,
    timestamp: "6 hours ago",
  },
]