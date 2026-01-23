"use client"

import { useEffect, useState } from "react"
import { Search, Home, MessageCircle, Bell, Settings, LogOut, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/lib/helper"
import { searchUser } from "@/services/user"

// Mock users data for search
const mockUsers = [
  {
    id: 1,
    full_name: "Sarah Johnson",
    username: "sarahjohnson",
    avatar: "/diverse-woman-portrait.png",
    coverImage: "/serene-mountain-lake.png",
    bio: "Product Designer | UX Enthusiast | Coffee Lover",
    location: "San Francisco, CA",
    work: "Google",
    education: "Stanford University",
    followers: 2340,
    following: 890,
    posts: 156,
    isFollowing: false,
    dateOfBirth: "1992-03-15",
  },
  {
    id: 2,
    full_name: "Michael Chen",
    username: "michaelchen",
    avatar: "/man.jpg",
    coverImage: "/abstract-geometric-flow.png",
    bio: "Software Engineer | Open Source Contributor",
    location: "New York, NY",
    work: "Microsoft",
    education: "MIT",
    followers: 1890,
    following: 654,
    posts: 234,
    isFollowing: false,
    dateOfBirth: "1988-07-22",
  },
  {
    id: 3,
    name: "Emma Williams",
    full_username: "emmawilliams",
    avatar: "/diverse-woman-portrait.png",
    bio: "Marketing Manager | Digital Strategist",
    location: "London, UK",
    work: "Meta",
    education: "Oxford University",
    followers: 3120,
    following: 1200,
    posts: 189,
    isFollowing: true,
    dateOfBirth: "1995-11-08",
  },
  {
    id: 4,
    full_name: "David Brown",
    username: "davidbrown",
    avatar: "/diverse-group-friends.png",
    bio: "Entrepreneur | Startup Founder",
    location: "Austin, TX",
    followers: 5670,
    following: 432,
    posts: 298,
    isFollowing: false,
    dateOfBirth: "1985-05-30",
  },
  {
    id: 5,
    full_name: "Lisa Anderson",
    username: "lisaanderson",
    avatar: "/diverse-group-women.png",
    bio: "Photographer | Travel Blogger",
    location: "Los Angeles, CA",
    followers: 8900,
    following: 2340,
    posts: 567,
    isFollowing: false,
    dateOfBirth: "1993-09-12",
  },
]

export function Navbar() {
  const { logout, user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [selectedUser, setSelectedUser] = useState<(typeof mockUsers)[0] | null>(null)

  const debouncedQuery = useDebounce(searchQuery)

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([])
        return
      }

      try {
        setLoading(true)
        const res = await searchUser(debouncedQuery)
        setSearchResults(res.data)
      } catch {
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [debouncedQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const filtered = mockUsers.filter((user) => user?.full_name?.toLowerCase().includes(query.toLowerCase()))
      setSearchResults(filtered)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const handleUserClick = (user: (typeof mockUsers)[0]) => {
    router.push(`/user/${user.username}`)
    setSearchQuery("")
    setShowResults(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Name */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">OS</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">Our Space</span>
          </Link>

          <div className="relative flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users..."
                className="pl-10 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary rounded-full h-10"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
            </div>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full mt-2 w-full bg-card border rounded-lg shadow-lg">
                {loading && (
                  <p className="p-3 text-sm text-muted-foreground text-center">
                    Searching...
                  </p>
                )}

                {!loading && searchResults.length === 0 && (
                  <p className="p-3 text-sm text-muted-foreground text-center">
                    No users found
                  </p>
                )}

                {searchResults.map((user:any) => (
                  <button
                    key={user.id}
                    onClick={() => router.push(`/user/${user.username}`)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.profile_image} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.full_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1" >
            <Button
              variant="ghost"
              className="relative flex flex-col items-center justify-center cursor-pointer h-14 px-6 hover:bg-transparent group"
            >
              <Home className="w-5 h-5 text-primary" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-md" />
            </Button>
            <Button
              variant="ghost"
              className="relative flex flex-col items-center justify-center h-14 px-6 hover:bg-muted/50 group"
            >
              <MessageCircle className="w-5 h-5 group-hover:text-primary transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <Button
              variant="ghost"
              className="relative flex flex-col items-center justify-center h-14 px-6 hover:bg-muted/50 group"
            >
              <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </Button>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full ml-2 cursor-pointer">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profile_image || "/abstract-profile.png"} alt={user?.full_name || "Profile"} />
                    <AvatarFallback>{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user?.profile_image || "/abstract-profile.png"} alt={user?.full_name || "Profile"} />
                      <AvatarFallback>{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{user?.full_name || user?.username || "User"}</span>
                      <span className="text-xs text-muted-foreground">@{user?.username || "username"}</span>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* {selectedUser && (
        <UserProfileViewer isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} user={selectedUser} />
      )} */}
    </nav>
  )
}
