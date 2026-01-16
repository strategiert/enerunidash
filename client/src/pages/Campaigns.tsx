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
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { ArrowUpRight, BarChart3, Calendar, DollarSign, Edit, Megaphone, MousePointerClick, Plus, Target, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";

export default function CampaignsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("active");

  // Convex Queries
  const allCampaigns = useQuery(api.campaigns.list, {});
  const campaignStats = useQuery(api.campaigns.getStats, {});

  // Convex Mutations
  const addCampaign = useMutation(api.campaigns.add);
  const updateCampaign = useMutation(api.campaigns.update);
  const removeCampaign = useMutation(api.campaigns.remove);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    status: "Planned" as const,
    channel: "",
    budget: 5000,
    spent: 0,
    roas: 0,
    conversions: 0,
    clicks: 0,
    impressions: 0,
    startDate: "",
    endDate: "",
    targetAudience: "",
    goals: [] as string[],
  });

  // Filtered campaigns by status
  const filteredCampaigns = useMemo(() => {
    if (!allCampaigns) return [];

    if (activeTab === "active") {
      return allCampaigns.filter(c => c.status === "Active");
    } else if (activeTab === "planned") {
      return allCampaigns.filter(c => c.status === "Planned");
    } else if (activeTab === "ended") {
      return allCampaigns.filter(c => c.status === "Ended" || c.status === "Paused");
    }
    return allCampaigns;
  }, [allCampaigns, activeTab]);

  const handleEdit = (campaign: any) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      status: campaign.status,
      channel: campaign.channel,
      budget: campaign.budget,
      spent: campaign.spent,
      roas: campaign.roas,
      conversions: campaign.conversions,
      clicks: campaign.clicks,
      impressions: campaign.impressions,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      targetAudience: campaign.targetAudience,
      goals: campaign.goals,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    const campaignData = {
      ...formData,
      goals: formData.goals.length > 0 ? formData.goals : ["Brand Awareness"],
    };

    if (editingCampaign) {
      await updateCampaign({
        id: editingCampaign._id,
        ...campaignData,
      });
    } else {
      await addCampaign(campaignData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: any) => {
    if (confirm("Möchten Sie diese Kampagne wirklich löschen?")) {
      await removeCampaign({ id });
    }
  };

  const resetForm = () => {
    setEditingCampaign(null);
    setFormData({
      name: "",
      status: "Planned",
      channel: "",
      budget: 5000,
      spent: 0,
      roas: 0,
      conversions: 0,
      clicks: 0,
      impressions: 0,
      startDate: "",
      endDate: "",
      targetAudience: "",
      goals: [],
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Kampagnen</h2>
            <p className="text-muted-foreground mt-1">
              Verwaltung und Performance aller Marketing-Kampagnen
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Neue Kampagne
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingCampaign ? "Kampagne bearbeiten" : "Neue Kampagne erstellen"}</DialogTitle>
                <DialogDescription>
                  Erstellen oder bearbeiten Sie eine Marketing-Kampagne.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid gap-2">
                  <Label htmlFor="name">Kampagnenname</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="z.B. Winterstrom & Sicherheit"
                  />
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
                        <SelectItem value="Active">Aktiv</SelectItem>
                        <SelectItem value="Paused">Pausiert</SelectItem>
                        <SelectItem value="Ended">Beendet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="channel">Kanal</Label>
                    <Input
                      id="channel"
                      value={formData.channel}
                      onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                      placeholder="z.B. Google Ads, Meta"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Startdatum</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">Enddatum</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Budget (EUR)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="spent">Ausgegeben (EUR)</Label>
                    <Input
                      id="spent"
                      type="number"
                      value={formData.spent}
                      onChange={(e) => setFormData({ ...formData, spent: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="roas">ROAS</Label>
                    <Input
                      id="roas"
                      type="number"
                      step="0.1"
                      value={formData.roas}
                      onChange={(e) => setFormData({ ...formData, roas: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="conversions">Conversions</Label>
                    <Input
                      id="conversions"
                      type="number"
                      value={formData.conversions}
                      onChange={(e) => setFormData({ ...formData, conversions: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clicks">Klicks</Label>
                    <Input
                      id="clicks"
                      type="number"
                      value={formData.clicks}
                      onChange={(e) => setFormData({ ...formData, clicks: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="targetAudience">Zielgruppe</Label>
                  <Input
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="z.B. Sicherheitsbewusste Hausbesitzer"
                  />
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                {editingCampaign && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDelete(editingCampaign._id);
                      setIsDialogOpen(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Löschen
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Abbrechen</Button>
                  <Button onClick={handleSubmit}>{editingCampaign ? "Speichern" : "Erstellen"}</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktives Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaignStats ? `€${campaignStats.totalBudget.toLocaleString()}` : "..."}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                €{campaignStats?.totalSpent.toLocaleString() || 0} ausgegeben ({campaignStats?.budgetUtilization || 0}%)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamt ROAS</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaignStats ? `${campaignStats.overallRoas}x` : "..."}
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" /> Ziel: 4.0x
                </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktive Kampagnen</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaignStats?.activeCampaigns || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {campaignStats?.plannedCampaigns || 0} weitere geplant
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="active">Aktiv</TabsTrigger>
            <TabsTrigger value="planned">Geplant</TabsTrigger>
            <TabsTrigger value="ended">Beendet</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4 space-y-4">
            {filteredCampaigns.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  {allCampaigns === undefined ? "Lade Kampagnen..." : "Keine Kampagnen in dieser Kategorie"}
                </CardContent>
              </Card>
            ) : (
              filteredCampaigns.map((campaign) => (
                <Card key={campaign._id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{campaign.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="secondary">{campaign.channel}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(campaign.startDate).toLocaleDateString('de-DE')} - {new Date(campaign.endDate).toLocaleDateString('de-DE')}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge
                        variant={campaign.status === "Active" ? "default" : "outline"}
                        className={campaign.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                      >
                        {campaign.status === "Active" ? "Aktiv" :
                          campaign.status === "Planned" ? "Geplant" :
                            campaign.status === "Paused" ? "Pausiert" : "Beendet"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-5 gap-6 mb-4">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Budget</span>
                        <div className="text-lg font-bold">
                          €{campaign.spent.toLocaleString()}
                          <span className="text-xs font-normal text-muted-foreground"> / €{campaign.budget.toLocaleString()}</span>
                        </div>
                        <Progress value={(campaign.spent / campaign.budget) * 100} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">ROAS</span>
                        <div className="text-lg font-bold flex items-center gap-2">
                          {campaign.roas > 0 ? `${campaign.roas}x` : "-"}
                          {campaign.roas >= 4 && (
                            <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-500 h-4 px-1">Top</Badge>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Conversions</span>
                        <div className="text-lg font-bold">{campaign.conversions > 0 ? campaign.conversions : "-"}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Klicks</span>
                        <div className="text-lg font-bold">{campaign.clicks > 0 ? campaign.clicks.toLocaleString() : "-"}</div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(campaign)}>
                          <Edit className="mr-2 h-3 w-3" /> Bearbeiten
                        </Button>
                      </div>
                    </div>
                    {campaign.targetAudience && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Zielgruppe:</span> {campaign.targetAudience}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
