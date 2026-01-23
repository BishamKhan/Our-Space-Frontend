"use client"

import { useState, useEffect, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Leaf } from "lucide-react"
import { APP_NAME } from "@/lib/constant"

interface Story {
  id: number
  media_url?: string
  created_at: string
  content?: string
  bg_color?: string
  is_photo?: boolean
}

interface User {
  username: string
  profile_image: string
}

interface StoryUser {
  user: User
  stories: Story[]
}

interface StoryViewerProps {
  story: StoryUser[]
  initialUserIndex: number
  onClose: () => void
}

export function StoryViewer({ story, initialUserIndex, onClose }: StoryViewerProps) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const currentUser = story[currentUserIndex]
  const currentStory = currentUser?.stories[currentStoryIndex]
  const storyDuration = 5000
  console.log(currentStory, "=stor=")

  const goToNextStory = useCallback(() => {
    if (currentStoryIndex < currentUser?.stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1)
    } else if (currentUserIndex < story.length - 1) {
      setCurrentUserIndex((prev) => prev + 1)
      setCurrentStoryIndex(0)
    } else {
      onClose()
    }
  }, [currentStoryIndex, currentUser?.stories.length, currentUserIndex, story.length, onClose])

  const goToPrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1)
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex((prev) => prev - 1)
      const prevUser = story[currentUserIndex - 1]
      setCurrentStoryIndex(prevUser?.stories.length - 1)
    }
  }, [currentStoryIndex, currentUserIndex, story])


  // Auto-advance story
  useEffect(() => {
    let progressValue = 0
    const interval = setInterval(() => {
      progressValue += (100 / (storyDuration / 100))

      if (progressValue >= 100) {
        // Story is complete, advance to next
        if (currentStoryIndex < currentUser?.stories.length - 1) {
          setCurrentStoryIndex((prev) => prev + 1)
        } else if (currentUserIndex < story.length - 1) {
          setCurrentUserIndex((prev) => prev + 1)
          setCurrentStoryIndex(0)
        } else {
          onClose()
        }
        progressValue = 0
        setProgress(0)
      } else {
        setProgress(progressValue)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [currentStoryIndex, currentUserIndex, currentUser?.stories.length, story.length, storyDuration, onClose])


  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevStory()
      if (e.key === "ArrowRight") goToNextStory()
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNextStory, goToPrevStory, onClose])

  if (!currentUser || !currentStory) return null

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

      {/* Navigation Arrows */}
      {/* Left Arrow */}
      {(currentUserIndex > 0 || currentStoryIndex > 0) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevStory}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 rounded-full w-12 h-12"
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
      )}

      {/* Right Arrow */}
      {(currentUserIndex < story.length - 1 || currentStoryIndex < currentUser?.stories.length - 1) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextStory}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 rounded-full w-12 h-12"
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      )}

      {/* Story Container */}
      <div className="relative w-full max-w-md h-[85vh] max-h-[700px] mx-4 rounded-xl overflow-hidden bg-neutral-900">
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-2">
          {currentUser?.stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-100"
                style={{
                  width:
                    index < currentStoryIndex
                      ? "100%"
                      : index === currentStoryIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>


        {/* User Info */}
        <div className="absolute top-6 left-0 right-0 z-10 flex items-center gap-3 px-3">
          <Avatar className="w-10 h-10 border-2 border-primary">
            <AvatarImage src={currentUser.user?.profile_image || "/placeholder.svg"} alt={currentUser.user?.username} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {currentUser.user?.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">{currentUser.user?.username}</p>
            <p className="text-white/60 text-xs">{
              new Date(currentStory?.created_at || "").toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })
            }</p>
          </div>
        </div>

        {/* Story Content */}
        {currentStory.is_photo ? (
          // PHOTO STORY
          <div className="relative w-full h-full">
            {/* Image */}
            <img
              src={currentStory.media_url || "/placeholder.svg"}
              alt={`${currentUser?.user.username}'s story`}
              className="w-full h-full object-cover"
            />

            {/* Optional dark overlay */}
            <div className="absolute inset-0 " />

            {/* Text overlay */}
            {currentStory.content && (
              <div className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
                <p className="text-white text-3xl font-semibold leading-snug">
                  {currentStory.content}
                </p>
              </div>
            )}
          </div>
        ) : (
          // TEXT STORY
          <div
            className={`w-full h-full flex items-center justify-center px-6 text-center ${currentStory.bg_color || "bg-neutral-900"
              }`}
          >
            <p className="text-white text-3xl font-semibold leading-snug">
              {currentStory.content}
            </p>
          </div>
        )}

        {/* Click Areas for Navigation */}
        <div className="absolute inset-0 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={goToPrevStory} />
          <div className="w-1/3 h-full" />
          <div className="w-1/3 h-full cursor-pointer" onClick={goToNextStory} />
        </div>
      </div>

      {/* User Thumbnails */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {story.map((user, index) => (
          <button
            key={user.user.username}
            onClick={() => {
              setCurrentUserIndex(index)
              setCurrentStoryIndex(0)
              setProgress(0)
            }}
            className={`transition-all ${index === currentUserIndex ? "scale-110" : "opacity-50 hover:opacity-80"
              }`}
          >
            <Avatar className={`w-8 h-8 border-2 ${index === currentUserIndex ? "border-primary" : "border-transparent"}`}>
              <AvatarImage src={user.user?.profile_image || "/placeholder.svg"} alt={user.user?.username} />
              <AvatarFallback className="text-xs">{user.user?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
          </button>
        ))}
      </div>
    </div>
  )
}
