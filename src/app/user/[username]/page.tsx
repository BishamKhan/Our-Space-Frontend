"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
    MapPin,
    Briefcase,
    Calendar,
    GraduationCap,
    UserPlus,
    MessageCircle,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { PostCard } from "@/components/post-card"
import { ImageViewer } from "@/components/image-viewer"
import { ProtectedRoute } from "@/components/protected-route"

import { getUserProfile } from "@/services/user"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { followUser, unFollowUser } from "@/services/follow"

function UserProfilePage() {
    const { username } = useParams()
    const { user: currentUser } = useAuth()

    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    console.log('=ch', profile)
    const [isFollowing, setIsFollowing] = useState(profile?.follows ? "Following" : "Follow")
    const [imageViewerOpen, setImageViewerOpen] = useState(false)
    const [viewerImages, setViewerImages] = useState<string[]>([])
    const [viewerIndex, setViewerIndex] = useState(0)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getUserProfile(username as string)
                setProfile(res.data)
            } catch {
                setProfile(null)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [username])

    if (loading) return <p className="p-6">Loading profile...</p>
    if (!profile) return <p className="p-6">User not found</p>

    const isOwnProfile = currentUser?.username === profile.username

    const openImageViewer = (images: string[], index = 0) => {
        setViewerImages(images)
        setViewerIndex(index)
        setImageViewerOpen(true)
    }

    const handleFollowToggle = async () => {
        // followUser
        try {
            const res = await followUser({
                user_id: profile.id
            })
            if (res.status == 200) {
                toast.error("User followed successfully")
                setIsFollowing("Following")
            }

        }
        catch {
            toast.error("Something went wrong")
        }
    }

    const handleUnFollowToggle = async () => {
        // followUser
        try {
            const res = await unFollowUser({
                user_id: profile.id
            })
            if (res.status == 200) {
                toast.error("User unfollowed successfully")
                setIsFollowing("Follow")
            }

        }
        catch {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <Navbar />

            <div className="container mx-auto px-4 py-6 max-w-5xl">
                {/* Cover */}
                <div
                    className="relative h-80 rounded-xl overflow-hidden cursor-pointer"
                    onClick={() =>
                        openImageViewer([profile.cover_image || "/placeholder.svg"])
                    }
                >
                    <img
                        src={profile.cover_image || "/placeholder.svg"}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Profile Info */}
                <div className="relative px-6">
                    <div className="absolute -top-24 left-0 right-0 flex justify-between items-end">
                        <Avatar
                            className="w-40 h-40 border-4 border-background cursor-pointer"
                            onClick={() =>
                                openImageViewer([profile.profile_image || "/placeholder.svg"])
                            }
                        >
                            <AvatarImage src={profile.profile_image} />
                            <AvatarFallback className="text-4xl">
                                {profile.full_name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        {!isOwnProfile && (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => toast.info("Coming soon")}>
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Message
                                </Button>
                                <Button onClick={profile.follows ? handleUnFollowToggle : handleFollowToggle}>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    {isFollowing}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="pt-20">
                        <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                        <p className="text-muted-foreground">@{profile.username}</p>
                        {profile.bio && <p className="mt-2">{profile.bio}</p>}
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="posts" className="mt-8">
                    <TabsList className="border-b bg-transparent">
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="about">About</TabsTrigger>
                    </TabsList>

                    {/* POSTS */}
                    <TabsContent value="posts" className="mt-6 space-y-4 max-w-2xl">
                        {profile.first_post ? (
                            <PostCard data={profile.first_post} />
                        ) : (
                            <p className="text-muted-foreground">No posts yet</p>
                        )}
                    </TabsContent>

                    {/* ABOUT */}
                    <TabsContent value="about" className="mt-6 max-w-2xl">
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                {profile.gender && (
                                    <InfoRow icon={UserPlus} label="Gender" value={profile.gender} />
                                )}
                                {profile.date_of_birth && (
                                    <InfoRow
                                        icon={Calendar}
                                        label="Born"
                                        value={new Date(profile.date_of_birth).toDateString()}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <ImageViewer
                isOpen={imageViewerOpen}
                images={viewerImages}
                initialIndex={viewerIndex}
                onClose={() => setImageViewerOpen(false)}
            />
        </div>
    )
}

function InfoRow({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-center gap-4">
            <Icon className="w-5 h-5 text-primary" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    )
}

export default function UserProfile() {
    return (
        <ProtectedRoute>
            <UserProfilePage />
        </ProtectedRoute>
    )
}
