import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { ArrowLeft, BookOpen, FileText, Search, Video } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState, useMemo } from "react";

export default function PillarDetailPage() {
  const params = useParams();
  const pillarId = params.pillarId as Id<"contentPillars">;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");

  const pillarDetail = useQuery(api.contentPieces.getPillarDetail, { pillarId });

  const filteredContent = useMemo(() => {
    if (!pillarDetail?.pieces) return [];

    let filtered = [...pillarDetail.pieces];

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (channelFilter !== "all") {
      filtered = filtered.filter(c => c.channel === channelFilter);
    }

    if (contentTypeFilter !== "all") {
      filtered = filtered.filter(c => c.contentType === contentTypeFilter);
    }

    return filtered;
  }, [pillarDetail?.pieces, searchTerm, statusFilter, channelFilter, contentTypeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-emerald-500/20 text-emerald-500";
      case "In Progress": return "bg-blue-500/20 text-blue-500";
      case "Review": return "bg-amber-500/20 text-amber-500";
      case "Scheduled": return "bg-purple-500/20 text-purple-500";
      case "Draft": return "bg-slate-500/20 text-slate-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "Video": return <Video className="h-4 w-4" />;
      case "Blog": return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (!pillarDetail) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Lade Pillar-Daten...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/content">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">{pillarDetail.title}</h2>
              <Badge variant={pillarDetail.priority === "HOCH" ? "default" : "secondary"}>
                {pillarDetail.priority}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{pillarDetail.description}</p>
          </div>
        </div>

        {/* Progress Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fortschritt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Progress value={pillarDetail.stats.progress} className="flex-1 h-3" />
                <span className="text-2xl font-bold">{pillarDetail.stats.progress}%</span>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Ziel: </span>
                  <span className="font-medium">{pillarDetail.targetCount} Pieces</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Veroeffentlicht: </span>
                  <span className="font-medium text-emerald-500">{pillarDetail.stats.published}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">In Arbeit: </span>
                  <span className="font-medium text-blue-500">{pillarDetail.stats.inProgress}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Geplant: </span>
                  <span className="font-medium">{pillarDetail.stats.planned}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Gesamt</CardDescription>
              <CardTitle className="text-2xl">{pillarDetail.stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Veroeffentlicht</CardDescription>
              <CardTitle className="text-2xl text-emerald-500">{pillarDetail.stats.published}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>In Arbeit</CardDescription>
              <CardTitle className="text-2xl text-blue-500">{pillarDetail.stats.inProgress}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Geplant</CardDescription>
              <CardTitle className="text-2xl">{pillarDetail.stats.planned}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Distribution Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nach Kanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(pillarDetail.stats.byChannel).map(([channel, count]) => (
                  <Badge key={channel} variant="outline" className="text-sm py-1.5 px-3">
                    {channel}: {count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nach Content-Typ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(pillarDetail.stats.byContentType).map(([type, count]) => (
                  <Badge key={type} variant="outline" className="text-sm py-1.5 px-3">
                    {type}: {count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Pieces Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Content Pieces</CardTitle>
                <CardDescription>Alle Inhalte dieser Content-Saeule</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Content suchen..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Planned">Planned</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Kanal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Kanale</SelectItem>
                    <SelectItem value="SEO">SEO</SelectItem>
                    <SelectItem value="SEA">SEA</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Typen</SelectItem>
                    <SelectItem value="Blog">Blog</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Tool">Tool</SelectItem>
                    <SelectItem value="Pillar Page">Pillar Page</SelectItem>
                    <SelectItem value="Social Post">Social Post</SelectItem>
                    <SelectItem value="Newsletter">Newsletter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredContent.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {pillarDetail.pieces.length === 0
                  ? "Keine Content Pieces in diesem Pillar vorhanden"
                  : "Keine Content Pieces gefunden"}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[400px]">Titel</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Kanal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Journey Phase</TableHead>
                    <TableHead>Datum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.map((content) => (
                    <TableRow key={content._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {getContentIcon(content.contentType)}
                          </span>
                          <span className="font-medium">{content.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {content.contentType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{content.channel}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", getStatusColor(content.status))}>
                          {content.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {content.journeyPhase}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(content.publishDate).toLocaleDateString("de-DE")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
