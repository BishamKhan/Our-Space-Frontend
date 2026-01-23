"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Briefcase, GraduationCap, UserPlus, MessageCircle, X } from "lucide-react"
import Link from "next/link"

interface UserProfileViewerProps {
  isOpen: boolean
  onClose: () => void
  user:any
}

export function UserProfileViewer({ isOpen, onClose, user }: UserProfileViewerProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    console.log(`${isFollowing ? "Unfollowed" : "Followed"} ${user.name}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/40">
          {user.coverImage && (
            <img src={user.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Profile Content */}
        <div className="relative px-6 pb-6">
          {/* Profile Picture */}
          <div className="flex justify-between items-start -mt-16 mb-4">
            <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-3xl">{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex gap-2 mt-20">
              <Button
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "default"}
                className={isFollowing ? "" : "bg-primary hover:bg-primary/90"}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              {user.username && <p className="text-muted-foreground">@{user.username}</p>}
            </div>

            {user.bio && <p className="text-foreground leading-relaxed">{user.bio}</p>}

            {/* Stats */}
            <div className="flex gap-6 py-3">
              <div>
                <p className="font-bold text-foreground">{user.posts || 0}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div>
                <p className="font-bold text-foreground">{user.followers || 0}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="font-bold text-foreground">{user.following || 0}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>

            {/* About Info */}
            {(user.work || user.education || user.location) && (
              <Card className="border-border">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-foreground mb-3">About</h3>

                  {user.work && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Works at</p>
                        <p className="text-foreground font-medium">{user.work}</p>
                      </div>
                    </div>
                  )}

                  {user.education && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Studied at</p>
                        <p className="text-foreground font-medium">{user.education}</p>
                      </div>
                    </div>
                  )}

                  {user.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Lives in</p>
                        <p className="text-foreground font-medium">{user.location}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* View Full Profile Link */}
            <Link href={`/profile/${user.id}`}>
              <Button variant="ghost" className="w-full hover:bg-muted">
                View Full Profile
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
