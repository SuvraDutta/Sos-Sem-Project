import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  LocateFixed,
  MapPin,
  Pencil,
  RotateCcw,
  Siren,
} from "lucide-react";
import { useGeolocation } from "../useGeolocation";
import { EMERGENCY_TYPES, type EmergencyType, type LocationState, type SubmitResult } from "../types";
import { submitSos, isBackendConfigured } from "../api";
import { LocationMap } from "./LocationMap";

type Step = "start" | "location" | "type" | "details" | "review";
const STEPS: { key: Exclude<Step, "start">; label: string }[] = [
  { key: "location", label: "Location" },
  { key: "type", label: "What happened" },
  { key: "details", label: "Details" },
  { key: "review", label: "Review" },
];

type SendState = "idle" | "sending" | SubmitResult["kind"];

export function ReportFlow() {
  const [step, setStep] = useState<Step>("start");
  const geo = useGeolocation();
  const [type, setType] = useState<EmergencyType | null>(null);
  const [description, setDescription] = useState("");
  const [send, setSend] = useState<SendState>("idle");
  const [reference, setReference] = useState<string>();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step !== "start") headingRef.current?.focus();
  }, [step]);

  const fix = geo.state.status === "success" ? geo.state.fix : null;

  async function handleSend() {
    if (!fix || !type) return;
    setSend("sending");
    const r = await submitSos({ emergencyType: type, description: description.trim(), location: fix });
    if (r.kind === "sent") setReference(r.reference);
    setSend(r.kind);
  }

  function reset() {
    setStep("start");
    setType(null);
    setDescription("");
    setSend("idle");
    setReference(undefined);
  }

  if (step === "start") {
    return (
      <section aria-labelledby="start-heading" className="border-b border-border pb-8">
        <h1 id="start-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
          Need help?
        </h1>
        <p className="mt-2 max-w-xl text-lg text-muted-foreground">
          Report an emergency and share your location.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" className="btn-sos" onClick={() => setStep("location")}>
            <Siren className="size-6" aria-hidden />
            Send SOS
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setStep("location");
              geo.request();
            }}
          >
            <LocateFixed className="size-5" aria-hidden />
            Share my location
          </button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Send SOS starts a short report: location, what happened, and a quick review before sending.
        </p>
      </section>
    );
  }

  const idx = STEPS.findIndex((s) => s.key === step);
  const back = () => setStep(idx <= 0 ? "start" : (STEPS[idx - 1]?.key ?? "start"));

  return (
    <section aria-labelledby="flow-heading" className="border-b border-border pb-8">
      <div className="flex items-center justify-between gap-3">
        <button type="button" className="btn-ghost" onClick={back} disabled={send === "sending"}>
          <ChevronLeft className="size-4" aria-hidden />
          Back
        </button>
        <p className="text-sm font-medium text-muted-foreground">
          Step {idx + 1} of {STEPS.length}
        </p>
      </div>

      <ol className="mt-4 grid grid-cols-4 gap-1" aria-label="Report progress">
        {STEPS.map((s, i) => (
          <li key={s.key}>
            <div className={`h-1.5 ${i <= idx ? "bg-emergency" : "bg-muted"}`} />
            <span
              className={`mt-1.5 hidden text-xs sm:block ${i === idx ? "font-semibold text-foreground" : "text-muted-foreground"}`}
              aria-current={i === idx ? "step" : undefined}
            >
              {s.label}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-6">
        {step === "location" && (
          <>
            <h2 id="flow-heading" ref={headingRef} tabIndex={-1} className="step-title">
              Where are you?
            </h2>
            <LocationPanel state={geo.state} onRequest={geo.request} />
            <div className="mt-6">
              <button
                type="button"
                className="btn-primary"
                disabled={!fix}
                onClick={() => setStep("type")}
              >
                Continue
              </button>
              {!fix && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Your location is needed so help can find you.
                </p>
              )}
            </div>
          </>
        )}

        {step === "type" && (
          <fieldset>
            <legend id="flow-heading" ref={headingRef as never} tabIndex={-1} className="step-title">
              What happened?
            </legend>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {EMERGENCY_TYPES.map((t) => {
                const selected = type === t.value;
                return (
                  <label key={t.value} className={`choice ${selected ? "choice-selected" : ""}`}>
                    <input
                      type="radio"
                      name="emergency-type"
                      value={t.value}
                      checked={selected}
                      onChange={() => setType(t.value)}
                      className="sr-only"
                    />
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-emergency bg-emergency" : "border-input"}`}
                      aria-hidden
                    >
                      {selected && <Check className="size-3 text-emergency-foreground" strokeWidth={3} />}
                    </span>
                    {t.label}
                  </label>
                );
              })}
            </div>
            <button
              type="button"
              className="btn-primary mt-6"
              disabled={!type}
              onClick={() => setStep("details")}
            >
              Continue
            </button>
          </fieldset>
        )}

        {step === "details" && (
          <>
            <h2 id="flow-heading" ref={headingRef} tabIndex={-1} className="step-title">
              <label htmlFor="desc">What should we know?</label>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Optional. A few words is enough.</p>
            <textarea
              id="desc"
              rows={4}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what is happening..."
              className="field mt-3"
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">{description.length}/500</p>
            <button type="button" className="btn-primary mt-4" onClick={() => setStep("review")}>
              Review report
            </button>
          </>
        )}

        {step === "review" && fix && type && (
          <>
            <h2 id="flow-heading" ref={headingRef} tabIndex={-1} className="step-title">
              Review before sending
            </h2>
            <dl className="mt-4 divide-y divide-border border-y border-border">
              <ReviewRow label="Emergency" onEdit={() => setStep("type")} disabled={send !== "idle" && send !== "failed"}>
                {EMERGENCY_TYPES.find((t) => t.value === type)?.label}
              </ReviewRow>
              <ReviewRow label="Location" onEdit={() => setStep("location")} disabled={send !== "idle" && send !== "failed"}>
                <span className="block">Location detected</span>
                <span className="block font-mono text-sm text-muted-foreground">
                  Latitude {fix.latitude.toFixed(5)} · Longitude {fix.longitude.toFixed(5)} · ±
                  {Math.round(fix.accuracy)} m
                </span>
              </ReviewRow>
              <ReviewRow label="Description" onEdit={() => setStep("details")} disabled={send !== "idle" && send !== "failed"}>
                {description.trim() || <span className="text-muted-foreground">None added</span>}
              </ReviewRow>
            </dl>

            <div className="mt-6" aria-live="polite">
              {(send === "idle" || send === "sending" || send === "failed") && (
                <button
                  type="button"
                  className="btn-sos"
                  onClick={handleSend}
                  disabled={send === "sending"}
                >
                  {send === "sending" ? (
                    <>
                      <Loader2 className="size-6 animate-spin" aria-hidden /> Sending...
                    </>
                  ) : send === "failed" ? (
                    <>
                      <RotateCcw className="size-5" aria-hidden /> Try sending again
                    </>
                  ) : (
                    <>
                      <Siren className="size-6" aria-hidden /> Send SOS
                    </>
                  )}
                </button>
              )}

              {send === "failed" && (
                <Notice tone="error" title="Unable to send SOS">
                  Your report was not delivered. Check your connection and try again. If you are in
                  immediate danger, contact local emergency services directly.
                </Notice>
              )}

              {send === "not_configured" && (
                <Notice tone="warning" title="Emergency report not sent">
                  Your report could not be sent because emergency reporting is currently
                  unavailable. No emergency service has received this report.
                </Notice>
              )}

              {send === "sent" && (
                <Notice tone="success" title="SOS sent">
                  Your report was received{reference ? ` (reference ${reference})` : ""}. Stay where
                  you are if it is safe, and keep your phone with you.
                </Notice>
              )}

              {(send === "sent" || send === "not_configured") && (
                <button type="button" className="btn-ghost mt-4" onClick={reset}>
                  Start a new report
                </button>
              )}
            </div>
            {!isBackendConfigured() && send === "idle" && (
              <p className="mt-3 text-sm text-muted-foreground">
                Note: emergency reporting is currently unavailable. Your report will be prepared but not delivered.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ReviewRow({
  label,
  children,
  onEdit,
  disabled,
}: {
  label: string;
  children: React.ReactNode;
  onEdit: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
        <dd className="mt-1 break-words">{children}</dd>
      </div>
      <button type="button" className="btn-ghost shrink-0" onClick={onEdit} disabled={disabled}>
        <Pencil className="size-4" aria-hidden />
        Edit<span className="sr-only"> {label.toLowerCase()}</span>
      </button>
    </div>
  );
}

function Notice({
  tone,
  title,
  children,
}: {
  tone: "error" | "warning" | "success" | "info";
  title: string;
  children: React.ReactNode;
}) {
  const Icon = tone === "success" ? CheckCircle2 : AlertTriangle;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`notice notice-${tone} mt-4`}>
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm">{children}</p>
      </div>
    </div>
  );
}

function LocationPanel({ state, onRequest }: { state: LocationState; onRequest: () => void }) {
  const loading = state.status === "loading";
  return (
    <div className="mt-4 space-y-4">
      <div aria-live="polite">
        {state.status === "idle" && (
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-5" aria-hidden /> Location not detected
          </p>
        )}
        {loading && (
          <p className="flex items-center gap-2">
            <Loader2 className="size-5 animate-spin" aria-hidden /> Getting your location...
          </p>
        )}
        {state.status === "success" && (
          <div>
            <p className="flex items-center gap-2 font-semibold text-success">
              <CheckCircle2 className="size-5" aria-hidden /> Location detected
            </p>
            <dl className="mt-2 grid grid-cols-3 gap-2 font-mono text-sm">
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Latitude</dt>
                <dd>{state.fix.latitude.toFixed(5)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Longitude</dt>
                <dd>{state.fix.longitude.toFixed(5)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Accuracy</dt>
                <dd>±{Math.round(state.fix.accuracy)} m</dd>
              </div>
            </dl>
          </div>
        )}
        {state.status === "denied" && (
          <Notice tone="error" title="Location access was denied.">
            To share your location, allow location access for this site in your browser settings, then
            try again.
          </Notice>
        )}
        {state.status === "unavailable" && (
          <Notice tone="error" title="Unable to determine your location.">
            Move to an open area or turn on location services on your device, then try again.
          </Notice>
        )}
        {state.status === "timeout" && (
          <Notice tone="error" title="Location request timed out. Please try again.">
            Getting a location fix took too long.
          </Notice>
        )}
      </div>

      {state.status === "success" && <LocationMap fix={state.fix} />}

      <button type="button" className="btn-secondary" onClick={onRequest} disabled={loading}>
        <LocateFixed className="size-5" aria-hidden />
        {state.status === "success" ? "Update my location" : state.status === "idle" ? "Share my location" : loading ? "Getting location..." : "Try again"}
      </button>
    </div>
  );
}
