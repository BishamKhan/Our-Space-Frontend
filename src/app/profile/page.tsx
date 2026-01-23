"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Camera, MapPin, Briefcase, Calendar, Edit, ImageIcon, GraduationCap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { PostCard } from "@/components/post-card"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { toast } from "sonner"
import { getUserDetails, updateCoverPic, updateProfilePic, updateUserInfo } from "@/services/user"
import { getUserFeed } from "@/services/post"
import { PostCardComponent } from "@/components/post-card-component"
import { uploadToCloudinary } from "@/lib/helper"
import { ImageViewer } from "@/components/image-viewer"

// Mock user posts
const mockUserPosts = [
  {
    id: 1,
    author: {
      name: "Alex Morgan",
      avatar: "/diverse-avatars.png",
      title: "Software Engineer at Tech Corp",
    },
    content: "Just finished an amazing project! Really proud of what the team accomplished. Hard work pays off! 🚀",
    image: "/serene-mountain-lake.png",
    likes: 234,
    comments: 45,
    shares: 12,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    author: {
      name: "Alex Morgan",
      avatar: "/diverse-avatars.png",
      title: "Software Engineer at Tech Corp",
    },
    content: "Beautiful day for a coffee break! ☕ What's everyone working on today?",
    likes: 156,
    comments: 28,
    shares: 5,
    timestamp: "1 day ago",
  },
]

// Mock user photos
const mockUserPhotos = [
  "/serene-mountain-lake.png",
  "/diverse-avatars.png",
  "/abstract-geometric-flow.png",
  "/serene-mountain-lake.png",
  "/diverse-avatars.png",
  "/abstract-geometric-flow.png",
]

