import { mutation } from "./_generated/server";

// Seed-Funktion zum Befüllen der Datenbank mit Anfangsdaten
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Prüfen ob bereits Daten vorhanden sind
    const existingKeywords = await ctx.db.query("keywords").first();
    if (existingKeywords) {
      return { message: "Database already seeded", seeded: false };
    }

    // ============ KEYWORDS SEEDEN ============
    const keywordsData = [
      // USV & Notstrom (Höchste Priorität - USP von enerunity)
      { keyword: "Balkonkraftwerk bei Stromausfall", cluster: "USV & Notstrom", journeyPhase: "Awareness" as const, volume: 2400, difficulty: 35, priorityScore: 130, hasContent: false },
      { keyword: "Notstromaggregat für Einfamilienhaus", cluster: "USV & Notstrom", journeyPhase: "Consideration" as const, volume: 5400, difficulty: 45, priorityScore: 90, hasContent: false },
      { keyword: "USV Solaranlage", cluster: "USV & Notstrom", journeyPhase: "Decision" as const, volume: 880, difficulty: 25, priorityScore: 90, hasContent: false },
      { keyword: "Solar Notstrom Testsieger", cluster: "USV & Notstrom", journeyPhase: "Decision" as const, volume: 720, difficulty: 40, priorityScore: 85, hasContent: false },
      { keyword: "Notstromaggregat für Heizung", cluster: "USV & Notstrom", journeyPhase: "Awareness" as const, volume: 2900, difficulty: 40, priorityScore: 70, hasContent: false },
      { keyword: "Notstromaggregat solar sinnvoll", cluster: "USV & Notstrom", journeyPhase: "Consideration" as const, volume: 590, difficulty: 30, priorityScore: 65, hasContent: false },
      { keyword: "Stromausfall Vorbereitung", cluster: "USV & Notstrom", journeyPhase: "Awareness" as const, volume: 8100, difficulty: 50, priorityScore: 55, hasContent: false },

      // Autarkie
      { keyword: "komplett autarke Stromversorgung Einfamilienhaus", cluster: "Autarkie", journeyPhase: "Awareness" as const, volume: 1900, difficulty: 55, priorityScore: 65, hasContent: false },
      { keyword: "Energieunabhängigkeit", cluster: "Autarkie", journeyPhase: "Awareness" as const, volume: 1600, difficulty: 45, priorityScore: 60, hasContent: false },
      { keyword: "Balkonkraftwerk autark betreiben", cluster: "Autarkie", journeyPhase: "Action" as const, volume: 320, difficulty: 25, priorityScore: 55, hasContent: false },
      { keyword: "Insellösung Photovoltaik", cluster: "Autarkie", journeyPhase: "Awareness" as const, volume: 2900, difficulty: 40, priorityScore: 50, hasContent: false },
      { keyword: "Stromautark werden", cluster: "Autarkie", journeyPhase: "Awareness" as const, volume: 880, difficulty: 35, priorityScore: 45, hasContent: false },
      { keyword: "Solaranlage autark", cluster: "Autarkie", journeyPhase: "Consideration" as const, volume: 590, difficulty: 30, priorityScore: 40, hasContent: false },
      { keyword: "selber Strom erzeugen", cluster: "Autarkie", journeyPhase: "Awareness" as const, volume: 3600, difficulty: 40, priorityScore: 35, hasContent: false },

      // Speicher & Batterie
      { keyword: "Stromspeicher Wirtschaftlichkeit", cluster: "Speicher & Batterie", journeyPhase: "Consideration" as const, volume: 1300, difficulty: 45, priorityScore: 55, hasContent: false },
      { keyword: "Heimspeicher selber bauen", cluster: "Speicher & Batterie", journeyPhase: "Action" as const, volume: 880, difficulty: 50, priorityScore: 50, hasContent: false },
      { keyword: "Stromspeicher 10 kWh", cluster: "Speicher & Batterie", journeyPhase: "Decision" as const, volume: 2400, difficulty: 45, priorityScore: 45, hasContent: false },
      { keyword: "Stromspeicher 30 kWh Preis", cluster: "Speicher & Batterie", journeyPhase: "Decision" as const, volume: 480, difficulty: 35, priorityScore: 40, hasContent: false },
      { keyword: "welcher Stromspeicher ist der beste", cluster: "Speicher & Batterie", journeyPhase: "Decision" as const, volume: 1600, difficulty: 50, priorityScore: 40, hasContent: false },

      // Balkonkraftwerk Basics
      { keyword: "Balkonkraftwerk Förderung 2026", cluster: "Balkonkraftwerk Basics", journeyPhase: "Decision" as const, volume: 22200, difficulty: 55, priorityScore: 35, hasContent: true, contentType: "Blog" },
      { keyword: "Balkonkraftwerk Testsieger", cluster: "Balkonkraftwerk Basics", journeyPhase: "Decision" as const, volume: 14800, difficulty: 60, priorityScore: 35, hasContent: false },
      { keyword: "bestes Balkonkraftwerk", cluster: "Balkonkraftwerk Basics", journeyPhase: "Decision" as const, volume: 9900, difficulty: 55, priorityScore: 35, hasContent: false },
      { keyword: "Balkonkraftwerk mit Speicher", cluster: "Balkonkraftwerk Basics", journeyPhase: "Consideration" as const, volume: 12100, difficulty: 50, priorityScore: 65, hasContent: false },
      { keyword: "wie funktioniert ein Balkonkraftwerk", cluster: "Balkonkraftwerk Basics", journeyPhase: "Awareness" as const, volume: 8100, difficulty: 40, priorityScore: 25, hasContent: false },
      { keyword: "Balkonkraftwerk Ertrag Winter", cluster: "Balkonkraftwerk Basics", journeyPhase: "Consideration" as const, volume: 6600, difficulty: 40, priorityScore: 30, hasContent: false },

      // Watt & Leistung
      { keyword: "wieviel Watt darf ein Balkonkraftwerk haben 2026", cluster: "Watt & Leistung", journeyPhase: "Awareness" as const, volume: 33100, difficulty: 45, priorityScore: 35, hasContent: false },
      { keyword: "Balkonkraftwerk 2000 Watt erlaubt", cluster: "Watt & Leistung", journeyPhase: "Awareness" as const, volume: 8100, difficulty: 40, priorityScore: 35, hasContent: false },
      { keyword: "Balkonkraftwerk 800 Watt erlaubt", cluster: "Watt & Leistung", journeyPhase: "Awareness" as const, volume: 12100, difficulty: 40, priorityScore: 30, hasContent: false },
      { keyword: "was kann ich mit 600 Watt betreiben", cluster: "Watt & Leistung", journeyPhase: "Awareness" as const, volume: 2400, difficulty: 30, priorityScore: 25, hasContent: false },

      // Montage & Installation
      { keyword: "Balkonkraftwerk Flachdach", cluster: "Montage & Installation", journeyPhase: "Consideration" as const, volume: 4400, difficulty: 40, priorityScore: 30, hasContent: false },
      { keyword: "Balkonkraftwerk auf Garage", cluster: "Montage & Installation", journeyPhase: "Consideration" as const, volume: 2900, difficulty: 35, priorityScore: 28, hasContent: false },
      { keyword: "Balkonkraftwerk Montageanleitung", cluster: "Montage & Installation", journeyPhase: "Action" as const, volume: 1900, difficulty: 30, priorityScore: 25, hasContent: true, contentType: "Video" },
      { keyword: "Balkonkraftwerk Winkel", cluster: "Montage & Installation", journeyPhase: "Action" as const, volume: 3600, difficulty: 35, priorityScore: 25, hasContent: false },

      // Förderung & Rechtliches
      { keyword: "Balkonkraftwerk Förderung Bayern", cluster: "Förderung & Rechtliches", journeyPhase: "Decision" as const, volume: 6600, difficulty: 45, priorityScore: 30, hasContent: false },
      { keyword: "Balkonkraftwerk Förderung NRW", cluster: "Förderung & Rechtliches", journeyPhase: "Decision" as const, volume: 4400, difficulty: 45, priorityScore: 30, hasContent: false },
      { keyword: "Balkonkraftwerk neues Gesetz 2026", cluster: "Förderung & Rechtliches", journeyPhase: "Awareness" as const, volume: 8100, difficulty: 40, priorityScore: 30, hasContent: false },
      { keyword: "Balkonkraftwerk nicht angemeldet Strafe", cluster: "Förderung & Rechtliches", journeyPhase: "Awareness" as const, volume: 3600, difficulty: 35, priorityScore: 28, hasContent: false },

      // Wechselrichter
      { keyword: "Wechselrichter Vergleich 2026", cluster: "Wechselrichter", journeyPhase: "Decision" as const, volume: 2400, difficulty: 45, priorityScore: 30, hasContent: false },
      { keyword: "bester Wechselrichter 800 Watt", cluster: "Wechselrichter", journeyPhase: "Decision" as const, volume: 1600, difficulty: 40, priorityScore: 28, hasContent: false },
      { keyword: "Hoymiles oder APSystems", cluster: "Wechselrichter", journeyPhase: "Decision" as const, volume: 1300, difficulty: 35, priorityScore: 25, hasContent: false },

      // Camping & Mobil
      { keyword: "Camping Solar Komplettanlage Test", cluster: "Camping & Mobil", journeyPhase: "Decision" as const, volume: 1600, difficulty: 45, priorityScore: 28, hasContent: false },
      { keyword: "Wohnmobil Solaranlage Test", cluster: "Camping & Mobil", journeyPhase: "Decision" as const, volume: 2400, difficulty: 45, priorityScore: 28, hasContent: false },
      { keyword: "tragbare Powerstation mit Solar", cluster: "Camping & Mobil", journeyPhase: "Decision" as const, volume: 1300, difficulty: 40, priorityScore: 25, hasContent: false },

      // Sonstiges
      { keyword: "Strompreisentwicklung bis 2035", cluster: "Sonstiges", journeyPhase: "Awareness" as const, volume: 4400, difficulty: 45, priorityScore: 25, hasContent: true, contentType: "Blog" },
      { keyword: "Stromkosten 2026", cluster: "Sonstiges", journeyPhase: "Awareness" as const, volume: 12100, difficulty: 50, priorityScore: 22, hasContent: false },
      { keyword: "Klimaanlage mit Balkonkraftwerk betreiben", cluster: "Sonstiges", journeyPhase: "Consideration" as const, volume: 1300, difficulty: 35, priorityScore: 28, hasContent: false },
    ];

    for (const kw of keywordsData) {
      await ctx.db.insert("keywords", kw);
    }

    // ============ CALENDAR EVENTS SEEDEN ============
    const eventsData = [
      // Januar 2026
      { title: "Strompreisentwicklung 2026", date: "2026-01-05", type: "SEO" as const, status: "Published" as const, description: "Blog Post über erwartete Strompreisentwicklung" },
      { title: "Neujahrs-Newsletter", date: "2026-01-07", type: "Newsletter" as const, status: "Sent" as const },
      { title: "Video: Stromkosten senken in 2026", date: "2026-01-08", type: "Social" as const, status: "Published" as const },
      { title: "Brand-Kampagne Start", date: "2026-01-10", type: "SEA" as const, status: "Active" as const },
      { title: "Balkonkraftwerk Förderung 2026 Übersicht", date: "2026-01-12", type: "SEO" as const, status: "Published" as const },
      { title: "Video: Förderungen nutzen", date: "2026-01-14", type: "Social" as const, status: "Published" as const },
      { title: "PM: Neue Förderungen 2026", date: "2026-01-15", type: "PR" as const, status: "Sent" as const },
      { title: "USV für Homeoffice", date: "2026-01-19", type: "SEO" as const, status: "Review" as const },
      { title: "Video: Nie wieder Stromausfall im Homeoffice", date: "2026-01-20", type: "Social" as const, status: "Draft" as const },
      { title: "B2B-Newsletter", date: "2026-01-21", type: "Newsletter" as const, status: "Draft" as const },
      { title: "Autarkiegrad berechnen", date: "2026-01-26", type: "SEO" as const, status: "Dev" as const },
      { title: "Video: Wie autark bist du?", date: "2026-01-27", type: "Social" as const, status: "Planned" as const },

      // Februar 2026
      { title: "Balkonkraftwerk Ertrag Winter", date: "2026-02-02", type: "SEO" as const, status: "Planned" as const },
      { title: "Video: Solar im Winter - lohnt sich das?", date: "2026-02-03", type: "Social" as const, status: "Planned" as const },
      { title: "Notstromaggregat vs. USV-Speicher", date: "2026-02-09", type: "SEO" as const, status: "Planned" as const },
      { title: "Video: Generator oder Batterie?", date: "2026-02-10", type: "Social" as const, status: "Planned" as const },
      { title: "PM: USV-Innovation", date: "2026-02-11", type: "PR" as const, status: "Planned" as const },
      { title: "Stromausfall Vorbereitung 2026", date: "2026-02-16", type: "SEO" as const, status: "Planned" as const },
      { title: "Video: Blackout-Vorsorge", date: "2026-02-17", type: "Social" as const, status: "Planned" as const },
      { title: "Heizung bei Stromausfall", date: "2026-02-23", type: "SEO" as const, status: "Planned" as const },

      // März 2026
      { title: "Balkonkraftwerk Montage Anleitung", date: "2026-03-02", type: "SEO" as const, status: "Planned" as const },
      { title: "Video: DIY Montage in 30 Minuten", date: "2026-03-03", type: "Social" as const, status: "Planned" as const },
      { title: "Wechselrichter Vergleich 2026", date: "2026-03-09", type: "SEO" as const, status: "Planned" as const },
      { title: "PV-Anlage mit Speicher planen", date: "2026-03-16", type: "SEO" as const, status: "Planned" as const },
      { title: "PM: Frühjahrsaktion", date: "2026-03-18", type: "PR" as const, status: "Planned" as const },

      // April - Mai 2026
      { title: "Beste Solarmodule 2026", date: "2026-04-06", type: "SEO" as const, status: "Planned" as const },
      { title: "Balkonkraftwerk Flachdach", date: "2026-04-13", type: "SEO" as const, status: "Planned" as const },
      { title: "USV für Server & Rechenzentrum", date: "2026-04-20", type: "SEO" as const, status: "Planned" as const },
      { title: "Balkonkraftwerk 2000 Watt erlaubt?", date: "2026-05-04", type: "SEO" as const, status: "Planned" as const },
      { title: "Komplett autarke Stromversorgung", date: "2026-05-18", type: "SEO" as const, status: "Planned" as const },
      { title: "Balkonkraftwerk Testsieger 2026", date: "2026-05-25", type: "SEO" as const, status: "Planned" as const },

      // Juni - Dezember 2026 (ausgewählte Events)
      { title: "Klimaanlage mit Balkonkraftwerk", date: "2026-06-01", type: "SEO" as const, status: "Planned" as const },
      { title: "Camping Solaranlage Komplettset", date: "2026-06-15", type: "SEO" as const, status: "Planned" as const },
      { title: "Balkonkraftwerk Ertrag maximieren", date: "2026-07-06", type: "SEO" as const, status: "Planned" as const },
      { title: "USV für Gastronomie", date: "2026-07-13", type: "SEO" as const, status: "Planned" as const },
      { title: "Notstrom für medizinische Geräte", date: "2026-08-10", type: "SEO" as const, status: "Planned" as const },
      { title: "Stromspeicher Wirtschaftlichkeit", date: "2026-09-07", type: "SEO" as const, status: "Planned" as const },
      { title: "Strompreis Prognose 2027", date: "2026-10-12", type: "SEO" as const, status: "Planned" as const },
      { title: "Black Friday Solar Angebote", date: "2026-11-23", type: "SEO" as const, status: "Planned" as const },
      { title: "Ausblick Solar 2027", date: "2026-12-14", type: "SEO" as const, status: "Planned" as const },
    ];

    for (const event of eventsData) {
      await ctx.db.insert("calendarEvents", event);
    }

    // ============ CONTENT PILLARS SEEDEN ============
    const pillarsData = [
      { title: "USV & Notstrom", description: "Differenzierung & USP - Das Alleinstellungsmerkmal von enerunity", color: "emerald", priority: "HOCH" as const, targetKeywords: 11, completedKeywords: 2 },
      { title: "Autarkie & Unabhängigkeit", description: "Emotionale Ansprache - Für Menschen die unabhängig leben wollen", color: "blue", priority: "HOCH" as const, targetKeywords: 8, completedKeywords: 0 },
      { title: "Speicher & Batterie", description: "Technische Beratung - Für technikaffine Kunden", color: "purple", priority: "MITTEL" as const, targetKeywords: 30, completedKeywords: 0 },
      { title: "Balkonkraftwerk Basics", description: "Traffic & Awareness - Einstieg für Neukunden", color: "amber", priority: "MITTEL" as const, targetKeywords: 150, completedKeywords: 12 },
    ];

    for (const pillar of pillarsData) {
      await ctx.db.insert("contentPillars", pillar);
    }

    // ============ CONTENT ITEMS SEEDEN ============
    const contentItemsData = [
      // USV & Notstrom (pillarId: 1)
      { title: "Pillar Page: Kompletter Guide Solaranlage mit USV", pillarId: 1, type: "Pillar Page" as const, status: "In Progress" as const },
      { title: "Video-Serie: Was passiert bei Stromausfall?", pillarId: 1, type: "Video" as const, status: "Planned" as const },
      { title: "Infografik: USV vs. Generator vs. Batterie", pillarId: 1, type: "Infographic" as const, status: "Planned" as const },
      { title: "Blog: USV für Homeoffice", pillarId: 1, type: "Blog" as const, status: "Review" as const },

      // Autarkie (pillarId: 2)
      { title: "Rechner: Autarkiegrad berechnen", pillarId: 2, type: "Tool" as const, status: "In Progress" as const },
      { title: "Blog-Serie: Weg zur Energieunabhängigkeit", pillarId: 2, type: "Blog" as const, status: "Planned" as const },
      { title: "Video: 100% autark – geht das?", pillarId: 2, type: "Video" as const, status: "Planned" as const },

      // Speicher (pillarId: 3)
      { title: "Stromspeicher Wirtschaftlichkeit", pillarId: 3, type: "Blog" as const, status: "Planned" as const },
      { title: "Heimspeicher selber bauen", pillarId: 3, type: "Video" as const, status: "Planned" as const },
      { title: "ROI-Rechner: Lohnt sich ein Speicher?", pillarId: 3, type: "Tool" as const, status: "Planned" as const },

      // Balkonkraftwerk Basics (pillarId: 4)
      { title: "Förderung 2026 Übersicht", pillarId: 4, type: "Blog" as const, status: "Published" as const },
      { title: "Montageanleitung Flachdach", pillarId: 4, type: "Video" as const, status: "Published" as const },
      { title: "Anmeldung beim Netzbetreiber", pillarId: 4, type: "Blog" as const, status: "Review" as const },
      { title: "FAQ: Die 20 häufigsten Fragen", pillarId: 4, type: "Blog" as const, status: "Planned" as const },
    ];

    for (const item of contentItemsData) {
      await ctx.db.insert("contentItems", item);
    }

    // ============ CAMPAIGNS SEEDEN ============
    const campaignsData = [
      {
        name: "Winterstrom & Sicherheit",
        status: "Active" as const,
        channel: "Multi-Channel (Google Ads, Meta)",
        budget: 15000,
        spent: 8500,
        roas: 4.5,
        conversions: 320,
        clicks: 12500,
        impressions: 450000,
        startDate: "2026-01-01",
        endDate: "2026-02-28",
        targetAudience: "Sicherheitsbewusste Hausbesitzer",
        goals: ["Brand Awareness", "Lead Generation"],
      },
      {
        name: "B2B USV Offensive",
        status: "Active" as const,
        channel: "LinkedIn Ads, Google Ads",
        budget: 8000,
        spent: 2100,
        roas: 3.2,
        conversions: 45,
        clicks: 3200,
        impressions: 85000,
        startDate: "2026-01-15",
        endDate: "2026-03-31",
        targetAudience: "IT-Leiter, Facility Manager",
        goals: ["B2B Leads", "Demo Requests"],
      },
      {
        name: "Autarkie-Rechner Launch",
        status: "Planned" as const,
        channel: "Meta Ads, Email",
        budget: 5000,
        spent: 0,
        roas: 0,
        conversions: 0,
        clicks: 0,
        impressions: 0,
        startDate: "2026-02-01",
        endDate: "2026-03-15",
        targetAudience: "Autarkie-Interessierte",
        goals: ["Tool Usage", "Email Signups"],
      },
      {
        name: "Frühjahrs-Offensive",
        status: "Planned" as const,
        channel: "Multi-Channel",
        budget: 25000,
        spent: 0,
        roas: 0,
        conversions: 0,
        clicks: 0,
        impressions: 0,
        startDate: "2026-03-15",
        endDate: "2026-05-31",
        targetAudience: "Hausbesitzer, Gartenbesitzer",
        goals: ["Sales", "Brand Awareness"],
      },
    ];

    for (const campaign of campaignsData) {
      await ctx.db.insert("campaigns", campaign);
    }

    // ============ MONTHLY KPIs SEEDEN ============
    const kpisData = [
      { month: "Jan", year: 2026, revenue: 50000, target: 45000, conversions: 180, usvShare: 28, roas: 4.2, organicTraffic: 12000, paidTraffic: 8500 },
      { month: "Feb", year: 2026, revenue: 65000, target: 50000, conversions: 220, usvShare: 30, roas: 4.5, organicTraffic: 15000, paidTraffic: 10000 },
      { month: "Mär", year: 2026, revenue: 85000, target: 70000, conversions: 310, usvShare: 32, roas: 4.3, organicTraffic: 20000, paidTraffic: 14000 },
      { month: "Apr", year: 2026, revenue: 120000, target: 100000, conversions: 420, usvShare: 33, roas: 4.1, organicTraffic: 28000, paidTraffic: 22000 },
      { month: "Mai", year: 2026, revenue: 180000, target: 150000, conversions: 580, usvShare: 35, roas: 3.8, organicTraffic: 38000, paidTraffic: 35000 },
      { month: "Jun", year: 2026, revenue: 220000, target: 180000, conversions: 680, usvShare: 36, roas: 3.9, organicTraffic: 42000, paidTraffic: 40000 },
      { month: "Jul", year: 2026, revenue: 250000, target: 200000, conversions: 750, usvShare: 38, roas: 4.0, organicTraffic: 45000, paidTraffic: 42000 },
      { month: "Aug", year: 2026, revenue: 210000, target: 190000, conversions: 620, usvShare: 37, roas: 4.2, organicTraffic: 40000, paidTraffic: 35000 },
      { month: "Sep", year: 2026, revenue: 160000, target: 140000, conversions: 480, usvShare: 35, roas: 4.4, organicTraffic: 32000, paidTraffic: 25000 },
      { month: "Okt", year: 2026, revenue: 110000, target: 100000, conversions: 350, usvShare: 34, roas: 4.5, organicTraffic: 25000, paidTraffic: 18000 },
      { month: "Nov", year: 2026, revenue: 90000, target: 80000, conversions: 280, usvShare: 32, roas: 5.2, organicTraffic: 22000, paidTraffic: 20000 },
      { month: "Dez", year: 2026, revenue: 70000, target: 60000, conversions: 210, usvShare: 30, roas: 4.8, organicTraffic: 18000, paidTraffic: 12000 },
    ];

    for (const kpi of kpisData) {
      await ctx.db.insert("monthlyKPIs", kpi);
    }

    // ============ CHANNEL ATTRIBUTION SEEDEN ============
    const attributionData = [
      { name: "Referral", value: 4085476, percentage: 24, color: "var(--chart-1)", year: 2026 },
      { name: "Paid Search", value: 3502042, percentage: 20.5, color: "var(--chart-2)", year: 2026 },
      { name: "Direct", value: 2775280, percentage: 16.3, color: "var(--chart-3)", year: 2026 },
      { name: "Organic Search", value: 1727388, percentage: 10.1, color: "var(--chart-4)", year: 2026 },
      { name: "Cross-network", value: 1690871, percentage: 9.9, color: "var(--chart-5)", year: 2026 },
      { name: "Social", value: 86225, percentage: 0.5, color: "var(--accent)", year: 2026 },
    ];

    for (const attr of attributionData) {
      await ctx.db.insert("channelAttribution", attr);
    }

    // ============ INFOGRAPHICS SEEDEN ============
    const infographicsData = [
      { month: "Januar", title: "USV vs. Generator vs. Batterie", status: "Planned" as const, year: 2026 },
      { month: "Februar", title: "Förderungen nach Bundesland", status: "Planned" as const, year: 2026 },
      { month: "März", title: "Balkonkraftwerk Montageorte", status: "Planned" as const, year: 2026 },
      { month: "April", title: "Autarkiegrad-Rechner", status: "Planned" as const, year: 2026 },
      { month: "Mai", title: "Watt-Vergleich: Was kann ich betreiben?", status: "Planned" as const, year: 2026 },
      { month: "Juni", title: "Sommer-Ertrag maximieren", status: "Planned" as const, year: 2026 },
      { month: "Juli", title: "Camping-Solar Checkliste", status: "Planned" as const, year: 2026 },
      { month: "August", title: "USV für B2B: Einsatzbereiche", status: "Planned" as const, year: 2026 },
      { month: "September", title: "Herbst-Wintercheck", status: "Planned" as const, year: 2026 },
      { month: "Oktober", title: "Strompreis-Entwicklung", status: "Planned" as const, year: 2026 },
      { month: "November", title: "Black Friday Checkliste", status: "Planned" as const, year: 2026 },
      { month: "Dezember", title: "Jahresplanung Solar 2027", status: "Planned" as const, year: 2026 },
    ];

    for (const infographic of infographicsData) {
      await ctx.db.insert("infographics", infographic);
    }

    return {
      message: "Database seeded successfully",
      seeded: true,
      counts: {
        keywords: keywordsData.length,
        events: eventsData.length,
        pillars: pillarsData.length,
        contentItems: contentItemsData.length,
        campaigns: campaignsData.length,
        kpis: kpisData.length,
        attribution: attributionData.length,
        infographics: infographicsData.length,
      }
    };
  },
});

