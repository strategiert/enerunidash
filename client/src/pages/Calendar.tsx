import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import { useState } from "react";

// Mock Data for Calendar Events
const events = [
  { id: 1, title: "Strompreisentwicklung 2026", date: "2026-01-05", type: "SEO", status: "Done" },
  { id: 2, title: "Neujahrs-Newsletter", date: "2026-01-07", type: "Newsletter", status: "Done" },
  { id: 3, title: "Video: Stromkosten senken", date: "2026-01-08", type: "Social", status: "Done" },
  { id: 4, title: "Brand-Kampagne Start", date: "2026-01-10", type: "SEA", status: "Active" },
  { id: 5, title: "Förderungs-Guide 2026", date: "2026-01-12", type: "SEO", status: "Published" },
  { id: 6, title: "PM: Neue Förderungen", date: "2026-01-15", type: "PR", status: "Sent" },
  { id: 7, title: "USV für Homeoffice", date: "2026-01-19", type: "SEO", status: "Review" },
  { id: 8, title: "B2B-Newsletter", date: "2026-01-21", type: "Newsletter", status: "Draft" },
  { id: 9, title: "Autarkie-Rechner Launch", date: "2026-01-26", type: "Product", status: "Dev" },
  { id: 10, title: "Solar im Winter", date: "2026-02-02", type: "SEO", status: "Planned" },
  { id: 11, title: "Blackout-Vorsorge Video", date: "2026-02-15", type: "Social", status: "Planned" },
];

const eventTypes = {
  SEO: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  SEA: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  Social: "bg-pink-500/20 text-pink-500 border-pink-500/30",
  Newsletter: "bg-orange-500/20 text-orange-500 border-orange-500/30",
  PR: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
  Product: "bg-slate-500/20 text-slate-500 border-slate-500/30",
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = Jan 2026
  const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  
  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay(); // 0 = Sun

  const renderCalendarDays = () => {
    const year = 2026;
    const totalDays = daysInMonth(currentMonth, year);
    const startDay = firstDayOfMonth(currentMonth, year) || 7; // Adjust for Mon start (1) to Sun (7)
    const days = [];

    // Empty cells for previous month
    for (let i = 1; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border border-border/50 bg-muted/20" />);
    }

    // Days of current month
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `2026-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);

      days.push(
        <div key={day} className="h-32 border border-border/50 p-2 hover:bg-muted/30 transition-colors relative group">
          <span className={cn(
            "text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full mb-1",
            dateStr === "2026-01-16" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}>
            {day}
          </span>
          <div className="space-y-1 overflow-y-auto max-h-[80px] no-scrollbar">
            {dayEvents.map(event => (
              <div 
                key={event.id} 
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded border truncate cursor-pointer hover:opacity-80",
                  eventTypes[event.type as keyof typeof eventTypes]
                )}
              >
                {event.title}
              </div>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute bottom-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    return days;
  };

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
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Neuer Eintrag
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Kalenderansicht</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs">Monat</Button>
                <Button variant="ghost" size="sm" className="text-xs">Woche</Button>
                <Button variant="ghost" size="sm" className="text-xs">Liste</Button>
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
                <CardTitle className="text-sm">Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Kanal</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(eventTypes).map(type => (
                      <Badge 
                        key={type} 
                        variant="outline" 
                        className={cn("cursor-pointer hover:bg-muted", eventTypes[type as keyof typeof eventTypes])}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Status wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      <SelectItem value="planned">Geplant</SelectItem>
                      <SelectItem value="active">Aktiv</SelectItem>
                      <SelectItem value="done">Erledigt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Nächste Meilensteine</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {[
                      { title: "Q1 Review", date: "31. Mär", days: 74 },
                      { title: "Sommer-Kampagne Start", date: "01. Mai", days: 105 },
                      { title: "Black Friday Prep", date: "01. Okt", days: 258 },
                      { title: "Jahresabschluss", date: "15. Dez", days: 333 },
                    ].map((milestone, i) => (
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
