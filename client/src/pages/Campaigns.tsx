import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, BarChart3, Calendar, DollarSign, Megaphone, MousePointerClick, Plus, Target } from "lucide-react";

const activeCampaigns = [
  {
    id: 1,
    name: "Winterstrom & Sicherheit",
    status: "Active",
    channel: "Multi-Channel",
    budget: 15000,
    spent: 8500,
    roas: 4.5,
    conversions: 320,
    progress: 65,
    startDate: "01. Jan",
    endDate: "28. Feb"
  },
  {
    id: 2,
    name: "B2B USV Offensive",
    status: "Active",
    channel: "LinkedIn / SEA",
    budget: 8000,
    spent: 2100,
    roas: 3.2,
    conversions: 45,
    progress: 25,
    startDate: "15. Jan",
    endDate: "31. Mär"
  },
  {
    id: 3,
    name: "Autarkie-Rechner Launch",
    status: "Planned",
    channel: "Social / Email",
    budget: 5000,
    spent: 0,
    roas: 0,
    conversions: 0,
    progress: 0,
    startDate: "01. Feb",
    endDate: "15. Mär"
  }
];

export default function CampaignsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Kampagnen</h2>
            <p className="text-muted-foreground mt-1">Verwaltung und Performance aller aktiven Marketing-Kampagnen</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Neue Kampagne
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktives Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€28,000</div>
              <p className="text-xs text-muted-foreground mt-1">für Q1 2026</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamt ROAS</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.1x</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" /> +0.2
                </span>
                vs. Ziel (4.0x)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktive Kampagnen</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-1">1 weitere geplant</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Aktiv</TabsTrigger>
            <TabsTrigger value="planned">Geplant</TabsTrigger>
            <TabsTrigger value="ended">Beendet</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4 space-y-4">
            {activeCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{campaign.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="secondary">{campaign.channel}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {campaign.startDate} - {campaign.endDate}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant={campaign.status === "Active" ? "default" : "outline"} className={campaign.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6 mb-6">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Budget Ausnutzung</span>
                      <div className="text-lg font-bold">€{campaign.spent.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ €{campaign.budget.toLocaleString()}</span></div>
                      <Progress value={(campaign.spent / campaign.budget) * 100} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">ROAS</span>
                      <div className="text-lg font-bold flex items-center gap-2">
                        {campaign.roas > 0 ? `${campaign.roas}x` : "-"}
                        {campaign.roas >= 4 && <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-500 h-4 px-1">Top</Badge>}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Conversions</span>
                      <div className="text-lg font-bold">{campaign.conversions > 0 ? campaign.conversions : "-"}</div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="mr-2 h-3 w-3" /> Details
                      </Button>
                      <Button size="sm">
                        <Calendar className="mr-2 h-3 w-3" /> Editieren
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
