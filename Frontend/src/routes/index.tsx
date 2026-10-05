import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ReportFlow } from "@/features/sos/components/ReportFlow";
import { SAFETY_GUIDES } from "@/features/sos/safety";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Disaster SOS — Report an emergency" },
      { name: "description", content: "Report a disaster or emergency and share your current location." },
      { property: "og:title", content: "Disaster SOS — Report an emergency" },
      { property: "og:description", content: "Report a disaster or emergency and share your current location." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <ReportFlow />
      <section aria-labelledby="info-heading" className="pt-8">
        <h2 id="info-heading" className="text-lg font-semibold">Stay safe</h2>
        <ul className="mt-3 divide-y divide-border border-y border-border">
          {SAFETY_GUIDES.map((g) => (
            <li key={g.id}>
              <Link
                to="/information"
                hash={g.id}
                className="flex items-center justify-between py-3 hover:text-emergency focus-visible:text-emergency"
              >
                <span>
                  <span className="font-medium">{g.title} safety</span>
                  <span className="block text-sm text-muted-foreground">{g.points[0]}</span>
                </span>
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
