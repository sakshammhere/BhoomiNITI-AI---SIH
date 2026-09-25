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

