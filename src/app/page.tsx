import { Navbar } from "@/components/navbar"
import { ProfileSidebar } from "@/components/profile-leftside"
import { NewsFeed } from "@/components/news-feed"
import { ProfileRightSide } from "@/components/profile-rightside"
import { ProtectedRoute } from "@/components/protected-route"

export default function Home() {
  return (
  <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Profile Summary */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-20">
                <ProfileSidebar />
              </div>
            </aside>

            {/* Center - News Feed */}
            <main className="lg:col-span-6">
              <NewsFeed />
            </main>

            {/* Right Sidebar - Promoted Pages */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-20">
                <ProfileRightSide />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
