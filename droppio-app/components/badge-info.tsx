import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"

interface BadgeInfoProps {
  level?: string
}

export default function BadgeInfo({ level }: BadgeInfoProps) {
  const getBadgeColor = (badgeLevel: string) => {
    switch (badgeLevel) {
      case "bronze":
        return "bg-amber-500"
      case "silver":
        return "bg-slate-400"
      case "gold":
        return "bg-yellow-500"
      default:
        return "bg-gray-200"
    }
  }

  if (level) {
    return (
      <div className="flex items-center gap-2">
        <div className={`h-6 w-6 rounded-full ${getBadgeColor(level)} flex items-center justify-center`}>
          <Award className="h-4 w-4 text-white" />
        </div>
        <span className="capitalize">{level}</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Badge Eligibility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-medium">Bronze Badge</h4>
            <p className="text-sm text-muted-foreground">Tip more than 100,000 $IDRX</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-400 flex items-center justify-center">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-medium">Silver Badge</h4>
            <p className="text-sm text-muted-foreground">Tip more than 500,000 $IDRX</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-medium">Gold Badge</h4>
            <p className="text-sm text-muted-foreground">Tip more than 1,000,000 $IDRX</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
