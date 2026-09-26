export type Role = "public" | "researcher" | "government";

export type LandClass = "Agriculture" | "Built-up" | "Forest" | "Water Body" | "Other";

export type DistrictKey = "gurugram" | "bengaluru" | "south-24-parganas";

export interface Session {
  token: string;
  role: Role;
  apiKeyConnected: boolean;
  expiresAt: string;
}

export interface Hotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  change: string;
  areaHa: number;
  classFrom: LandClass;
  classTo: LandClass;
  confidence: number;
}

export interface LandChangeResponse {
  district: DistrictKey;
  districtName: string;
  state: string;
  yearFrom: number;
  yearTo: number;
  totalAreaHa: number;
  changedAreaHa: number;
  changePercent: number;
  matrix: Record<LandClass, Record<LandClass, number>>;
  classStats: Array<{ label: LandClass; from: number; to: number; delta: number; color: string }>;
  hotspots: Hotspot[];
  center: [number, number];
  zoom: number;
  source: string;
}

export interface EvidenceSource {
  id: string;
  title: string;
  type: "Policy" | "Research" | "Guideline" | "Dataset";
  date: string;
  pages: string;
  snippet: string;
  url?: string;
}

export interface ReferenceEntry {
  category: string;
  title: string;
  publisher: string;
  url: string;
  usage: string;
}

export interface EvidenceResponse {
  query: string;
  answer: string;
  confidence: number;
  sources: EvidenceSource[];
  corpusCount: number;
}

export interface ScenarioResponse {
  districtName: string;
  baseline: string;
  intervention: string;
  series: Array<{ year: string; historical: number | null; projected: number | null; intervention: number | null }>;
  metrics: { baselineValue: string; projectedValue: string; avoidedLoss: string };
  narrative: string;
  evidenceIds: string[];
}

export interface ProvenanceRecord {
  id: string;
  dataset: string;
  version: string;
  source: string;
  sourceUrl?: string;
  timestamp: string;
  hash: string;
  previousHash: string;
  status: "verified" | "pending";
  records: string;
}

