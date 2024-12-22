import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export function UserProfile() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-normal">Your profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JW</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">Jessica Wilkinson</div>
            <div className="text-sm text-muted-foreground">Digital Artist</div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Your collection status</div>
            <Progress value={60} className="h-2" />
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground flex justify-between">
              <span>Current status:</span>
              <span className="text-red-500">$ 46,646.86</span>
            </div>
            <div className="text-sm text-muted-foreground flex justify-between">
              <span>You need:</span>
              <span>$ 100,000.00</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

