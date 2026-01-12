import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const promotedPages = [
  {
    id: 1,
    name: "Tech Innovators",
    category: "Technology",
    avatar: "/abstract-tech-logo.png",
    followers: "45K",
  },
  {
    id: 2,
    name: "Design Inspiration",
    category: "Design",
    avatar: "/generic-logo-design.png",
    followers: "32K",
  },
  {
    id: 3,
    name: "Startup Stories",
    category: "Business",
    avatar: "/abstract-startup-logo.png",
    followers: "28K",
  },
  {
    id: 4,
    name: "Code Masters",
    category: "Programming",
    avatar: "/code-logo.png",
    followers: "52K",
  },
  {
    id: 5,
    name: "Marketing Hub",
    category: "Marketing",
    avatar: "/abstract-marketing-logo.png",
    followers: "38K",
  },
]

export function ProfileRightSide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Suggested Pages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {promotedPages.map((page) => (
          <div key={page.id} className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={page.avatar || "/placeholder.svg"} alt={page.name} />
              <AvatarFallback>{page.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-foreground truncate">{page.name}</h4>
              <p className="text-xs text-muted-foreground">{page.category}</p>
              <p className="text-xs text-muted-foreground">{page.followers} followers</p>
            </div>
            <Button size="sm" className="bg-[#21ab71] hover:bg-primary/90 text-primary-foreground">
              Follow
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
