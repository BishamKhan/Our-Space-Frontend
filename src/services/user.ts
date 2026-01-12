import api from "@/lib/api"

export const updateProfileApi = (data: any) =>
  api.put("/users/update", data)


export const updateUserInfo = async (data: any) => {
  const res = await api.put("/users/updateInfo", data)
  return res
}

export const updateProfilePic = async (data: any) => {
  const res = await api.put("/users/updateProfilePic", data)
  return res
}

export const getUserDetails = () =>
  api.get("/users/userInfo")