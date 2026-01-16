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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Marketing Übersicht</h2>
            <p className="text-muted-foreground mt-1">Performance-Daten und KPIs für enerunity {selectedYear}</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger className="w-[120px]">
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamtumsatz (YTD)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRevenue(stats.totalRevenue)}</div>
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
              <div className="text-2xl font-bold">{stats.totalConversions.toLocaleString('de-DE')}</div>
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
              <div className="text-2xl font-bold">{stats.avgUsvShare}%</div>
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
              <CardTitle className="text-sm font-medium">Content Pieces</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentStats?.total || 0}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  {contentStats?.published || 0} veröffentlicht
                </span>
                / {contentStats?.inProgress || 0} in Arbeit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Umsatzentwicklung & Prognose</CardTitle>
              <CardDescription>Vergleich Ist-Umsatz vs. Zielvorgabe {selectedYear}</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full">
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

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Umsatz nach Kanal</CardTitle>
              <CardDescription>Basierend auf Attribution Model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Keywords (nach Priorität)</CardTitle>
              <CardDescription>Basierend auf Volumen und Schwierigkeit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topKeywords ? topKeywords.map((item) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="font-medium text-sm truncate max-w-[140px]">{item.keyword}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{item.volume.toLocaleString('de-DE')}</span>
                      <span className="font-bold text-primary">{item.priorityScore}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-muted-foreground">Lade Keywords...</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Content Pipeline {selectedYear}</CardTitle>
              <CardDescription>Nächste 30 Tage - Content nach Status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
            </CardContent>
          </Card>
        </div>

        {/* Content Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Content-Verteilung {selectedYear}</CardTitle>
            <CardDescription>Content Pieces nach Kanal pro Monat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
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
