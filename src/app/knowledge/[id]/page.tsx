import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getKnowledgeById,
  getDnaNodesByKnowledgeId,
  getRiskImpactItems,
} from "@/lib/data/seed";
import DnaAccordion from "@/components/knowledge-dna/DnaAccordion";
import RiskIndicator from "@/components/knowledge-dna/RiskIndicator";
import type { KnowledgeDnaNode, DnaNodeType } from "@/types/database";

const CATEGORY_LABELS: Record<string, string> = {
  craft: "Kriya Tekstil & Tenun",
  language: "Bahasa & Sastra Daerah",
  music: "Musik & Pelantunan Ritual",
  culinary: "Rempah & Kuliner Leluhur",
  ritual: "Upacara & Daur Hidup",
  oral_story: "Tradisi Tutur & Mitos",
  other: "Kearifan Lokal",
};

function groupDnaNodes(nodes: KnowledgeDnaNode[]) {
  const grouped: Record<DnaNodeType, KnowledgeDnaNode[]> = {
    technique: [],
    knowledge_fact: [],
    meaning: [],
    story: [],
    people: [],
    variation: [],
    warning: [],
    terminology: [],
  };

  for (const node of nodes) {
    if (grouped[node.node_type]) {
      grouped[node.node_type].push(node);
    }
  }

  for (const key of Object.keys(grouped) as DnaNodeType[]) {
    grouped[key].sort((a, b) => a.order_index - b.order_index);
  }

  return grouped;
}

export default async function KnowledgeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const knowledge = getKnowledgeById(id);

  if (!knowledge) {
    notFound();
  }

  const dnaNodes = getDnaNodesByKnowledgeId(id);
  const grouped = groupDnaNodes(dnaNodes);
  const impactItems = getRiskImpactItems(id);
  const isSekomandi = id === "sekomandi";

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#FAF9F6]">
        {/* Header section */}
        <section className="pt-12 pb-16 px-6 border-b border-[#E7E2D8]">
          <div className="mx-auto max-w-[1180px]">
            {/* Archival Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-xs font-mono text-[#6B655C]">
              <Link href="/" className="hover:text-[#1A1815] transition-colors">
                BERANDA
              </Link>
              <span>/</span>
              <Link
                href="/knowledge"
                className="hover:text-[#1A1815] transition-colors"
              >
                INDEKS PENGETAHUAN
              </Link>
              <span>/</span>
              <span className="text-[#A8522E] uppercase font-semibold">
                {knowledge.title}
              </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Title & Metadata */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 bg-[#F2EDE4] border border-[#E7E2D8] text-[#1A1815] rounded">
                    {CATEGORY_LABELS[knowledge.category ?? "craft"] ?? knowledge.category}
                  </span>
                  <span className="text-xs font-mono text-[#6B655C]">
                    LOKASI: {knowledge.region}
                  </span>
                  <span className="text-xs font-mono text-[#6B655C] border-l border-[#E7E2D8] pl-3">
                    KATALOG: KNL-{id.toUpperCase()}-2026
                  </span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl text-[#1A1815] leading-tight">
                  {knowledge.title}
                </h1>

                {knowledge.summary && (
                  <p className="text-base text-[#524E48] leading-relaxed max-w-[700px]">
                    {knowledge.summary}
                  </p>
                )}

                {/* Sekomandi Archival Photo Showcase */}
                {isSekomandi && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="relative aspect-[4/3] rounded border border-[#E7E2D8] overflow-hidden bg-[#1A1815]">
                      <Image
                        src="/images/hero_artisan.jpg"
                        alt="Mama Ina Pagi di alat tenun Sekomandi"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/75 px-2 py-1 text-[9px] font-mono text-white/90">
                        MAESTRO: MAMA INA PAGI (78 THN)
                      </div>
                    </div>
                    <div className="relative aspect-[4/3] rounded border border-[#E7E2D8] overflow-hidden bg-[#1A1815]">
                      <Image
                        src="/images/sekomandi_archive.jpg"
                        alt="Catatan lapangan motif Sekomandi"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/75 px-2 py-1 text-[9px] font-mono text-white/90">
                        MOTIF POTE SEKANG & PEWARNA ALAMI
                      </div>
                    </div>
                  </div>
                )}

                {/* Transmission Actions */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Link
                    href={`/knowledge/${id}/learn`}
                    className="px-6 py-3 bg-[#A8522E] text-white rounded text-xs font-mono uppercase tracking-widest font-medium hover:bg-[#8C4425] transition-colors"
                  >
                    Pelajari Silabus Transmisi (Teach Me) →
                  </Link>
                  <Link
                    href={`/knowledge/${id}/mentor`}
                    className="px-5 py-3 border border-[#1A1815] text-[#1A1815] rounded text-xs font-mono uppercase tracking-widest font-medium hover:bg-[#1A1815] hover:text-white transition-colors"
                  >
                    Cari Maestro Pembimbing
                  </Link>
                  <Link
                    href={`/knowledge/${id}/lineage`}
                    className="px-5 py-3 border border-[#E7E2D8] text-[#524E48] rounded text-xs font-mono uppercase tracking-widest font-medium hover:border-[#1A1815] transition-colors"
                  >
                    Garis Silsilah (Lineage)
                  </Link>
                </div>
              </div>

              {/* Risk Indicator Sidebar */}
              {knowledge.risk && (
                <div className="lg:col-span-4">
                  <RiskIndicator
                    riskLevel={knowledge.risk.risk_level}
                    practitioners={knowledge.risk.known_practitioners}
                    apprentices={knowledge.risk.apprentice_count}
                    documentationPct={knowledge.risk.documentation_pct}
                    impactItems={impactItems.map((i) => i.item_label)}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Knowledge DNA section */}
        <section className="py-16 md:py-24 px-6">
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-[700px] mb-10">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#A8522E] block mb-2">
                STRUKTUR KOGNITIF & KINETIK
              </span>
              <h2 className="font-display text-2xl md:text-3xl text-[#1A1815]">
                Knowledge DNA: Komponen Pengetahuan
              </h2>
              <p className="mt-2 text-sm text-[#6B655C] leading-relaxed">
                Diurai secara metodis agar dapat dipelajari secara bertahap
                tanpa mereduksi kedalaman makna dan etika adat yang mengikatnya.
              </p>
            </div>

            <DnaAccordion grouped={grouped} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
