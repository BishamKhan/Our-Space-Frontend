"use client"

import React from "react"

import { useRef, useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Plus, ChevronLeft, ChevronRight, ImageIcon, Type, Eye } from "lucide-react"
import { CreateStory } from "@/components/create-story"
import { CreatePhotoStory } from "@/components/create-photo-story"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StoryViewer } from "./view-story"
import { getAllStories, getUserStories } from "@/services/story"

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

export function Stories() {
    const { user } = useAuth()
    const scrollRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(false)
    const [viewerOpen, setViewerOpen] = useState(false)
    const [story, setStory] = useState([])
    const [userStory, setUserStory] = useState<any>([])
    const [createTextStoryOpen, setCreateTextStoryOpen] = useState(false)
    const [createPhotoStoryOpen, setCreatePhotoStoryOpen] = useState(false)
    const [selectedUserIndex, setSelectedUserIndex] = useState(0)
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)

    console.log(userStory, "res=")

    const openStoryViewer = (index: number) => {
        setSelectedUserIndex(index)
        setViewerOpen(true)
    }

    const handlePhotoStoryClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImageFile(file)
            setCreatePhotoStoryOpen(true)
        }
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
            setShowLeftArrow(scrollLeft > 0)
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }


    // get user Stories
    const getUserStory = async () => {
        try {
            const res = await getUserStories()
            if (res.status == 200) {
                setUserStory(res.data)
            }
        }
        catch {
            toast.error("Something went wrong")
        }
    }

    // getAllStories
    const getStories = async () => {
        try {
            const res = await getAllStories()
            if (res.status == 200) {
                setStory(res.data)
                console.log(res, "res=")
            }
        }
        catch {
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        getStories()
        getUserStory()
        checkScrollPosition()
        window.addEventListener("resize", checkScrollPosition)
        return () => window.removeEventListener("resize", checkScrollPosition)
    }, [])

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 200
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            })
            setTimeout(checkScrollPosition, 300)
        }
    }

    return (
        <div className="bg-card rounded-xl p-4 border border-border relative">
            {/* Left Arrow */}
            {showLeftArrow && (
                <Button
                    size="icon"
                    variant="secondary"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full w-8 h-8 shadow-lg bg-background/90 hover:bg-background cursor-pointer"
                    onClick={() => scroll("left")}
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
            )}

            {/* Right Arrow */}
            {showRightArrow && (
                <Button
                    size="icon"
                    variant="secondary"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full w-8 h-8 shadow-lg bg-background/90 hover:bg-background cursor-pointer"
                    onClick={() => scroll("right")}
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            )}

            {/* Stories Container */}
            <div
                ref={scrollRef}
                onScroll={checkScrollPosition}
                className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {/* Hidden file input for photo story */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                {/* Create Story with Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex flex-col items-center text-center flex-shrink-0 cursor-pointer group">
                            <div className="relative">
                                <div className={`w-16 h-16 rounded-full p-[3px] ${userStory.stories?.length > 0 ? " bg-gradient-to-br from-primary via-emerald-400 to-teal-500" : ""} `}>
                                    <Avatar className="w-full h-full border-2 border-card">
                                        <AvatarImage src={user?.avatar || "/man.jpg"} alt="Profile" />
                                        <AvatarFallback className="text-lg bg-muted">
                                            {user?.fullName?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <Button
                                    size="icon"
                                    className="absolute -bottom-1 -right-1 rounded-full w-6 h-6 bg-primary hover:bg-primary/90 border-2 border-card"
                                >
                                    <Plus className="w-3 h-3 text-white" />
                                </Button>
                            </div>
                            <p className="text-xs font-medium mt-2 text-muted-foreground group-hover:text-foreground transition-colors truncate w-16">
                                Your Story
                            </p>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuItem onClick={handlePhotoStoryClick} className="cursor-pointer">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Create Photo Story
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setCreateTextStoryOpen(true)} className="cursor-pointer">
                            <Type className="w-4 h-4 mr-2" />
                            Create Text Story
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                if (userStory?.stories?.length > 0) {
                                    openStoryViewer(-1)
                                }
                            }}
                            className="cursor-pointer"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            View Stories
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Stories */}
                {story.map((item: any, key) => (
                    <div
                        key={key}
                        onClick={() => openStoryViewer(key)}
                        className="flex flex-col items-center text-center flex-shrink-0 cursor-pointer group"
                    >
                        <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-br from-primary via-emerald-400 to-teal-500 ">
                            <Avatar className="w-full h-full border-2 border-card">
                                <AvatarImage src={item?.user?.profile_image || "/placeholder.svg"} alt={item?.user?.username} />
                                <AvatarFallback className="text-lg bg-muted">
                                    {item?.user?.username.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <p className="text-xs mt-2 text-muted-foreground group-hover:text-foreground transition-colors truncate w-16">
                            {item?.user?.username}
                        </p>
                    </div>
                ))}
            </div>

            {/* Create Text Story Modal */}
            {createTextStoryOpen && (
                <CreateStory
                    getStories={getStories}
                    getUserStory={getUserStory}
                    onClose={() => setCreateTextStoryOpen(false)}
                />
            )}

            {/* Create Photo Story Modal */}
            {createPhotoStoryOpen && selectedImageFile && (
                <CreatePhotoStory
                    imageFile={selectedImageFile}
                    getUserStory={getUserStory}
                    getStories={getStories}
                    onClose={() => {
                        setCreatePhotoStoryOpen(false)
                        setSelectedImageFile(null)
                    }}
                />
            )}

            {/* Story Viewer Modal */}
            {viewerOpen && (
                <StoryViewer
                    story={selectedUserIndex === -1 ? [userStory] : story}
                    initialUserIndex={selectedUserIndex === -1 ? 0 : selectedUserIndex}
                    onClose={() => setViewerOpen(false)}
                />
            )}
        </div>
    )
}
