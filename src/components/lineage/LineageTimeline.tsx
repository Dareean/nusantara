"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import type { KnowledgeLineageEntry } from "@/types/database";

interface LineageTimelineProps {
  entries: KnowledgeLineageEntry[];
  currentUserId?: string;
}

export default function LineageTimeline({
  entries,
  currentUserId,
}: LineageTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-reveal");
          }
        });
      },
      { threshold: 0.2 }
    );

    const nodes = timelineRef.current?.querySelectorAll("[data-reveal]");
    nodes?.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={timelineRef} className="relative pl-8">
      {/* Vertical connecting line */}
      <div className="absolute left-[11px] top-4 bottom-4 w-px bg-border" />

      {/* Entries */}
      <div className="space-y-12">
        {entries.map((entry, i) => {
          const isCurrentUser =
            currentUserId && entry.person_user_id === currentUserId;
          const isLast = i === entries.length - 1;

          return (
            <div
              key={entry.id}
              data-reveal
              className={`relative opacity-0`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Node dot */}
              <div
                className={cn(
                  "absolute -left-8 top-1 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center",
                  isCurrentUser
                    ? "border-accent bg-accent"
                    : "border-border bg-background"
                )}
              >
                {isCurrentUser && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>

              {/* Content */}
              <div>
                {/* Era label */}
                {entry.era_label && (
                  <p className="text-caption text-text-secondary mb-1">
                    {entry.era_label}
                  </p>
                )}

                {/* Name */}
                <h3
                  className={cn(
                    "font-display text-lg",
                    isCurrentUser ? "text-accent" : "text-foreground"
                  )}
                >
                  {isCurrentUser ? "YOU" : entry.person_name}
                </h3>

                {/* Role */}
                {entry.role_description && (
                  <p className="text-sm text-text-secondary mt-1">
                    {entry.role_description}
                  </p>
                )}
              </div>

              {/* Future indicator for last entry */}
              {isLast && !isCurrentUser && (
                <div className="mt-12 relative">
                  <div
                    className={cn(
                      "absolute -left-8 top-1 w-[22px] h-[22px] rounded-full border-2 border-dashed",
                      "border-accent/40 bg-background"
                    )}
                  />
                  <p className="font-display text-lg text-accent/60 italic">
                    The next carrier?
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    This could be you.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