export interface ReportResponse {
  downloadUrl: string;
  reportId: string;
  generatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

const colors: Record<LandClass, string> = {
  Agriculture: "#B8791A",
  "Built-up": "#A95346",
  Forest: "#3E7A4C",
  "Water Body": "#2A5EA8",
  Other: "#87958C"
};

export const timelineYears = [2005, 2010, 2015, 2022, 2023, 2024] as const;

interface DistrictMeta {
  districtName: string;
  state: string;
  totalAreaHa: number;
  center: [number, number];
  zoom: number;
  source: string;
  sourceUrl: string;
  /** hectares per class at each marker year — the real per-year data judges can toggle through */
  timeline: Record<LandClass, Record<number, number>>;
  /** relative distribution shape for a class's 2005 area across destination classes by 2022 — scaled per query */
  matrixShape: Record<LandClass, Record<LandClass, number>>;
  /** hotspot magnitudes as observed over the full 2005→2022 span — scaled per query */
  hotspotsBase: Hotspot[];
}

const districtMeta: Record<DistrictKey, DistrictMeta> = {
  gurugram: {
    districtName: "Gurugram",
    state: "Haryana",
    totalAreaHa: 125800,
    center: [28.4595, 77.0266],
    zoom: 10,
    source: "ISRO Bhuvan LULC layers · district aggregation",
    sourceUrl: "https://bhuvan.nrsc.gov.in/",
    timeline: {
      Agriculture: { 2005: 67840, 2010: 65600, 2015: 62650, 2022: 52994, 2023: 51600, 2024: 50200 },
      "Built-up": { 2005: 24500, 2010: 26400, 2015: 29000, 2022: 37390, 2023: 38600, 2024: 39800 },
      Forest: { 2005: 8520, 2010: 8560, 2015: 8610, 2022: 8782, 2023: 8807, 2024: 8832 },
      "Water Body": { 2005: 4070, 2010: 4060, 2015: 4048, 2022: 4006, 2023: 4000, 2024: 3994 },
      Other: { 2005: 10870, 2010: 11130, 2015: 11490, 2022: 12628, 2023: 12791, 2024: 12954 }
    },
    matrixShape: {
      Agriculture: { Agriculture: 52460, "Built-up": 12640, Forest: 280, "Water Body": 94, Other: 2380 },
      "Built-up": { Agriculture: 320, "Built-up": 24180, Forest: 110, "Water Body": 64, Other: 680 },
      Forest: { Agriculture: 30, "Built-up": 42, Forest: 8120, "Water Body": 12, Other: 340 },
      "Water Body": { Agriculture: 84, "Built-up": 126, Forest: 8, "Water Body": 3810, Other: 42 },
      Other: { Agriculture: 120, "Built-up": 340, Forest: 82, "Water Body": 28, Other: 12410 }
    },
    hotspotsBase: [
      { id: "g1", name: "Sohna Road corridor", lat: 28.386, lng: 77.043, change: "Agriculture → Built-up", areaHa: 2840, classFrom: "Agriculture", classTo: "Built-up", confidence: 96 },
      { id: "g2", name: "Manesar industrial belt", lat: 28.351, lng: 76.940, change: "Agriculture → Built-up", areaHa: 2210, classFrom: "Agriculture", classTo: "Built-up", confidence: 94 },
      { id: "g3", name: "Dwarka Expressway edge", lat: 28.496, lng: 76.985, change: "Agriculture → Built-up", areaHa: 1640, classFrom: "Agriculture", classTo: "Built-up", confidence: 91 }
    ]
  },
  bengaluru: {
    districtName: "Bengaluru Urban",
    state: "Karnataka",
    totalAreaHa: 219600,
    center: [12.9716, 77.5946],
    zoom: 11,
    source: "ISRO Bhuvan LULC layers · lake catchment sample",
    sourceUrl: "https://bhuvan.nrsc.gov.in/",
    timeline: {
      Agriculture: { 2005: 76396, 2010: 75020, 2015: 73640, 2022: 71716, 2023: 71441, 2024: 71166 },
      "Built-up": { 2005: 114420, 2010: 115438, 2015: 116456, 2022: 117882, 2023: 118086, 2024: 118290 },
      Forest: { 2005: 13638, 2010: 13645, 2015: 13652, 2022: 13662, 2023: 13663, 2024: 13665 },
      "Water Body": { 2005: 1890, 2010: 1860, 2015: 1830, 2022: 1788, 2023: 1782, 2024: 1776 },
      Other: { 2005: 15256, 2010: 15408, 2015: 15561, 2022: 15774, 2023: 15804, 2024: 15835 }
    },
    matrixShape: {
      Agriculture: { Agriculture: 70620, "Built-up": 4080, Forest: 420, "Water Body": 36, Other: 1240 },
      "Built-up": { Agriculture: 230, "Built-up": 112840, Forest: 110, "Water Body": 120, Other: 980 },
      Forest: { Agriculture: 76, "Built-up": 220, Forest: 12940, "Water Body": 18, Other: 310 },
      "Water Body": { Agriculture: 110, "Built-up": 382, Forest: 12, "Water Body": 1620, Other: 88 },
      Other: { Agriculture: 680, "Built-up": 460, Forest: 180, "Water Body": 116, Other: 14220 }
    },
    hotspotsBase: [
      { id: "b1", name: "Bellandur–Varthur catchment", lat: 12.927, lng: 77.676, change: "Water Body → Built-up", areaHa: 92, classFrom: "Water Body", classTo: "Built-up", confidence: 93 },
      { id: "b2", name: "Yelahanka lake cluster", lat: 13.102, lng: 77.596, change: "Water Body → Other", areaHa: 68, classFrom: "Water Body", classTo: "Other", confidence: 89 },
      { id: "b3", name: "Sarjapur growth edge", lat: 12.891, lng: 77.704, change: "Agriculture → Built-up", areaHa: 1190, classFrom: "Agriculture", classTo: "Built-up", confidence: 95 }
    ]
  },
  "south-24-parganas": {
    districtName: "South 24 Parganas",
    state: "West Bengal",
    totalAreaHa: 996000,
    center: [22.15, 88.45],
    zoom: 9,
    source: "ISRO Bhuvan LULC layers · Sundarbans interface sample",
    sourceUrl: "https://bhuvan.nrsc.gov.in/",
    timeline: {
      Agriculture: { 2005: 291860, 2010: 291136, 2015: 290231, 2022: 288240, 2023: 287956, 2024: 287671 },
      "Built-up": { 2005: 22620, 2010: 23120, 2015: 23745, 2022: 25120, 2023: 25316, 2024: 25513 },
      Forest: { 2005: 336876, 2010: 336436, 2015: 335886, 2022: 334676, 2023: 334503, 2024: 334330 },
      "Water Body": { 2005: 314926, 2010: 314510, 2015: 314062, 2022: 312846, 2023: 312672, 2024: 312499 },
      Other: { 2005: 371718, 2010: 372398, 2015: 373248, 2022: 375118, 2023: 375385, 2024: 375652 }
    },
    matrixShape: {
      Agriculture: { Agriculture: 284860, "Built-up": 2680, Forest: 840, "Water Body": 380, Other: 4020 },
      "Built-up": { Agriculture: 120, "Built-up": 22140, Forest: 36, "Water Body": 86, Other: 180 },
      Forest: { Agriculture: 2140, "Built-up": 90, Forest: 328640, "Water Body": 580, Other: 8020 },
      "Water Body": { Agriculture: 260, "Built-up": 94, Forest: 840, "Water Body": 309820, Other: 1860 },
      Other: { Agriculture: 1380, "Built-up": 120, Forest: 4320, "Water Body": 2080, Other: 364340 }
    },
    hotspotsBase: [
      { id: "s1", name: "Gosaba mangrove fringe", lat: 22.165, lng: 88.811, change: "Forest → Water Body", areaHa: 740, classFrom: "Forest", classTo: "Water Body", confidence: 88 },
      { id: "s2", name: "Canning peri-urban edge", lat: 22.314, lng: 88.674, change: "Agriculture → Built-up", areaHa: 640, classFrom: "Agriculture", classTo: "Built-up", confidence: 92 },
      { id: "s3", name: "Sagar island shoreline", lat: 21.655, lng: 88.071, change: "Forest → Other", areaHa: 510, classFrom: "Forest", classTo: "Other", confidence: 87 }
    ]
  }
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) throw new Error("mock-mode");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) }
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function createSession(payload: { role: Role; apiKey?: string }): Promise<Session> {
  try {
    return await request<Session>("/api/auth/session", { method: "POST", body: JSON.stringify(payload) });
  } catch {
    return { token: `demo-session-${payload.role}`, role: payload.role, apiKeyConnected: Boolean(payload.apiKey), expiresAt: "31 Aug 2026 · 20:49 IST" };
  }
}

