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
import { BookOpen, CheckCircle2, Clock, Edit, FileText, Plus, Trash2, Video } from "lucide-react";
import { useState, useMemo } from "react";

const pillarColors: Record<string, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  amber: "bg-amber-500",
};

const quarterlyPlan = [
  {
    quarter: "Q1: Start & Planung",
    focus: "Neujahrsvorsätze & Sicherheit",
    months: [
      { name: "Januar", theme: "Energieunabhängigkeit", key_content: "Strompreisentwicklung, USV-Guide" },
      { name: "Februar", theme: "Winterstrom", key_content: "Winter-Ertrag, Notstrom-Vergleich" },
      { name: "März", theme: "Frühjahrsstart", key_content: "Montage-Anleitungen, Wechselrichter" },
    ]
  },
  {
    quarter: "Q2: Hochsaison Start",
    focus: "Installation & Ertrag",
    months: [
      { name: "April", theme: "Solarfrühling", key_content: "Modul-Vergleich, Flachdach-Montage" },
      { name: "Mai", theme: "Peak Season", key_content: "Leistungsgrenzen, Reinigung" },
      { name: "Juni", theme: "Sommer-Power", key_content: "Klimaanlage & Solar, Camping" },
    ]
  },
  {
    quarter: "Q3: Hochsaison & Urlaub",
    focus: "Optimierung & Mobil",
    months: [
      { name: "Juli", theme: "Peak Performance", key_content: "Ertrag maximieren, B2B USV" },
      { name: "August", theme: "Urlaub & Sicherheit", key_content: "Anlage im Urlaub, Medizinische USV" },
      { name: "September", theme: "Herbstvorbereitung", key_content: "Winkel anpassen, Speicher ROI" },
    ]
  },
  {
    quarter: "Q4: Winter & Planung",
    focus: "Vorbereitung & Deals",
    months: [
      { name: "Oktober", theme: "Wintercheck", key_content: "Wintervorbereitung, Strompreis 2027" },
      { name: "November", theme: "Black Friday", key_content: "Angebote, Geschenke" },
      { name: "Dezember", theme: "Jahresabschluss", key_content: "Steuererklärung, Ausblick 2027" },
    ]
  }
];

