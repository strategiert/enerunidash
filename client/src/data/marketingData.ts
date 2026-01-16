// Zentrale Marketing-Daten basierend auf enerunity Content-Strategie & Jahresplanung 2026
// und KleinesKraftwerk Marketing-Insights

// ============ KEYWORDS ============
// 557 Keywords aus der Keyword-Recherche, kategorisiert nach Cluster und Customer Journey

export interface Keyword {
  id: number;
  keyword: string;
  cluster: string;
  journeyPhase: 'Awareness' | 'Consideration' | 'Decision' | 'Action' | 'Retention';
  volume: number;
  difficulty: number;
  priorityScore: number;
  hasContent: boolean;
  contentType?: string;
}

export const keywordClusters = [
  { name: "USV & Notstrom", color: "emerald", count: 11, priority: "HOCH" },
  { name: "Autarkie", color: "blue", count: 8, priority: "HOCH" },
  { name: "Speicher & Batterie", color: "purple", count: 30, priority: "MITTEL" },
  { name: "Balkonkraftwerk Basics", color: "amber", count: 150, priority: "MITTEL" },
  { name: "Watt & Leistung", color: "orange", count: 60, priority: "MITTEL" },
  { name: "Montage & Installation", color: "cyan", count: 45, priority: "MITTEL" },
  { name: "Förderung & Rechtliches", color: "rose", count: 40, priority: "MITTEL" },
  { name: "Wechselrichter", color: "indigo", count: 25, priority: "NIEDRIG" },
  { name: "Camping & Mobil", color: "teal", count: 35, priority: "NIEDRIG" },
  { name: "Sonstiges", color: "slate", count: 153, priority: "NIEDRIG" },
];

