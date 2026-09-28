/**
 * Curriculum backing the careers detail view ("Career in ...").
 *
 * Clicking a career card on /careers opens this syllabus inline, so the
 * numbers shown in the header, the section meta and the expand/collapse
 * counts are all derived from here instead of being hard-coded twice.
 */

export interface CourseLecture {
  id: string;
  title: string;
  /** One-line blurb shown under the lecture title. */
  description: string;
  /** Runtime credited to learning activity when the lecture is watched. */
  durationSeconds: number;
}

export interface CourseQuiz {
  id: string;
  /** "Quiz 2" / "Final quiz" */
  title: string;
  questions: number;
  /** The end-of-path assessment ("1 lecture, final quiz"). */
  final?: boolean;
}

export interface CourseSection {
  id: string;
  /** Module number, or null for sections that are not modules. */
  moduleNumber: number | null;
  /** Full row label, e.g. "Module 4: Equity Capital Markets (ECM)". */
  title: string;
  lectures: CourseLecture[];
  quiz: CourseQuiz | null;
  /** Lectures already watched when the page loads (demo progress). */
  initialWatched: number;
  initialQuizDone: boolean;
}

export interface CourseCurriculum {
  id: string;
  /** "Career in Investment Banking" */
  headline: string;
  /** "Knowledge part" */
  subtitle: string;
  sections: CourseSection[];
}

interface LectureSpec {
  title: string;
  description: string;
}

interface SectionSpec {
  id: string;
  moduleNumber: number | null;
  name: string;
  lectures: LectureSpec[];
  quizQuestions?: number;
  finalQuiz?: boolean;
  initialWatched?: number;
  initialQuizDone?: boolean;
}

/** Deterministic 6–14 min runtimes so every render and API call agree. */
function durationFor(sectionIndex: number, lectureIndex: number): number {
  return (6 + ((sectionIndex * 4 + lectureIndex * 3) % 9)) * 60;
}

function buildSection(spec: SectionSpec, sectionIndex: number): CourseSection {
  return {
    id: spec.id,
    moduleNumber: spec.moduleNumber,
    title:
      spec.moduleNumber == null
        ? spec.name
        : `Module ${spec.moduleNumber}: ${spec.name}`,
    lectures: spec.lectures.map((lecture, lectureIndex) => ({
      id: `${spec.id}-l${lectureIndex + 1}`,
      title: lecture.title,
      description: lecture.description,
      durationSeconds: durationFor(sectionIndex, lectureIndex),
    })),
    quiz:
      spec.quizQuestions == null
        ? null
        : {
            id: `${spec.id}-quiz`,
            title: spec.finalQuiz
              ? "Final quiz"
              : `Quiz ${spec.moduleNumber ?? ""}`.trim(),
            questions: spec.quizQuestions,
            final: spec.finalQuiz,
          },
    initialWatched: spec.initialWatched ?? 0,
    initialQuizDone: spec.initialQuizDone ?? false,
  };
}

/** "6 lectures, 1 quiz" / "6 lectures" / "1 lecture, final quiz" */
export function sectionMeta(section: CourseSection): string {
  const count = section.lectures.length;
  const lectures = count === 1 ? "1 lecture" : `${count} lectures`;

  if (!section.quiz) return lectures;

  return `${lectures}, ${section.quiz.final ? "final quiz" : "1 quiz"}`;
}

/** "13 modules, 66 lectures, 13 quizzes" */
export function curriculumSummary(curriculum: CourseCurriculum): string {
  const modules = curriculum.sections.filter(
    (section) => section.moduleNumber != null,
  ).length;
  const lectures = curriculum.sections.reduce(
    (total, section) => total + section.lectures.length,
    0,
  );
  const quizzes = curriculum.sections.filter(
    (section) => section.quiz != null,
  ).length;

  return `${modules} modules, ${lectures} lectures, ${quizzes} quizzes`;
}

