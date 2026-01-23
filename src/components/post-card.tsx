
"use client"

import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageViewer } from "./image-viewer"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { deleteLike, likePost } from "@/services/post"
import { CommentsSection } from "./comments-section"

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

export function PostCard({ data, renewFeed }: any) {
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)

  const { user } = useAuth()

  const postLiked = data?.likes.find((item: any) => {
    return item?.user.id == user?.id
  })

  const handleLikePost = async () => {
    try {
      const res = await likePost({
        post_id: data.id
      })
      if (res.status == 200) {
        renewFeed()
      }
      else {
        toast.error("Post not liked")
      }
    }
    catch {
      toast.error("Something went wrong")
    }
  }

  const handleDeleteLike = async () => {
    try {
      const res = await deleteLike({
        post_id: data.id
      })
      if (res.status == 200) {
        renewFeed()
      }
      else {
        toast.error("Post not liked")
      }
    }
    catch {
      toast.error("Something went wrong")
    }
  }

  console.log('Post liked by user?', !!postLiked)

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
        <p className="text-foreground mb-4 leading-relaxed pb-2 border-b-2 ">{data?.content}</p>

        {/* Post Image */}
        {data?.media_url && (
          <>
            <div className="mb-4 rounded-lg overflow-hidden bg-muted max-h-96 "
              onClick={() => setIsViewerOpen(true)}
            >
              <img src={data?.media_url || "/placeholder.svg"} alt="Post content" className="w-full h-full object-cover" />
            </div>

            <ImageViewer images={[data?.media_url]} isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} />
          </>
        )}

        {/* Post Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-3 pt-3 border-t-2  border-border">
          <span>{data?.likes_count ? `${data?.likes_count} likes` : "0 likes"} </span>
          <div className="flex gap-3">
            <span>{ data?.comments_count ? data?.comments_count : "0"} comments</span>
            <span>{"2"} shares</span>
          </div>
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-around">
          <Button onClick={postLiked ? handleDeleteLike : handleLikePost} variant="ghost" size="sm" className={`flex-1 hover:text-primary cursor-pointer ${postLiked ? "text-primary" : ""} `}>
            <Heart className={`w-5 h-5 mr-2 ${postLiked ? "fill-primary text-primary " : ""}`} />
            Like
          </Button>
          <Button
            onClick={() => setIsCommentsOpen(true)} variant="ghost" size="sm" className="flex-1 hover:text-primary cursor-pointer">
            <MessageCircle className="w-5 h-5 mr-2" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 hover:text-primary">
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>

      {/* Comments Section */}
      <CommentsSection
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        commentData={data?.comments}
        likes_count={data?.likes_count}
        initialIsLiked={postLiked}
        postId={data?.id}
        postContent={data?.content}
        postImage={data?.media_url}
        postTimeStamp={data?.created_at}
        userFullName={data?.user.full_name}
        userDp={data?.user.profile_image}
        renewFeed={renewFeed}
      />
    </Card>
  )
}
