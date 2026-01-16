import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2, Calendar as CalendarIcon, Filter } from "lucide-react";
import { useState, useMemo } from "react";

const channelStyles: Record<string, string> = {
  SEO: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  SEA: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  Social: "bg-pink-500/20 text-pink-500 border-pink-500/30",
  Email: "bg-amber-500/20 text-amber-500 border-amber-500/30",
  PR: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
  Product: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30",
};

const statusStyles: Record<string, string> = {
  Idea: "bg-gray-500/20 text-gray-400",
  Planned: "bg-slate-500/20 text-slate-400",
  Draft: "bg-yellow-500/20 text-yellow-500",
  "In Progress": "bg-blue-500/20 text-blue-400",
  Review: "bg-orange-500/20 text-orange-400",
  Scheduled: "bg-indigo-500/20 text-indigo-400",
  Published: "bg-emerald-500/20 text-emerald-400",
  Active: "bg-green-500/20 text-green-400",
  Paused: "bg-amber-500/20 text-amber-400",
  Ended: "bg-gray-500/20 text-gray-500",
};

const contentTypes = ["Blog", "Video", "Tool", "Infographic", "Pillar Page", "Case Study", "Social Post", "Newsletter", "PR", "SEA Ad"] as const;
const channels = ["SEO", "SEA", "Social", "Email", "PR", "Product"] as const;
const statuses = ["Idea", "Planned", "Draft", "In Progress", "Review", "Scheduled", "Published", "Active", "Paused", "Ended"] as const;
const journeyPhases = ["Awareness", "Consideration", "Decision", "Action", "Retention"] as const;

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Start at Jan 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPiece, setEditingPiece] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    publishDate: "",
    contentType: "Blog" as typeof contentTypes[number],
    channel: "SEO" as typeof channels[number],
    status: "Planned" as typeof statuses[number],
    journeyPhase: "Awareness" as typeof journeyPhases[number],
    assignee: "",
    notes: "",
  });

  // Convex queries
  const contentPieces = useQuery(api.contentPieces.getByMonth, {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  });

  const stats = useQuery(api.contentPieces.getStats, { year: currentDate.getFullYear() });
  const pillars = useQuery(api.contentPieces.getByPillar, {});

  // Mutations
  const createPiece = useMutation(api.contentPieces.create);
  const updatePiece = useMutation(api.contentPieces.update);
  const deletePiece = useMutation(api.contentPieces.remove);

  // Filter content by channel
  const filteredContent = useMemo(() => {
    if (!contentPieces) return [];
    if (channelFilter === "all") return contentPieces;
    return contentPieces.filter(p => p.channel === channelFilter);
  }, [contentPieces, channelFilter]);

  // Group content by date
  const contentByDate = useMemo(() => {
    const grouped: Record<string, typeof filteredContent> = {};
    for (const piece of filteredContent) {
      if (!grouped[piece.publishDate]) {
        grouped[piece.publishDate] = [];
      }
      grouped[piece.publishDate].push(piece);
    }
    return grouped;
  }, [filteredContent]);

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const navigateYear = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear() + direction, currentDate.getMonth(), 1));
  };

  // Dialog handlers
  const openCreateDialog = (date?: string) => {
    setEditingPiece(null);
    setFormData({
      title: "",
      description: "",
      publishDate: date || new Date().toISOString().split('T')[0],
      contentType: "Blog",
      channel: "SEO",
      status: "Planned",
      journeyPhase: "Awareness",
      assignee: "",
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (piece: any) => {
    setEditingPiece(piece);
    setFormData({
      title: piece.title,
      description: piece.description || "",
      publishDate: piece.publishDate,
      contentType: piece.contentType,
      channel: piece.channel,
      status: piece.status,
      journeyPhase: piece.journeyPhase,
      assignee: piece.assignee || "",
      notes: piece.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (editingPiece) {
      await updatePiece({
        id: editingPiece._id,
        ...formData,
      });
    } else {
      await createPiece(formData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: any) => {
    if (confirm("Content-Piece wirklich löschen?")) {
      await deletePiece({ id });
    }
  };

  // Get content for selected date
  const selectedDateContent = selectedDate ? contentByDate[selectedDate] || [] : [];

  // Render calendar - Desktop version (full)
  const renderCalendarDesktop = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

    // Header
    days.push(
      <div key="header" className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
    );

    // Days
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-1" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayContent = contentByDate[dateStr] || [];
      const isSelected = selectedDate === dateStr;
      const isToday = dateStr === new Date().toISOString().split('T')[0];

      cells.push(
        <div
          key={day}
          onClick={() => setSelectedDate(dateStr)}
          className={cn(
            "p-1 min-h-[100px] border border-border/50 rounded-md cursor-pointer transition-colors hover:bg-muted/30",
            isSelected && "ring-2 ring-primary bg-primary/5",
            isToday && "bg-primary/10"
          )}
        >
          <div className={cn(
            "text-sm font-medium mb-1",
            isToday && "text-primary"
          )}>
            {day}
          </div>
          <div className="space-y-0.5">
            {dayContent.slice(0, 3).map((piece: any) => (
              <div
                key={piece._id}
                className={cn(
                  "text-[10px] px-1 py-0.5 rounded truncate border",
                  channelStyles[piece.channel]
                )}
                title={piece.title}
              >
                {piece.title}
              </div>
            ))}
            {dayContent.length > 3 && (
              <div className="text-[10px] text-muted-foreground px-1">
                +{dayContent.length - 3} mehr
              </div>
            )}
          </div>
        </div>
      );
    }

    days.push(
      <div key="days" className="grid grid-cols-7 gap-1">
        {cells}
      </div>
    );

    return days;
  };

  // Render calendar - Mobile version (compact with dots)
  const renderCalendarMobile = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayContent = contentByDate[dateStr] || [];
      const isSelected = selectedDate === dateStr;
      const isToday = dateStr === new Date().toISOString().split('T')[0];

      cells.push(
        <div
          key={day}
          onClick={() => setSelectedDate(dateStr)}
          className={cn(
            "aspect-square flex flex-col items-center justify-center rounded-md cursor-pointer transition-colors min-h-[44px]",
            isSelected && "ring-2 ring-primary bg-primary/10",
            isToday && !isSelected && "bg-primary/5",
            !isSelected && !isToday && "hover:bg-muted/50"
          )}
        >
          <span className={cn(
            "text-sm font-medium",
            isToday && "text-primary",
            isSelected && "font-bold"
          )}>
            {day}
          </span>
          {dayContent.length > 0 && (
            <div className="flex gap-0.5 mt-0.5">
              {dayContent.slice(0, 3).map((piece: any, i: number) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    piece.channel === "SEO" && "bg-blue-500",
                    piece.channel === "SEA" && "bg-purple-500",
                    piece.channel === "Social" && "bg-pink-500",
                    piece.channel === "Email" && "bg-amber-500",
                    piece.channel === "PR" && "bg-emerald-500",
                    piece.channel === "Product" && "bg-cyan-500"
                  )}
                />
              ))}
              {dayContent.length > 3 && (
                <span className="text-[8px] text-muted-foreground">+</span>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-7 mb-1">
          {weekDays.map(day => (
            <div key={day} className="text-center text-[10px] font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {cells}
        </div>
      </>
    );
  };

  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Content-Kalender</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {stats?.total || 0} Content-Pieces für {currentDate.getFullYear()} geplant
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-[130px] sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kanäle</SelectItem>
                {channels.map(channel => (
                  <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => openCreateDialog()} size="sm" className="sm:size-default">
              <Plus className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Neuer Content</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <Card className="p-3 sm:p-4">
            <CardHeader className="pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Gesamt</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-xl sm:text-2xl font-bold">{stats?.total || 0}</div>
            </CardContent>
          </Card>
          <Card className="p-3 sm:p-4">
            <CardHeader className="pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-emerald-500">Veröffentlicht</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-xl sm:text-2xl font-bold text-emerald-500">{stats?.published || 0}</div>
            </CardContent>
          </Card>
          <Card className="p-3 sm:p-4">
            <CardHeader className="pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-500">In Arbeit</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-xl sm:text-2xl font-bold text-blue-500">{stats?.inProgress || 0}</div>
            </CardContent>
          </Card>
          <Card className="p-3 sm:p-4">
            <CardHeader className="pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-400">Geplant</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-xl sm:text-2xl font-bold text-slate-400">{stats?.planned || 0}</div>
            </CardContent>
          </Card>
          <Card className="p-3 sm:p-4 col-span-2 sm:col-span-1">
            <CardHeader className="pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Dieser Monat</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-xl sm:text-2xl font-bold">{filteredContent.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-4 lg:space-y-0 lg:grid lg:gap-6 lg:grid-cols-4">
          {/* Calendar */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hidden sm:flex" onClick={() => navigateYear(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="h-4 w-4 -ml-2" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => navigateMonth(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-base sm:text-xl">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => navigateMonth(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hidden sm:flex" onClick={() => navigateYear(1)}>
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4 -ml-2" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              {/* Desktop Calendar */}
              <div className="hidden md:block">
                {renderCalendarDesktop()}
              </div>
              {/* Mobile Calendar */}
              <div className="md:hidden">
                {renderCalendarMobile()}
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="truncate">
                  {selectedDate ? new Date(selectedDate).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Tag auswählen'}
                </span>
              </CardTitle>
              <CardDescription>
                {selectedDateContent.length} Content-Pieces
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {selectedDate && (
                <Button
                  variant="outline"
                  className="w-full mb-4 min-h-[44px]"
                  onClick={() => openCreateDialog(selectedDate)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Content für diesen Tag
                </Button>
              )}
              <ScrollArea className="h-[300px] lg:h-[500px]">
                <div className="space-y-3">
                  {selectedDateContent.map((piece: any) => (
                    <div
                      key={piece._id}
                      className="p-3 border rounded-lg space-y-2 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm leading-tight">{piece.title}</h4>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(piece)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(piece._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className={cn("text-xs", channelStyles[piece.channel])}>
                          {piece.channel}
                        </Badge>
                        <Badge variant="outline" className={cn("text-xs", statusStyles[piece.status])}>
                          {piece.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{piece.contentType}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{piece.journeyPhase}</p>
                    </div>
                  ))}
                  {selectedDateContent.length === 0 && selectedDate && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Keine Content-Pieces für diesen Tag
                    </p>
                  )}
                  {!selectedDate && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Wähle einen Tag im Kalender aus
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPiece ? "Content bearbeiten" : "Neuer Content"}</DialogTitle>
            <DialogDescription>
              {editingPiece ? "Bearbeite das Content-Piece" : "Erstelle ein neues Content-Piece für den Kalender"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Content-Titel eingeben..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="publishDate">Veröffentlichungsdatum</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="channel">Kanal</Label>
                <Select value={formData.channel} onValueChange={(v: any) => setFormData({ ...formData, channel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {channels.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contentType">Content-Typ</Label>
                <Select value={formData.contentType} onValueChange={(v: any) => setFormData({ ...formData, contentType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {contentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="journeyPhase">Customer Journey Phase</Label>
                <Select value={formData.journeyPhase} onValueChange={(v: any) => setFormData({ ...formData, journeyPhase: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {journeyPhases.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignee">Zugewiesen an</Label>
                <Input
                  id="assignee"
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  placeholder="Name..."
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kurze Beschreibung..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">Abbrechen</Button>
            <Button onClick={handleSubmit} disabled={!formData.title || !formData.publishDate} className="w-full sm:w-auto">
              {editingPiece ? "Speichern" : "Erstellen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