const IB_SECTIONS: SectionSpec[] = [
  {
    id: "ib-1",
    moduleNumber: 1,
    name: "Foundations",
    lectures: [
      {
        title: "What a career in finance really looks like",
        description:
          "Where finance jobs actually sit across banks, funds and corporates, and what each one asks of you day to day.",
      },
      {
        title: "The language of markets and money",
        description:
          "Yields, spreads, equities and credit explained in plain English before anything else builds on them.",
      },
      {
        title: "How companies raise capital",
        description:
          "The routes a business uses to fund growth: issuing equity, borrowing, or reinvesting its own cash.",
      },
      {
        title: "Reading the financial news like a banker",
        description:
          "How to pull the deal, the numbers and the market signal out of a headline in under a minute.",
      },
      {
        title: "Ethics, trust and reputation in deal-making",
        description:
          "Why one bad call can end a career here, and the standards bankers are actually held to.",
      },
      {
        title: "Setting up your finance toolkit",
        description:
          "The spreadsheets, data sources and note-taking habits that make every later module faster.",
      },
    ],
    quizQuestions: 10,
    initialWatched: 6,
    initialQuizDone: true,
  },
  {
    id: "ib-2",
    moduleNumber: 2,
    name: "Introduction to Investment Banking",
    lectures: [
      {
        title: "The Rise of Investment Banking",
        description:
          "How investment banks started, and why they became the link between companies that need money and investors who have it.",
      },
      {
        title: "Why Reputation Matters",
        description:
          "Why a bank's name and track record help it win big clients and deals.",
      },
      {
        title: "Commercial Banking vs Investment Banking",
        description:
          "Commercial banks take deposits and give loans. Investment banks advise on and arrange large deals, and earn fees.",
      },
      {
        title: "Universal Banks",
        description:
          "Why some banks offer both commercial and investment banking, the benefits of this model, and the risks regulators watch for.",
      },
      {
        title: "How Investment Banks Earn Money",
        description:
          "The main sources of income, such as advisory fees and underwriting fees.",
      },
      {
        title: "Conflicts of Interest and Information Walls",
        description:
          "Why teams inside a bank must keep client information separate, and how “Chinese walls” do this.",
      },
    ],
    quizQuestions: 5,
    initialWatched: 3,
  },
  {
    id: "ib-3",
    moduleNumber: 3,
    name: "How an Investment Bank Is Organised",
    lectures: [
      {
        title: "Front office, middle office, back office",
        description:
          "Who talks to clients, who checks the work, and who keeps the machinery running.",
      },
      {
        title: "Coverage and industry teams",
        description:
          "How bankers are split by sector so every client gets someone who already knows their world.",
      },
      {
        title: "Support functions: control, technology, operations",
        description:
          "The teams that approve, build and process everything the deal floor sells.",
      },
      {
        title: "How a deal team gets staffed",
        description:
          "Who gets picked for a live mandate, and why the mix changes as the deal moves.",
      },
    ],
    quizQuestions: 10,
  },
  {
    id: "ib-4",
    moduleNumber: 4,
    name: "Equity Capital Markets (ECM)",
    lectures: [
      {
        title: "What an equity capital market does",
        description:
          "How a bank turns a company's need for money into shares the market is ready to buy.",
      },
      {
        title: "IPOs from mandate to listing",
        description:
          "The full journey of going public, from the first pitch to the first trade.",
      },
      {
        title: "Book building vs. fixed price issues",
        description:
          "Two ways to price a new issue, and when each one makes sense.",
      },
      {
        title: "Pricing, greenshoe and allocation",
        description:
          "How the final price is set, what the over-allotment option does, and who gets shares.",
      },
      {
        title: "Follow-ons, rights issues and QIPs",
        description:
          "The routes companies use to raise more equity after they are already listed.",
      },
      {
        title: "Placements and block trades",
        description:
          "Selling large parcels of stock quickly, quietly and at a known price.",
      },
      {
        title: "Drafting the offer document",
        description:
          "What goes into a prospectus, who signs it, and why every word gets checked twice.",
      },
      {
        title: "ECM regulation and disclosures",
        description:
          "The rules that keep new issues fair, and what happens when a disclosure is missed.",
      },
    ],
    quizQuestions: 12,
  },
  {
    id: "ib-5",
    moduleNumber: 5,
    name: "Debt Capital Markets (DCM)",
    lectures: [
      {
        title: "How debt capital markets work",
        description:
          "Where companies and governments borrow at scale, and who is lending to them.",
      },
      {
        title: "Bonds, loans and hybrid instruments",
        description:
          "The main building blocks of corporate debt, and how they differ in risk.",
      },
      {
        title: "Issuing a bond: the full process",
        description:
          "From mandate to maturity: ratings, roadshows, pricing and settlement.",
      },
      {
        title: "Ratings, covenants and spreads",
        description:
          "How credit rating agencies, loan terms and market pricing shape the cost of borrowing.",
      },
      {
        title: "Structuring, trancheing and tenors",
        description:
          "Splitting debt by risk and length so the right buyers can be found.",
      },
      {
        title: "Masala bonds and external commercial borrowings",
        description:
          "How Indian issuers raise rupee and foreign-currency debt from overseas investors.",
      },
    ],
    quizQuestions: 10,
  },
  {
    id: "ib-6",
    moduleNumber: 6,
    name: "Mergers and Acquisitions (M&A)",
    lectures: [
      {
        title: "Why companies merge and acquire",
        description:
          "The strategic and financial logic behind buying a business instead of building one.",
      },
      {
        title: "Strategic vs. financial buyers",
        description:
          "Who buys with synergies in mind, and who buys purely for returns.",
      },
      {
        title: "The M&A process, timeline by timeline",
        description:
          "Teaser to signing to closing: every stage of a live deal in order.",
      },
      {
        title: "Valuation inside a live deal",
        description:
          "How comps, precedents and DCFs get used when real money is on the table.",
      },
      {
        title: "Accretion and dilution in practice",
        description:
          "Reading a deal model to see whether it adds to or subtracts from earnings.",
      },
      {
        title: "Structuring, financing and fees",
        description:
          "Cash, stock or debt: how deals get paid for and what the bankers earn.",
      },
      {
        title: "Post-merger integration basics",
        description:
          "What has to be true in the first 100 days for the deal to actually work.",
      },
    ],
    quizQuestions: 12,
  },
  {
    id: "ib-7",
    moduleNumber: 7,
    name: "Valuation Basics",
    lectures: [
      {
        title: "Comparable company analysis",
        description:
          "Valuing a business against listed peers using the multiples the market already pays.",
      },
      {
        title: "Precedent transactions",
        description:
          "What buyers have actually paid for similar companies, and why control changes the number.",
      },
      {
        title: "Discounted cash flow, step by step",
        description:
          "Forecasting cash, choosing a discount rate and turning it into a value today.",
      },
      {
        title: "Choosing the multiple that fits",
        description:
          "EV/EBITDA, P/E, price-to-book: which ratio suits which kind of business.",
      },
      {
        title: "Building the football field",
        description:
          "Laying every method side by side to defend a valuation range.",
      },
      {
        title: "Valuation pitfalls and hygiene checks",
        description:
          "The small errors that quietly break a model, and how to catch them first.",
      },
    ],
    quizQuestions: 10,
  },
  {
    id: "ib-8",
    moduleNumber: 8,
    name: "Restructuring",
    lectures: [
      {
        title: "Distress, default and bankruptcy",
        description:
          "What happens when a company can no longer pay, and who decides what happens next.",
      },
      {
        title: "Turnarounds and refinancing",
        description:
          "Fixing a business before it runs out of room: cost, cash and debt fixes.",
      },
      {
        title: "Creditors, committees and claims",
        description:
          "Who gets paid first, and how bondholders and lenders organise to protect themselves.",
      },
      {
        title: "Restructuring advisory in practice",
        description:
          "Where bankers sit when a company is fighting for survival.",
      },
    ],
    quizQuestions: 10,
  },
  {
    id: "ib-9",
    moduleNumber: 9,
    name: "Other Areas of an Investment Bank",
    lectures: [
      {
        title: "Sales and trading",
        description:
          "Markets desks: making prices, moving inventory and managing risk all day.",
      },
      {
        title: "Research and prime services",
        description:
          "Sell-side research and the financing that lets institutional clients trade at scale.",
      },
      {
        title: "Treasury and risk management",
        description:
          "How a bank funds itself and measures what could go wrong.",
      },
      {
        title: "Asset and wealth management",
        description:
          "Investing other people's money, and the business that sits next to advisory.",
      },
    ],
    quizQuestions: 10,
  },
  {
    id: "ib-10",
    moduleNumber: 10,
    name: "The Regulatory Environment",
    lectures: [
      {
        title: "SEBI, exchanges and market regulation",
        description:
          "Who polices Indian markets, and the rulebook they enforce.",
      },
      {
        title: "Global rules: Basel, MiFID and Dodd-Frank",
        description:
          "The international frameworks that reshaped banking after the financial crisis.",
      },
      {
        title: "Compliance, KYC and information walls",
        description:
          "The controls that keep banks clean, and why they slow deals down for good reasons.",
      },
    ],
    quizQuestions: 10,
  },
  {
    id: "ib-11",
    moduleNumber: 11,
    name: "Technology and the Future of Investment Banking",
    lectures: [
      {
        title: "AI, automation and the analyst workflow",
        description:
          "What machines now do faster than juniors, and where human judgement still wins.",
      },
      {
        title: "Fintech, digital assets and what comes next",
        description:
          "The new rails, tokens and platforms changing how capital moves.",
      },
    ],
    quizQuestions: 8,
  },
  {
    id: "ib-12",
    moduleNumber: 12,
    name: "Key Players in India",
    lectures: [
      {
        title: "Domestic banks and boutique advisors",
        description:
          "The Indian institutions and small firms that win deals on relationships and sector depth.",
      },
      {
        title: "Global banks operating in India",
        description:
          "How international desks cover Indian clients from Mumbai, Bengaluru and Singapore.",
      },
      {
        title: "Where Indian deals actually happen",
        description:
          "The sectors, cities and sponsors behind India's live deal pipeline.",
      },
    ],
    quizQuestions: 10,
  },
  {
    id: "ib-13",
    moduleNumber: 13,
    name: "Career Pathways in Investment Banking",
    lectures: [
      {
        title: "Choosing your first role",
        description:
          "Analyst, markets, research or consulting: picking the entry point that fits you.",
      },
      {
        title: "Breaking in: internships and referrals",
        description:
          "How most hires actually happen, and how to engineer an introduction.",
      },
      {
        title: "The interview: technicals and live deals",
        description:
          "What gets asked, how to prepare, and how to talk about a deal you only read about.",
      },
      {
        title: "From analyst to associate and beyond",
        description:
          "The promotion criteria at each step, and what changes when you start running deals.",
      },
      {
        title: "Moving to the buy-side: PE and VC",
        description:
          "What funds look for in bankers, and what the jump really involves.",
      },
      {
        title: "Exit options and long-term paths",
        description:
          "Corporate, startups or banking itself: where bankers go after a few years.",
      },
    ],
  },
  {
    id: "ib-takeaways",
    moduleNumber: null,
    name: "Key Takeaways",
    lectures: [
      {
        title: "The ideas to carry into every interview",
        description:
          "A fast recap of the concepts, vocabulary and judgement this path has built.",
      },
    ],
    quizQuestions: 25,
    finalQuiz: true,
  },
];

