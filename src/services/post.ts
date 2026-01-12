import api from "@/lib/api"

export const getFeedApi = () =>
  api.get("/posts")

export const createPostApi = (data: any) =>
  api.post("/posts", data)

export const getUserFeed = () =>
  api.get("/posts/userfeed")
