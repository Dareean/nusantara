"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import {
  getKnowledgeById,
  getLearningPathByKnowledgeId,
  getLearningSteps,
} from "@/lib/data/seed";
import { useParams } from "next/navigation";

export default function LearnPage() {
  const params = useParams();
  const id = params.id as string;

  const knowledge = getKnowledgeById(id);
  const learningPath = getLearningPathByKnowledgeId(id);
  const steps = learningPath ? getLearningSteps(learningPath.id) : [];

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  if (!knowledge) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-24 px-6 text-center">
          <p className="text-text-secondary">Knowledge not found.</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!learningPath || steps.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-24 px-6">
          <div className="mx-auto max-w-[720px] text-center">
            <p className="text-caption text-text-secondary mb-3">TEACH ME</p>
            <h1 className="font-display text-3xl text-foreground mb-4">
              No learning path yet
            </h1>
            <p className="text-text-secondary mb-8">
              A learning path for &ldquo;{knowledge.title}&rdquo; has not been
              created yet. Check back later.
            </p>
            <Link
              href={`/knowledge/${id}`}
              className="text-sm text-accent hover:text-accent-hover"
            >
              ← Back to knowledge
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const completedCount = completedSteps.size;
  const totalSteps = steps.length;
  const progressPct = Math.round((completedCount / totalSteps) * 100);

  function handleMarkComplete(stepNumber: number) {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepNumber)) {
        next.delete(stepNumber);
      } else {
        next.add(stepNumber);
      }
      return next;
    });
  }

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
            <span className="text-foreground">Learn</span>
          </nav>

          {/* Header */}
          <p className="text-caption text-text-secondary mb-3">TEACH ME</p>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            {learningPath.title}
          </h1>
          {learningPath.description && (
            <p className="text-text-secondary mb-8">
              {learningPath.description}
            </p>
          )}

          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">
                {completedCount}/{totalSteps} complete
              </span>
              <span className="text-sm text-text-secondary">{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Step list */}
          <div className="space-y-4">
            {steps.map((step, i) => {
              const isCompleted = completedSteps.has(step.step_number);
              const isCurrent = currentStep === i;
              // Steps unlock sequentially: step is locked if previous is not completed
              // For demo, all steps are accessible
              const isAccessible = true;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "border border-border rounded-md overflow-hidden transition-colors",
                    isCurrent && "border-accent/30",
                    isCompleted && "bg-surface/50"
                  )}
                >
                  <button
                    onClick={() => isAccessible && setCurrentStep(i)}
                    className={cn(
                      "w-full flex items-center gap-4 px-6 py-5 text-left",
                      isAccessible
                        ? "hover:bg-surface/30 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {/* Step number / check */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm border",
                        isCompleted
                          ? "bg-accent border-accent text-white"
                          : "border-border text-text-secondary"
                      )}
                    >
                      {isCompleted ? "✓" : step.step_number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={cn(
                          "font-medium",
                          isCompleted
                            ? "text-text-secondary line-through"
                            : "text-foreground"
                        )}
                      >
                        {step.title}
                      </h3>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isCurrent && (
                    <div className="px-6 pb-6 pl-[4.5rem]">
                      {step.description && (
                        <p className="text-sm text-text-secondary leading-relaxed mb-4">
                          {step.description}
                        </p>
                      )}
                      <button
                        onClick={() => handleMarkComplete(step.step_number)}
                        className={cn(
                          "px-4 py-2 text-sm rounded-md transition-colors",
                          isCompleted
                            ? "border border-border text-text-secondary hover:bg-surface"
                            : "bg-accent text-white hover:bg-accent-hover"
                        )}
                      >
                        {isCompleted ? "Mark as incomplete" : "Mark as complete"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Completion message */}
          {completedCount === totalSteps && (
            <div className="mt-8 border border-border rounded-md p-6 text-center">
              <p className="font-display text-xl text-foreground mb-2">
                You&apos;ve completed the learning path
              </p>
              <p className="text-sm text-text-secondary mb-4">
                Ready to become an apprentice? Find a mentor and start
                practicing.
              </p>
              <Link
                href={`/knowledge/${id}/mentor`}
                className="inline-block px-5 py-2.5 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors text-sm"
              >
                Find a Mentor
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
