import api from "@/lib/api"

export const postStory = async (data: any) => {
  const res = await api.post(`/story/`, data)
  return res
}

export const getAllStories = async () => {
  const res = await api.get(`/story/all`)
  return res
}

export const getUserStories = async () => {
  const res = await api.get(`/story/user`)
  return res
}



// export const unFollowUser = async (data: any) => {
//   const res = await api.delete(`/follow/${data.user_id}`)
//   return res
// }

// export const getFollowers = async (data: any) => {
//   const res = await api.delete(`/follow/followers/${data.user_id}`)
//   return res
// }

// export const getFollowing = async (data: any) => {
//   const res = await api.delete(`/follow/followers/${data.user_id}`)
//   return res
// }
