import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKnowledgeById, getHoldersByKnowledgeId } from "@/lib/data/seed";
import type { HolderWithProfile } from "@/types/database";

function computeMatchScore(holder: HolderWithProfile) {
  // Simple heuristic scoring (agent.md §6)
  const expertise = 0.9; // High — matched by knowledge
  const location = holder.profile?.teaching_methods?.includes("video-call")
    ? 0.7
    : 0.5;
  const language = holder.languages.includes("Bahasa Indonesia") ? 0.8 : 0.5;
  const availability = holder.profile?.availability ? 0.7 : 0.3;

  const score =
    0.4 * expertise + 0.2 * location + 0.2 * language + 0.2 * availability;

  return {
    total: Math.round(score * 100),
    breakdown: {
      expertise: Math.round(expertise * 100),
      location: Math.round(location * 100),
      language: Math.round(language * 100),
      availability: Math.round(availability * 100),
    },
  };
}

export default async function MentorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const knowledge = getKnowledgeById(id);

  if (!knowledge) {
    notFound();
  }

  const holders = getHoldersByKnowledgeId(id);
  const matches = holders
    .map((holder) => ({
      holder,
      score: computeMatchScore(holder),
    }))
    .sort((a, b) => b.score.total - a.score.total);

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 md:py-24 px-6">
        <div className="mx-auto max-w-[720px]">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-text-secondary">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">·</span>
            <Link
              href={`/knowledge/${id}`}
              className="hover:text-foreground transition-colors"
            >
              {knowledge.title}
            </Link>
            <span className="mx-2">·</span>
            <span className="text-foreground">Find a Mentor</span>
          </nav>

          {/* Header */}
          <p className="text-caption text-text-secondary mb-3">FIND MY MENTOR</p>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Learn from the source
          </h1>
          <p className="text-text-secondary mb-12">
            These cultural holders can guide you in learning{" "}
            <span className="text-foreground">{knowledge.title}</span>. Match
            scores are based on expertise, location, language, and availability.
          </p>

          {matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map(({ holder, score }) => (
                <div
                  key={holder.id}
                  className="border border-border rounded-md p-6 hover:bg-surface/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg text-foreground">
                        {holder.full_name}
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {holder.location_city}, {holder.location_region}
                        {holder.profile?.years_of_practice &&
                          ` · ${holder.profile.years_of_practice} tahun pengalaman`}
                      </p>
                    </div>
                    {/* Match score — simple number, not a gauge */}
                    <div className="text-right shrink-0">
                      <p className="font-display text-2xl text-foreground">
                        {score.total}%
                      </p>
                      <p className="text-caption text-text-secondary">match</p>
                    </div>
                  </div>

                  {/* Expertise */}
                  {holder.profile?.expertise_summary && (
                    <p className="text-sm text-text-secondary mb-4">
                      {holder.profile.expertise_summary}
                    </p>
                  )}

                  {/* Score breakdown — transparent */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: "Expertise", value: score.breakdown.expertise },
                      { label: "Location", value: score.breakdown.location },
                      { label: "Language", value: score.breakdown.language },
                      {
                        label: "Availability",
                        value: score.breakdown.availability,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="text-center p-2 border border-border rounded"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {item.value}%
                        </p>
                        <p className="text-[10px] text-text-secondary mt-0.5">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Teaching methods + availability */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {holder.profile?.teaching_methods?.map((method) => (
                      <span
                        key={method}
                        className="px-2 py-1 text-xs border border-border rounded text-text-secondary"
                      >
                        {method}
                      </span>
                    ))}
                    {holder.languages?.map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-1 text-xs border border-border rounded text-text-secondary"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="px-5 py-2.5 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors text-sm">
                    Request Mentorship
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-border rounded-md p-8 text-center">
              <p className="text-text-secondary">
                No mentors available for this knowledge yet.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
