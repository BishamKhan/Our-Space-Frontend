"use client"

import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
}

export function PostCardComponent({ post }: PostCardProps) {
    return (
        <Card className="w-full">
            <CardContent className="pt-6">
                {/* Post Header */}
                <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{post.author.name}</h3>
                        <p className="text-sm text-muted-foreground">{post.author.title}</p>
                        <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                </div>

                {/* Post Content */}
                <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                {/* Post Image */}
                {post.image && (
                    <div className="mb-4 rounded-lg overflow-hidden bg-muted max-h-96">
                        <img src={post.image || "/placeholder.svg"} alt="Post content" className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3 pb-3 border-b border-border">
                    <span>{post.likes} likes</span>
                    <div className="flex gap-3">
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
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