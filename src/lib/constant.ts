
// App Info
export const APP_NAME = "Our Space"

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


export const emojis = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "🙃",
  "😉",
  "😊",
  "😇",
  "🥰",
  "😍",
  "🤩",
  "😘",
  "😗",
  "😚",
  "😙",
  "🥲",
  "😋",
  "😛",
  "😜",
  "🤪",
  "😝",
  "🤑",
  "🤗",
  "🤭",
  "🤫",
  "🤔",
  "🤐",
  "🤨",
  "😐",
  "😑",
  "😶",
  "😏",
  "😒",
  "🙄",
  "😬",
  "🤥",
  "😌",
  "😔",
  "😪",
  "🤤",
  "😴",
  "😷",
  "🤒",
  "🤕",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🤎",
  "💔",
  "❣️",
  "💕",
  "👍",
  "👎",
  "👏",
  "🙌",
  "👐",
  "🤲",
  "🤝",
  "🙏",
  "✨",
  "💫",
  "🔥",
  "💯",
]

export const storyColors = [
  "bg-blue-600",
  "bg-red-500",
  "bg-purple-600",
  "bg-pink-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-neutral-900",
]
