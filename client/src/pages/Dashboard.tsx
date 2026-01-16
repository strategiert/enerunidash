import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownRight, ArrowUpRight, Battery, DollarSign, FileText, MousePointerClick, Users, Zap } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useState, useMemo } from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(2026);

  // Convex Queries - Alle Daten aus der einheitlichen Datenbank
  const monthlyKPIs = useQuery(api.kpis.getMonthlyKPIs, { year: selectedYear });
  const ytdStats = useQuery(api.kpis.getYTDStats, { year: selectedYear });
  const channelAttribution = useQuery(api.kpis.getChannelAttribution, { year: selectedYear });
  const topKeywords = useQuery(api.keywords.list, { limit: 5 });
  const contentStats = useQuery(api.contentPieces.getStats, { year: selectedYear });
  const yearOverview = useQuery(api.contentPieces.getYearOverview, { year: selectedYear });
  const upcomingContent = useQuery(api.contentPieces.getUpcoming, { days: 30 });

  // Chart data vorbereiten
  const revenueData = useMemo(() => {
    if (!monthlyKPIs) return [];
    return monthlyKPIs.map(kpi => ({
      month: kpi.month,
      revenue: kpi.revenue,
      target: kpi.target,
    }));
  }, [monthlyKPIs]);

  const channelData = useMemo(() => {
    if (!channelAttribution) return [];
    return channelAttribution.map(ch => ({
      name: ch.name,
      value: ch.value,
      color: ch.color || "var(--chart-1)",
    }));
  }, [channelAttribution]);

  const contentByMonthData = useMemo(() => {
    if (!yearOverview) return [];
    return yearOverview.map(m => ({
      month: m.month,
      seo: m.seo,
      social: m.social,
      email: m.email,
      total: m.total,
    }));
  }, [yearOverview]);

  // Format revenue for display
  const formatRevenue = (value: number) => {
    if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `€${(value / 1000).toFixed(0)}k`;
    return `€${value}`;
  };

  const stats = ytdStats ?? { totalRevenue: 0, totalConversions: 0, avgUsvShare: 0, avgRoas: 0 };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Marketing Übersicht</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Performance-Daten für enerunity {selectedYear}</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger className="w-[100px] sm:w-[120px]">
                <SelectValue placeholder="Jahr" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
                <SelectItem value="2028">2028</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Umsatz (YTD)</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-lg sm:text-2xl font-bold">{formatRevenue(stats.totalRevenue)}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" /> +20.1%
                </span>
                <span className="hidden sm:inline">vs. Vorjahr</span>
              </p>
            </CardContent>
          </Card>
          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Conversions</CardTitle>
              <MousePointerClick className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-lg sm:text-2xl font-bold">{stats.totalConversions.toLocaleString('de-DE')}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" /> +15.2%
                </span>
                <span className="hidden sm:inline">vs. Vormonat</span>
              </p>
            </CardContent>
          </Card>
          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">USV-Anteil</CardTitle>
              <Battery className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-lg sm:text-2xl font-bold">{stats.avgUsvShare}%</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" /> +4.5%
                </span>
                <span className="hidden sm:inline">Ziel: 30%</span>
              </p>
            </CardContent>
          </Card>
          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Content</CardTitle>
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-lg sm:text-2xl font-bold">{contentStats?.total || 0}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  {contentStats?.published || 0} pub.
                </span>
                <span className="hidden sm:inline">/ {contentStats?.inProgress || 0} in Arbeit</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Umsatzentwicklung</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Ist vs. Ziel {selectedYear}</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 p-4 sm:p-6 pt-0">
              <div className="h-[250px] sm:h-[350px] w-full">
                {revenueData.length > 0 ? (
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
                        formatter={(value: number) => [`€${value.toLocaleString()}`, '']}
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
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Lade Umsatzdaten...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Umsatz nach Kanal</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Attribution Model</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="h-[250px] sm:h-[350px] w-full">
                {channelData.length > 0 ? (
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
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Lade Channel-Daten...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content & Keywords */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Top Keywords</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Nach Priorität</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3 sm:space-y-4">
                {topKeywords ? topKeywords.map((item) => (
                  <div key={item._id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      <span className="font-medium text-xs sm:text-sm truncate">{item.keyword}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">{item.volume.toLocaleString('de-DE')}</span>
                      <span className="font-bold text-primary text-sm">{item.priorityScore}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-muted-foreground">Lade Keywords...</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Content Pipeline {selectedYear}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Nächste 30 Tage</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {/* Desktop Table View */}
              <div className="hidden md:block space-y-4">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground mb-2">
                  <div>Thema</div>
                  <div>Format</div>
                  <div>Kanal</div>
                  <div>Status</div>
                  <div>Datum</div>
                </div>
                {upcomingContent && upcomingContent.length > 0 ? (
                  upcomingContent.slice(0, 5).map((item) => (
                    <div key={item._id} className="grid grid-cols-5 gap-4 text-sm items-center p-2 hover:bg-muted/50 rounded-md transition-colors">
                      <div className="font-medium truncate">{item.title}</div>
                      <div>
                        <span className="px-2 py-1 rounded-full bg-secondary text-xs">{item.contentType}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">{item.channel}</span>
                      </div>
                      <div>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs flex w-fit items-center gap-1",
                          item.status === "Published" ? "bg-emerald-500/10 text-emerald-500" :
                          item.status === "Review" ? "bg-amber-500/10 text-amber-500" :
                          item.status === "In Progress" || item.status === "Draft" ? "bg-blue-500/10 text-blue-500" :
                          item.status === "Scheduled" ? "bg-purple-500/10 text-purple-500" :
                          "bg-muted text-muted-foreground"
                        )}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {item.status}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        {new Date(item.publishDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    {upcomingContent === undefined ? "Lade Content..." : "Keine anstehenden Content-Pieces"}
                  </div>
                )}
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {upcomingContent && upcomingContent.length > 0 ? (
                  upcomingContent.slice(0, 5).map((item) => (
                    <div key={item._id} className="border rounded-lg p-3 space-y-2">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px]">{item.contentType}</span>
                        <span className="text-[10px] text-muted-foreground">{item.channel}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1",
                          item.status === "Published" ? "bg-emerald-500/10 text-emerald-500" :
                          item.status === "Review" ? "bg-amber-500/10 text-amber-500" :
                          item.status === "In Progress" || item.status === "Draft" ? "bg-blue-500/10 text-blue-500" :
                          item.status === "Scheduled" ? "bg-purple-500/10 text-purple-500" :
                          "bg-muted text-muted-foreground"
                        )}>
                          <span className="h-1 w-1 rounded-full bg-current" />
                          {item.status}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {new Date(item.publishDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    {upcomingContent === undefined ? "Lade Content..." : "Keine anstehenden Content-Pieces"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Distribution Chart */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Content-Verteilung {selectedYear}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Nach Kanal pro Monat</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="h-[200px] sm:h-[300px] w-full">
              {contentByMonthData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contentByMonthData}>
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
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Legend />
                    <Bar dataKey="seo" fill="var(--chart-1)" name="SEO" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="social" fill="var(--chart-2)" name="Social" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="email" fill="var(--chart-3)" name="Email" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Lade Content-Daten...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
