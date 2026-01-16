import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { ArrowLeft, BookOpen, FileText, Search, TrendingUp, Video } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ClusterDetailPage() {
  const params = useParams();
  const clusterName = decodeURIComponent(params.cluster || "");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");

  const clusterDetail = useQuery(api.keywords.getClusterDetail, { cluster: clusterName });

  const filteredContent = useMemo(() => {
    if (!clusterDetail?.contentPieces) return [];

    let filtered = [...clusterDetail.contentPieces];

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

    return filtered;
  }, [clusterDetail?.contentPieces, searchTerm, statusFilter, channelFilter]);

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

  if (!clusterDetail) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Lade Cluster-Daten...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/keywords">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h2 className="text-3xl font-bold tracking-tight">{clusterName}</h2>
            <p className="text-muted-foreground mt-1">
              {clusterDetail.stats.keywordCount} Keywords, {clusterDetail.stats.contentCount} Content Pieces
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Keywords</CardDescription>
              <CardTitle className="text-2xl">{clusterDetail.stats.keywordCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Content Pieces</CardDescription>
              <CardTitle className="text-2xl">{clusterDetail.stats.contentCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Veroeffentlicht</CardDescription>
              <CardTitle className="text-2xl text-emerald-500">{clusterDetail.stats.publishedCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Suchvolumen</CardDescription>
              <CardTitle className="text-2xl">{clusterDetail.stats.totalVolume.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Schwierigkeit</CardDescription>
              <CardTitle className="text-2xl">{clusterDetail.stats.avgDifficulty}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Keywords List */}
        <Card>
          <CardHeader>
            <CardTitle>Keywords in diesem Cluster</CardTitle>
            <CardDescription>Nach Priority Score sortiert</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {clusterDetail.keywords.map((keyword) => (
                <Badge
                  key={keyword._id}
                  variant="outline"
                  className={cn(
                    "text-sm py-1.5 px-3",
                    keyword.priorityScore >= 90 ? "border-emerald-500 text-emerald-500" :
                    keyword.priorityScore >= 50 ? "border-blue-500 text-blue-500" : ""
                  )}
                >
                  <TrendingUp className="h-3 w-3 mr-1.5" />
                  {keyword.keyword}
                  <span className="ml-2 text-muted-foreground text-xs">
                    ({keyword.volume.toLocaleString()})
                  </span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Pieces */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Content Pieces</CardTitle>
                <CardDescription>Alle Inhalte die Keywords aus diesem Cluster targeten</CardDescription>
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredContent.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {clusterDetail.contentPieces.length === 0
                  ? "Keine Content Pieces in diesem Cluster vorhanden"
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
