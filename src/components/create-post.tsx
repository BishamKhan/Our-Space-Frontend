"use client"

import type React from "react"

import { useState } from "react"
import { ImageIcon, Loader2, Smile, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createPostApi } from "@/services/post"
import { toast } from "sonner"
import { uploadToCloudinary } from "@/lib/helper"
import { useAuth } from "@/lib/auth-context"
import { emojis } from "@/lib/constant"

export function CreatePost({renewFeed}:any) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [postContent, setPostContent] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const {user} = useAuth()

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePost = async () => {
    try {
      if (!imageFile && !postContent.trim()) {
        toast.error("Please add content or an image")
        return
      }

      setIsLoading(true)

      // 1️⃣ Upload image/video to Cloudinary
      const upload = imageFile
        ? await uploadToCloudinary(imageFile, "image")
        : null

      // 2️⃣ Create post API call
      const res = await createPostApi({
        content: postContent,
        media_url: upload?.url || null, // only URL
      })

      // 3️⃣ Check response status
      if (res.status === 201) {
        renewFeed()
        setIsModalOpen(false)
        setPostContent("")
        setImagePreview(null)
        setImageFile(null)
        toast.success("Status Posted")
      } else {
        toast.error("Post failed. Please try again.")
      }
    } catch (err) {
      console.error("Error posting:", err)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }


  const handleEmojiSelect = (emoji: string) => {
    setPostContent((prev) => prev + emoji)
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3 items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.profile_image || "/abstract-profile.png" } alt={user.full_name} />
              <AvatarFallback>{user.full_name}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 text-left px-4 py-3 bg-muted hover:bg-muted/80 rounded-full text-muted-foreground transition-colors"
            >
              What's on your mind, John?
            </button>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              className="flex-1 text-muted-foreground hover:bg-muted/50"
              onClick={() => setIsModalOpen(true)}
            >
              <ImageIcon className="w-5 h-5 mr-2 text-primary" />
              Photo
            </Button>
            <Button
              variant="ghost"
              className="flex-1 text-muted-foreground hover:bg-muted/50"
              onClick={() => setIsModalOpen(true)}
            >
              <Smile className="w-5 h-5 mr-2 text-primary" />
              Feeling
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.profile_image || "/man.jpg"} alt="Your profile" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{user.full_name}</p>
              </div>
            </div>

            <Textarea
              placeholder="What's on your mind, John?"
              className="min-h-[120px] resize-none border-0 focus-visible:ring-0 text-base"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-auto max-h-[400px] object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={() => {
                    setImagePreview(null)
                    setImageFile(null)
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Add to Post Options */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <span className="text-sm font-medium">Add to your post</span>
              <div className="flex gap-2">
                <label htmlFor="image-upload">
                  <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" asChild>
                    <div>
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                      <Smile className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[320px] p-2">
                    <div className="grid grid-cols-8 gap-1">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiSelect(emoji)}
                          className="text-2xl hover:bg-muted rounded p-1 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button
              onClick={handlePost}
              disabled={!postContent.trim() && !imageFile}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <>
                <Loader2 className="w-4 h-4 animate-spin" />

                  {/* <Loader className="w-4 h-4 animate-spin" /> */}
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
