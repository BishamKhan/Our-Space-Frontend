import api from "@/lib/api"

export const getFeedApi = () =>
  api.get("/posts")

export const createPostApi = (data: any) =>
  api.post("/posts", data)

export const getUserFeed = () =>
  api.get("/posts/userfeed")

export const likePost = async (data: any) => {
  const res = await api.post(`/likes/${data.post_id}`)
  return res
}

export const deleteLike = async (data: any) => {
  const res = await api.delete(`/likes/${data.post_id}`)
  return res
}