// Vollständige Keyword-Liste mit Scoring
export const keywords: Keyword[] = [
  // USV & Notstrom (Höchste Priorität - USP von enerunity)
  { id: 1, keyword: "Balkonkraftwerk bei Stromausfall", cluster: "USV & Notstrom", journeyPhase: "Awareness", volume: 2400, difficulty: 35, priorityScore: 130, hasContent: false },
  { id: 2, keyword: "Notstromaggregat für Einfamilienhaus", cluster: "USV & Notstrom", journeyPhase: "Consideration", volume: 5400, difficulty: 45, priorityScore: 90, hasContent: false },
  { id: 3, keyword: "USV Solaranlage", cluster: "USV & Notstrom", journeyPhase: "Decision", volume: 880, difficulty: 25, priorityScore: 90, hasContent: false },
  { id: 4, keyword: "Solar Notstrom Testsieger", cluster: "USV & Notstrom", journeyPhase: "Decision", volume: 720, difficulty: 40, priorityScore: 85, hasContent: false },
  { id: 5, keyword: "photovoltaiq als usv", cluster: "USV & Notstrom", journeyPhase: "Consideration", volume: 480, difficulty: 20, priorityScore: 80, hasContent: false },
  { id: 6, keyword: "photovoltaiq delta 2 usv", cluster: "USV & Notstrom", journeyPhase: "Decision", volume: 390, difficulty: 15, priorityScore: 75, hasContent: false },
  { id: 7, keyword: "photovoltaiq usv", cluster: "USV & Notstrom", journeyPhase: "Decision", volume: 320, difficulty: 20, priorityScore: 75, hasContent: false },
  { id: 8, keyword: "Notstromaggregat für Heizung", cluster: "USV & Notstrom", journeyPhase: "Awareness", volume: 2900, difficulty: 40, priorityScore: 70, hasContent: false },
  { id: 9, keyword: "Notstromaggregat solar sinnvoll", cluster: "USV & Notstrom", journeyPhase: "Consideration", volume: 590, difficulty: 30, priorityScore: 65, hasContent: false },
  { id: 10, keyword: "Notstromaggregat Funktionsweise", cluster: "USV & Notstrom", journeyPhase: "Awareness", volume: 1200, difficulty: 35, priorityScore: 60, hasContent: false },
  { id: 11, keyword: "Stromausfall 2024", cluster: "USV & Notstrom", journeyPhase: "Awareness", volume: 8100, difficulty: 50, priorityScore: 55, hasContent: false },

  // Autarkie (Hohe Priorität)
  { id: 12, keyword: "komplett autarke Stromversorgung eines Einfamilienhauses", cluster: "Autarkie", journeyPhase: "Awareness", volume: 1900, difficulty: 55, priorityScore: 65, hasContent: false },
  { id: 13, keyword: "Energieunabhängigkeit", cluster: "Autarkie", journeyPhase: "Awareness", volume: 1600, difficulty: 45, priorityScore: 60, hasContent: false },
  { id: 14, keyword: "Balkonkraftwerk autark betreiben", cluster: "Autarkie", journeyPhase: "Action", volume: 320, difficulty: 25, priorityScore: 55, hasContent: false },
  { id: 15, keyword: "Insellösung", cluster: "Autarkie", journeyPhase: "Awareness", volume: 2900, difficulty: 40, priorityScore: 50, hasContent: false },
  { id: 16, keyword: "Stromautark", cluster: "Autarkie", journeyPhase: "Awareness", volume: 880, difficulty: 35, priorityScore: 45, hasContent: false },
  { id: 17, keyword: "Stromautarkie", cluster: "Autarkie", journeyPhase: "Awareness", volume: 720, difficulty: 35, priorityScore: 45, hasContent: false },
  { id: 18, keyword: "Solaranlage autark", cluster: "Autarkie", journeyPhase: "Consideration", volume: 590, difficulty: 30, priorityScore: 40, hasContent: false },
  { id: 19, keyword: "selber Strom erzeugen", cluster: "Autarkie", journeyPhase: "Awareness", volume: 3600, difficulty: 40, priorityScore: 35, hasContent: false },

  // Speicher & Batterie
  { id: 20, keyword: "Stromspeicher Wirtschaftlichkeit", cluster: "Speicher & Batterie", journeyPhase: "Consideration", volume: 1300, difficulty: 45, priorityScore: 55, hasContent: false },
  { id: 21, keyword: "Heimspeicher selber bauen", cluster: "Speicher & Batterie", journeyPhase: "Action", volume: 880, difficulty: 50, priorityScore: 50, hasContent: false },
  { id: 22, keyword: "Batteriespeicher Wirtschaftlichkeit", cluster: "Speicher & Batterie", journeyPhase: "Consideration", volume: 720, difficulty: 40, priorityScore: 45, hasContent: false },
  { id: 23, keyword: "Stromspeicher 10 kWh", cluster: "Speicher & Batterie", journeyPhase: "Decision", volume: 2400, difficulty: 45, priorityScore: 45, hasContent: false },
  { id: 24, keyword: "Stromspeicher 10kwh", cluster: "Speicher & Batterie", journeyPhase: "Decision", volume: 1900, difficulty: 45, priorityScore: 45, hasContent: false },
  { id: 25, keyword: "Stromspeicher 30 kWh Preis", cluster: "Speicher & Batterie", journeyPhase: "Decision", volume: 480, difficulty: 35, priorityScore: 40, hasContent: false },
  { id: 26, keyword: "welcher Stromspeicher ist der beste", cluster: "Speicher & Batterie", journeyPhase: "Decision", volume: 1600, difficulty: 50, priorityScore: 40, hasContent: false },
  { id: 27, keyword: "Speicher 1 kWh", cluster: "Speicher & Batterie", journeyPhase: "Decision", volume: 320, difficulty: 30, priorityScore: 35, hasContent: false },
  { id: 28, keyword: "Solar Energie speichern", cluster: "Speicher & Batterie", journeyPhase: "Awareness", volume: 1300, difficulty: 35, priorityScore: 35, hasContent: false },

  // Balkonkraftwerk Basics (Traffic-Treiber)
  { id: 29, keyword: "Balkonkraftwerk Förderung", cluster: "Balkonkraftwerk Basics", journeyPhase: "Decision", volume: 18100, difficulty: 55, priorityScore: 35, hasContent: true, contentType: "Blog" },
  { id: 30, keyword: "Balkonkraftwerk Testsieger", cluster: "Balkonkraftwerk Basics", journeyPhase: "Decision", volume: 14800, difficulty: 60, priorityScore: 35, hasContent: false },
  { id: 31, keyword: "bestes Balkonkraftwerk", cluster: "Balkonkraftwerk Basics", journeyPhase: "Decision", volume: 9900, difficulty: 55, priorityScore: 35, hasContent: false },
  { id: 32, keyword: "Balkonkraftwerk mit Speicher", cluster: "Balkonkraftwerk Basics", journeyPhase: "Consideration", volume: 12100, difficulty: 50, priorityScore: 65, hasContent: false },
  { id: 33, keyword: "Balkonkraftwerk anmelden oder nicht", cluster: "Förderung & Rechtliches", journeyPhase: "Action", volume: 5400, difficulty: 35, priorityScore: 30, hasContent: false },
  { id: 34, keyword: "wie funktioniert ein Balkonkraftwerk", cluster: "Balkonkraftwerk Basics", journeyPhase: "Awareness", volume: 8100, difficulty: 40, priorityScore: 25, hasContent: false },
  { id: 35, keyword: "Balkonkraftwerk Ertrag Winter", cluster: "Balkonkraftwerk Basics", journeyPhase: "Consideration", volume: 6600, difficulty: 40, priorityScore: 30, hasContent: false },
  { id: 36, keyword: "Balkonkraftwerk Set", cluster: "Balkonkraftwerk Basics", journeyPhase: "Decision", volume: 5400, difficulty: 50, priorityScore: 25, hasContent: false },

  // Watt & Leistung
  { id: 37, keyword: "wieviel Watt darf ein Balkonkraftwerk haben 2024", cluster: "Watt & Leistung", journeyPhase: "Awareness", volume: 33100, difficulty: 45, priorityScore: 35, hasContent: false },
  { id: 38, keyword: "Balkonkraftwerk 2000 Watt erlaubt", cluster: "Watt & Leistung", journeyPhase: "Awareness", volume: 8100, difficulty: 40, priorityScore: 35, hasContent: false },
  { id: 39, keyword: "Balkonkraftwerk 1600 Watt erlaubt", cluster: "Watt & Leistung", journeyPhase: "Awareness", volume: 4400, difficulty: 35, priorityScore: 30, hasContent: false },
  { id: 40, keyword: "Balkonkraftwerk 800 Watt erlaubt", cluster: "Watt & Leistung", journeyPhase: "Awareness", volume: 12100, difficulty: 40, priorityScore: 30, hasContent: false },
  { id: 41, keyword: "Balkonkraftwerk 1000 Watt erlaubt", cluster: "Watt & Leistung", journeyPhase: "Awareness", volume: 6600, difficulty: 40, priorityScore: 30, hasContent: false },
  { id: 42, keyword: "Balkonkraftwerk 1200 Watt erlaubt ab 2024", cluster: "Watt & Leistung", journeyPhase: "Awareness", volume: 2900, difficulty: 35, priorityScore: 28, hasContent: false },
  { id: 43, keyword: "was kann ich mit 600 Watt betreiben", cluster: "Watt & Leistung", journeyPhase: "Awareness", volume: 2400, difficulty: 30, priorityScore: 25, hasContent: false },
  { id: 44, keyword: "was kann man mit 2000 Watt betreiben", cluster: "Watt & Leistung", journeyPhase: "Awareness", volume: 1900, difficulty: 30, priorityScore: 25, hasContent: false },
  { id: 45, keyword: "Balkonkraftwerk 600w Ertrag pro Tag", cluster: "Watt & Leistung", journeyPhase: "Consideration", volume: 2400, difficulty: 35, priorityScore: 25, hasContent: false },
  { id: 46, keyword: "Balkonkraftwerk 800w Ertrag pro Tag", cluster: "Watt & Leistung", journeyPhase: "Consideration", volume: 1900, difficulty: 35, priorityScore: 25, hasContent: false },

  // Montage & Installation
  { id: 47, keyword: "Balkonkraftwerk Flachdach", cluster: "Montage & Installation", journeyPhase: "Consideration", volume: 4400, difficulty: 40, priorityScore: 30, hasContent: false },
  { id: 48, keyword: "Balkonkraftwerk Flachdach Aufständerung", cluster: "Montage & Installation", journeyPhase: "Action", volume: 1600, difficulty: 35, priorityScore: 28, hasContent: false },
  { id: 49, keyword: "Balkonkraftwerk auf Garage", cluster: "Montage & Installation", journeyPhase: "Consideration", volume: 2900, difficulty: 35, priorityScore: 28, hasContent: false },
  { id: 50, keyword: "Balkonkraftwerk Ziegeldach", cluster: "Montage & Installation", journeyPhase: "Consideration", volume: 2400, difficulty: 35, priorityScore: 28, hasContent: false },
  { id: 51, keyword: "Balkonkraftwerk Wandhalterung", cluster: "Montage & Installation", journeyPhase: "Action", volume: 2900, difficulty: 30, priorityScore: 25, hasContent: false },
  { id: 52, keyword: "Balkonkraftwerk Montageanleitung", cluster: "Montage & Installation", journeyPhase: "Action", volume: 1900, difficulty: 30, priorityScore: 25, hasContent: true, contentType: "Video" },
  { id: 53, keyword: "Balkonkraftwerk auf Trapezblech montieren", cluster: "Montage & Installation", journeyPhase: "Action", volume: 880, difficulty: 30, priorityScore: 25, hasContent: false },
  { id: 54, keyword: "Balkonkraftwerk Winkel", cluster: "Montage & Installation", journeyPhase: "Action", volume: 3600, difficulty: 35, priorityScore: 25, hasContent: false },

  // Förderung & Rechtliches
  { id: 55, keyword: "Balkonkraftwerk Förderung 2024", cluster: "Förderung & Rechtliches", journeyPhase: "Decision", volume: 22200, difficulty: 55, priorityScore: 35, hasContent: true, contentType: "Blog" },
  { id: 56, keyword: "Balkonkraftwerk Förderung Bayern", cluster: "Förderung & Rechtliches", journeyPhase: "Decision", volume: 6600, difficulty: 45, priorityScore: 30, hasContent: false },
  { id: 57, keyword: "Balkonkraftwerk Förderung NRW", cluster: "Förderung & Rechtliches", journeyPhase: "Decision", volume: 4400, difficulty: 45, priorityScore: 30, hasContent: false },
  { id: 58, keyword: "Balkonkraftwerk Förderung Baden-Württemberg", cluster: "Förderung & Rechtliches", journeyPhase: "Decision", volume: 3600, difficulty: 45, priorityScore: 30, hasContent: false },
  { id: 59, keyword: "Balkonkraftwerk neues Gesetz 2024", cluster: "Förderung & Rechtliches", journeyPhase: "Awareness", volume: 8100, difficulty: 40, priorityScore: 30, hasContent: false },
  { id: 60, keyword: "Balkonkraftwerk nicht angemeldet Strafe", cluster: "Förderung & Rechtliches", journeyPhase: "Awareness", volume: 3600, difficulty: 35, priorityScore: 28, hasContent: false },
  { id: 61, keyword: "Balkonkraftwerk Steuer absetzen", cluster: "Förderung & Rechtliches", journeyPhase: "Action", volume: 2400, difficulty: 40, priorityScore: 28, hasContent: false },
  { id: 62, keyword: "Powerstation ohne Mehrwertsteuer", cluster: "Förderung & Rechtliches", journeyPhase: "Decision", volume: 720, difficulty: 30, priorityScore: 45, hasContent: false },

  // Wechselrichter
  { id: 63, keyword: "Wechselrichter Vergleich 2026", cluster: "Wechselrichter", journeyPhase: "Decision", volume: 2400, difficulty: 45, priorityScore: 30, hasContent: false },
  { id: 64, keyword: "bester Wechselrichter 800 Watt", cluster: "Wechselrichter", journeyPhase: "Decision", volume: 1600, difficulty: 40, priorityScore: 28, hasContent: false },
  { id: 65, keyword: "Hoymiles oder APSystems", cluster: "Wechselrichter", journeyPhase: "Decision", volume: 1300, difficulty: 35, priorityScore: 25, hasContent: false },
  { id: 66, keyword: "Microwechselrichter Test", cluster: "Wechselrichter", journeyPhase: "Decision", volume: 1900, difficulty: 40, priorityScore: 25, hasContent: false },
  { id: 67, keyword: "Wechselrichter einstellbare Leistung", cluster: "Wechselrichter", journeyPhase: "Consideration", volume: 720, difficulty: 30, priorityScore: 25, hasContent: false },
  { id: 68, keyword: "was ist ein Off Grid Wechselrichter", cluster: "Wechselrichter", journeyPhase: "Awareness", volume: 590, difficulty: 25, priorityScore: 45, hasContent: false },

  // Camping & Mobil
  { id: 69, keyword: "Camping Solar Komplettanlage Test", cluster: "Camping & Mobil", journeyPhase: "Decision", volume: 1600, difficulty: 45, priorityScore: 28, hasContent: false },
  { id: 70, keyword: "Wohnmobil Solaranlage Test", cluster: "Camping & Mobil", journeyPhase: "Decision", volume: 2400, difficulty: 45, priorityScore: 28, hasContent: false },
  { id: 71, keyword: "Camping Solaranlage 2000W", cluster: "Camping & Mobil", journeyPhase: "Decision", volume: 880, difficulty: 40, priorityScore: 25, hasContent: false },
  { id: 72, keyword: "mobile PV Anlage mit Speicher", cluster: "Camping & Mobil", journeyPhase: "Consideration", volume: 720, difficulty: 35, priorityScore: 25, hasContent: false },
  { id: 73, keyword: "tragbare Powerstation mit Solar", cluster: "Camping & Mobil", journeyPhase: "Decision", volume: 1300, difficulty: 40, priorityScore: 25, hasContent: false },
  { id: 74, keyword: "Solarbatterie Camping", cluster: "Camping & Mobil", journeyPhase: "Decision", volume: 880, difficulty: 35, priorityScore: 25, hasContent: false },

  // Sonstiges / Allgemein
  { id: 75, keyword: "Strompreisentwicklung bis 2035", cluster: "Sonstiges", journeyPhase: "Awareness", volume: 4400, difficulty: 45, priorityScore: 25, hasContent: true, contentType: "Blog" },
  { id: 76, keyword: "Stromkosten 2024", cluster: "Sonstiges", journeyPhase: "Awareness", volume: 12100, difficulty: 50, priorityScore: 22, hasContent: false },
  { id: 77, keyword: "Preis pro Kilowattstunde", cluster: "Sonstiges", journeyPhase: "Awareness", volume: 18100, difficulty: 50, priorityScore: 20, hasContent: false },
  { id: 78, keyword: "Klimaanlage mit Balkonkraftwerk betreiben", cluster: "Sonstiges", journeyPhase: "Consideration", volume: 1300, difficulty: 35, priorityScore: 28, hasContent: false },
  { id: 79, keyword: "Pool Wärmepumpe mit PV betreiben", cluster: "Sonstiges", journeyPhase: "Consideration", volume: 720, difficulty: 35, priorityScore: 25, hasContent: false },
  { id: 80, keyword: "was kostet eine Solaranlage für den Balkon", cluster: "Balkonkraftwerk Basics", journeyPhase: "Consideration", volume: 2900, difficulty: 40, priorityScore: 28, hasContent: false },
];

