export type EmergencyType =
  | "flood"
  | "fire"
  | "earthquake"
  | "cyclone"
  | "landslide"
  | "accident"
  | "medical"
  | "other";

export const EMERGENCY_TYPES: { value: EmergencyType; label: string }[] = [
  { value: "flood", label: "Flood" },
  { value: "fire", label: "Fire" },
  { value: "earthquake", label: "Earthquake" },
  { value: "cyclone", label: "Cyclone" },
  { value: "landslide", label: "Landslide" },
  { value: "accident", label: "Accident" },
  { value: "medical", label: "Medical emergency" },
  { value: "other", label: "Other" },
];

export interface GeoFix {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export type LocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; fix: GeoFix }
  | { status: "denied" }
  | { status: "unavailable" }
  | { status: "timeout" };

export interface SosReport {
  emergencyType: EmergencyType;
  description: string;
  location: GeoFix;
}

export type SubmitResult =
  | { kind: "sent"; reference?: string }
  | { kind: "not_configured" }
  | { kind: "failed" };
