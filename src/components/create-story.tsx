"use client"

import React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { X, Leaf, Smile, PaintBucket } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/lib/auth-context"
import { APP_NAME, emojis, storyColors } from "@/lib/constant"
import { postStory } from "@/services/story"
import { toast } from "sonner"

interface Story {
    id: number
    image?: string
    timestamp: string
    postContent?: string
    bg?: string
    isPhoto?: boolean
}

interface StoryUser {
    username: string
    profile_image: string
    stories: Story[]
    isPhoto?: boolean
}

interface CreateStoryProps {
    onClose: () => void
    getStories: () => void
    getUserStory: () => void
}

export function CreateStory({ onClose, getStories, getUserStory }: CreateStoryProps) {
    const [postContent, setPostContent] = useState("")
    const [bgColor, setBgColor] = useState("bg-blue-600")
    const { user } = useAuth()

    const handleEmojiSelect = (emoji: string) => {
        setPostContent((prev) => prev + emoji)
    }


    const handleCreate = async () => {
        try {
            const res = await postStory(
                {
                    content: postContent,
                    bg_color: bgColor
                }
            )
            if (res.status == 201) {
                toast.error("New Story Posted")
                getStories()
                getUserStory()
                onClose()
            }
            else {
                toast.error("Story not posted")
            }
        }
        catch {
            toast.error("Something went wrong")
        }
    }

    //   const handleCreate = () => {
    //     if (!postContent.trim()) return

    //     const newStory: StoryUser = {
    //       username: user?.username || "You",
    //       profile_image: user?.avatar || "/man.jpg",
    //       isPhoto: false,
    //       stories: [{
    //         id: Date.now(),
    //         timestamp: "Just now",
    //         postContent: postContent,
    //         bg: bgColor,
    //         isPhoto: false,
    //       }]
    //     }
    //     setStory((prev) => [newStory, ...prev])
    //     onClose()
    //   }

    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
                {/* Logo and Name */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-bold text-xl hidden sm:block">{APP_NAME}</span>
                </div>

                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-white hover:bg-white/20 rounded-full w-10 h-10"
                >
                    <X className="w-6 h-6" />
                </Button>
            </div>

            {/* Story Container */}
            <div className={`relative w-full max-w-md h-[85vh] max-h-[700px] mx-4 rounded-xl overflow-hidden ${bgColor}`}>
                {/* Toolbar */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                <Smile className="w-6 h-6" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[320px] p-2" side="bottom" align="end">
                            <div className="grid grid-cols-8 gap-1 max-h-[200px] overflow-y-auto">
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
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                <PaintBucket className="w-6 h-6" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[220px] p-3" side="bottom" align="end">
                            <div className="grid grid-cols-5 gap-3">
                                {storyColors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setBgColor(color)}
                                        className={`w-8 h-8 rounded-full ${color} border-2 ${bgColor === color ? 'border-white ring-2 ring-white/50' : 'border-white/70'} hover:scale-110 transition-transform`}
                                    />
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* User Info */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <Avatar className="w-10 h-10 border-2 border-white">
                        <AvatarImage src={user?.profile_image || "/man.jpg"} alt={user?.username} />
                        <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-white font-medium text-sm">{user?.username || "You"}</span>
                </div>

                {/* Text area container */}
                <div className="h-full flex items-center justify-center px-4 pt-20">
                    <Textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="w-full h-full bg-transparent border-none resize-none text-center text-white text-2xl placeholder:text-white/70 placeholder:text-2xl focus-visible:ring-0 py-6"
                        placeholder="Type your status here..."
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                <Button
                    variant="secondary"
                    className="bg-muted text-muted-foreground hover:bg-muted/80"
                    onClick={onClose}
                >
                    Discard
                </Button>
                <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleCreate}
                    disabled={!postContent.trim()}
                >
                    Share Story
                </Button>
            </div>
        </div>
    )
}
