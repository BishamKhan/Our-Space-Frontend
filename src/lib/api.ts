import axios from "axios"
import { toast } from "sonner"

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
})

// Request interceptor: attach token only if exists, skip Content-Type for FormData
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ACCESS_TOKEN")
    if (token) {
      config.headers!["Authorization"] = `Bearer ${token}`
    }

    // Only set JSON Content-Type if not FormData
    if (config.data && !(config.data instanceof FormData)) {
      config.headers!["Content-Type"] = "application/json"
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor (optional: handle 401 globally)
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      toast.error("Session expired. Please login again.")
      localStorage.removeItem("ACCESS_TOKEN")
      window.location.href = "/auth/login" // force logout
    }
    return Promise.reject(err)
  }
)

export default axiosInstance