export const IB_CURRICULUM: CourseCurriculum = {
  id: "investment-banking",
  headline: "Career in Investment Banking",
  subtitle: "Knowledge part",
  sections: IB_SECTIONS.map((spec, index) => buildSection(spec, index)),
};

/* --------------------------------------------------------- progress model */

export interface SectionProgressState {
  watched: boolean[];
  quizDone: boolean;
}

/** sectionId → watched flags + quiz state for one career. */
export type CareerProgressState = Record<string, SectionProgressState>;

/** A stored decision per syllabus item (Supabase row or local cache row). */
export interface ProgressRow {
  item_id: string;
  completed: boolean;
}

/** Syllabus defaults — the demo progress the page starts from. */
export function defaultProgress(
  curriculum: CourseCurriculum,
): CareerProgressState {
  return Object.fromEntries(
    curriculum.sections.map((section) => [
      section.id,
      {
        watched: section.lectures.map(
          (_, index) => index < section.initialWatched,
        ),
        quizDone: section.initialQuizDone,
      },
    ]),
  );
}

/** One addressable syllabus item: a lecture or a quiz. */
export interface CurriculumItem {
  itemId: string;
  sectionId: string;
  kind: "lecture" | "quiz";
  /** Lecture index (0-based); quizzes use -1. */
  index: number;
  title: string;
  durationSeconds: number;
}