// ============ JAHRESKALENDER EVENTS ============
export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: 'SEO' | 'SEA' | 'Social' | 'Newsletter' | 'PR' | 'Product';
  status: 'Planned' | 'Draft' | 'Review' | 'Published' | 'Active' | 'Done' | 'Sent' | 'Dev';
  description?: string;
  relatedKeywords?: string[];
  assignee?: string;
}

export const calendarEvents: CalendarEvent[] = [
  // Januar 2026
  { id: 1, title: "Strompreisentwicklung 2026", date: "2026-01-05", type: "SEO", status: "Published", description: "Blog Post über erwartete Strompreisentwicklung", relatedKeywords: ["Strompreisentwicklung", "Stromkosten 2026"] },
  { id: 2, title: "Neujahrs-Newsletter", date: "2026-01-07", type: "Newsletter", status: "Sent", description: "Newsletter zu Neujahrsvorsätzen" },
  { id: 3, title: "Video: Stromkosten senken in 2026", date: "2026-01-08", type: "Social", status: "Published", description: "YouTube Video" },
  { id: 4, title: "Brand-Kampagne Start", date: "2026-01-10", type: "SEA", status: "Active", description: "Google Ads Brand-Kampagne" },
  { id: 5, title: "Balkonkraftwerk Förderung 2026 Übersicht", date: "2026-01-12", type: "SEO", status: "Published", relatedKeywords: ["Balkonkraftwerk Förderung 2026"] },
  { id: 6, title: "Video: Förderungen nutzen", date: "2026-01-14", type: "Social", status: "Published" },
  { id: 7, title: "Förderungs-Guide Newsletter", date: "2026-01-14", type: "Newsletter", status: "Sent" },
  { id: 8, title: "PM: Neue Förderungen 2026", date: "2026-01-15", type: "PR", status: "Sent" },
  { id: 9, title: "USV für Homeoffice", date: "2026-01-19", type: "SEO", status: "Review", relatedKeywords: ["USV Solaranlage", "Homeoffice Stromausfall"] },
  { id: 10, title: "Video: Nie wieder Stromausfall im Homeoffice", date: "2026-01-20", type: "Social", status: "Draft" },
  { id: 11, title: "B2B-Newsletter", date: "2026-01-21", type: "Newsletter", status: "Draft" },
  { id: 12, title: "USV-Keywords Kampagne", date: "2026-01-22", type: "SEA", status: "Planned" },
  { id: 13, title: "Autarkiegrad berechnen", date: "2026-01-26", type: "SEO", status: "Dev", relatedKeywords: ["Autarkiegrad berechnen", "komplett autarke Stromversorgung"] },
  { id: 14, title: "Video: Wie autark bist du?", date: "2026-01-27", type: "Social", status: "Planned" },
  { id: 15, title: "Autarkie-Rechner Newsletter", date: "2026-01-28", type: "Newsletter", status: "Planned" },

  // Februar 2026
  { id: 16, title: "Balkonkraftwerk Ertrag Winter", date: "2026-02-02", type: "SEO", status: "Planned", relatedKeywords: ["Balkonkraftwerk Ertrag Winter"] },
  { id: 17, title: "Video: Solar im Winter - lohnt sich das?", date: "2026-02-03", type: "Social", status: "Planned" },
  { id: 18, title: "Winter-Tipps Newsletter", date: "2026-02-04", type: "Newsletter", status: "Planned" },
  { id: 19, title: "Notstromaggregat vs. USV-Speicher", date: "2026-02-09", type: "SEO", status: "Planned", relatedKeywords: ["Notstromaggregat für Einfamilienhaus", "USV Solaranlage"] },
  { id: 20, title: "Video: Generator oder Batterie?", date: "2026-02-10", type: "Social", status: "Planned" },
  { id: 21, title: "PM: USV-Innovation", date: "2026-02-11", type: "PR", status: "Planned" },
  { id: 22, title: "Stromausfall Vorbereitung 2026", date: "2026-02-16", type: "SEO", status: "Planned", relatedKeywords: ["Stromausfall", "Blackout Vorsorge"] },
  { id: 23, title: "Video: Blackout-Vorsorge", date: "2026-02-17", type: "Social", status: "Planned" },
  { id: 24, title: "Sicherheits-Newsletter", date: "2026-02-18", type: "Newsletter", status: "Planned" },
  { id: 25, title: "Heizung bei Stromausfall", date: "2026-02-23", type: "SEO", status: "Planned", relatedKeywords: ["Notstromaggregat für Heizung"] },
  { id: 26, title: "Video: Heizung ohne Strom?", date: "2026-02-24", type: "Social", status: "Planned" },

  // März 2026
  { id: 27, title: "Balkonkraftwerk Montage Anleitung", date: "2026-03-02", type: "SEO", status: "Planned", relatedKeywords: ["Balkonkraftwerk Montageanleitung"] },
  { id: 28, title: "Video: DIY Montage in 30 Minuten", date: "2026-03-03", type: "Social", status: "Planned" },
  { id: 29, title: "Montage-Guide Newsletter", date: "2026-03-04", type: "Newsletter", status: "Planned" },
  { id: 30, title: "Wechselrichter Vergleich 2026", date: "2026-03-09", type: "SEO", status: "Planned", relatedKeywords: ["bester Wechselrichter 800 Watt"] },
  { id: 31, title: "Video: Der beste Wechselrichter", date: "2026-03-10", type: "Social", status: "Planned" },
  { id: 32, title: "Technik-Newsletter", date: "2026-03-11", type: "Newsletter", status: "Planned" },
  { id: 33, title: "PV-Anlage mit Speicher planen", date: "2026-03-16", type: "SEO", status: "Planned" },
  { id: 34, title: "Video: Speicher richtig dimensionieren", date: "2026-03-17", type: "Social", status: "Planned" },
  { id: 35, title: "PM: Frühjahrsaktion", date: "2026-03-18", type: "PR", status: "Planned" },
  { id: 36, title: "Balkonkraftwerk anmelden 2026", date: "2026-03-23", type: "SEO", status: "Planned", relatedKeywords: ["Balkonkraftwerk anmelden"] },
  { id: 37, title: "Video: Anmeldung Schritt für Schritt", date: "2026-03-24", type: "Social", status: "Planned" },

  // April 2026
  { id: 38, title: "Beste Solarmodule 2026", date: "2026-04-06", type: "SEO", status: "Planned" },
  { id: 39, title: "Video: Modul-Vergleich", date: "2026-04-07", type: "Social", status: "Planned" },
  { id: 40, title: "Produktvergleich Newsletter", date: "2026-04-08", type: "Newsletter", status: "Planned" },
  { id: 41, title: "Balkonkraftwerk Flachdach", date: "2026-04-13", type: "SEO", status: "Planned", relatedKeywords: ["Balkonkraftwerk Flachdach"] },
  { id: 42, title: "Video: Flachdach-Montage", date: "2026-04-14", type: "Social", status: "Planned" },
  { id: 43, title: "USV für Server & Rechenzentrum", date: "2026-04-20", type: "SEO", status: "Planned" },
  { id: 44, title: "Video: B2B USV-Lösungen", date: "2026-04-21", type: "Social", status: "Planned" },
  { id: 45, title: "PM: B2B-Partnerschaft", date: "2026-04-22", type: "PR", status: "Planned" },
  { id: 46, title: "Solaranlage Garage/Carport", date: "2026-04-27", type: "SEO", status: "Planned", relatedKeywords: ["Balkonkraftwerk auf Garage"] },
  { id: 47, title: "Video: Carport als Kraftwerk", date: "2026-04-28", type: "Social", status: "Planned" },

  // Mai 2026 (Peak-Monat)
  { id: 48, title: "Balkonkraftwerk 2000 Watt erlaubt?", date: "2026-05-04", type: "SEO", status: "Planned", relatedKeywords: ["Balkonkraftwerk 2000 Watt erlaubt"] },
  { id: 49, title: "Video: Neue Leistungsgrenzen", date: "2026-05-05", type: "Social", status: "Planned" },
  { id: 50, title: "PM: Gesetzesänderung", date: "2026-05-06", type: "PR", status: "Planned" },
  { id: 51, title: "Solarpanel Reinigung", date: "2026-05-11", type: "SEO", status: "Planned" },
  { id: 52, title: "Video: Ertrag steigern durch Reinigung", date: "2026-05-12", type: "Social", status: "Planned" },
  { id: 53, title: "Wartungs-Newsletter", date: "2026-05-13", type: "Newsletter", status: "Planned" },
  { id: 54, title: "Komplett autarke Stromversorgung", date: "2026-05-18", type: "SEO", status: "Planned", relatedKeywords: ["komplett autarke Stromversorgung eines Einfamilienhauses"] },
  { id: 55, title: "Video: 100% autark leben", date: "2026-05-19", type: "Social", status: "Planned" },
  { id: 56, title: "Autarkie-Serie Newsletter", date: "2026-05-20", type: "Newsletter", status: "Planned" },
  { id: 57, title: "Balkonkraftwerk Testsieger 2026", date: "2026-05-25", type: "SEO", status: "Planned", relatedKeywords: ["Balkonkraftwerk Testsieger", "bestes Balkonkraftwerk"] },
  { id: 58, title: "Video: Top 10 Balkonkraftwerke", date: "2026-05-26", type: "Social", status: "Planned" },

  // Juni 2026
  { id: 59, title: "Klimaanlage mit Balkonkraftwerk", date: "2026-06-01", type: "SEO", status: "Planned", relatedKeywords: ["Klimaanlage mit Balkonkraftwerk betreiben"] },
  { id: 60, title: "Video: Kühlen mit Solarstrom", date: "2026-06-02", type: "Social", status: "Planned" },
  { id: 61, title: "Sommer-Newsletter", date: "2026-06-03", type: "Newsletter", status: "Planned" },
  { id: 62, title: "Pool Wärmepumpe mit Solar", date: "2026-06-08", type: "SEO", status: "Planned", relatedKeywords: ["Pool Wärmepumpe mit PV betreiben"] },
  { id: 63, title: "Video: Pool heizen mit Solar", date: "2026-06-09", type: "Social", status: "Planned" },
  { id: 64, title: "Camping Solaranlage Komplettset", date: "2026-06-15", type: "SEO", status: "Planned", relatedKeywords: ["Camping Solar Komplettanlage Test"] },
  { id: 65, title: "Video: Solar fürs Wohnmobil", date: "2026-06-16", type: "Social", status: "Planned" },
  { id: 66, title: "Camping-Newsletter", date: "2026-06-17", type: "Newsletter", status: "Planned" },
  { id: 67, title: "Stromausfall im Sommer - Risiken", date: "2026-06-22", type: "SEO", status: "Planned" },
  { id: 68, title: "Video: Blackout bei Hitze", date: "2026-06-23", type: "Social", status: "Planned" },
  { id: 69, title: "PM: Sommer-Blackout Warnung", date: "2026-06-24", type: "PR", status: "Planned" },

  // Juli - Dezember (gekürzt für Übersichtlichkeit)
  { id: 70, title: "Balkonkraftwerk Ertrag maximieren", date: "2026-07-06", type: "SEO", status: "Planned" },
  { id: 71, title: "USV für Gastronomie", date: "2026-07-13", type: "SEO", status: "Planned" },
  { id: 72, title: "Solaranlage erweitern", date: "2026-07-20", type: "SEO", status: "Planned" },
  { id: 73, title: "Notstrom für medizinische Geräte", date: "2026-08-10", type: "SEO", status: "Planned" },
  { id: 74, title: "Balkonkraftwerk Versicherung", date: "2026-08-17", type: "SEO", status: "Planned" },
  { id: 75, title: "Stromspeicher Wirtschaftlichkeit", date: "2026-09-07", type: "SEO", status: "Planned", relatedKeywords: ["Stromspeicher Wirtschaftlichkeit"] },
  { id: 76, title: "Strompreis Prognose 2027", date: "2026-10-12", type: "SEO", status: "Planned" },
  { id: 77, title: "Black Friday Solar Angebote", date: "2026-11-23", type: "SEO", status: "Planned" },
  { id: 78, title: "Black Friday Newsletter", date: "2026-11-24", type: "Newsletter", status: "Planned" },
  { id: 79, title: "Ausblick Solar 2027", date: "2026-12-14", type: "SEO", status: "Planned" },
  { id: 80, title: "Jahresabschluss Newsletter", date: "2026-12-21", type: "Newsletter", status: "Planned" },
];

