
"use client"

import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageViewer } from "./image-viewer"
import { useState } from "react"

interface Post {
  id: number
  author: {
    name: string
    avatar: string
    title: string
  }
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  timestamp: string
}

interface PostCardProps {
  post: Post
  author?: any
}

export function PostCard({ post, data }: any) {
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  console.log('==>data', data)
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {/* Post Header */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={data?.user.profile_image || "/placeholder.svg"} alt={data?.user.full_name} />
            <AvatarFallback>{data?.user.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{data?.user.full_name}</h3>
            {/* <p className="text-sm text-muted-foreground">{data.user.bio}</p> */}
            <p className="text-xs text-muted-foreground">{
              new Date(data?.created_at || "").toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            }</p>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-foreground mb-4 leading-relaxed">{data?.content}</p>

        {/* Post Image */}
        {data?.media_url && (
          <>
            <div className="mb-4 rounded-lg overflow-hidden bg-muted max-h-96"
              onClick={() => setIsViewerOpen(true)}
            >
              <img src={data?.media_url || "/placeholder.svg"} alt="Post content" className="w-full h-full object-cover" />
            </div>

            <ImageViewer images={[data?.media_url]} isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} />
          </>
        )}

        {/* Post Image */}
        {/* {post.image && (
          <>
            <div
              className="mb-4 rounded-lg overflow-hidden bg-muted max-h-96 cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setIsViewerOpen(true)}
            >
              <img src={post.image || "/placeholder.svg"} alt="Post content" className="w-full h-full object-cover" />
            </div>

            <ImageViewer images={[data?.media_url]} isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} />
          </>
        )} */}

        {/* Post Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3 pb-3 border-b border-border">
          <span>{"200"} likes</span>
          <div className="flex gap-3">
            <span>{"100"} comments</span>
            <span>{"2"} shares</span>
          </div>
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-around">
          <Button variant="ghost" size="sm" className="flex-1 hover:text-primary">
            <Heart className="w-5 h-5 mr-2" />
            Like
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 hover:text-primary">
            <MessageCircle className="w-5 h-5 mr-2" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 hover:text-primary">
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
