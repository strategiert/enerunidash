import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";

const eventTypeStyles: Record<string, string> = {
  SEO: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  SEA: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  Social: "bg-pink-500/20 text-pink-500 border-pink-500/30",
  Newsletter: "bg-orange-500/20 text-orange-500 border-orange-500/30",
  PR: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
  Product: "bg-slate-500/20 text-slate-500 border-slate-500/30",
};

const statusColors: Record<string, string> = {
  Planned: "text-muted-foreground",
  Draft: "text-amber-500",
  Review: "text-blue-500",
  Published: "text-emerald-500",
  Active: "text-emerald-500",
  Done: "text-emerald-500",
  Sent: "text-emerald-500",
  Dev: "text-purple-500",
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = Jan 2026
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

  // Convex Queries
  const allEvents = useQuery(api.calendarEvents.list, { month: currentMonth, year: 2026 });
  const upcomingEvents = useQuery(api.calendarEvents.getUpcoming, { limit: 10 });
  const eventStats = useQuery(api.calendarEvents.getStatsByType, {});

  // Convex Mutations
  const addEvent = useMutation(api.calendarEvents.add);
  const updateEvent = useMutation(api.calendarEvents.update);
  const removeEvent = useMutation(api.calendarEvents.remove);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    type: "SEO" as const,
    status: "Planned" as const,
    description: "",
  });

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (!allEvents) return [];

    let filtered = [...allEvents];

    if (selectedType !== "all") {
      filtered = filtered.filter(e => e.type === selectedType);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(e => e.status === selectedStatus);
    }

    return filtered;
  }, [allEvents, selectedType, selectedStatus]);

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 7 : day; // Convert Sunday (0) to 7 for Monday-first week
  };

  const handleAddEvent = (date: string) => {
    setSelectedDate(date);
    setFormData({
      ...formData,
      date: date,
    });
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      type: event.type,
      status: event.status,
      description: event.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (editingEvent) {
      await updateEvent({
        id: editingEvent._id,
        title: formData.title,
        date: formData.date,
        type: formData.type,
        status: formData.status,
        description: formData.description || undefined,
      });
    } else {
      await addEvent({
        title: formData.title,
        date: formData.date,
        type: formData.type,
        status: formData.status,
        description: formData.description || undefined,
      });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: any) => {
    if (confirm("Möchten Sie dieses Event wirklich löschen?")) {
      await removeEvent({ id });
    }
  };

  const resetForm = () => {
    setEditingEvent(null);
    setSelectedDate("");
    setFormData({
      title: "",
      date: "",
      type: "SEO",
      status: "Planned",
      description: "",
    });
  };

  const renderCalendarDays = () => {
    const year = 2026;
    const totalDays = daysInMonth(currentMonth, year);
    const startDay = firstDayOfMonth(currentMonth, year);
    const days = [];
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Empty cells for previous month
    for (let i = 1; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border border-border/50 bg-muted/20" />);
    }

    // Days of current month
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `2026-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = filteredEvents.filter(e => e.date === dateStr);
      const isToday = dateStr === todayStr;

      days.push(
        <div
          key={day}
          className="h-32 border border-border/50 p-2 hover:bg-muted/30 transition-colors relative group"
        >
          <span className={cn(
            "text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full mb-1",
            isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}>
            {day}
          </span>
          <div className="space-y-1 overflow-y-auto max-h-[80px] no-scrollbar">
            {dayEvents.map(event => (
              <div
                key={event._id}
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded border truncate cursor-pointer hover:opacity-80 flex items-center gap-1",
                  eventTypeStyles[event.type]
                )}
                onClick={() => handleEditEvent(event)}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", statusColors[event.status]?.replace("text-", "bg-"))} />
                {event.title}
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleAddEvent(dateStr)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    return days;
  };

  // Calculate milestones
  const milestones = useMemo(() => {
    const today = new Date();
    return [
      { title: "Q1 Review", date: "31. Mär", days: Math.ceil((new Date(2026, 2, 31).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) },
      { title: "Sommer-Kampagne Start", date: "01. Mai", days: Math.ceil((new Date(2026, 4, 1).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) },
      { title: "Black Friday Prep", date: "01. Okt", days: Math.ceil((new Date(2026, 9, 1).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) },
      { title: "Jahresabschluss", date: "15. Dez", days: Math.ceil((new Date(2026, 11, 15).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) },
    ].filter(m => m.days > 0);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Jahresplaner 2026</h2>
            <p className="text-muted-foreground mt-1">Übersicht aller Marketing-Aktivitäten und Kampagnen</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(Math.max(0, currentMonth - 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="w-32 text-center font-medium text-lg">
              {months[currentMonth]} 2026
            </div>
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(Math.min(11, currentMonth + 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="h-6 w-px bg-border mx-2" />
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Neuer Eintrag
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? "Event bearbeiten" : "Neues Event erstellen"}</DialogTitle>
                  <DialogDescription>
                    {editingEvent ? "Bearbeiten Sie die Event-Details." : "Fügen Sie ein neues Marketing-Event hinzu."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Titel</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="z.B. Blog: USV für Homeoffice"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Datum</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
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
                          <SelectItem value="SEO">SEO / Blog</SelectItem>
                          <SelectItem value="SEA">SEA / Ads</SelectItem>
                          <SelectItem value="Social">Social Media</SelectItem>
                          <SelectItem value="Newsletter">Newsletter</SelectItem>
                          <SelectItem value="PR">PR / Presse</SelectItem>
                          <SelectItem value="Product">Produkt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                        <SelectItem value="Planned">Geplant</SelectItem>
                        <SelectItem value="Draft">Entwurf</SelectItem>
                        <SelectItem value="Review">In Review</SelectItem>
                        <SelectItem value="Dev">In Entwicklung</SelectItem>
                        <SelectItem value="Published">Veröffentlicht</SelectItem>
                        <SelectItem value="Active">Aktiv</SelectItem>
                        <SelectItem value="Done">Erledigt</SelectItem>
                        <SelectItem value="Sent">Gesendet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Beschreibung (optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Kurze Beschreibung des Events..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-between">
                  {editingEvent && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDelete(editingEvent._id);
                        setIsDialogOpen(false);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Löschen
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Abbrechen</Button>
                    <Button onClick={handleSubmit}>{editingEvent ? "Speichern" : "Erstellen"}</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Kalenderansicht</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[130px] h-8 text-xs">
                    <SelectValue placeholder="Alle Typen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Typen</SelectItem>
                    <SelectItem value="SEO">SEO</SelectItem>
                    <SelectItem value="SEA">SEA</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Newsletter">Newsletter</SelectItem>
                    <SelectItem value="PR">PR</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[130px] h-8 text-xs">
                    <SelectValue placeholder="Alle Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="Planned">Geplant</SelectItem>
                    <SelectItem value="Draft">Entwurf</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Published">Veröffentlicht</SelectItem>
                    <SelectItem value="Active">Aktiv</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px mb-px text-center text-sm font-medium text-muted-foreground py-2">
                <div>Mo</div><div>Di</div><div>Mi</div><div>Do</div><div>Fr</div><div>Sa</div><div>So</div>
              </div>
              <div className="grid grid-cols-7 gap-px bg-border/50 border border-border rounded-md overflow-hidden">
                {renderCalendarDays()}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Legende</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Kanäle</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(eventTypeStyles).map(([type, style]) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className={cn("cursor-pointer hover:bg-muted text-xs", style)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Statistik</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {eventStats?.map(stat => (
                      <div key={stat.type} className="flex justify-between">
                        <span className="text-muted-foreground">{stat.type}</span>
                        <span className="font-medium">{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Nächste Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-3">
                    {upcomingEvents?.slice(0, 5).map((event) => (
                      <div
                        key={event._id}
                        className="flex items-center justify-between p-2 border border-border rounded-md bg-muted/10 cursor-pointer hover:bg-muted/30"
                        onClick={() => handleEditEvent(event)}
                      >
                        <div>
                          <div className="font-medium text-sm truncate max-w-[150px]">{event.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                          </div>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px]", eventTypeStyles[event.type])}>
                          {event.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Meilensteine</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[150px] pr-4">
                  <div className="space-y-3">
                    {milestones.map((milestone, i) => (
                      <div key={i} className="flex items-center justify-between p-2 border border-border rounded-md bg-muted/10">
                        <div>
                          <div className="font-medium text-sm">{milestone.title}</div>
                          <div className="text-xs text-muted-foreground">{milestone.date}</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          in {milestone.days} Tagen
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