export default function ContentPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedPillar, setSelectedPillar] = useState<number>(1);

  // Convex Queries
  const pillars = useQuery(api.content.listPillars, {});
  const contentItems = useQuery(api.content.listItems, {});
  const contentStats = useQuery(api.content.getContentStats, {});

  // Convex Mutations
  const addItem = useMutation(api.content.addItem);
  const updateItem = useMutation(api.content.updateItem);
  const removeItem = useMutation(api.content.removeItem);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    pillarId: 1,
    type: "Blog" as const,
    status: "Planned" as const,
    description: "",
    dueDate: "",
  });

  // Group items by pillar
  const itemsByPillar = useMemo(() => {
    if (!contentItems || !pillars) return {};

    const grouped: Record<number, any[]> = {};
    pillars.forEach((_, index) => {
      grouped[index + 1] = contentItems.filter(item => item.pillarId === index + 1);
    });
    return grouped;
  }, [contentItems, pillars]);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      pillarId: item.pillarId,
      type: item.type,
      status: item.status,
      description: item.description || "",
      dueDate: item.dueDate || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem({
        id: editingItem._id,
        title: formData.title,
        pillarId: formData.pillarId,
        type: formData.type,
        status: formData.status,
        description: formData.description || undefined,
        dueDate: formData.dueDate || undefined,
      });
    } else {
      await addItem({
        title: formData.title,
        pillarId: formData.pillarId,
        type: formData.type,
        status: formData.status,
        description: formData.description || undefined,
        dueDate: formData.dueDate || undefined,
      });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: any) => {
    if (confirm("Möchten Sie dieses Content-Piece wirklich löschen?")) {
      await removeItem({ id });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      pillarId: 1,
      type: "Blog",
      status: "Planned",
      description: "",
      dueDate: "",
    });
  };

  const getProgress = (pillarId: number) => {
    const items = itemsByPillar[pillarId] || [];
    if (items.length === 0) return 0;
    const published = items.filter(i => i.status === "Published").length;
    return Math.round((published / items.length) * 100);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Content Strategie</h2>
            <p className="text-muted-foreground mt-1">
              {contentStats?.total || 0} Content-Pieces in 4 strategischen Säulen
              ({contentStats?.published || 0} veröffentlicht, {contentStats?.inProgress || 0} in Arbeit)
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="mr-2 h-4 w-4" /> Neues Content-Piece
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Content-Säule</Label>
                    <Select
                      value={String(formData.pillarId)}
                      onValueChange={(value) => setFormData({ ...formData, pillarId: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pillars?.map((pillar, index) => (
                          <SelectItem key={pillar._id} value={String(index + 1)}>
                            {pillar.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Typ</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: any) => setFormData({ ...formData, type: value })}
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="Planned">Geplant</SelectItem>
                        <SelectItem value="Draft">Entwurf</SelectItem>
                        <SelectItem value="In Progress">In Arbeit</SelectItem>
                        <SelectItem value="Review">Review</SelectItem>
                        <SelectItem value="Published">Veröffentlicht</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Fälligkeitsdatum</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
              <DialogFooter className="flex justify-between">
                {editingItem && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDelete(editingItem._id);
                      setIsDialogOpen(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Löschen
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Abbrechen</Button>
                  <Button onClick={handleSubmit}>{editingItem ? "Speichern" : "Erstellen"}</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars?.map((pillar, index) => {
            const pillarId = index + 1;
            const items = itemsByPillar[pillarId] || [];
            const progress = getProgress(pillarId);

            return (
              <Card key={pillar._id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pillar.title}</CardTitle>
                    <Badge variant={pillar.priority === "HOCH" ? "default" : "secondary"} className="text-[10px]">
                      {pillar.priority}
                    </Badge>
                  </div>
                  <CardDescription>{pillar.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Fortschritt</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress
                      value={progress}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2 mt-2 flex-1">
                    {items.slice(0, 4).map((item) => (
                      <div
                        key={item._id}
                        className="flex items-start gap-2 text-sm p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleEdit(item)}
                      >
                        {item.type === "Video" ? <Video className="h-4 w-4 mt-0.5 text-muted-foreground" /> :
                          item.type === "Tool" ? <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" /> :
                            <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground" />}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium leading-tight truncate">{item.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] h-4 px-1 py-0">{item.type}</Badge>
                            <span className={cn(
                              "text-[10px]",
                              item.status === "Published" ? "text-emerald-500" : "text-muted-foreground"
                            )}>{item.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {items.length > 4 && (
                      <div className="text-xs text-muted-foreground text-center pt-2">
                        +{items.length - 4} weitere
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-auto"
                    onClick={() => {
                      setFormData({ ...formData, pillarId });
                      setIsDialogOpen(true);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Hinzufügen
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Jahresübersicht 2026</h3>
          <Tabs defaultValue="q1" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="q1">Q1: Start & Planung</TabsTrigger>
              <TabsTrigger value="q2">Q2: Hochsaison Start</TabsTrigger>
              <TabsTrigger value="q3">Q3: Hochsaison & Urlaub</TabsTrigger>
              <TabsTrigger value="q4">Q4: Winter & Planung</TabsTrigger>
            </TabsList>
            {quarterlyPlan.map((q, i) => (
              <TabsContent key={i} value={`q${i + 1}`} className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{q.quarter}</CardTitle>
                    <CardDescription>Fokus: {q.focus}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      {q.months.map((month) => (
                        <div key={month.name} className="space-y-3 border rounded-lg p-4 bg-muted/10">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-lg">{month.name}</h4>
                            <Badge variant="secondary">{month.theme}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Key Content:</div>
                            <ul className="space-y-1">
                              {month.key_content.split(", ").map((item, k) => (
                                <li key={k} className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-3 w-3 text-primary" />
                                  {item}
                                </li>
                              ))}
                            </ul>
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
      </div>
    </DashboardLayout>
  );
}
