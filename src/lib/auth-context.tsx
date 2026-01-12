"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { loginApi, getUserInfoApi, registerApi } from "@/services/auth"
import { updateUserInfo } from "@/services/user"

type AuthContextType = {
  user: any
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: any) => Promise<void>
  logout: () => void
  register: (data: any) => any
  updateUser: (data: any) => any
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  // Restore session on refresh
  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN")
    if (token) {
      setAccessToken(token)
      getUserInfoApi()
        .then((res: any) => setUser(res.data))
        .catch(() => logout())
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  // LOGIN

  const login = async (credentials: { username: string; password: string }) => {

    setIsLoading(true)

    const formData = new FormData()
    formData.append("username", credentials.username)
    formData.append("password", credentials.password)

    const res = await loginApi(formData)

    const { access_token, user } = res.data

    // Store token in localStorage
    localStorage.setItem("ACCESS_TOKEN", access_token)

    // Set global user
    setUser(user)
    setAccessToken(access_token)

    router.push("/") // redirect after login
    setIsLoading(false)
  }

  const register = async (payload: any) => {
    setIsLoading(true)
    const formData = {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      gender: payload.gender,
      date_of_birth: payload.date_of_birth
    }

    const res = await registerApi(formData)
    if (res.status === 201) {
      router.push("/auth/login") // redirect after login
      setIsLoading(false)
    }
  }

  //   const updateUserAbout = async (payload: any) => {
  //   const res = await updateUserInfo(payload)
  // console.log('res',res)
  //   // API returns updated user
  //   setUser(res.data.user)
  // }

  // ✅ UPDATE USER (used by profile, settings, etc.)
  const updateUser = (data: any) => {
    setUser((prev: any) => ({
      ...prev,
      ...data,
    }))
  }

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("ACCESS_TOKEN")
    setUser(null)
    setAccessToken(null)
    router.push("/auth/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken,
        isLoading,
        register,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// THIS IS WHERE useContext WORKS
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
