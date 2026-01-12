import api from "@/lib/api"


export const getNewsFeed = async () => {
  const res = await api.get("/feed")
  return res
}