// ============ CONTENT PILLARS ============
export interface ContentPillar {
  id: number;
  title: string;
  description: string;
  color: string;
  priority: 'HOCH' | 'MITTEL' | 'NIEDRIG';
  targetKeywords: number;
  completedKeywords: number;
  items: ContentItem[];
}

export interface ContentItem {
  id: number;
  title: string;
  type: 'Blog' | 'Video' | 'Tool' | 'Infographic' | 'Pillar Page' | 'Case Study';
  status: 'Planned' | 'Draft' | 'In Progress' | 'Review' | 'Published';
  dueDate?: string;
  assignee?: string;
}

export const contentPillars: ContentPillar[] = [
  {
    id: 1,
    title: "USV & Notstrom",
    description: "Differenzierung & USP - Das Alleinstellungsmerkmal von enerunity",
    color: "emerald",
    priority: "HOCH",
    targetKeywords: 11,
    completedKeywords: 2,
    items: [
      { id: 101, title: "Pillar Page: Kompletter Guide Solaranlage mit USV", type: "Pillar Page", status: "In Progress" },
      { id: 102, title: "Video-Serie: Was passiert bei Stromausfall?", type: "Video", status: "Planned" },
      { id: 103, title: "Infografik: USV vs. Generator vs. Batterie", type: "Infographic", status: "Planned" },
      { id: 104, title: "Case Study: B2B-Kunde mit kritischer Infrastruktur", type: "Case Study", status: "Planned" },
      { id: 105, title: "Blog: USV für Homeoffice", type: "Blog", status: "Review" },
      { id: 106, title: "Video: Nie wieder Stromausfall im Homeoffice", type: "Video", status: "Draft" },
    ]
  },
  {
    id: 2,
    title: "Autarkie & Unabhängigkeit",
    description: "Emotionale Ansprache - Für Menschen die unabhängig leben wollen",
    color: "blue",
    priority: "HOCH",
    targetKeywords: 8,
    completedKeywords: 0,
    items: [
      { id: 201, title: "Rechner: Autarkiegrad berechnen", type: "Tool", status: "In Progress" },
      { id: 202, title: "Blog-Serie: Weg zur Energieunabhängigkeit", type: "Blog", status: "Planned" },
      { id: 203, title: "Video: 100% autark – geht das?", type: "Video", status: "Planned" },
      { id: 204, title: "Newsletter-Serie: Autarkie in 12 Monaten", type: "Blog", status: "Planned" },
    ]
  },
  {
    id: 3,
    title: "Speicher & Batterie",
    description: "Technische Beratung - Für technikaffine Kunden",
    color: "purple",
    priority: "MITTEL",
    targetKeywords: 30,
    completedKeywords: 0,
    items: [
      { id: 301, title: "Stromspeicher Wirtschaftlichkeit", type: "Blog", status: "Planned" },
      { id: 302, title: "Heimspeicher selber bauen", type: "Video", status: "Planned" },
      { id: 303, title: "Batteriespeicher Vergleich 2026", type: "Blog", status: "Planned" },
      { id: 304, title: "ROI-Rechner: Lohnt sich ein Speicher?", type: "Tool", status: "Planned" },
    ]
  },
  {
    id: 4,
    title: "Balkonkraftwerk Basics",
    description: "Traffic & Awareness - Einstieg für Neukunden",
    color: "amber",
    priority: "MITTEL",
    targetKeywords: 150,
    completedKeywords: 12,
    items: [
      { id: 401, title: "Förderung 2026 Übersicht", type: "Blog", status: "Published" },
      { id: 402, title: "Montageanleitung Flachdach", type: "Video", status: "Published" },
      { id: 403, title: "Anmeldung beim Netzbetreiber", type: "Blog", status: "Review" },
      { id: 404, title: "Regionale Förderungsguides (16 Bundesländer)", type: "Blog", status: "Planned" },
      { id: 405, title: "FAQ: Die 20 häufigsten Fragen", type: "Blog", status: "Planned" },
    ]
  }
];