// Seed Q1 2026 detaillierter Content-Kalender (5 Posts/Woche)
export const seedQ1ContentCalendar = mutation({
  args: {},
  handler: async (ctx) => {
    // Q1 2026 Content-Kalender: 5 Posts pro Woche (Mo-Fr)
    const q1Events = [
      // KW 1 (6.-10. Jan)
      { title: "Strompreisentwicklung 2026: Was Hausbesitzer jetzt wissen müssen", date: "2026-01-06", type: "SEO" as const, status: "Planned" as const, description: "Deep-Dive Blog - Awareness" },
      { title: "Balkonkraftwerk installieren: Komplette Schritt-für-Schritt Anleitung", date: "2026-01-07", type: "SEO" as const, status: "Planned" as const, description: "How-To Tutorial - Action" },
      { title: "Balkonkraftwerk vs. PV-Anlage: Der ultimative Vergleich 2026", date: "2026-01-08", type: "SEO" as const, status: "Planned" as const, description: "Vergleich - Consideration" },
      { title: "Neue Solarförderungen 2026: Alle Programme im Überblick", date: "2026-01-09", type: "SEO" as const, status: "Planned" as const, description: "News - Awareness" },
      { title: "FAQ: Die 10 häufigsten Fragen zum Balkonkraftwerk beantwortet", date: "2026-01-10", type: "SEO" as const, status: "Planned" as const, description: "FAQ - Decision" },

      // KW 2 (13.-17. Jan)
      { title: "Stromausfall in Deutschland: So häufig passiert es wirklich", date: "2026-01-13", type: "SEO" as const, status: "Planned" as const, description: "Deep-Dive - Awareness (USP)" },
      { title: "Balkonkraftwerk beim Netzbetreiber anmelden: 5 einfache Schritte", date: "2026-01-14", type: "SEO" as const, status: "Planned" as const, description: "How-To - Action" },
      { title: "Hoymiles vs. APSystems: Welcher Wechselrichter ist besser?", date: "2026-01-15", type: "SEO" as const, status: "Planned" as const, description: "Vergleich - Consideration" },
      { title: "Balkonkraftwerk-Förderung Bayern 2026: Bis zu 500€ sichern", date: "2026-01-16", type: "SEO" as const, status: "Planned" as const, description: "News - Decision" },
      { title: "Lohnt sich ein Balkonkraftwerk mit Speicher? ROI-Berechnung", date: "2026-01-17", type: "SEO" as const, status: "Planned" as const, description: "FAQ/Analysis - Decision" },

      // KW 3 (20.-24. Jan)
      { title: "Notstromaggregat vs. USV-Speicher: Was ist die bessere Wahl?", date: "2026-01-20", type: "SEO" as const, status: "Planned" as const, description: "Deep-Dive - Awareness (USP)" },
      { title: "Balkonkraftwerk auf dem Flachdach montieren: So geht's", date: "2026-01-21", type: "SEO" as const, status: "Planned" as const, description: "How-To - Action" },
      { title: "Top 10 Balkonkraftwerke 2026: Testsieger im Vergleich", date: "2026-01-22", type: "SEO" as const, status: "Planned" as const, description: "Vergleich - Consideration" },
      { title: "Balkonkraftwerk-Förderung NRW: Aktuelle Programme & Anträge", date: "2026-01-23", type: "SEO" as const, status: "Planned" as const, description: "News - Decision" },
      { title: "Wieviel Watt darf ein Balkonkraftwerk haben? Rechtslage 2026", date: "2026-01-24", type: "SEO" as const, status: "Planned" as const, description: "FAQ - Awareness" },

      // KW 4 (27.-31. Jan)
      { title: "USV für Homeoffice: Nie wieder Datenverlust bei Stromausfall", date: "2026-01-27", type: "SEO" as const, status: "Planned" as const, description: "Deep-Dive - Awareness (USP)" },
      { title: "Balkonkraftwerk Ertrag messen: Apps und Tools im Überblick", date: "2026-01-28", type: "SEO" as const, status: "Planned" as const, description: "How-To - Action" },
      { title: "Stromspeicher 10 kWh: Die besten Modelle im Test 2026", date: "2026-01-29", type: "SEO" as const, status: "Planned" as const, description: "Vergleich - Consideration" },
      { title: "Solarpaket 2: Was ändert sich für Balkonkraftwerk-Besitzer?", date: "2026-01-30", type: "SEO" as const, status: "Planned" as const, description: "News - Awareness" },
      { title: "Balkonkraftwerk Amortisation: Wann rechnet sich die Investition?", date: "2026-01-31", type: "SEO" as const, status: "Planned" as const, description: "FAQ - Decision" },

      // KW 5 (3.-7. Feb)
      { title: "Autarke Stromversorgung: Der Weg zur Energieunabhängigkeit", date: "2026-02-03", type: "SEO" as const, status: "Planned" as const, description: "Deep-Dive - Awareness" },
      { title: "Microwechselrichter anschließen: Anleitung für Einsteiger", date: "2026-02-04", type: "SEO" as const, status: "Planned" as const, description: "How-To - Action" },
      { title: "Balkonkraftwerk 600W vs. 800W: Was ist besser?", date: "2026-02-05", type: "SEO" as const, status: "Planned" as const, description: "Vergleich - Consideration" },
      { title: "Balkonkraftwerk-Förderung Baden-Württemberg: So beantragen Sie", date: "2026-02-06", type: "SEO" as const, status: "Planned" as const, description: "News - Decision" },
      { title: "Was kann ich mit 600 Watt betreiben? Rechenbeispiele", date: "2026-02-07", type: "SEO" as const, status: "Planned" as const, description: "FAQ - Awareness" },

      // KW 6 (10.-14. Feb)
      { title: "Heizung bei Stromausfall: So bleiben Sie warm", date: "2026-02-10", type: "SEO" as const, status: "Planned" as const, description: "Deep-Dive - Awareness (USP)" },
      { title: "Balkonkraftwerk auf der Garage montieren: Genehmigung & Tipps", date: "2026-02-11", type: "SEO" as const, status: "Planned" as const, description: "How-To - Action" },
      { title: "EcoFlow vs. Anker vs. Bluetti: Powerstations im Vergleich", date: "2026-02-12", type: "SEO" as const, status: "Planned" as const, description: "Vergleich - Consideration" },
      { title: "Balkonkraftwerk-Förderung Brandenburg: Neues Programm 2026", date: "2026-02-13", type: "SEO" as const, status: "Planned" as const, description: "News - Decision" },
      { title: "Balkonkraftwerk nicht angemeldet: Droht wirklich Strafe?", date: "2026-02-14", type: "SEO" as const, status: "Planned" as const, description: "FAQ - Awareness" },

      // KW 7 (17.-21. Feb)
      { title: "Insellösung Photovoltaik: Komplett unabhängig vom Stromnetz", date: "2026-02-17", type: "SEO" as const, status: "Planned" as const, description: "Deep-Dive - Awareness" },
      { title: "Balkonkraftwerk Winkel einstellen: Optimale Ausrichtung finden", date: "2026-02-18", type: "SEO" as const, status: "Planned" as const, description: "How-To - Action" },
      { title: "Solarpanel-Vergleich: Mono vs. Poly vs. Dünnschicht", date: "2026-02-19", type: "SEO" as const, status: "Planned" as const, description: "Vergleich - Consideration" },
      { title: "Balkonkraftwerk-Förderung Sachsen: Bis zu 300€ Zuschuss", date: "2026-02-20", type: "SEO" as const, status: "Planned" as const, description: "News - Decision" },
      { title: "Wie funktioniert ein Wechselrichter? Einfach erklärt", date: "2026-02-21", type: "SEO" as const, status: "Planned" as const, description: "FAQ - Awareness" },

      // KW 8 (24.-28. Feb)
      { title: "Stromspeicher Wirtschaftlichkeit: Wann lohnt sich der Kauf?", date: "2026-02-24", type: "SEO" as const, status: "Planned" as const, description: "Deep-Dive - Consideration" },
      { title: "Balkonkraftwerk erden: Ist das notwendig?", date: "2026-02-25", type: "SEO" as const, status: "Planned" as const, description: "How-To - Action" },
      { title: "Wohnmobil Solaranlage Test: Die besten Systeme 2026", date: "2026-02-26", type: "SEO" as const, status: "Planned" as const, description: "Vergleich - Consideration" },
      { title: "Balkonkraftwerk-Förderung Niedersachsen: Alle Infos", date: "2026-02-27", type: "SEO" as const, status: "Planned" as const, description: "News - Decision" },
      { title: "Balkonkraftwerk Rendite berechnen: So viel sparen Sie", date: "2026-02-28", type: "SEO" as const, status: "Planned" as const, description: "FAQ - Decision" },

      // KW 9 (3.-7. März)
      { title: "Komplett autarke Stromversorgung Einfamilienhaus: Der Guide", date: "2026-03-03", type: "SEO" as const, status: "Planned" as const, description: "Deep-Dive - Awareness" },
      { title: "Balkonkraftwerk Wandhalterung montieren: Schritt für Schritt", date: "2026-03-04", type: "SEO" as const, status: "Planned" as const, description: "How-To - Action" },
      { title: "Bestes Balkonkraftwerk 2026: Unsere Top-Empfehlungen", date: "2026-03-05", type: "SEO" as const, status: "Planned" as const, description: "Vergleich - Decision" },
      { title: "Frühjahrs-Check für Ihre Solaranlage: Jetzt Ertrag optimieren", date: "2026-03-06", type: "SEO" as const, status: "Planned" as const, description: "News - Action" },
      { title: "Balkonkraftwerk für Mieter: Was ist erlaubt?", date: "2026-03-07", type: "SEO" as const, status: "Planned" as const, description: "FAQ - Awareness" },

      // KW 10 (10.-14. März)
      { title: "Notstrom für medizinische Geräte: Lebensrettende Absicherung", date: "2026-03-10", type: "SEO" as const, status: "Planned" as const, description: "Deep-Dive - Awareness (USP)" },
      { title: "Balkonkraftwerk Einspeisung messen: Die besten Methoden", date: "2026-03-11", type: "SEO" as const, status: "Planned" as const, description: "How-To - Action" },
      { title: "Beste Solarmodule 2026: Effizienz-Ranking", date: "2026-03-12", type: "SEO" as const, status: "Planned" as const, description: "Vergleich - Consideration" },
      { title: "Balkonkraftwerk-Förderung Thüringen: Jetzt beantragen", date: "2026-03-13", type: "SEO" as const, status: "Planned" as const, description: "News - Decision" },
      { title: "Balkonkraftwerk maximale Leistung: Was ist erlaubt?", date: "2026-03-14", type: "SEO" as const, status: "Planned" as const, description: "FAQ - Awareness" },

      // KW 11 (17.-21. März)
      { title: "USV für kritische Infrastruktur: Server & Rechenzentrum absichern", date: "2026-03-17", type: "SEO" as const, status: "Planned" as const, description: "Deep-Dive - Awareness (B2B USP)" },
      { title: "Balkonkraftwerk mit Speicher nachrüsten: So geht's", date: "2026-03-18", type: "SEO" as const, status: "Planned" as const, description: "How-To - Action (USP)" },
      { title: "Camping Solar Komplettanlage Test: Top 5 im Vergleich", date: "2026-03-19", type: "SEO" as const, status: "Planned" as const, description: "Vergleich - Consideration" },
      { title: "Solarpaket 2 Update: Neue Regelungen ab April", date: "2026-03-20", type: "SEO" as const, status: "Planned" as const, description: "News - Awareness" },
      { title: "Balkonkraftwerk Ertrag im Winter: Realistische Erwartungen", date: "2026-03-21", type: "SEO" as const, status: "Planned" as const, description: "FAQ - Consideration" },

      // KW 12 (24.-28. März)
      { title: "Batteriespeicher selber bauen: DIY-Anleitung für Fortgeschrittene", date: "2026-03-24", type: "SEO" as const, status: "Planned" as const, description: "Deep-Dive - Action" },
      { title: "Balkonkraftwerk Unterkonstruktion: Die besten Optionen", date: "2026-03-25", type: "SEO" as const, status: "Planned" as const, description: "How-To - Action" },
      { title: "Tragbare Powerstation mit Solar: Die besten Modelle 2026", date: "2026-03-26", type: "SEO" as const, status: "Planned" as const, description: "Vergleich - Consideration" },
      { title: "Balkonkraftwerk-Förderung RLP: Neue Mittel verfügbar", date: "2026-03-27", type: "SEO" as const, status: "Planned" as const, description: "News - Decision" },
      { title: "Balkonkraftwerk Kosten-Nutzen: Die ehrliche Rechnung", date: "2026-03-28", type: "SEO" as const, status: "Planned" as const, description: "FAQ - Decision" },

      // KW 13 (31. März)
      { title: "Q1 2026 Rückblick: Solar-Markt Entwicklung & Trends", date: "2026-03-31", type: "SEO" as const, status: "Planned" as const, description: "Deep-Dive - Awareness" },
    ];

    let insertedCount = 0;
    for (const event of q1Events) {
      // Prüfen ob Event bereits existiert
      const existing = await ctx.db
        .query("calendarEvents")
        .filter((q) => q.eq(q.field("title"), event.title))
        .first();

      if (!existing) {
        await ctx.db.insert("calendarEvents", event);
        insertedCount++;
      }
    }

    return {
      message: `Q1 2026 Content Calendar seeded`,
      inserted: insertedCount,
      total: q1Events.length,
    };
  },
});

// Clear all data (für Entwicklung)
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all records from each table
    const tables = [
      "keywords",
      "calendarEvents",
      "contentItems",
      "contentPillars",
      "campaigns",
      "monthlyKPIs",
      "channelAttribution",
      "infographics",
    ] as const;

    for (const table of tables) {
      const records = await ctx.db.query(table).collect();
      for (const record of records) {
        await ctx.db.delete(record._id);
      }
    }

    return { message: "All data cleared" };
  },
});
