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

export const updateCoverPic = async (data: any) => {
  const res = await api.put("/users/coverPic", data)
  return res
}

export const getUserDetails = () =>
  api.get("/users/userInfo")

export const searchUser = async (data: any) => {
  const res = await api.get(`/users/search?q=${data}`)
  return res
}

export const getUserProfile = async (data: any) => {
  const res = await api.get(`/users/${data}`)
  return res
}

export const postComment = async (data: any) => {
  const res = await api.post(`/comment/${data.post_id}?content=${data.content}`)
  return res
}