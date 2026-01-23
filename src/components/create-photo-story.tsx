"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { X, Leaf, Smile, Type, Move } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/lib/auth-context"
import { APP_NAME, emojis } from "@/lib/constant"
import { postStory } from "@/services/story"
import { toast } from "sonner"
import { uploadToCloudinary } from "@/lib/helper"

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

interface CreatePhotoStoryProps {
    onClose: () => void
    getStories: () => void
    getUserStory: () => void
    imageFile: File
}

export function CreatePhotoStory({ onClose, imageFile, getStories,getUserStory }: CreatePhotoStoryProps) {
    const [postContent, setPostContent] = useState("")
    const [imageUrl, setImageUrl] = useState<string>("")
    const [textPosition, setTextPosition] = useState({ x: 50, y: 50 })
    const [isDragging, setIsDragging] = useState(false)
    const [media, setMedia] = useState("")
    const [showTextInput, setShowTextInput] = useState(false)
    const [textColor, setTextColor] = useState("white")
    const containerRef = useRef<HTMLDivElement>(null)
    const { user } = useAuth()


    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile)
            setImageUrl(url)
            return () => URL.revokeObjectURL(url)
        }
    }, [imageFile])

    const handleEmojiSelect = (emoji: string) => {
        setPostContent((prev) => prev + emoji)
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (showTextInput) {
            setIsDragging(true)
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100
            setTextPosition({
                x: Math.max(10, Math.min(90, x)),
                y: Math.max(10, Math.min(90, y))
            })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleTouchStart = () => {
        if (showTextInput) {
            setIsDragging(true)
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isDragging && containerRef.current) {
            const touch = e.touches[0]
            const rect = containerRef.current.getBoundingClientRect()
            const x = ((touch.clientX - rect.left) / rect.width) * 100
            const y = ((touch.clientY - rect.top) / rect.height) * 100
            setTextPosition({
                x: Math.max(10, Math.min(90, x)),
                y: Math.max(10, Math.min(90, y))
            })
        }
    }

    const handleTouchEnd = () => {
        setIsDragging(false)
    }



    const handleCreate = async () => {
        try {
            // 1️⃣ Upload image/video to Cloudinary
            const upload = imageFile
                ? await uploadToCloudinary(imageFile, "image")
                : null

            const res = await postStory(
                {
                    content: postContent,
                    media_url: upload?.url
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
    //     const newStory: StoryUser = {
    //       username: user?.username || "You",
    //       profile_image: user?.avatar || "/man.jpg",
    //       isPhoto: true,
    //       stories: [{
    //         id: Date.now(),
    //         image: imageUrl,
    //         timestamp: "Just now",
    //         postContent: postContent,
    //         isPhoto: true,
    //       }]
    //     }
    //     setUsers((prev) => [newStory, ...prev])
    //     onClose()
    //   }

    const textColors = ["white", "black", "red", "yellow", "green", "blue", "purple", "pink"]

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
            <div
                ref={containerRef}
                className="relative w-full max-w-md h-[85vh] max-h-[700px] mx-4 rounded-xl overflow-hidden bg-black"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Image */}
                {imageUrl && (
                    <img
                        src={imageUrl || "/placeholder.svg"}
                        alt="Story"
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Toolbar */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`text-white hover:bg-white/20 ${showTextInput ? 'bg-white/30' : ''}`}
                        onClick={() => setShowTextInput(!showTextInput)}
                    >
                        <Type className="w-6 h-6" />
                    </Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                <Smile className="w-6 h-6" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[320px] p-2" side="left" align="start">
                            <div className="grid grid-cols-8 gap-1 max-h-[200px] overflow-y-auto">
                                {emojis.map((emoji, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            handleEmojiSelect(emoji)
                                            setShowTextInput(true)
                                        }}
                                        className="text-2xl hover:bg-muted rounded p-1 transition-colors"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* User Info */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <Avatar className="w-10 h-10 border-2 border-white">
                        <AvatarImage src={user?.avatar || "/man.jpg"} alt={user?.username} />
                        <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-white font-medium text-sm drop-shadow-lg">{user?.username || "You"}</span>
                </div>

                {/* Draggable Text */}
                {showTextInput && (
                    <div
                        className="absolute z-30 cursor-move select-none"
                        style={{
                            left: `${textPosition.x}%`,
                            top: `${textPosition.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1 bg-black/50 rounded-full px-2 py-1 mb-1">
                                <Move className="w-4 h-4 text-white/70" />
                                <span className="text-xs text-white/70">Drag to move</span>
                            </div>
                            <Input
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                className={`bg-black/50 border-none text-center text-xl font-bold focus-visible:ring-2 focus-visible:ring-white/50 min-w-[200px] max-w-[300px]`}
                                style={{ color: textColor }}
                                placeholder="Add text..."
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                            />
                            {/* Color picker */}
                            <div className="flex gap-1 bg-black/50 rounded-full p-1">
                                {textColors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setTextColor(color)
                                        }}
                                        className={`w-6 h-6 rounded-full border-2 ${textColor === color ? 'border-primary scale-110' : 'border-white/50'} transition-transform`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Display text overlay (when not editing) */}
                {postContent && !isDragging && (
                    <div
                        className="absolute z-20 pointer-events-none"
                        style={{
                            left: `${textPosition.x}%`,
                            top: `${textPosition.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <p
                            className="text-2xl font-bold drop-shadow-lg text-center px-4"
                            style={{ color: textColor, textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                        >
                            {postContent}
                        </p>
                    </div>
                )}
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
                >
                    Share Story
                </Button>
            </div>
        </div>
    )
}
