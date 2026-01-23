"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Send, X, ThumbsUp, MessageCircle, Share2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { postComment } from "@/services/user"
import { toast } from "sonner"

interface Comment {
  id: number
  author: {
    name: string
    avatar: string
  }
  content: string
  likes: number
  isLiked: boolean
  timestamp: string
  replies?: Comment[]
}

interface CommentsSectionProps {
  isOpen: boolean
  onClose: () => void
  renewFeed: () => void
  commentData: any
  likes_count: number
  initialIsLiked: boolean
  postContent: string
  postImage: string
  postTimeStamp: string
  userFullName: string
  userDp: string
  postId: number
}

export function CommentsSection({
  isOpen,
  onClose,
  commentData,
  likes_count,
  initialIsLiked,
  postContent,
  postImage,
  postTimeStamp,
  userFullName,
  userDp,
  postId,
  renewFeed
}: CommentsSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>(commentData)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isPostLiked, setIsPostLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(likes_count)
  console.log("commentData", commentData)
  const handleAddComment = async () => {
    const comm = {
      content: newComment,
      createdAt: Date.now(),
      user: user
    }
    try {
      const res = await postComment({
        post_id: postId,
        content: newComment
      })
      if (res.status == 200) {
        toast.error("Comment Posted")
        setComments((prev:any) => [...prev, comm])
        setNewComment("")
        renewFeed()
      }
      else {
        toast.error("Comment not posted")
      }
    }
    catch {
      toast.error("Something went wrong")
    }

    // if (newComment.trim()) {
    //   const comment: Comment = {
    //     id: Date.now(),
    //     author: {
    //       name: user?.fullName || "Current User",
    //       avatar: user?.avatar || "/abstract-profile.png",
    //     },
    //     content: newComment,
    //     likes: 0,
    //     isLiked: false,
    //     timestamp: "Just now",
    //   }
    //   setComments([comment, ...comments])
    //   setNewComment("")
    // }
  }

  console.log(comments, "comments")

  const handleAddReply = (commentId: number) => {
    if (replyContent.trim()) {
      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          const reply: Comment = {
            id: Date.now(),
            author: {
              name: user?.fullName || "Current User",
              avatar: user?.avatar || "/abstract-profile.png",
            },
            content: replyContent,
            likes: 0,
            isLiked: false,
            timestamp: "Just now",
          }
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          }
        }
        return comment
      })
      setComments(updatedComments)
      setReplyContent("")
      setReplyingTo(null)
    }
  }

  const toggleLike = (commentId: number, isReply = false, parentId?: number) => {
    if (isReply && parentId) {
      setComments(
        comments.map((comment) => {
          if (comment.id === parentId && comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => {
                if (reply.id === commentId) {
                  return {
                    ...reply,
                    isLiked: !reply.isLiked,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  }
                }
                return reply
              }),
            }
          }
          return comment
        }),
      )
    } else {
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          }
          return comment
        }),
      )
    }
  }

  const handlePostLike = () => {
    setIsPostLiked(!isPostLiked)
    setLikesCount(isPostLiked ? likesCount - 1 : likesCount + 1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] h-[95vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b border-border flex-shrink-0">
          {/* Post Header */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={
                userDp || "/placeholder.svg"} alt={userFullName} />
              <AvatarFallback>{userFullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{userFullName}</h3>
              <p className="text-xs text-muted-foreground">{
                new Date(
                  postTimeStamp || "").toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
              }</p>
            </div>
          </div>

          {/* Post Content */}
          <p className="text-foreground mb-4 leading-relaxed pb-2 border-b-2 ">{postContent}</p>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Post Image - Now at the top */}
          {postImage && (
            <div className="w-full bg-black flex items-center justify-center">
              <img src={postImage || "/placeholder.svg"} alt="Post" className="w-full max-h-[400px] object-contain" />
            </div>
          )}

          {/* Post Content */}
          <div className="p-4 border-b border-border bg-background">

            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
              <div className="flex items-center gap-1">
                {/* {likesCount > 0 && ( */}
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3 fill-primary text-primary" />
                  <span>{likesCount}</span>
                </div>
                {/* )} */}
              </div>
              <div className="flex items-center gap-3">
                <span>{comments?.length} comments</span>
                <span>{"1"} shares</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-border pt-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className={`flex-1 hover:bg-muted ${isPostLiked ? "text-primary" : "text-muted-foreground"}`}
                onClick={handlePostLike}
              >
                <ThumbsUp className={`w-4 h-4 mr-2 ${isPostLiked ? "fill-primary" : ""}`} />
                Like
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 hover:bg-muted text-muted-foreground">
                <MessageCircle className="w-4 h-4 mr-2" />
                Comment
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 hover:bg-muted text-muted-foreground">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="p-4 space-y-4 bg-background">
            {comments?.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground text-sm">No comments yet. Be the first to comment!</p>
              </div>
            )}

            {comments?.map((comment: any) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-start gap-2">
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarImage src={comment?.user?.profile_image || "/placeholder.svg"} alt={comment?.user?.full_name} />
                    <AvatarFallback>{comment?.user?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="bg-muted rounded-2xl px-3 py-2 inline-block max-w-full">
                      <p className="font-semibold text-sm text-foreground break-words">{comment?.user?.full_name}</p>
                      <p className="text-sm text-foreground leading-relaxed break-words">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-3 flex-wrap">
                      <button onClick={() => toggleLike(comment.id)} className="text-xs font-semibold hover:underline">
                        <span className={comment.isLiked ? "text-primary" : "text-muted-foreground"}>Like</span>
                        {comment.likes > 0 && <span className="ml-1 text-muted-foreground">({comment.likes})</span>}
                      </button>
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="text-xs font-semibold text-muted-foreground hover:underline"
                      >
                        Reply
                      </button>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>

                    {/* Replies */}
                    {comment?.replies && comment?.replies?.length > 0 && (
                      <div className="ml-4 mt-3 space-y-3">
                        {comment.replies.map((reply: any) => (
                          <div key={reply.id} className="flex items-start gap-2">
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
                              <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="bg-muted rounded-2xl px-3 py-2 inline-block max-w-full">
                                <p className="font-semibold text-sm text-foreground break-words">{reply.author.name}</p>
                                <p className="text-sm text-foreground leading-relaxed break-words">{reply.content}</p>
                              </div>
                              <div className="flex items-center gap-3 mt-1 px-3 flex-wrap">
                                <button
                                  onClick={() => toggleLike(reply.id, true, comment.id)}
                                  className="text-xs font-semibold hover:underline"
                                >
                                  <span className={reply.isLiked ? "text-primary" : "text-muted-foreground"}>Like</span>
                                  {reply.likes > 0 && (
                                    <span className="ml-1 text-muted-foreground">({reply.likes})</span>
                                  )}
                                </button>
                                <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                      <div className="ml-4 mt-3 flex items-center gap-2">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src={user?.avatar || "/abstract-profile.png"} alt={user?.fullName || "User"} />
                          <AvatarFallback>{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <Input
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 rounded-full border-muted-foreground/20 text-sm h-9"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleAddReply(comment.id)
                            }
                          }}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleAddReply(comment.id)}
                          className="h-9 w-9 flex-shrink-0"
                        >
                          <Send className="w-4 h-4 text-primary" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment Input - Fixed at bottom */}
        <div className="border-t border-border p-4 bg-background flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 flex-shrink-0">
              <AvatarImage src={user?.profile_image || "/abstract-profile.png"} alt={user?.full_name || "User"} />
              <AvatarFallback>{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-full border-muted-foreground/20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleAddComment()
                }
              }}
            />
            <Button size="icon" variant="ghost" onClick={handleAddComment} className="flex-shrink-0">
              <Send className="w-5 h-5 text-primary" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
