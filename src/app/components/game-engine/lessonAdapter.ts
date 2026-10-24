import type {
  Lesson,
  Question,
  ChoiceQuestionData,
  TrueFalseQuestionData,
  MatchQuestionData,
  OrderQuestionData,
  HotspotQuestionData,
  ScenarioQuestionData,
} from "@/lib/lessons";
import type {
  GameSession,
  GameQuestion,
  QuestionOption,
  MatchingPair,
  HotspotItem,
} from "./types";

function deterministicShuffle(items: string[], seedStr: string): string[] {
  const result = [...items];
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) % 2147483647;
  }
  const nextPseudo = () => {
    seed = (seed * 16807 + 1) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(nextPseudo() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  if (result.length > 1 && result.every((val, idx) => val === items[idx])) {
    const first = result.shift()!;
    result.push(first);
  }
  return result;
}

export function questionToGameQuestion(
  question: Question,
  lessonIntro: string
): GameQuestion {
  const curatorNote = question.why || "";

  switch (question.type) {
    case "choice": {
      const data = question.data as ChoiceQuestionData;
      const options: QuestionOption[] = (data.options || []).map((opt) => ({
        id: opt.id,
        title: opt.label,
        isCorrect: opt.id === data.answer,
      }));
      return {
        id: question.id,
        type: "multiple_choice",
        prompt: question.prompt,
        options,
        curatorNote,
        audioUrl: question.audioUrl,
      };
    }

    case "truefalse": {
      const data = question.data as TrueFalseQuestionData;
      const options: QuestionOption[] = [
        {
          id: "opt-true",
          title: "Benar",
          isCorrect: data.answer === true,
        },
        {
          id: "opt-false",
          title: "Salah",
          isCorrect: data.answer === false,
        },
      ];
      return {
        id: question.id,
        type: "multiple_choice",
        prompt: data.statement || question.prompt,
        options,
        curatorNote,
        audioUrl: question.audioUrl,
      };
    }

    case "match": {
      const data = question.data as MatchQuestionData;
      const matchingPairs: MatchingPair[] = (data.pairs || []).map((p, idx) => ({
        id: `${question.id}-pair-${idx}`,
        left: p.left,
        right: p.right,
      }));
      return {
        id: question.id,
        type: "matching",
        prompt: question.prompt,
        matchingPairs,
        curatorNote,
        audioUrl: question.audioUrl,
      };
    }

    case "order": {
      const data = question.data as OrderQuestionData;
      const wordTiles = deterministicShuffle(data.items || [], question.id);
      return {
        id: question.id,
        type: "word_builder",
        prompt: question.prompt,
        wordTiles,
        targetSentence: data.answer || [],
        curatorNote,
        audioUrl: question.audioUrl,
      };
    }

    case "hotspot": {
      const data = question.data as HotspotQuestionData;
      const hotspots: HotspotItem[] = (data.hotspots || []).map((h, idx) => ({
        id: idx + 1,
        name: h.label,
        title: h.label,
        description: h.description,
        top: h.top || (idx % 2 === 0 ? "25%" : "55%"),
        left: h.left || `${15 + idx * 20}%`,
      }));
      const options: QuestionOption[] = (data.hotspots || []).map((h) => ({
        id: h.id,
        title: h.label,
        isCorrect: h.id === data.answer,
      }));
      return {
        id: question.id,
        type: "hotspot",
        prompt: question.prompt,
        imageUrl: data.imageUrl,
        imageCaption: data.imageCaption,
        hotspots,
        options,
        curatorNote,
        audioUrl: question.audioUrl,
      };
    }

    case "scenario": {
      const data = question.data as ScenarioQuestionData;
      const firstStep = data.steps?.[0];
      const maxScore = firstStep
        ? Math.max(...firstStep.choices.map((c) => c.score))
        : 0;
      const options: QuestionOption[] = (firstStep?.choices || []).map((c) => ({
        id: c.id,
        title: c.label,
        isCorrect: c.score === maxScore,
      }));
      return {
        id: question.id,
        type: "roleplay",
        prompt: question.prompt,
        scenarioContext: lessonIntro,
        npcDialogue: firstStep?.prompt || question.prompt,
        options,
        curatorNote,
        audioUrl: question.audioUrl,
      };
    }

    default: {
      return {
        id: question.id,
        type: "multiple_choice",
        prompt: question.prompt,
        options: [],
        curatorNote,
        audioUrl: question.audioUrl,
      };
    }
  }
}

export function lessonToGameSession(lesson: Lesson): GameSession {
  const culturalSourceCard = lesson.source
    ? {
        institution: lesson.source.institution,
        informant: lesson.source.informant,
        registrationCode: lesson.source.registrationCode,
        verifiedDate: lesson.source.verifiedDate,
        summary: lesson.source.summary,
        status: lesson.source.status,
      }
    : undefined;

  const questions: GameQuestion[] = [];
  for (const q of lesson.questions || []) {
    if (q.type === "scenario") {
      const data = q.data as ScenarioQuestionData;
      if (data.steps && data.steps.length > 0) {
        data.steps.forEach((step, idx) => {
          const maxScore = Math.max(...step.choices.map((c) => c.score));
          const options: QuestionOption[] = (step.choices || []).map((c) => ({
            id: c.id,
            title: c.label,
            isCorrect: c.score === maxScore,
          }));
          questions.push({
            id: `${q.id}-step-${idx + 1}`,
            type: "roleplay",
            prompt: q.prompt,
            scenarioContext: lesson.intro,
            npcDialogue: step.prompt,
            options,
            curatorNote: q.why || "",
            audioUrl: q.audioUrl,
          });
        });
        continue;
      }
    }
    questions.push(questionToGameQuestion(q, lesson.intro));
  }

  return {
    id: "lesson-" + lesson.id,
    title: lesson.title,
    chapter: lesson.subtitle,
    subEthnic: lesson.region,
    xpReward: lesson.rewardXp,
    streakDays: 0,
    culturalSourceCard,
    questions,
  };
}

export function gameSessionToLesson(session: GameSession): Lesson {
  const numericId = parseInt(session.id.replace("lesson-", ""), 10) || 1;
  const questions: Question[] = (session.questions || []).map((q, idx) => {
    const why = q.curatorNote || q.why || "";
    const xp = q.xp || 5;

    if (q.type === "match" || q.type === "matching") {
      const pairs =
        q.pairs ||
        q.matchingPairs?.map((p) => ({ left: p.left, right: p.right })) ||
        [];
      return {
        id: q.id || `q-match-${idx}`,
        type: "match",
        prompt: q.prompt,
        why,
        xp,
        audioUrl: q.audioUrl,
        data: {
          pairs,
        },
      };
    }

    if (q.type === "order" || q.type === "word_builder") {
      const items = q.items || q.targetSentence || [];
      return {
        id: q.id || `q-order-${idx}`,
        type: "order",
        prompt: q.prompt,
        why,
        xp,
        audioUrl: q.audioUrl,
        data: {
          items,
          answer: items,
        },
      };
    }

    if (q.type === "true_false") {
      return {
        id: q.id || `q-tf-${idx}`,
        type: "truefalse",
        prompt: q.prompt,
        why,
        xp,
        audioUrl: q.audioUrl,
        data: {
          statement: q.statement || q.prompt,
          answer: Boolean(q.answerBoolean),
        },
      };
    }

    if (q.type === "scenario" || q.type === "roleplay") {
      if (q.steps && q.steps.length > 0) {
        return {
          id: q.id || `q-sc-${idx}`,
          type: "scenario",
          prompt: q.prompt,
          why,
          xp,
          audioUrl: q.audioUrl,
          data: {
            steps: q.steps.map((s) => ({
              prompt: s.prompt,
              choices: s.choices.map((c, i) => ({
                id: c.id || String(i),
                label: c.label,
                score: c.score,
              })),
            })),
            passingScore: q.passingScore || Math.ceil(q.steps.length * 1.5),
          },
        };
      }
      const options = q.options || [];
      return {
        id: q.id || `q-sc-${idx}`,
        type: "scenario",
        prompt: q.prompt,
        why,
        xp,
        audioUrl: q.audioUrl,
        data: {
          steps: [
            {
              prompt: q.npcDialogue || q.prompt,
              choices: options.map((opt, i) => ({
                id: opt.id || String(i),
                label: opt.title,
                score: opt.isCorrect ? 2 : 1,
              })),
            },
          ],
          passingScore: 2,
        },
      };
    }

    if (q.type === "hotspot" || q.type === "visual") {
      const hotspots = (q.hotspots || []).map((h) => ({
        id: String(h.id),
        label: h.name || h.title,
        description: h.description,
        top: h.top,
        left: h.left,
      }));
      const correctOpt = q.options?.find((o) => o.isCorrect);
      const answer = correctOpt?.id || (hotspots[0]?.id ?? "1");
      return {
        id: q.id || `q-hotspot-${idx}`,
        type: "hotspot",
        prompt: q.prompt,
        why,
        xp,
        audioUrl: q.audioUrl,
        data: {
          imageUrl: q.imageUrl,
          imageCaption: q.imageCaption,
          hotspots,
          answer,
        },
      };
    }

    // Default: multiple_choice / choice / audio
    const options = (q.options || []).map((opt) => ({
      id: opt.id,
      label: opt.title,
    }));
    const answer = q.options?.find((o) => o.isCorrect)?.id || options[0]?.id || "";
    return {
      id: q.id || `q-choice-${idx}`,
      type: "choice",
      prompt: q.prompt,
      why,
      xp,
      audioUrl: q.audioUrl,
      data: {
        options,
        answer,
      },
    };
  });

  return {
    id: numericId,
    slug: session.id,
    title: session.title,
    subtitle: session.chapter,
    region: session.subEthnic,
    intro:
      session.culturalSourceCard?.summary ||
      session.questions[0]?.curatorNote ||
      session.title,
    rewardXp: session.xpReward || 30,
    badge: session.title,
    source: session.culturalSourceCard
      ? {
          institution: session.culturalSourceCard.institution,
          informant: session.culturalSourceCard.informant,
          registrationCode: session.culturalSourceCard.registrationCode,
          verifiedDate: session.culturalSourceCard.verifiedDate,
          summary: session.culturalSourceCard.summary,
          status: session.culturalSourceCard.status,
        }
      : undefined,
    questions,
  };
}

