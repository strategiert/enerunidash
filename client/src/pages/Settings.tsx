import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Globe, Lock, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Einstellungen</h2>
          <p className="text-muted-foreground mt-1">Verwalten Sie Ihre Dashboard-Präferenzen und Account-Daten</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-64 shrink-0">
              <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-1">
                <TabsTrigger value="general" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
                  <User className="h-4 w-4" /> Allgemein
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
                  <Bell className="h-4 w-4" /> Benachrichtigungen
                </TabsTrigger>
                <TabsTrigger value="integrations" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
                  <Globe className="h-4 w-4" /> Integrationen
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
                  <Lock className="h-4 w-4" /> Sicherheit
                </TabsTrigger>
              </TabsList>
            </aside>
            
            <div className="flex-1">
              <TabsContent value="general" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profil</CardTitle>
                    <CardDescription>Ihre persönlichen Informationen</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue="Max Mustermann" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue="max@enerunity.de" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Ansicht</CardTitle>
                    <CardDescription>Passen Sie das Erscheinungsbild an</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Dark Mode erzwingen</Label>
                        <p className="text-sm text-muted-foreground">Immer das dunkle Theme verwenden</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Kompakte Ansicht</Label>
                        <p className="text-sm text-muted-foreground">Mehr Daten auf weniger Platz</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Benachrichtigungen</CardTitle>
                    <CardDescription>Wann sollen wir Sie informieren?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Wöchentlicher Report</Label>
                        <p className="text-sm text-muted-foreground">Zusammenfassung der KPIs per Email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Budget Warnungen</Label>
                        <p className="text-sm text-muted-foreground">Wenn 80% des Budgets verbraucht sind</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Neue Keyword Rankings</Label>
                        <p className="text-sm text-muted-foreground">Bei signifikanten Positionsänderungen</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
