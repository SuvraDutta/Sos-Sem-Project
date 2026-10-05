import { createFileRoute, Link } from "@tanstack/react-router";
import { Siren } from "lucide-react";
import { SAFETY_GUIDES } from "@/features/sos/safety";

export const Route = createFileRoute("/information")({
  head: () => ({
    meta: [
      { title: "Emergency safety information — Disaster SOS" },
      { name: "description", content: "Short safety guidance for floods, fires, earthquakes, cyclones and medical emergencies." },
      { property: "og:title", content: "Emergency safety information — Disaster SOS" },
      { property: "og:description", content: "Short safety guidance for floods, fires, earthquakes, cyclones and medical emergencies." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InformationPage,
});

function InformationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Emergency information</h1>
      <p className="mt-2 text-muted-foreground">
        Short, practical steps. Always follow instructions from local authorities.
      </p>
      <nav aria-label="Topics" className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {SAFETY_GUIDES.map((g) => (
          <a key={g.id} href={`#${g.id}`} className="underline underline-offset-4 hover:text-emergency">
            {g.title}
          </a>
        ))}
      </nav>
      <div className="mt-6 divide-y divide-border border-y border-border">
        {SAFETY_GUIDES.map((g) => (
          <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="scroll-mt-20 py-5">
            <h2 id={`${g.id}-h`} className="text-lg font-semibold">{g.title} safety</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {g.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </section>
        ))}
      </div>
      <Link to="/" className="btn-sos mt-8">
        <Siren className="size-6" aria-hidden /> Report an emergency
      </Link>
    </div>
  );
}
