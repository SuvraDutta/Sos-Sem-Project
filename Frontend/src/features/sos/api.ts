import type { SosReport, SubmitResult } from "./types";

/**
 * Base URL of the FastAPI backend.
 */
export const SOS_API_URL: string | undefined =
  import.meta.env["VITE_SOS_API_URL"] || undefined;

export const isBackendConfigured = () => Boolean(SOS_API_URL);

export async function submitSos(
  report: SosReport
): Promise<SubmitResult> {
  if (!SOS_API_URL) {
    console.error("SOS API URL is not configured");
    return { kind: "not_configured" };
  }

  try {
    const res = await fetch(
      `${SOS_API_URL.replace(/\/$/, "")}/sos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disaster_type: report.emergencyType,
          description: report.description || null,
          latitude: report.location.latitude,
          longitude: report.location.longitude,
          accuracy: report.location.accuracy,
        }),
      }
    );

    const data = await res.json().catch(() => ({}));

    console.log("SOS API response:", data);

    if (!res.ok) {
      console.error("SOS submit failed:", res.status, data);
      return { kind: "failed" };
    }

    // FastAPI returns sos_id
    if (data.sos_id) {
      return {
        kind: "sent",
        reference: String(data.sos_id),
      };
    }

    return {
      kind: "sent",
    };

  } catch (error) {
    console.error("SOS submit error:", error);
    return { kind: "failed" };
  }
}