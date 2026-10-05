import type { SosReport, SubmitResult } from "./types";

/**
 * Base URL of the FastAPI backend.
 * Example:
 * VITE_SOS_API_URL=http://127.0.0.1:8000
 */
export const SOS_API_URL: string | undefined = import.meta.env["VITE_SOS_API_URL"] || undefined;

export const isBackendConfigured = () => Boolean(SOS_API_URL);

export async function submitSos(report: SosReport): Promise<SubmitResult> {
  if (!SOS_API_URL) {
    return { kind: "not_configured" };
  }

  try {
    const res = await fetch(`${SOS_API_URL.replace(/\/$/, "")}/sos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        // Match FastAPI field names
        disaster_type: report.emergencyType,
        description: report.description || null,
        latitude: report.location.latitude,
        longitude: report.location.longitude,
        accuracy: report.location.accuracy,
      }),
    });

    if (!res.ok) {
      console.error("SOS submit failed:", res.status, await res.text());

      return { kind: "failed" };
    }

    const data = (await res.json()) as {
      success?: boolean;
      message?: string;
      sos_id?: string;
    };

    console.log("SOS submitted:", data);

    if (data.sos_id) {
      return {
        kind: "sent",
        reference: data.sos_id,
      };
    }

    return { kind: "sent" };
  } catch (error) {
    console.error("SOS submit error:", error);

    return { kind: "failed" };
  }
}
