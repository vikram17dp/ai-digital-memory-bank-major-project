import { Brain, Clock, TrendingUp, Sparkles } from "lucide-react"

interface DashboardStatsProps {
  totalMemories: number
  recentCount: number
}

export function DashboardStats({ totalMemories, recentCount }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Memories",
      value: totalMemories,
      icon: Brain,
      color: "text-primary",
    },
    {
      title: "Recent Activity",
      value: recentCount,
      icon: Clock,
      color: "text-secondary",
    },
    {
      title: "AI Insights",
      value: Math.floor(totalMemories * 0.8),
      icon: Sparkles,
      color: "text-accent",
    },
    {
      title: "Growth",
      value: "+12%",
      icon: TrendingUp,
      color: "text-chart-2",
    },
  ]

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="font-montserrat font-bold text-xl mb-4 text-foreground">Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="glass rounded-lg p-4 text-center">
            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <div className="font-montserrat font-bold text-lg text-foreground">{stat.value}</div>
            <div className="font-open-sans text-sm text-muted-foreground">{stat.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
