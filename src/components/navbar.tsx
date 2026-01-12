"use client"

import { useState } from "react"
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

// Mock users data for search
const mockUsers = [
  { id: 1, full_name: "Sarah Johnson", profile_image: "/diverse-woman-portrait.png" },
  { id: 2, full_name: "Michael Chen", profile_image: "/man.jpg" },
  { id: 3, full_name: "Emma Williams", profile_image: "/diverse-woman-portrait.png" },
  { id: 4, full_name: "David Brown", profile_image: "/diverse-group-friends.png" },
  { id: 5, full_name: "Lisa Anderson", profile_image: "/diverse-group-women.png" },
]

export function Navbar() {
  const { logout, user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any>([])
  const [showResults, setShowResults] = useState(false)

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
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {searchResults.map((user:any) => (
                  <button
                    key={user.id}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      console.log("Selected user:", user.username)
                      setSearchQuery("")
                      setShowResults(false)
                    }}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user?.profile_image || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">{user.full_name}</span>
                  </button>
                ))}
              </div>
            )}

            {showResults && searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg p-4">
                <p className="text-sm text-muted-foreground text-center">No users found</p>
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
    </nav>
  )
}
