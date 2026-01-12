import api from "@/lib/api"

export const loginApi = (data: any) =>
  api.post("/login", data)

export const registerApi = (data: any) =>
  api.post("/register", data)

export const getUserInfoApi = () =>
  api.get("/users/userInfo")
