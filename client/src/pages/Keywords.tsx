import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { ArrowUpDown, Download, Edit, ExternalLink, Plus, Search, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const clusterColors: Record<string, string> = {
  "USV & Notstrom": "var(--chart-1)",
  "Autarkie": "var(--chart-2)",
  "Speicher & Batterie": "var(--chart-3)",
  "Balkonkraftwerk Basics": "var(--chart-4)",
  "Watt & Leistung": "var(--chart-5)",
  "Montage & Installation": "var(--accent)",
  "Förderung & Rechtliches": "var(--primary)",
  "Wechselrichter": "var(--muted-foreground)",
  "Camping & Mobil": "var(--secondary)",
  "Sonstiges": "var(--muted)",
};

export default function KeywordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCluster, setSelectedCluster] = useState<string>("all");
  const [selectedJourney, setSelectedJourney] = useState<string>("all");
  const [sortField, setSortField] = useState<"priorityScore" | "volume">("priorityScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<any>(null);

  // Convex Queries - Mit Content-Count aus dem einheitlichen Modell
  const keywordsWithContent = useQuery(api.keywords.listWithContentCount, {});
  const clusters = useQuery(api.keywords.getClusters, {});
  const journeyDistribution = useQuery(api.keywords.getJourneyDistribution, {});

  // Convex Mutations
  const addKeyword = useMutation(api.keywords.add);
  const updateKeyword = useMutation(api.keywords.update);
  const removeKeyword = useMutation(api.keywords.remove);

  // Form State - Ohne hasContent (wird automatisch berechnet)
  const [formData, setFormData] = useState({
    keyword: "",
    cluster: "USV & Notstrom",
    journeyPhase: "Awareness" as "Awareness" | "Consideration" | "Decision" | "Action" | "Retention",
    volume: 0,
    difficulty: 30,
    priorityScore: 50,
    notes: "",
  });

  // Filtered and sorted keywords
  const filteredKeywords = useMemo(() => {
    if (!keywordsWithContent) return [];

    let filtered = [...keywordsWithContent];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(kw =>
        kw.keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Cluster filter
    if (selectedCluster !== "all") {
      filtered = filtered.filter(kw => kw.cluster === selectedCluster);
    }

    // Journey filter
    if (selectedJourney !== "all") {
      filtered = filtered.filter(kw => kw.journeyPhase === selectedJourney);
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortDirection === "desc" ? bVal - aVal : aVal - bVal;
    });

    return filtered;
  }, [keywordsWithContent, searchTerm, selectedCluster, selectedJourney, sortField, sortDirection]);

  // Chart data
  const clusterData = useMemo(() => {
    if (!clusters) return [];
    return clusters.map(c => ({
      name: c.name,
      value: c.count,
      color: clusterColors[c.name] || "var(--muted)",
    }));
  }, [clusters]);

  const journeyData = useMemo(() => {
    if (!journeyDistribution) return [];
    return journeyDistribution;
  }, [journeyDistribution]);

  // Handlers
  const handleSort = (field: "priorityScore" | "volume") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSubmit = async () => {
    const keywordData = {
      keyword: formData.keyword,
      cluster: formData.cluster,
      journeyPhase: formData.journeyPhase,
      volume: formData.volume,
      difficulty: formData.difficulty,
      priorityScore: formData.priorityScore,
      notes: formData.notes || undefined,
    };

    if (editingKeyword) {
      await updateKeyword({
        id: editingKeyword._id,
        ...keywordData,
      });
    } else {
      await addKeyword(keywordData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (keyword: any) => {
    setEditingKeyword(keyword);
    setFormData({
      keyword: keyword.keyword,
      cluster: keyword.cluster,
      journeyPhase: keyword.journeyPhase,
      volume: keyword.volume,
      difficulty: keyword.difficulty,
      priorityScore: keyword.priorityScore,
      notes: keyword.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (confirm("Möchten Sie dieses Keyword wirklich löschen?")) {
      await removeKeyword({ id });
    }
  };

  const resetForm = () => {
    setEditingKeyword(null);
    setFormData({
      keyword: "",
      cluster: "USV & Notstrom",
      journeyPhase: "Awareness",
      volume: 0,
      difficulty: 30,
      priorityScore: 50,
      notes: "",
    });
  };

  const handleExport = () => {
    if (!filteredKeywords.length) return;

    const csv = [
      ["Keyword", "Cluster", "Journey Phase", "Volume", "Difficulty", "Priority Score", "Content Count"].join(","),
      ...filteredKeywords.map(kw =>
        [kw.keyword, kw.cluster, kw.journeyPhase, kw.volume, kw.difficulty, kw.priorityScore, kw.contentCount].join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "keywords-export.csv";
    a.click();
  };

  const uniqueClusters = useMemo(() => {
    if (!keywordsWithContent) return [];
    return [...new Set(keywordsWithContent.map(k => k.cluster))];
  }, [keywordsWithContent]);

  // Stats
  const stats = useMemo(() => {
    if (!keywordsWithContent) return { total: 0, withContent: 0, withoutContent: 0 };
    const withContent = keywordsWithContent.filter(k => k.hasContent).length;
    return {
      total: keywordsWithContent.length,
      withContent,
      withoutContent: keywordsWithContent.length - withContent,
    };
  }, [keywordsWithContent]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Keyword Analyse</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {stats.total} Keywords ({stats.withContent} mit Content, {stats.withoutContent} ohne Content)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} size="sm" className="sm:size-default">
              <Download className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Export</span> CSV
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Neues Keyword
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingKeyword ? "Keyword bearbeiten" : "Neues Keyword"}</DialogTitle>
                  <DialogDescription>
                    Keyword zur Analyse hinzufügen. Content-Status wird automatisch berechnet.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="keyword">Keyword</Label>
                    <Input
                      id="keyword"
                      value={formData.keyword}
                      onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                      placeholder="z.B. Balkonkraftwerk bei Stromausfall"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Cluster</Label>
                      <Select
                        value={formData.cluster}
                        onValueChange={(value) => setFormData({ ...formData, cluster: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USV & Notstrom">USV & Notstrom</SelectItem>
                          <SelectItem value="Autarkie">Autarkie</SelectItem>
                          <SelectItem value="Speicher & Batterie">Speicher & Batterie</SelectItem>
                          <SelectItem value="Balkonkraftwerk Basics">Balkonkraftwerk Basics</SelectItem>
                          <SelectItem value="Watt & Leistung">Watt & Leistung</SelectItem>
                          <SelectItem value="Montage & Installation">Montage & Installation</SelectItem>
                          <SelectItem value="Förderung & Rechtliches">Förderung & Rechtliches</SelectItem>
                          <SelectItem value="Wechselrichter">Wechselrichter</SelectItem>
                          <SelectItem value="Camping & Mobil">Camping & Mobil</SelectItem>
                          <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Journey Phase</Label>
                      <Select
                        value={formData.journeyPhase}
                        onValueChange={(value: any) => setFormData({ ...formData, journeyPhase: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Awareness">Awareness</SelectItem>
                          <SelectItem value="Consideration">Consideration</SelectItem>
                          <SelectItem value="Decision">Decision</SelectItem>
                          <SelectItem value="Action">Action</SelectItem>
                          <SelectItem value="Retention">Retention</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="volume" className="text-xs sm:text-sm">Volumen</Label>
                      <Input
                        id="volume"
                        type="number"
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="difficulty" className="text-xs sm:text-sm">Schwierigkeit</Label>
                      <Input
                        id="difficulty"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priorityScore" className="text-xs sm:text-sm">Priority</Label>
                      <Input
                        id="priorityScore"
                        type="number"
                        value={formData.priorityScore}
                        onChange={(e) => setFormData({ ...formData, priorityScore: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notizen (optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Zusätzliche Informationen..."
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  {editingKeyword && (
                    <Button
                      variant="destructive"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        handleDelete(editingKeyword._id);
                        setIsDialogOpen(false);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Löschen
                    </Button>
                  )}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 sm:flex-none">Abbrechen</Button>
                    <Button onClick={handleSubmit} className="flex-1 sm:flex-none">{editingKeyword ? "Speichern" : "Hinzufügen"}</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Cluster Cards */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {clusters?.map((cluster) => (
            <Link key={cluster.name} href={`/cluster/${encodeURIComponent(cluster.name)}`}>
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors h-full">
                <CardHeader className="pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium truncate">{cluster.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 p-3 sm:p-4 pt-0">
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span className="text-xl sm:text-2xl font-bold">{cluster.count}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">KW</span>
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                    {cluster.contentCount} Content | {cluster.totalVolume.toLocaleString()} Vol.
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Themen-Verteilung</CardTitle>
              <CardDescription>Anzahl Keywords pro Cluster</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {clusterData.length > 0 ? (
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
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Lade Cluster-Daten...
                  </div>
                )}
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
                {journeyData.length > 0 ? (
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
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Lade Journey-Daten...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle>Keyword Liste</CardTitle>
                <CardDescription>Priorisierte Keywords mit Verknüpfung zu Content-Pieces</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
                <div className="relative flex-1 min-w-0 sm:max-w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Keywords suchen..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCluster} onValueChange={setSelectedCluster}>
                    <SelectTrigger className="flex-1 sm:w-[150px]">
                      <SelectValue placeholder="Cluster" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Cluster</SelectItem>
                      {uniqueClusters.map(cluster => (
                        <SelectItem key={cluster} value={cluster}>{cluster}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedJourney} onValueChange={setSelectedJourney}>
                    <SelectTrigger className="flex-1 sm:w-[130px]">
                      <SelectValue placeholder="Phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Phasen</SelectItem>
                      <SelectItem value="Awareness">Awareness</SelectItem>
                      <SelectItem value="Consideration">Consideration</SelectItem>
                      <SelectItem value="Decision">Decision</SelectItem>
                      <SelectItem value="Action">Action</SelectItem>
                      <SelectItem value="Retention">Retention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Mobile sort buttons */}
              <div className="flex gap-2 md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleSort("priorityScore")}
                >
                  Priority <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleSort("volume")}
                >
                  Volumen <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[350px]">Keyword</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8"
                        onClick={() => handleSort("priorityScore")}
                      >
                        Priority Score
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Cluster</TableHead>
                    <TableHead>Journey Phase</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8"
                        onClick={() => handleSort("volume")}
                      >
                        Volumen
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead className="w-[80px]">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKeywords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {keywordsWithContent === undefined ? "Lade Keywords..." : "Keine Keywords gefunden"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredKeywords.slice(0, 50).map((kw) => (
                      <TableRow key={kw._id}>
                        <TableCell className="font-medium">{kw.keyword}</TableCell>
                        <TableCell>
                          <Badge
                            variant={kw.priorityScore >= 90 ? "default" : kw.priorityScore >= 50 ? "secondary" : "outline"}
                            className={cn(
                              kw.priorityScore >= 90 ? "bg-emerald-500 hover:bg-emerald-600" :
                                kw.priorityScore >= 50 ? "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30" : ""
                            )}
                          >
                            {kw.priorityScore}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link href={`/cluster/${encodeURIComponent(kw.cluster)}`}>
                            <span className="text-sm hover:text-primary hover:underline cursor-pointer flex items-center gap-1">
                              {kw.cluster}
                              <ExternalLink className="h-3 w-3 opacity-50" />
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {kw.journeyPhase}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{kw.volume.toLocaleString()}</TableCell>
                        <TableCell>
                          {kw.hasContent ? (
                            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-500">
                              {kw.contentCount} Stück
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(kw)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(kw._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filteredKeywords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {keywordsWithContent === undefined ? "Lade Keywords..." : "Keine Keywords gefunden"}
                </div>
              ) : (
                filteredKeywords.slice(0, 50).map((kw) => (
                  <div
                    key={kw._id}
                    className="border rounded-lg p-3 space-y-2 bg-card"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-sm leading-tight flex-1">{kw.keyword}</div>
                      <Badge
                        variant={kw.priorityScore >= 90 ? "default" : kw.priorityScore >= 50 ? "secondary" : "outline"}
                        className={cn(
                          "shrink-0",
                          kw.priorityScore >= 90 ? "bg-emerald-500 hover:bg-emerald-600" :
                            kw.priorityScore >= 50 ? "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30" : ""
                        )}
                      >
                        {kw.priorityScore}
                      </Badge>
                    </div>
                    {/* Priority bar */}
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          kw.priorityScore >= 90 ? "bg-emerald-500" :
                            kw.priorityScore >= 50 ? "bg-blue-500" : "bg-muted-foreground"
                        )}
                        style={{ width: `${kw.priorityScore}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <Link href={`/cluster/${encodeURIComponent(kw.cluster)}`}>
                        <span className="text-muted-foreground hover:text-primary">{kw.cluster}</span>
                      </Link>
                      <span className="text-muted-foreground/50">·</span>
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                        {kw.journeyPhase}
                      </Badge>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="text-muted-foreground">{kw.volume.toLocaleString()} Vol.</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        {kw.hasContent ? (
                          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-500 text-xs">
                            {kw.contentCount} Content
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">Kein Content</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(kw)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(kw._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredKeywords.length > 50 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Zeige 50 von {filteredKeywords.length} Keywords. Verwende die Filter um die Liste einzugrenzen.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