// ============ CAMPAIGNS ============
export interface Campaign {
  id: number;
  name: string;
  status: 'Planned' | 'Active' | 'Paused' | 'Ended';
  channel: string;
  budget: number;
  spent: number;
  roas: number;
  conversions: number;
  clicks: number;
  impressions: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  goals: string[];
}

export const campaigns: Campaign[] = [
  {
    id: 1,
    name: "Winterstrom & Sicherheit",
    status: "Active",
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
    goals: ["Brand Awareness", "Lead Generation"]
  },
  {
    id: 2,
    name: "B2B USV Offensive",
    status: "Active",
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
    goals: ["B2B Leads", "Demo Requests"]
  },
  {
    id: 3,
    name: "Autarkie-Rechner Launch",
    status: "Planned",
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
    goals: ["Tool Usage", "Email Signups"]
  },
  {
    id: 4,
    name: "Frühjahrs-Offensive",
    status: "Planned",
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
    goals: ["Sales", "Brand Awareness"]
  },
  {
    id: 5,
    name: "Sommer Peak Campaign",
    status: "Planned",
    channel: "Google Ads, Meta, YouTube",
    budget: 40000,
    spent: 0,
    roas: 0,
    conversions: 0,
    clicks: 0,
    impressions: 0,
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    targetAudience: "Alle Zielgruppen",
    goals: ["Sales Maximierung"]
  }
];