export function findCurriculumItem(
  curriculum: CourseCurriculum,
  itemId: string,
): CurriculumItem | null {
  for (const section of curriculum.sections) {
    const lectureIndex = section.lectures.findIndex(
      (lecture) => lecture.id === itemId,
    );

    if (lectureIndex !== -1) {
      return {
        itemId,
        sectionId: section.id,
        kind: "lecture",
        index: lectureIndex,
        title: section.lectures[lectureIndex].title,
        durationSeconds: section.lectures[lectureIndex].durationSeconds,
      };
    }

    if (section.quiz?.id === itemId) {
      return {
        itemId,
        sectionId: section.id,
        kind: "quiz",
        index: -1,
        title: section.quiz.title,
        durationSeconds: 0,
      };
    }
  }

  return null;
}

/** Copy of `state` with one item set — never mutates the input. */
export function withItemCompleted(
  curriculum: CourseCurriculum,
  state: CareerProgressState,
  itemId: string,
  completed: boolean,
): CareerProgressState {
  const item = findCurriculumItem(curriculum, itemId);
  const sectionState = item ? state[item.sectionId] : undefined;
  if (!item || !sectionState) return state;

  const next: SectionProgressState =
    item.kind === "lecture"
      ? {
          watched: sectionState.watched.map((flag, index) =>
            index === item.index ? completed : flag,
          ),
          quizDone: sectionState.quizDone,
        }
      : { watched: sectionState.watched, quizDone: completed };

  return { ...state, [item.sectionId]: next };
}

