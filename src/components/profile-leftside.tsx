"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export function ProfileSidebar() {
  const { user } = useAuth()

      console.log("user",user)
  return (
    <Card className="overflow-hidden">
      {/* Cover Photo */}
      <div className="h-24 bg-gradient-to-r from-primary/80 to-primary relative">
        <img
          src={user?.cover_image || "/coverpic.jpg"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="pt-0 pb-6">
        {/* Profile Picture */}
        <div className="flex justify-center -mt-12 mb-4">
          <Avatar className="w-24 h-24 border-4 border-card">
            <AvatarImage src={user?.profile_image || "/man.jpg"} alt="Profile" />
            <AvatarFallback className="text-2xl">{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Info */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-foreground">{user?.full_name || user?.username || "User"}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {user?.bio || "Welcome to Our Space! Start sharing your moments."}
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-around mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{user?.total_post || 0}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{user?.followers_count || 0}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{user?.following_count || 0}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