// ============ KPI DATA ============
export interface MonthlyKPI {
  month: string;
  revenue: number;
  target: number;
  conversions: number;
  usvShare: number;
  roas: number;
  organicTraffic: number;
  paidTraffic: number;
}

export const monthlyKPIs: MonthlyKPI[] = [
  { month: "Jan", revenue: 50000, target: 45000, conversions: 180, usvShare: 28, roas: 4.2, organicTraffic: 12000, paidTraffic: 8500 },
  { month: "Feb", revenue: 65000, target: 50000, conversions: 220, usvShare: 30, roas: 4.5, organicTraffic: 15000, paidTraffic: 10000 },
  { month: "Mär", revenue: 85000, target: 70000, conversions: 310, usvShare: 32, roas: 4.3, organicTraffic: 20000, paidTraffic: 14000 },
  { month: "Apr", revenue: 120000, target: 100000, conversions: 420, usvShare: 33, roas: 4.1, organicTraffic: 28000, paidTraffic: 22000 },
  { month: "Mai", revenue: 180000, target: 150000, conversions: 580, usvShare: 35, roas: 3.8, organicTraffic: 38000, paidTraffic: 35000 },
  { month: "Jun", revenue: 220000, target: 180000, conversions: 680, usvShare: 36, roas: 3.9, organicTraffic: 42000, paidTraffic: 40000 },
  { month: "Jul", revenue: 250000, target: 200000, conversions: 750, usvShare: 38, roas: 4.0, organicTraffic: 45000, paidTraffic: 42000 },
  { month: "Aug", revenue: 210000, target: 190000, conversions: 620, usvShare: 37, roas: 4.2, organicTraffic: 40000, paidTraffic: 35000 },
  { month: "Sep", revenue: 160000, target: 140000, conversions: 480, usvShare: 35, roas: 4.4, organicTraffic: 32000, paidTraffic: 25000 },
  { month: "Okt", revenue: 110000, target: 100000, conversions: 350, usvShare: 34, roas: 4.5, organicTraffic: 25000, paidTraffic: 18000 },
  { month: "Nov", revenue: 90000, target: 80000, conversions: 280, usvShare: 32, roas: 5.2, organicTraffic: 22000, paidTraffic: 20000 },
  { month: "Dez", revenue: 70000, target: 60000, conversions: 210, usvShare: 30, roas: 4.8, organicTraffic: 18000, paidTraffic: 12000 },
];

