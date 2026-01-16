import { mutation } from "./_generated/server";

// Vollständige Seed-Funktion für das einheitliche Datenmodell
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Prüfen ob bereits Daten vorhanden sind
    const existingContent = await ctx.db.query("contentPieces").first();
    if (existingContent) {
      return { message: "Database already seeded", seeded: false };
    }

    const now = new Date().toISOString();

    // ============ CONTENT PILLARS SEEDEN ============
    const pillarsData = [
      { title: "USV & Notstrom", description: "Differenzierung & USP - Das Alleinstellungsmerkmal von enerunity", color: "emerald", priority: "HOCH" as const, targetCount: 60 },
      { title: "Autarkie & Unabhängigkeit", description: "Emotionale Ansprache - Für Menschen die unabhängig leben wollen", color: "blue", priority: "HOCH" as const, targetCount: 50 },
      { title: "Balkonkraftwerk", description: "Traffic & Awareness - Einstieg für Neukunden", color: "amber", priority: "MITTEL" as const, targetCount: 200 },
      { title: "Speicher & Technik", description: "Technische Beratung - Für technikaffine Kunden", color: "purple", priority: "MITTEL" as const, targetCount: 80 },
      { title: "Förderung & Recht", description: "Entscheidungshilfe - Finanzielle Anreize", color: "rose", priority: "HOCH" as const, targetCount: 60 },
    ];

    const pillarIds: Record<string, any> = {};
    for (const pillar of pillarsData) {
      const id = await ctx.db.insert("contentPillars", pillar);
      pillarIds[pillar.title] = id;
    }

    // ============ KEYWORDS SEEDEN ============
    const keywordsData = [
      // USV & Notstrom
      { keyword: "Notstromaggregat für Einfamilienhaus", cluster: "USV & Notstrom", journeyPhase: "Consideration" as const, volume: 5400, difficulty: 45, priorityScore: 95 },
      { keyword: "USV Solaranlage", cluster: "USV & Notstrom", journeyPhase: "Decision" as const, volume: 880, difficulty: 25, priorityScore: 92 },
      { keyword: "Stromausfall Vorbereitung", cluster: "USV & Notstrom", journeyPhase: "Awareness" as const, volume: 8100, difficulty: 50, priorityScore: 88 },
      { keyword: "Notstrom für Heizung", cluster: "USV & Notstrom", journeyPhase: "Awareness" as const, volume: 2900, difficulty: 40, priorityScore: 85 },
      { keyword: "Solar Notstrom Testsieger", cluster: "USV & Notstrom", journeyPhase: "Decision" as const, volume: 720, difficulty: 40, priorityScore: 82 },

      // Autarkie
      { keyword: "komplett autarke Stromversorgung", cluster: "Autarkie", journeyPhase: "Awareness" as const, volume: 1900, difficulty: 55, priorityScore: 80 },
      { keyword: "Energieunabhängigkeit", cluster: "Autarkie", journeyPhase: "Awareness" as const, volume: 1600, difficulty: 45, priorityScore: 78 },
      { keyword: "Insellösung Photovoltaik", cluster: "Autarkie", journeyPhase: "Consideration" as const, volume: 2900, difficulty: 40, priorityScore: 75 },
      { keyword: "selber Strom erzeugen", cluster: "Autarkie", journeyPhase: "Awareness" as const, volume: 3600, difficulty: 40, priorityScore: 72 },

      // Balkonkraftwerk
      { keyword: "Balkonkraftwerk Testsieger", cluster: "Balkonkraftwerk", journeyPhase: "Decision" as const, volume: 14800, difficulty: 60, priorityScore: 90 },
      { keyword: "Balkonkraftwerk mit Speicher", cluster: "Balkonkraftwerk", journeyPhase: "Consideration" as const, volume: 12100, difficulty: 50, priorityScore: 88 },
      { keyword: "Balkonkraftwerk 800 Watt", cluster: "Balkonkraftwerk", journeyPhase: "Awareness" as const, volume: 12100, difficulty: 40, priorityScore: 85 },
      { keyword: "wie funktioniert Balkonkraftwerk", cluster: "Balkonkraftwerk", journeyPhase: "Awareness" as const, volume: 8100, difficulty: 40, priorityScore: 80 },
      { keyword: "Balkonkraftwerk Flachdach", cluster: "Balkonkraftwerk", journeyPhase: "Action" as const, volume: 4400, difficulty: 40, priorityScore: 75 },
      { keyword: "Balkonkraftwerk Montage", cluster: "Balkonkraftwerk", journeyPhase: "Action" as const, volume: 3600, difficulty: 35, priorityScore: 72 },
      { keyword: "Balkonkraftwerk für Mieter", cluster: "Balkonkraftwerk", journeyPhase: "Awareness" as const, volume: 2900, difficulty: 35, priorityScore: 70 },

      // Speicher & Technik
      { keyword: "Stromspeicher 10 kWh", cluster: "Speicher & Technik", journeyPhase: "Decision" as const, volume: 2400, difficulty: 45, priorityScore: 78 },
      { keyword: "bester Wechselrichter", cluster: "Speicher & Technik", journeyPhase: "Decision" as const, volume: 1600, difficulty: 40, priorityScore: 75 },
      { keyword: "Stromspeicher Wirtschaftlichkeit", cluster: "Speicher & Technik", journeyPhase: "Consideration" as const, volume: 1300, difficulty: 45, priorityScore: 72 },
      { keyword: "Hoymiles vs APSystems", cluster: "Speicher & Technik", journeyPhase: "Decision" as const, volume: 1300, difficulty: 35, priorityScore: 70 },

      // Förderung & Recht
      { keyword: "Balkonkraftwerk Förderung 2026", cluster: "Förderung & Recht", journeyPhase: "Decision" as const, volume: 22200, difficulty: 55, priorityScore: 92 },
      { keyword: "Balkonkraftwerk Förderung Bayern", cluster: "Förderung & Recht", journeyPhase: "Decision" as const, volume: 6600, difficulty: 45, priorityScore: 85 },
      { keyword: "Balkonkraftwerk Förderung NRW", cluster: "Förderung & Recht", journeyPhase: "Decision" as const, volume: 4400, difficulty: 45, priorityScore: 82 },
      { keyword: "Balkonkraftwerk anmelden", cluster: "Förderung & Recht", journeyPhase: "Action" as const, volume: 8100, difficulty: 40, priorityScore: 80 },
      { keyword: "Solarpaket 2", cluster: "Förderung & Recht", journeyPhase: "Awareness" as const, volume: 5400, difficulty: 35, priorityScore: 78 },
    ];

    const keywordIds: Record<string, any> = {};
    for (const kw of keywordsData) {
      const id = await ctx.db.insert("keywords", kw);
      keywordIds[kw.keyword] = id;
    }

    // ============ CAMPAIGNS SEEDEN ============
    const campaignsData = [
      {
        name: "Winterstrom & Sicherheit Q1",
        status: "Active" as const,
        channel: "Multi-Channel",
        budget: 15000,
        spent: 8500,
        roas: 4.5,
        conversions: 320,
        clicks: 12500,
        impressions: 450000,
        startDate: "2026-01-01",
        endDate: "2026-03-31",
        targetAudience: "Sicherheitsbewusste Hausbesitzer",
        goals: ["Brand Awareness", "Lead Generation"],
      },
      {
        name: "Frühjahrs-Offensive Q2",
        status: "Planned" as const,
        channel: "Google Ads, Meta",
        budget: 25000,
        spent: 0,
        roas: 0,
        conversions: 0,
        clicks: 0,
        impressions: 0,
        startDate: "2026-04-01",
        endDate: "2026-06-30",
        targetAudience: "Hausbesitzer, Gartenbesitzer",
        goals: ["Sales", "Brand Awareness"],
      },
      {
        name: "Sommer-Peak Q3",
        status: "Planned" as const,
        channel: "Multi-Channel",
        budget: 30000,
        spent: 0,
        roas: 0,
        conversions: 0,
        clicks: 0,
        impressions: 0,
        startDate: "2026-07-01",
        endDate: "2026-09-30",
        targetAudience: "Alle Zielgruppen",
        goals: ["Maximale Sales"],
      },
      {
        name: "Black Friday & Winter Q4",
        status: "Planned" as const,
        channel: "Multi-Channel",
        budget: 20000,
        spent: 0,
        roas: 0,
        conversions: 0,
        clicks: 0,
        impressions: 0,
        startDate: "2026-10-01",
        endDate: "2026-12-31",
        targetAudience: "Schnäppchenjäger, Wintervorsorge",
        goals: ["Black Friday Sales", "Wintervorsorge"],
      },
    ];

    const campaignIds: Record<string, any> = {};
    for (const campaign of campaignsData) {
      const id = await ctx.db.insert("campaigns", campaign);
      campaignIds[campaign.name] = id;
    }

    // ============ CONTENT PIECES FÜR 3 JAHRE SEEDEN ============
    // Wir generieren 5 Beiträge pro Woche für 2026, 2027, 2028
    const contentPieces: any[] = [];

    // Content-Vorlagen für verschiedene Themen
    const contentTemplates = [
      // USV & Notstrom Content
      { titlePattern: "Stromausfall Vorbereitung: {var} Tipps für {year}", pillar: "USV & Notstrom", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Awareness" as const },
      { titlePattern: "USV-System für {var}: Kompletter Ratgeber", pillar: "USV & Notstrom", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Consideration" as const },
      { titlePattern: "Notstrom für {var}: Test & Vergleich {year}", pillar: "USV & Notstrom", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Decision" as const },
      { titlePattern: "Video: {var} bei Stromausfall schützen", pillar: "USV & Notstrom", contentType: "Video" as const, channel: "Social" as const, journeyPhase: "Awareness" as const },

      // Autarkie Content
      { titlePattern: "Autark leben: {var} zur Energieunabhängigkeit", pillar: "Autarkie & Unabhängigkeit", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Awareness" as const },
      { titlePattern: "Insellösung {var}: So geht's", pillar: "Autarkie & Unabhängigkeit", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Consideration" as const },
      { titlePattern: "Autarkiegrad berechnen: {var}", pillar: "Autarkie & Unabhängigkeit", contentType: "Tool" as const, channel: "SEO" as const, journeyPhase: "Action" as const },

      // Balkonkraftwerk Content
      { titlePattern: "Balkonkraftwerk {var}: Kompletter Guide {year}", pillar: "Balkonkraftwerk", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Awareness" as const },
      { titlePattern: "Balkonkraftwerk Montage {var}: Anleitung", pillar: "Balkonkraftwerk", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Action" as const },
      { titlePattern: "Balkonkraftwerk {var} Test {year}", pillar: "Balkonkraftwerk", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Decision" as const },
      { titlePattern: "{var} Balkonkraftwerk: FAQ", pillar: "Balkonkraftwerk", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Awareness" as const },
      { titlePattern: "Video: Balkonkraftwerk {var} installieren", pillar: "Balkonkraftwerk", contentType: "Video" as const, channel: "Social" as const, journeyPhase: "Action" as const },

      // Speicher & Technik Content
      { titlePattern: "Stromspeicher {var}: Vergleich & Test", pillar: "Speicher & Technik", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Decision" as const },
      { titlePattern: "Wechselrichter {var}: Was du wissen musst", pillar: "Speicher & Technik", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Consideration" as const },
      { titlePattern: "{var} erklärt: Technische Grundlagen", pillar: "Speicher & Technik", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Awareness" as const },

      // Förderung & Recht Content
      { titlePattern: "Förderung {var} {year}: Alle Programme", pillar: "Förderung & Recht", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Decision" as const },
      { titlePattern: "Balkonkraftwerk anmelden {var}: Schritt für Schritt", pillar: "Förderung & Recht", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Action" as const },
      { titlePattern: "Solargesetz {year}: {var} Änderungen", pillar: "Förderung & Recht", contentType: "Blog" as const, channel: "SEO" as const, journeyPhase: "Awareness" as const },
    ];

    const variations = {
      "USV & Notstrom": ["Homeoffice", "Einfamilienhaus", "Heizung", "Server", "Medizingeräte", "Aquarium", "Kühlschrank", "IT-Infrastruktur", "Gewerbe", "Gastronomie", "Arztpraxis", "Landwirtschaft"],
      "Autarkie & Unabhängigkeit": ["Schritte", "im Einfamilienhaus", "mit Solarspeicher", "Wohnmobil", "Gartenhaus", "Ferienhaus", "2026", "2027", "2028", "komplett", "teilweise", "für Einsteiger"],
      "Balkonkraftwerk": ["Flachdach", "Garage", "Balkon", "Garten", "Fassade", "Carport", "Schrägdach", "Terrasse", "800W", "600W", "mit Speicher", "für Mieter", "für Eigentümer", "im Winter", "im Sommer"],
      "Speicher & Technik": ["10 kWh", "5 kWh", "20 kWh", "Hoymiles", "APSystems", "Deye", "Anker", "EcoFlow", "LiFePO4", "Hybrid", "AC-gekoppelt", "DC-gekoppelt"],
      "Förderung & Recht": ["Bayern", "NRW", "Baden-Württemberg", "Niedersachsen", "Hessen", "Berlin", "Brandenburg", "Sachsen", "Thüringen", "Rheinland-Pfalz", "Bundesweit", "KfW"],
    };

    // Generiere Content für 3 Jahre (2026-2028)
    const years = [2026, 2027, 2028];
    const statuses = ["Planned", "Draft", "In Progress", "Review", "Scheduled", "Published"] as const;

    for (const year of years) {
      // 52 Wochen * 5 Beiträge = 260 Beiträge pro Jahr
      for (let week = 1; week <= 52; week++) {
        for (let dayOfWeek = 0; dayOfWeek < 5; dayOfWeek++) {
          // Berechne das Datum (Montag = 0)
          const date = new Date(year, 0, 1);
          date.setDate(date.getDate() + (week - 1) * 7 + dayOfWeek + (date.getDay() === 0 ? 1 : (8 - date.getDay()) % 7));

          // Wenn das Datum nicht mehr im aktuellen Jahr ist, überspringe
          if (date.getFullYear() !== year) continue;

          const dateStr = date.toISOString().split('T')[0];

          // Wähle ein zufälliges Template
          const template = contentTemplates[(week * 5 + dayOfWeek) % contentTemplates.length];
          const pillarVars = variations[template.pillar as keyof typeof variations] || [""];
          const variation = pillarVars[(week + dayOfWeek) % pillarVars.length];

          // Erstelle den Titel
          const title = template.titlePattern
            .replace("{var}", variation)
            .replace("{year}", year.toString());

          // Bestimme Status basierend auf Datum
          const today = new Date("2026-01-15"); // Simuliertes "heute"
          let status: typeof statuses[number];
          if (date < today) {
            status = "Published";
          } else if (date < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
            status = "Scheduled";
          } else if (date < new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)) {
            status = "Review";
          } else if (date < new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) {
            status = "In Progress";
          } else {
            status = "Planned";
          }

          contentPieces.push({
            title,
            description: `${template.journeyPhase} Content für ${template.pillar}`,
            publishDate: dateStr,
            contentType: template.contentType,
            channel: template.channel,
            status,
            journeyPhase: template.journeyPhase,
            pillarId: pillarIds[template.pillar],
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    }

    // Insert alle Content Pieces
    for (const piece of contentPieces) {
      await ctx.db.insert("contentPieces", piece);
    }

    // ============ MONTHLY KPIs SEEDEN ============
    const months = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
    const kpiTemplate = [
      { revenue: 50000, target: 45000, conversions: 180, usvShare: 28, roas: 4.2, organicTraffic: 12000, paidTraffic: 8500 },
      { revenue: 65000, target: 50000, conversions: 220, usvShare: 30, roas: 4.5, organicTraffic: 15000, paidTraffic: 10000 },
      { revenue: 85000, target: 70000, conversions: 310, usvShare: 32, roas: 4.3, organicTraffic: 20000, paidTraffic: 14000 },
      { revenue: 120000, target: 100000, conversions: 420, usvShare: 33, roas: 4.1, organicTraffic: 28000, paidTraffic: 22000 },
      { revenue: 180000, target: 150000, conversions: 580, usvShare: 35, roas: 3.8, organicTraffic: 38000, paidTraffic: 35000 },
      { revenue: 220000, target: 180000, conversions: 680, usvShare: 36, roas: 3.9, organicTraffic: 42000, paidTraffic: 40000 },
      { revenue: 250000, target: 200000, conversions: 750, usvShare: 38, roas: 4.0, organicTraffic: 45000, paidTraffic: 42000 },
      { revenue: 210000, target: 190000, conversions: 620, usvShare: 37, roas: 4.2, organicTraffic: 40000, paidTraffic: 35000 },
      { revenue: 160000, target: 140000, conversions: 480, usvShare: 35, roas: 4.4, organicTraffic: 32000, paidTraffic: 25000 },
      { revenue: 110000, target: 100000, conversions: 350, usvShare: 34, roas: 4.5, organicTraffic: 25000, paidTraffic: 18000 },
      { revenue: 90000, target: 80000, conversions: 280, usvShare: 32, roas: 5.2, organicTraffic: 22000, paidTraffic: 20000 },
      { revenue: 70000, target: 60000, conversions: 210, usvShare: 30, roas: 4.8, organicTraffic: 18000, paidTraffic: 12000 },
    ];

    for (const year of years) {
      const growthFactor = 1 + (year - 2026) * 0.2; // 20% Wachstum pro Jahr
      for (let i = 0; i < 12; i++) {
        await ctx.db.insert("monthlyKPIs", {
          month: months[i],
          year,
          revenue: Math.round(kpiTemplate[i].revenue * growthFactor),
          target: Math.round(kpiTemplate[i].target * growthFactor),
          conversions: Math.round(kpiTemplate[i].conversions * growthFactor),
          usvShare: Math.min(50, kpiTemplate[i].usvShare + (year - 2026) * 3),
          roas: kpiTemplate[i].roas,
          organicTraffic: Math.round(kpiTemplate[i].organicTraffic * growthFactor),
          paidTraffic: Math.round(kpiTemplate[i].paidTraffic * growthFactor),
        });
      }
    }

    // ============ CHANNEL ATTRIBUTION SEEDEN ============
    for (const year of years) {
      const attrs = [
        { name: "Organic Search", value: 4000000 + (year - 2026) * 500000, percentage: 28, color: "var(--chart-1)" },
        { name: "Paid Search", value: 3500000 + (year - 2026) * 400000, percentage: 24, color: "var(--chart-2)" },
        { name: "Direct", value: 2800000 + (year - 2026) * 300000, percentage: 19, color: "var(--chart-3)" },
        { name: "Social", value: 2000000 + (year - 2026) * 350000, percentage: 14, color: "var(--chart-4)" },
        { name: "Referral", value: 1500000 + (year - 2026) * 200000, percentage: 10, color: "var(--chart-5)" },
        { name: "Email", value: 700000 + (year - 2026) * 150000, percentage: 5, color: "var(--accent)" },
      ];
      for (const attr of attrs) {
        await ctx.db.insert("channelAttribution", { ...attr, year });
      }
    }

    return {
      message: "Database seeded successfully",
      seeded: true,
      counts: {
        pillars: pillarsData.length,
        keywords: keywordsData.length,
        campaigns: campaignsData.length,
        contentPieces: contentPieces.length,
        kpis: months.length * years.length,
      }
    };
  },
});

// Alle Daten löschen
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "contentPieces",
      "keywords",
      "contentPillars",
      "campaigns",
      "monthlyKPIs",
      "channelAttribution",
    ] as const;

    let deleted = 0;
    for (const table of tables) {
      const records = await ctx.db.query(table).collect();
      for (const record of records) {
        await ctx.db.delete(record._id);
        deleted++;
      }
    }

    return { message: "All data cleared", deleted };
  },
});
