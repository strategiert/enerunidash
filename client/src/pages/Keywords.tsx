import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Download, Search, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Mock Data based on Clustering Analysis
const clusterData = [
  { name: "Balkonkraftwerk Basics", value: 150, color: "var(--chart-1)" },
  { name: "Speicher & Batterie", value: 90, color: "var(--chart-2)" },
  { name: "Watt & Leistung", value: 60, color: "var(--chart-3)" },
  { name: "Autarkie", value: 45, color: "var(--chart-4)" },
  { name: "Rechtliches", value: 40, color: "var(--chart-5)" },
];

const journeyData = [
  { phase: "Awareness", count: 120 },
  { phase: "Consideration", count: 180 },
  { phase: "Decision", count: 150 },
  { phase: "Action", count: 60 },
  { phase: "Retention", count: 47 },
];

const keywordList = [
  { keyword: "Balkonkraftwerk bei Stromausfall", score: 130, cluster: "USV & Notstrom", journey: "Awareness", volume: 2400 },
  { keyword: "Notstromaggregat für Einfamilienhaus", score: 90, cluster: "USV & Notstrom", journey: "Consideration", volume: 5400 },
  { keyword: "USV Solaranlage", score: 90, cluster: "USV & Notstrom", journey: "Decision", volume: 880 },
  { keyword: "Balkonkraftwerk mit Speicher", score: 65, cluster: "Speicher", journey: "Consideration", volume: 12000 },
  { keyword: "Autarkiegrad berechnen", score: 65, cluster: "Autarkie", journey: "Awareness", volume: 1600 },
  { keyword: "Powerstation ohne Mehrwertsteuer", score: 45, cluster: "Rechtliches", journey: "Decision", volume: 720 },
  { keyword: "Balkonkraftwerk autark betreiben", score: 40, cluster: "Autarkie", journey: "Action", volume: 320 },
  { keyword: "Stromspeicher 30 kwh Preis", score: 45, cluster: "Speicher", journey: "Decision", volume: 480 },
  { keyword: "Insellösung Photovoltaik", score: 30, cluster: "Autarkie", journey: "Awareness", volume: 2900 },
  { keyword: "Balkonkraftwerk Förderung 2026", score: 30, cluster: "Rechtliches", journey: "Decision", volume: 18000 },
];

export default function KeywordsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Keyword Analyse</h2>
            <p className="text-muted-foreground mt-1">557 Keywords geclustert nach Themen und Customer Journey</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button>
              <Zap className="mr-2 h-4 w-4" /> Neue Analyse
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Themen-Verteilung</CardTitle>
              <CardDescription>Anzahl Keywords pro Cluster</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clusterData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {clusterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--background)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Journey Phasen</CardTitle>
              <CardDescription>Verteilung der Suchintention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={journeyData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="phase" type="category" width={100} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'var(--muted)/20' }}
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Keyword Liste</CardTitle>
                <CardDescription>Priorisierte Keywords für Content-Erstellung</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Keywords suchen..." className="pl-8" />
                </div>
                <Tabs defaultValue="all" className="w-[300px]">
                  <TabsList>
                    <TabsTrigger value="all">Alle</TabsTrigger>
                    <TabsTrigger value="high">High Prio</TabsTrigger>
                    <TabsTrigger value="usv">Nur USV</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Keyword</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                      Priority Score <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Cluster</TableHead>
                  <TableHead>Journey Phase</TableHead>
                  <TableHead className="text-right">Volumen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywordList.map((kw) => (
                  <TableRow key={kw.keyword}>
                    <TableCell className="font-medium">{kw.keyword}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={kw.score >= 90 ? "default" : kw.score >= 50 ? "secondary" : "outline"}
                        className={cn(
                          kw.score >= 90 ? "bg-emerald-500 hover:bg-emerald-600" : 
                          kw.score >= 50 ? "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30" : ""
                        )}
                      >
                        {kw.score}
                      </Badge>
                    </TableCell>
                    <TableCell>{kw.cluster}</TableCell>
                    <TableCell>{kw.journey}</TableCell>
                    <TableCell className="text-right">{kw.volume.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