// Channel Attribution Data (basierend auf KleinesKraftwerk Insights)
export const channelAttribution = [
  { name: "Referral", value: 4085476, percentage: 24, color: "var(--chart-1)" },
  { name: "Paid Search", value: 3502042, percentage: 20.5, color: "var(--chart-2)" },
  { name: "Direct", value: 2775280, percentage: 16.3, color: "var(--chart-3)" },
  { name: "Organic Search", value: 1727388, percentage: 10.1, color: "var(--chart-4)" },
  { name: "Cross-network", value: 1690871, percentage: 9.9, color: "var(--chart-5)" },
  { name: "Unassigned", value: 2842622, percentage: 16.7, color: "var(--muted)" },
  { name: "Social", value: 86225, percentage: 0.5, color: "var(--accent)" },
];

// ============ ZIELGRUPPEN ============
export const targetAudiences = [
  { name: "Sicherheitsbewusste", description: "Menschen, die Stromausfälle fürchten (Homeoffice, medizinische Geräte)", percentage: 30, priority: "HOCH" },
  { name: "Autarkie-Interessierte", description: "Selbstversorger, Off-Grid-Enthusiasten", percentage: 25, priority: "HOCH" },
  { name: "B2B Kritische Infrastruktur", description: "Server, Produktion, Medizin, Gastronomie", percentage: 20, priority: "HOCH" },
  { name: "Hausbesitzer", description: "Eigenheimbesitzer mit PV-Interesse", percentage: 15, priority: "MITTEL" },
  { name: "Mieter", description: "Balkonkraftwerk-Interessierte", percentage: 10, priority: "MITTEL" },
];

