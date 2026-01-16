import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { BookOpen, CheckCircle2, Clock, Edit, ExternalLink, FileText, Plus, Trash2, Video } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "wouter";

export default function ContentPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(2026);

  // Convex Queries - Einheitliches Content-Modell
  const pillarsWithContent = useQuery(api.contentPieces.getByPillar, {});
  const contentStats = useQuery(api.contentPieces.getStats, { year: selectedYear });
  const yearOverview = useQuery(api.contentPieces.getYearOverview, { year: selectedYear });
  const clusters = useQuery(api.keywords.getClusters, {});

  // Convex Mutations - Einheitliches Content-Modell
  const createContent = useMutation(api.contentPieces.create);
  const updateContent = useMutation(api.contentPieces.update);
  const removeContent = useMutation(api.contentPieces.remove);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    pillarId: "none" as string,
    contentType: "Blog" as "Blog" | "Video" | "Tool" | "Infographic" | "Pillar Page" | "Case Study" | "Social Post" | "Newsletter" | "PR" | "SEA Ad",
    status: "Planned" as "Idea" | "Planned" | "Draft" | "In Progress" | "Review" | "Scheduled" | "Published" | "Active" | "Paused" | "Ended",
    channel: "SEO" as "SEO" | "SEA" | "Social" | "Email" | "PR" | "Product",
    journeyPhase: "Awareness" as "Awareness" | "Consideration" | "Decision" | "Action" | "Retention",
    description: "",
    publishDate: "",
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      pillarId: item.pillarId || "none",
      contentType: item.contentType,
      status: item.status,
      channel: item.channel,
      journeyPhase: item.journeyPhase,
      description: item.description || "",
      publishDate: item.publishDate || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    const pillarIdValue = formData.pillarId && formData.pillarId !== "none" ? (formData.pillarId as Id<"contentPillars">) : undefined;
    if (editingItem) {
      await updateContent({
        id: editingItem._id,
        title: formData.title,
        pillarId: pillarIdValue,
        contentType: formData.contentType,
        status: formData.status,
        channel: formData.channel,
        journeyPhase: formData.journeyPhase,
        description: formData.description || undefined,
        publishDate: formData.publishDate || undefined,
      });
    } else {
      await createContent({
        title: formData.title,
        pillarId: pillarIdValue,
        contentType: formData.contentType,
        status: formData.status,
        channel: formData.channel,
        journeyPhase: formData.journeyPhase,
        description: formData.description || undefined,
        publishDate: formData.publishDate || new Date().toISOString().split('T')[0],
      });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: any) => {
    if (confirm("Möchten Sie dieses Content-Piece wirklich löschen?")) {
      await removeContent({ id });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      pillarId: "none",
      contentType: "Blog",
      status: "Planned",
      channel: "SEO",
      journeyPhase: "Awareness",
      description: "",
      publishDate: "",
    });
  };

  // Quartalsplanung basierend auf Jahresdaten
  const quarterlyData = useMemo(() => {
    if (!yearOverview) return [];

    const quarters = [
      { quarter: "Q1: Start & Planung", focus: "Neujahrsvorsätze & Sicherheit", months: ["Jan", "Feb", "Mar"] },
      { quarter: "Q2: Hochsaison Start", focus: "Installation & Ertrag", months: ["Apr", "Mai", "Jun"] },
      { quarter: "Q3: Hochsaison & Urlaub", focus: "Optimierung & Mobil", months: ["Jul", "Aug", "Sep"] },
      { quarter: "Q4: Winter & Planung", focus: "Vorbereitung & Deals", months: ["Okt", "Nov", "Dez"] },
    ];

    return quarters.map((q, qIndex) => ({
      ...q,
      monthData: q.months.map((monthName, mIndex) => {
        const monthIndex = qIndex * 3 + mIndex;
        const data = yearOverview[monthIndex];
        return {
          name: monthName,
          total: data?.total || 0,
          published: data?.published || 0,
          seo: data?.seo || 0,
          social: data?.social || 0,
          email: data?.email || 0,
        };
      }),
    }));
  }, [yearOverview]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Content Strategie</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {contentStats?.total || 0} Content-Pieces in {pillarsWithContent?.length || 0} Säulen
              <span className="hidden sm:inline"> ({contentStats?.published || 0} veröffentlicht, {contentStats?.inProgress || 0} in Arbeit)</span>
            </p>
          </div>
          <div className="flex gap-2">
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
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <FileText className="mr-2 h-4 w-4" /> Neues Content-Piece
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Content bearbeiten" : "Neues Content-Piece"}</DialogTitle>
                  <DialogDescription>
                    Erstellen oder bearbeiten Sie ein Content-Piece.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Titel</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="z.B. Pillar Page: Solaranlage mit USV"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Content-Säule</Label>
                      <Select
                        value={formData.pillarId}
                        onValueChange={(value) => setFormData({ ...formData, pillarId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Säule wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Keine Säule</SelectItem>
                          {pillarsWithContent?.map((pillar) => (
                            <SelectItem key={pillar._id} value={pillar._id}>
                              {pillar.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Content-Typ</Label>
                      <Select
                        value={formData.contentType}
                        onValueChange={(value: any) => setFormData({ ...formData, contentType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Blog">Blog Post</SelectItem>
                          <SelectItem value="Video">Video</SelectItem>
                          <SelectItem value="Tool">Tool / Rechner</SelectItem>
                          <SelectItem value="Infographic">Infografik</SelectItem>
                          <SelectItem value="Pillar Page">Pillar Page</SelectItem>
                          <SelectItem value="Case Study">Case Study</SelectItem>
                          <SelectItem value="Social Post">Social Post</SelectItem>
                          <SelectItem value="Newsletter">Newsletter</SelectItem>
                          <SelectItem value="PR">Pressemitteilung</SelectItem>
                          <SelectItem value="SEA Ad">SEA Anzeige</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Kanal</Label>
                      <Select
                        value={formData.channel}
                        onValueChange={(value: any) => setFormData({ ...formData, channel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SEO">SEO</SelectItem>
                          <SelectItem value="SEA">SEA</SelectItem>
                          <SelectItem value="Social">Social Media</SelectItem>
                          <SelectItem value="Email">Email / Newsletter</SelectItem>
                          <SelectItem value="PR">PR</SelectItem>
                          <SelectItem value="Product">Produkt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Idea">Idee</SelectItem>
                          <SelectItem value="Planned">Geplant</SelectItem>
                          <SelectItem value="Draft">Entwurf</SelectItem>
                          <SelectItem value="In Progress">In Arbeit</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
                          <SelectItem value="Scheduled">Terminiert</SelectItem>
                          <SelectItem value="Published">Veröffentlicht</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div className="grid gap-2">
                      <Label htmlFor="publishDate">Veröffentlichungsdatum</Label>
                      <Input
                        id="publishDate"
                        type="date"
                        value={formData.publishDate}
                        onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Beschreibung (optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Kurze Beschreibung des Inhalts..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  {editingItem && (
                    <Button
                      variant="destructive"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        handleDelete(editingItem._id);
                        setIsDialogOpen(false);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Löschen
                    </Button>
                  )}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 sm:flex-none">Abbrechen</Button>
                    <Button onClick={handleSubmit} className="flex-1 sm:flex-none">{editingItem ? "Speichern" : "Erstellen"}</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content Pillars */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {pillarsWithContent?.map((pillar) => (
            <Card key={pillar._id} className="flex flex-col">
              <CardHeader className="pb-2 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/pillar/${pillar._id}`}>
                    <CardTitle className="text-base sm:text-lg hover:text-primary hover:underline cursor-pointer flex items-center gap-1">
                      {pillar.title}
                      <ExternalLink className="h-3 w-3 opacity-50 shrink-0" />
                    </CardTitle>
                  </Link>
                  <Badge variant={pillar.priority === "HOCH" ? "default" : "secondary"} className="text-[10px] shrink-0">
                    {pillar.priority}
                  </Badge>
                </div>
                <CardDescription className="text-xs sm:text-sm line-clamp-2">{pillar.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4 p-4 sm:p-6 pt-0">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Fortschritt</span>
                    <span>{pillar.progress}%</span>
                  </div>
                  <Progress value={pillar.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {pillar.publishedCount} / {pillar.targetCount} veröffentlicht
                  </div>
                </div>
                {/* Content items - collapsed on small mobile */}
                <div className="space-y-2 mt-2 flex-1 hidden sm:block">
                  {pillar.pieces.slice(0, 4).map((item: any) => (
                    <div
                      key={item._id}
                      className="flex items-start gap-2 text-sm p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleEdit(item)}
                    >
                      {item.contentType === "Video" ? <Video className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" /> :
                        item.contentType === "Tool" ? <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" /> :
                          <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium leading-tight truncate">{item.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] h-4 px-1 py-0">{item.contentType}</Badge>
                          <span className={cn(
                            "text-[10px]",
                            item.status === "Published" ? "text-emerald-500" : "text-muted-foreground"
                          )}>{item.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pillar.pieces.length > 4 && (
                    <div className="text-xs text-muted-foreground text-center pt-2">
                      +{pillar.pieces.length - 4} weitere
                    </div>
                  )}
                </div>
                {/* Mobile: Show count instead of items */}
                <div className="sm:hidden text-sm text-muted-foreground">
                  {pillar.pieces.length} Content-Pieces
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-auto min-h-[44px]"
                  onClick={() => {
                    setFormData({ ...formData, pillarId: pillar._id });
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" /> Hinzufügen
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Keyword Cluster */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold">Keyword Cluster</h3>
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
        </div>

        {/* Jahresübersicht */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold">Jahresübersicht {selectedYear}</h3>
          <Tabs defaultValue="q1" className="w-full">
            <TabsList className="w-full flex overflow-x-auto sm:grid sm:grid-cols-4 no-scrollbar">
              <TabsTrigger value="q1" className="flex-1 min-w-fit text-xs sm:text-sm px-2 sm:px-4">Q1</TabsTrigger>
              <TabsTrigger value="q2" className="flex-1 min-w-fit text-xs sm:text-sm px-2 sm:px-4">Q2</TabsTrigger>
              <TabsTrigger value="q3" className="flex-1 min-w-fit text-xs sm:text-sm px-2 sm:px-4">Q3</TabsTrigger>
              <TabsTrigger value="q4" className="flex-1 min-w-fit text-xs sm:text-sm px-2 sm:px-4">Q4</TabsTrigger>
            </TabsList>
            {quarterlyData.map((q, i) => (
              <TabsContent key={i} value={`q${i + 1}`} className="mt-4">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">{q.quarter}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Fokus: {q.focus}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      {q.monthData.map((month) => (
                        <div key={month.name} className="space-y-2 sm:space-y-3 border rounded-lg p-3 sm:p-4 bg-muted/10">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-base sm:text-lg">{month.name}</h4>
                            <Badge variant="secondary" className="text-xs">{month.total} Stück</Badge>
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="text-muted-foreground">SEO</span>
                              <span className="font-medium">{month.seo}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="text-muted-foreground">Social</span>
                              <span className="font-medium">{month.social}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="text-muted-foreground">Email</span>
                              <span className="font-medium">{month.email}</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-muted-foreground">Veröffentlicht</span>
                                <span className="font-medium text-emerald-500">{month.published}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Status-Übersicht */}
        {contentStats && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Content nach Status ({selectedYear})</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Verteilung aller Content-Pieces</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
                {Object.entries(contentStats.byStatus || {}).map(([status, count]) => (
                  <div key={status} className="text-center p-2 sm:p-4 rounded-lg bg-muted/30">
                    <div className="text-lg sm:text-2xl font-bold">{count as number}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{status}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
