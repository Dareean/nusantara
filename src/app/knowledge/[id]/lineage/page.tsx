import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKnowledgeById, getLineageByKnowledgeId } from "@/lib/data/seed";
import LineageTimeline from "@/components/lineage/LineageTimeline";

export default async function LineagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const knowledge = getKnowledgeById(id);

  if (!knowledge) {
    notFound();
  }

  const lineage = getLineageByKnowledgeId(id);

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
            <span className="text-foreground">Lineage</span>
          </nav>

          {/* Header */}
          <p className="text-caption text-text-secondary mb-3">
            KNOWLEDGE LINEAGE
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            The chain of transmission
          </h1>
          <p className="text-text-secondary mb-12">
            From generation to generation, this knowledge has been passed on
            through hands, voice, and practice. Each name below is a link in
            that chain.
          </p>

          {lineage.length > 0 ? (
            <LineageTimeline entries={lineage} />
          ) : (
            <div className="border border-border rounded-md p-8 text-center">
              <p className="text-text-secondary">
                No lineage has been documented yet for this knowledge.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 border border-border rounded-md p-6 text-center">
            <p className="font-display text-lg text-foreground mb-2">
              Become the next link
            </p>
            <p className="text-sm text-text-secondary mb-4">
              Learn from the last carriers and ensure this knowledge survives.
            </p>
            <Link
              href={`/knowledge/${id}/learn`}
              className="inline-block px-5 py-2.5 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors text-sm"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
