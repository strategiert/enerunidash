import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownRight, ArrowUpRight, Battery, DollarSign, MousePointerClick, Users, Zap } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Mock Data based on KleinesKraftwerk Insights
const revenueData = [
  { month: "Jan", revenue: 50000, target: 45000 },
  { month: "Feb", revenue: 65000, target: 50000 },
  { month: "Mär", revenue: 85000, target: 70000 },
  { month: "Apr", revenue: 120000, target: 100000 },
  { month: "Mai", revenue: 180000, target: 150000 },
  { month: "Jun", revenue: 220000, target: 180000 },
  { month: "Jul", revenue: 250000, target: 200000 },
  { month: "Aug", revenue: 210000, target: 190000 },
  { month: "Sep", revenue: 160000, target: 140000 },
  { month: "Okt", revenue: 110000, target: 100000 },
  { month: "Nov", revenue: 90000, target: 80000 },
  { month: "Dez", revenue: 70000, target: 60000 },
];

const channelData = [
  { name: "Referral", value: 4085476, color: "var(--chart-1)" },
  { name: "Paid Search", value: 3502042, color: "var(--chart-2)" },
  { name: "Direct", value: 2775280, color: "var(--chart-3)" },
  { name: "Organic", value: 1727388, color: "var(--chart-4)" },
  { name: "Social", value: 86225, color: "var(--chart-5)" },
];

const keywordRankingData = [
  { name: "Balkonkraftwerk", rank: 12, prev: 15 },
  { name: "Notstromaggregat", rank: 3, prev: 5 },
  { name: "USV Solar", rank: 1, prev: 1 },
  { name: "Autarkie", rank: 8, prev: 12 },
  { name: "Stromspeicher", rank: 15, prev: 18 },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Marketing Übersicht</h2>
            <p className="text-muted-foreground mt-1">Performance-Daten und KPIs für enerunity 2026</p>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-lg">
            <Tabs defaultValue="year" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="month">Monat</TabsTrigger>
                <TabsTrigger value="quarter">Quartal</TabsTrigger>
                <TabsTrigger value="year">Jahr</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamtumsatz (YTD)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€1.6M</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" /> +20.1%
                </span>
                vs. Vorjahr
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" /> +15.2%
                </span>
                vs. Vormonat
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">USV-Anteil</CardTitle>
              <Battery className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" /> +4.5%
                </span>
                Ziel: 30%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROAS (Gesamt)</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2x</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-rose-500 flex items-center mr-1">
                  <ArrowDownRight className="h-3 w-3 mr-0.5" /> -0.3
                </span>
                vs. Vormonat
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Umsatzentwicklung & Prognose</CardTitle>
              <CardDescription>Vergleich Ist-Umsatz vs. Zielvorgabe 2026</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="var(--muted-foreground)" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="var(--muted-foreground)" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `€${value / 1000}k`} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="var(--primary)" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      name="Umsatz"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="var(--muted-foreground)" 
                      strokeDasharray="5 5" 
                      strokeWidth={2}
                      dot={false}
                      name="Ziel"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Umsatz nach Kanal</CardTitle>
              <CardDescription>Basierend auf Attribution Model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--background)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `€${(value / 1000000).toFixed(2)}M`}
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Keyword Rankings</CardTitle>
              <CardDescription>Aktuelle Positionen in Google DE</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywordRankingData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">#{item.rank}</span>
                      {item.rank < item.prev ? (
                        <span className="text-emerald-500 text-xs flex items-center">
                          <ArrowUpRight className="h-3 w-3" /> {item.prev - item.rank}
                        </span>
                      ) : item.rank > item.prev ? (
                        <span className="text-rose-500 text-xs flex items-center">
                          <ArrowDownRight className="h-3 w-3" /> {item.rank - item.prev}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Content Pipeline Q1 2026</CardTitle>
              <CardDescription>Geplante Veröffentlichungen nach Phase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground mb-2">
                  <div>Thema</div>
                  <div>Format</div>
                  <div>Status</div>
                  <div>Datum</div>
                </div>
                {[
                  { title: "Strompreisentwicklung 2026", format: "Blog Post", status: "Published", date: "05. Jan" },
                  { title: "Förderungen nutzen (Video)", format: "YouTube", status: "Published", date: "12. Jan" },
                  { title: "USV für Homeoffice", format: "Pillar Page", status: "In Review", date: "19. Jan" },
                  { title: "Autarkie-Rechner", format: "Tool", status: "Development", date: "26. Jan" },
                  { title: "Solar im Winter", format: "Blog Post", status: "Planned", date: "02. Feb" },
                ].map((item, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 text-sm items-center p-2 hover:bg-muted/50 rounded-md transition-colors">
                    <div className="font-medium truncate">{item.title}</div>
                    <div>
                      <span className="px-2 py-1 rounded-full bg-secondary text-xs">{item.format}</span>
                    </div>
                    <div>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs flex w-fit items-center gap-1",
                        item.status === "Published" ? "bg-emerald-500/10 text-emerald-500" :
                        item.status === "In Review" ? "bg-amber-500/10 text-amber-500" :
                        item.status === "Development" ? "bg-blue-500/10 text-blue-500" :
                        "bg-muted text-muted-foreground"
                      )}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {item.status}
                      </span>
                    </div>
                    <div className="text-muted-foreground">{item.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