// ============ INFOGRAFIKEN PLAN ============
export const infographicsPlan = [
  { month: "Januar", title: "USV vs. Generator vs. Batterie", status: "Planned" },
  { month: "Februar", title: "Förderungen nach Bundesland", status: "Planned" },
  { month: "März", title: "Balkonkraftwerk Montageorte", status: "Planned" },
  { month: "April", title: "Autarkiegrad-Rechner", status: "Planned" },
  { month: "Mai", title: "Watt-Vergleich: Was kann ich betreiben?", status: "Planned" },
  { month: "Juni", title: "Sommer-Ertrag maximieren", status: "Planned" },
  { month: "Juli", title: "Camping-Solar Checkliste", status: "Planned" },
  { month: "August", title: "USV für B2B: Einsatzbereiche", status: "Planned" },
  { month: "September", title: "Herbst-Wintercheck", status: "Planned" },
  { month: "Oktober", title: "Strompreis-Entwicklung", status: "Planned" },
  { month: "November", title: "Black Friday Checkliste", status: "Planned" },
  { month: "Dezember", title: "Jahresplanung Solar 2027", status: "Planned" },
];

// ============ BUDGET PLAN ============
export const budgetPlan = {
  total: 120000,
  quarterly: [
    { quarter: "Q1", budget: 18000, spent: 10600, percentage: 15 },
    { quarter: "Q2", budget: 36000, spent: 0, percentage: 30 },
    { quarter: "Q3", budget: 42000, spent: 0, percentage: 35 },
    { quarter: "Q4", budget: 24000, spent: 0, percentage: 20 },
  ],
  byChannel: [
    { channel: "SEA", monthly: 4000, yearly: 48000, percentage: 40 },
    { channel: "Content (Blog/Video)", monthly: 3000, yearly: 36000, percentage: 30 },
    { channel: "Social Media Ads", monthly: 1500, yearly: 18000, percentage: 15 },
    { channel: "PR", monthly: 1000, yearly: 12000, percentage: 10 },
    { channel: "Tools & Software", monthly: 500, yearly: 6000, percentage: 5 },
  ]
};