/**
 * Layer stored rows over a base state. Rows (Supabase `career_progress`, or
 * the browser's local cache) always win over syllabus defaults, so un-
 * watching a default-watched lecture stays un-watched on every surface.
 */
export function applyProgressRows(
  curriculum: CourseCurriculum,
  state: CareerProgressState,
  rows: readonly ProgressRow[],
): CareerProgressState {
  let next = state;

  for (const row of rows) {
    if (typeof row?.item_id !== "string") continue;
    next = withItemCompleted(
      curriculum,
      next,
      row.item_id,
      Boolean(row.completed),
    );
  }

  return next;
}

export function progressFromRows(
  curriculum: CourseCurriculum,
  rows: readonly ProgressRow[],
): CareerProgressState {
  return applyProgressRows(curriculum, defaultProgress(curriculum), rows);
}

export function isSectionComplete(
  section: CourseSection,
  progress: SectionProgressState | undefined,
): boolean {
  if (!progress) return false;

  const allLectures = progress.watched.every(Boolean);
  const quizDone = section.quiz ? progress.quizDone : true;

  return allLectures && quizDone;
}

/** Completed syllabus sections — the dashboard's "1 of 14". */
export function completedSectionCount(
  curriculum: CourseCurriculum,
  state: CareerProgressState,
): number {
  return curriculum.sections.filter((section) =>
    isSectionComplete(section, state[section.id]),
  ).length;
}

/** Total seconds of lecture content in a curriculum. */
export function curriculumDurationSeconds(
  curriculum: CourseCurriculum,
): number {
  return curriculum.sections.reduce(
    (total, section) =>
      total +
      section.lectures.reduce((sum, lecture) => sum + lecture.durationSeconds, 0),
    0,
  );
}

/** "11 h 40 m" / "48 m" — content length for the career header. */
export function formatContentDuration(totalSeconds: number): string {
  const minutes = Math.round(Math.max(0, totalSeconds) / 60);
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (hours === 0) return `${remainder} m`;
  if (remainder === 0) return `${hours} h`;
  return `${hours} h ${remainder} m`;
}

/** Curriculum authored for a career id, if any ("investment-banking"). */
export function getCurriculum(
  careerId: string,
): CourseCurriculum | undefined {
  return careerId === IB_CURRICULUM.id ? IB_CURRICULUM : undefined;
}
