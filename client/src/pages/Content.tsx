import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { BookOpen, CheckCircle2, Clock, FileText, Video } from "lucide-react";

const contentPillars = [
  {
    title: "USV & Notstrom",
    description: "Differenzierung & USP",
    progress: 15,
    color: "bg-emerald-500",
    items: [
      { title: "Pillar Page: Solaranlage mit USV", type: "Blog", status: "In Progress" },
      { title: "Video: Was passiert bei Stromausfall?", type: "Video", status: "Planned" },
      { title: "Infografik: USV vs. Generator", type: "Visual", status: "Planned" },
    ]
  },
  {
    title: "Autarkie & Unabhängigkeit",
    description: "Emotionale Ansprache",
    progress: 5,
    color: "bg-blue-500",
    items: [
      { title: "Rechner: Autarkiegrad berechnen", type: "Tool", status: "Dev" },
      { title: "Blog-Serie: Weg zur Unabhängigkeit", type: "Blog", status: "Planned" },
      { title: "Video: 100% autark – geht das?", type: "Video", status: "Planned" },
    ]
  },
  {
    title: "Speicher & Batterie",
    description: "Technische Beratung",
    progress: 0,
    color: "bg-purple-500",
    items: [
      { title: "Stromspeicher Wirtschaftlichkeit", type: "Blog", status: "Planned" },
      { title: "Heimspeicher selber bauen", type: "Video", status: "Planned" },
      { title: "Batteriespeicher Vergleich 2026", type: "Blog", status: "Planned" },
    ]
  },
  {
    title: "Balkonkraftwerk Basics",
    description: "Traffic & Awareness",
    progress: 30,
    color: "bg-amber-500",
    items: [
      { title: "Förderung 2026 Übersicht", type: "Blog", status: "Published" },
      { title: "Montageanleitung Flachdach", type: "Video", status: "Published" },
      { title: "Anmeldung beim Netzbetreiber", type: "Blog", status: "Review" },
    ]
  }
];

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
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Content Strategie</h2>
            <p className="text-muted-foreground mt-1">Planung und Status der 4 strategischen Säulen</p>
          </div>
          <Button>
            <FileText className="mr-2 h-4 w-4" /> Neues Content-Piece
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {contentPillars.map((pillar) => (
            <Card key={pillar.title} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{pillar.title}</CardTitle>
                <CardDescription>{pillar.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Fortschritt</span>
                    <span>{pillar.progress}%</span>
                  </div>
                  <Progress value={pillar.progress} className={cn("h-2", pillar.color.replace("bg-", "text-"))} indicatorClassName={pillar.color} />
                </div>
                <div className="space-y-3 mt-2">
                  {pillar.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                      {item.type === "Video" ? <Video className="h-4 w-4 mt-0.5 text-muted-foreground" /> : 
                       item.type === "Tool" ? <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" /> :
                       <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground" />}
                      <div className="flex-1">
                        <div className="font-medium leading-tight">{item.title}</div>
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
                </div>
              </CardContent>
            </Card>
          ))}
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
                          <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                            Details planen
                          </Button>
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
