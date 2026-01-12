export interface User {
  id: string
  username: string
  fullName: string
  email: string
  dateOfBirth: string
  gender: string
  bio?: string
  avatar?: string
  coverImage?: string
  followers?: number
  following?: number
  posts?: number
}

export interface AuthState {
  users: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  fullName: string
  email: string
  dateOfBirth: string
  gender: string
  password: string
}

export interface AuthContextType extends AuthState {
  user:  any | null 
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}
