"use client"

import { CreatePost } from "@/components/create-post"
import { PostCard } from "@/components/post-card"
import { toast } from "sonner"
import { getNewsFeed } from "@/services/feed"
import { useEffect, useState } from "react"
import { Stories } from "./stories"


export function NewsFeed() {
  const [posts, setPosts] = useState([])

  const handleGetNewsFeed = async () => {
    try {
      const info = await getNewsFeed() // call the function
      console.log(info, 'info')
      setPosts(info.data)
    } catch (error) {
      toast.error("Error fetching newsfeed posts")
      console.error(error)
    }
  }

  // Fetch user feed on mount
  useEffect(() => {
    handleGetNewsFeed()
  }, [])


  return (
    <div className="space-y-6">
      {/* User stories */}
      <Stories />

      {/* Create Post Section */}
      <CreatePost renewFeed={handleGetNewsFeed} />

      {/* Posts Feed */}
      <div className="space-y-4">
        {
          posts.length > 0 ? posts.map((post:any) => (
            <PostCard key={post.id} data={post} renewFeed={handleGetNewsFeed} />
          )) : <p className="font-semibold text-xl text-foreground ">No posts</p>
        }
      </div>
    </div>
  )
}
