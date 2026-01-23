import api from "@/lib/api"

export const followUser = async (data: any) => {
  const res = await api.post(`/follow/${data.user_id}`)
  return res
}

export const unFollowUser = async (data: any) => {
  const res = await api.delete(`/follow/${data.user_id}`)
  return res
}

export const getFollowers = async (data: any) => {
  const res = await api.delete(`/follow/followers/${data.user_id}`)
  return res
}

export const getFollowing = async (data: any) => {
  const res = await api.delete(`/follow/followers/${data.user_id}`)
  return res
}