function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingCover, setIsEditingCover] = useState(false)
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [userFeed, setUserFeed] = useState<any[]>([])
  const [files, setFiles] = useState<any>()
  const [userData, setUserData] = useState<any>()


  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)
  const [viewerImages, setViewerImages] = useState<string[]>([])
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0)

  // Form states
  const [editForm, setEditForm] = useState({
    fullName: user?.full_name || "",
    bio: user?.bio || "",
    dateOfBirth: user?.date_of_birth || "",
    education: "Stanford University",
    location: "San Francisco, CA",
  })

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files?.[0]
    setFiles(file)
    // console.log(upload.url,'upload')
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFiles(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfilePic = async () => {
    try {
      const upload = await uploadToCloudinary(files, "image")
      const res = await updateProfilePic({
        profile_image: upload.url
      })
      updateUser(res.data)
      toast.success("Profile Photo Updated")
      setIsEditingProfile(false)
      setProfileImagePreview(null)
      setFiles("")
    } catch {
      toast.error("Update failed")
    }
  }

  const handleSaveCover = async () => {
    try {
      const upload = await uploadToCloudinary(files, "image")
      const res = await updateCoverPic({
        cover_image: upload.url
      })
      console.log("res==", res)
      updateUser(res.data)
      toast.success("Cover Photo Updated")
      setIsEditingCover(false)
      setProfileImagePreview(null)
      setFiles("file")
    } catch {
      toast.error("Update failed")
    }
  }

  const handleSaveAbout = async () => {
    try {
      const res = await updateUserInfo({
        full_name: editForm.fullName,
        bio: editForm.bio,
        date_of_birth: editForm.dateOfBirth,
      })
      console.log("res==", res)
      // 🔥 update global user state
      updateUser(res.data)
      toast.success("Profile updated")
      setIsEditingAbout(false)
    } catch {
      toast.error("Update failed")
    }
  }

  const handleGetUserFeed = async () => {
    try {
      const posts = await getUserFeed() // call the function
      console.log(posts.data, 'posts')
      setUserFeed(posts.data)
    } catch (error) {
      toast.error("Error fetching user posts")
      console.error(error)
    }
  }

  const handleGetUserInfo = async () => {
    try {
      const info = await getUserDetails() // call the function

      console.log("userdetails", info)
      setUserData(info.data)
      // setUserFeed(posts.data)
    } catch (error) {
      toast.error("Error fetching user posts")
      console.error(error)
    }
  }

  // Fetch user feed on mount
  useEffect(() => {
    handleGetUserFeed()
    handleGetUserInfo()
  }, [])

  const openImageViewer = (images: string[], initialIndex = 0) => {
    setViewerImages(images)
    setViewerInitialIndex(initialIndex)
    setIsImageViewerOpen(true)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Cover Image Section */}
          <div className="relative h-80 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl overflow-hidden">
            <img
              src={user?.cover_image || "/abstract-geometric-flow.png"}
              alt="Cover"
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => openImageViewer([user?.cover_image || "/abstract-geometric-flow.png"])}
            />
            <Dialog open={isEditingCover} onOpenChange={setIsEditingCover}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="absolute bottom-4 right-4 gap-2 z-10 pointer-events-auto"
                  variant="secondary"
                >
                  <Camera className="w-4 h-4" />
                  Edit Cover Photo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Cover Photo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cover-upload">Choose Cover Photo</Label>
                    <Input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="cursor-pointer"
                    />
                  </div>
                  {coverImagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <img
                        src={coverImagePreview || "/placeholder.svg"}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsEditingCover(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveCover} disabled={!coverImagePreview}>
                      Save Cover Photo
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Profile Info Section */}
          <div className="px-6">
            <div className="relative">
              <div className="absolute -top-24 left-0 right-0 flex items-end justify-between">
                {/* Profile Picture */}
                <div className="relative">
                  <Avatar
                    className="w-40 h-40 border-4 border-background cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => openImageViewer([user?.profile_image || "/diverse-avatars.png"])}
                  >
                    <AvatarImage src={user?.profile_image || "/diverse-avatars.png"} alt={user?.full_name} />
                    <AvatarFallback className="text-4xl">{user?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-2 right-2 rounded-full w-10 h-10"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Profile Picture</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="profile-upload">Choose Profile Picture</Label>
                          <Input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="cursor-pointer"
                          />
                        </div>
                        {profileImagePreview && (
                          <div className="flex justify-center">
                            <Avatar className="w-32 h-32">
                              <AvatarImage src={profileImagePreview || "/placeholder.svg"} alt="Profile preview" />
                            </Avatar>
                          </div>
                        )}
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveProfilePic} disabled={!profileImagePreview}>
                            Save Profile Picture
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Edit Profile Button */}
                <Dialog open={isEditingAbout} onOpenChange={setIsEditingAbout}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Profile Information</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          placeholder="Write something about yourself..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={editForm.dateOfBirth}
                          onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="education">Education</Label>
                        <Input
                          id="education"
                          value={editForm.education}
                          onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setIsEditingAbout(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveAbout}>Save Changes</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* User Info */}
              <div className="pt-20">
                <h1 className="text-3xl font-bold text-foreground">{user?.full_name}</h1>
                <p className="text-muted-foreground">@{user?.username}</p>
                {user?.bio && <p className="mt-2 text-foreground leading-relaxed">{user.bio}</p>}

                {/* Stats */}
                <div className="flex gap-6 mt-4">
                  <div>
                    <span className="font-bold text-foreground">{userData?.total_posts || 0}</span>
                    <span className="text-muted-foreground ml-1">Posts</span>
                  </div>
                  <div>
                    <span className="font-bold text-foreground">{userData?.followers_count || 0}</span>
                    <span className="text-muted-foreground ml-1">Followers</span>
                  </div>
                  <div>
                    <span className="font-bold text-foreground">{userData?.following_count || 0}</span>
                    <span className="text-muted-foreground ml-1">Following</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="posts" className="mt-8">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="posts"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="photos"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                >
                  Photos
                </TabsTrigger>
              </TabsList>

              {/* Posts Tab */}
              <TabsContent value="posts" className="mt-6">
                <div className="space-y-4 max-w-2xl">
                  {
                    userFeed.length > 0 ? userFeed.map((post) => (
                      <PostCard key={post.id} data={post} />
                    )) : <p className="font-semibold text-xl text-foreground ">No posts</p>
                  }
                </div>
              </TabsContent>

              {/* About Tab */}
              <TabsContent value="about" className="mt-6">
                <div className="grid gap-4 max-w-2xl">
                  <Card className="border-border/50 shadow-sm">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-xl mb-6 text-foreground">About</h3>
                      <div className="space-y-5">
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Works at</p>
                            <p className="font-medium text-foreground">Tech Corp</p>
                            <p className="text-sm text-muted-foreground">Software Engineer</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Studied at</p>
                            <p className="font-medium text-foreground">{editForm.education}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Lives in</p>
                            <p className="font-medium text-foreground">{editForm.location}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Born on</p>
                            <p className="font-medium text-foreground">
                              {new Date(user?.dateOfBirth || "").toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Photos Tab */}
              <TabsContent value="photos" className="mt-6">
                <Card className="border-border/50 shadow-sm max-w-2xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-xl text-foreground">Photos</h3>
                      <Button size="sm" className="gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Add Photos
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {mockUserPhotos.map((photo, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden bg-muted hover:scale-105 transition-transform cursor-pointer group relative"
                          // Made photos clickable to open viewer with all photos
                          onClick={() => openImageViewer(mockUserPhotos, index)}
                        >
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <ImageViewer
        images={viewerImages}
        initialIndex={viewerInitialIndex}
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
      />
    </div>
  )
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  )
}
