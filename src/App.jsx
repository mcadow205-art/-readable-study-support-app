import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import rainSound from "./assets/sounds/rain.mp3";
import brownSound from "./assets/sounds/brown.mp3";
import librarySound from "./assets/sounds/library.mp3";

const documents = {
  "Sample Essay":
    "Digital reading is central to higher education, but many students with dyslexia experience visual stress, difficulty concentrating, and fatigue when academic materials are presented in dense formats. Accessible reading tools can reduce overload and improve comprehension by making text easier to process. When students are given control over spacing, font size, contrast, and reading pace, they are more likely to stay engaged with academic material and build confidence in independent study.",
  "Case Law":
    "The claimant argued that the duty of care had been breached and that the defendant failed to take reasonable steps to prevent foreseeable harm in the circumstances. As a result, the claimant experienced significant academic disadvantage and argued that proper support had not been provided in time. The court considered whether the institution had acted reasonably, whether the risk was foreseeable, and whether practical adjustments could have reduced the harm suffered by the claimant.",
  "Lecture Notes":
    "User-Centred Design places the user at the centre of development. Iterative testing, prototyping, and feedback shape decisions so that the final solution reflects real needs rather than assumptions made by the designer. This process is especially important when designing for accessibility and inclusion. A successful inclusive design process does not treat accessibility as an afterthought, but builds support into the structure of the product from the beginning.",
};

const soundOptions = {
  Rain: rainSound,
  Brown: brownSound,
  Library: librarySound,
};

const navItems = [
  { id: "dashboard", label: "Study Desk", icon: "✦" },
  { id: "work", label: "Saved Work", icon: "▣" },
  { id: "reading", label: "Reading Lab", icon: "Aa" },
  { id: "planner", label: "Study Planner", icon: "✓" },
  { id: "focus", label: "Focus Cockpit", icon: "◉" },
  { id: "insights", label: "Insights Hub", icon: "↗" },
];

const workTypeTemplates = {
  Essay: {
    label: "Essay Structure",
    description: "Plan arguments, evidence, paragraphs, and final checks without starting from a blank page.",
    sections: [
      ["brief", "Question / brief", "Copy the assignment question and highlight the key instruction words."],
      ["argument", "Main argument", "What is your overall answer, position, or claim?"],
      ["intro", "Introduction", "Introduce the topic, context, and the argument you will make."],
      ["point-1", "Main point 1", "Write the first key point with evidence or examples."],
      ["point-2", "Main point 2", "Write the second key point with evidence or examples."],
      ["point-3", "Main point 3", "Write the third key point with evidence or examples."],
      ["evidence", "Evidence / references", "Save useful quotes, citations, page numbers, and source notes."],
      ["conclusion", "Conclusion", "Summarise your answer and link back to the question."],
      ["checklist", "Before submission checklist", "Check word count, references, spelling, formatting, and deadline."],
    ],
  },
  "Reading Notes": {
    label: "Reading Notes Template",
    description: "Understand academic reading by collecting the main idea, key points, quotes, and unknown words.",
    sections: [
      ["source", "Source / title", "What are you reading? Add the source, author, lecture, or document title."],
      ["main-idea", "Main idea", "What is the main idea in your own words?"],
      ["key-points", "Key points", "List the most important points from the reading."],
      ["quotes", "Useful quotes", "Save short useful quotes or page references."],
      ["words", "Words I need to check", "Write down difficult words or terms to check later."],
      ["assignment-link", "How this connects", "How could this reading help coursework, revision, or class discussion?"],
      ["summary", "Summary in my own words", "Write a short summary using language that makes sense to you."],
    ],
  },
  Revision: {
    label: "Revision Plan",
    description: "Track what you know, what needs practice, and what to review next.",
    sections: [
      ["topic", "Topic", "What topic are you revising?"],
      ["known", "What I already know", "Write anything you remember, even if it feels messy."],
      ["practice", "What I need to practise", "Which parts feel weakest or most confusing?"],
      ["terms", "Key terms / flashcards", "Add key words, definitions, formulas, or flashcard prompts."],
      ["questions", "Practice questions", "Add questions you can test yourself with."],
      ["confidence", "Confidence rating", "Rate your confidence and write what would improve it."],
      ["next-review", "Next review date", "When should you come back to this topic?"],
    ],
  },
  Presentation: {
    label: "Presentation Plan",
    description: "Plan slides, speaker notes, timing, and possible questions.",
    sections: [
      ["topic", "Topic", "What is your presentation about?"],
      ["audience", "Audience", "Who are you presenting to and what do they need to understand?"],
      ["opening", "Opening", "How will you start clearly and confidently?"],
      ["slides", "Slide outline", "List your slides in order."],
      ["message", "Key message", "What should people remember afterwards?"],
      ["speaker-notes", "Speaker notes", "Write what you want to say for each slide."],
      ["practice", "Practice checklist", "Check timing, clarity, confidence, and transitions."],
      ["questions", "Questions I might be asked", "What questions could your teacher or audience ask?"],
    ],
  },
  Research: {
    label: "Research Log",
    description: "Collect searches, sources, useful evidence, gaps, and next research actions.",
    sections: [
      ["question", "Research question", "What are you trying to find out?"],
      ["keywords", "Keywords", "What search terms are useful?"],
      ["sources", "Sources found", "Save links, books, articles, or lecture references."],
      ["evidence", "Useful evidence", "What evidence might support your work?"],
      ["gaps", "Gaps / questions", "What is missing or unclear?"],
      ["next", "Next search action", "What should you search or read next?"],
    ],
  },
  "Exam Prep": {
    label: "Exam Prep",
    description: "Organise exam topics, weak areas, practice questions, and final review checks.",
    sections: [
      ["module", "Module / topic", "What exam, module, or topic is this for?"],
      ["date", "Exam date", "When is the exam?"],
      ["priority", "High priority topics", "Which topics are most important?"],
      ["weak", "Weak areas", "What do you find hardest?"],
      ["practice", "Practice questions", "Add past paper tasks, quiz prompts, or questions."],
      ["timed", "Timed practice", "Record timed practice attempts here."],
      ["final", "Final review checklist", "What should you check before the exam?"],
    ],
  },
  "General Study": {
    label: "General Study File",
    description: "A flexible structure for notes, tasks, questions, and next actions.",
    sections: [
      ["goal", "Study goal", "What are you trying to achieve?"],
      ["notes", "Notes", "Save important thoughts, explanations, or reminders."],
      ["tasks", "Tasks", "What needs doing next?"],
      ["questions", "Questions", "What do you still need help with?"],
      ["next", "Next action", "What is the next tiny step?"],
    ],
  },
};

const workTypeOptions = Object.keys(workTypeTemplates);

const wordPredictionBank = [
  "The main idea is",
  "This means that",
  "A key point is",
  "For example",
  "This connects to",
  "The evidence suggests",
  "In my own words",
  "I need to check",
  "This is important because",
  "The author argues",
  "This supports my assignment because",
  "I am not sure about",
  "One useful quote is",
  "The next thing to do is",
  "This links to the topic of",
  "A question I still have is",
];

const emotionalStudyModes = {
  Overwhelmed: {
    title: "One thing at a time",
    body: "ReadAble will reduce the pressure, suggest a micro-start, and show one next action.",
    primary: "Start 2-min Micro-start",
    secondary: "Use Deadline Rescue",
  },
  Tired: {
    title: "Low-energy study mode",
    body: "Use read aloud, short notes, and a smaller focus block instead of forcing a full session.",
    primary: "Read Aloud",
    secondary: "Start 5-min Focus",
  },
  Confused: {
    title: "Comprehension support mode",
    body: "Turn on Chunked View, use the graphic organiser, and save words you need to check.",
    primary: "Open Reading Lab",
    secondary: "Turn On Chunking",
  },
  Distracted: {
    title: "Attention reset mode",
    body: "Restart gently with a small sprint, Focus Flower, and browser reminders.",
    primary: "Open Focus",
    secondary: "Micro-start",
  },
  Motivated: {
    title: "Momentum mode",
    body: "Use your energy on a saved file section and turn progress into a draft.",
    primary: "Continue File",
    secondary: "Open Planner",
  },
};

const wordSupportDictionary = {
  accessibility: {
    breakdown: "ac-cess-i-bil-i-ty",
    meaning: "making something easier for different people to access and use",
    sentence: "Accessibility should be built into design from the beginning.",
  },
  foreseeable: {
    breakdown: "fore-see-a-ble",
    meaning: "something that could reasonably be predicted before it happens",
    sentence: "The harm was foreseeable because the risk was already known.",
  },
  iterative: {
    breakdown: "it-er-a-tive",
    meaning: "done through repeated cycles of testing and improvement",
    sentence: "An iterative design process improves after feedback.",
  },
  cognitive: {
    breakdown: "cog-ni-tive",
    meaning: "connected to thinking, memory, attention, and understanding",
    sentence: "Cognitive load can make reading harder.",
  },
  disadvantage: {
    breakdown: "dis-ad-van-tage",
    meaning: "a condition that makes something harder for someone",
    sentence: "Lack of support can create academic disadvantage.",
  },
  comprehension: {
    breakdown: "com-pre-hen-sion",
    meaning: "understanding what something means",
    sentence: "Chunked reading can support comprehension.",
  },
  circumstances: {
    breakdown: "cir-cum-stan-ces",
    meaning: "the facts or conditions around a situation",
    sentence: "The court considered the circumstances of the case.",
  },
  adjustments: {
    breakdown: "ad-just-ments",
    meaning: "changes made to make something more suitable or accessible",
    sentence: "Reasonable adjustments can reduce barriers.",
  },
  academic: {
    breakdown: "a-ca-dem-ic",
    meaning: "connected to studying, university, or education",
    sentence: "Academic reading often uses dense language.",
  },
};

function cleanReadingWord(word) {
  return word.toLowerCase().replace(/[^a-z'-]/g, "");
}

function createSyllableBreakdown(word) {
  const clean = cleanReadingWord(word);
  if (!clean) return "";

  if (wordSupportDictionary[clean]) {
    return wordSupportDictionary[clean].breakdown;
  }

  if (clean.length <= 5) return clean;

  const chunks = clean.match(/.{1,3}/g) || [clean];
  return chunks.join("-");
}

function getWordSupport(word) {
  const clean = cleanReadingWord(word);
  const known = wordSupportDictionary[clean];

  if (known) {
    return {
      word: clean,
      ...known,
    };
  }

  return {
    word: clean,
    breakdown: createSyllableBreakdown(clean),
    meaning: "Add this to your word list and check the meaning later.",
    sentence: `I need to check the word "${clean}".`,
  };
}

function createTemplateSections(type) {
  const template = workTypeTemplates[type] || workTypeTemplates["General Study"];
  return template.sections.map(([id, title, prompt]) => ({
    id,
    title,
    prompt,
    content: "",
    updatedAt: new Date().toISOString(),
  }));
}

function getTemplateInfo(type) {
  return workTypeTemplates[type] || workTypeTemplates["General Study"];
}

function safeParse(value, fallback) {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
}

function normaliseStudyFile(file) {
  const templateSections =
    Array.isArray(file.templateSections) && file.templateSections.length > 0
      ? file.templateSections
      : createTemplateSections(file.type || "General Study");

  return {
    id: file.id || `file-${Date.now()}`,
    title: file.title || "Untitled study file",
    module: file.module || "General study",
    type: file.type || "General Study",
    deadline: file.deadline || "",
    status: file.status || "Not started",
    supportFocus: file.supportFocus || "Study support",
    notes: Array.isArray(file.notes) ? file.notes : [],
    drafts: Array.isArray(file.drafts) ? file.drafts : [],
    plans: Array.isArray(file.plans) ? file.plans : [],
    focusSessions: Array.isArray(file.focusSessions) ? file.focusSessions : [],
    garden: Array.isArray(file.garden) ? file.garden : [],
    templateSections,
    activeTemplateSectionId: file.activeTemplateSectionId || templateSections[0]?.id || "",
    createdAt: file.createdAt || new Date().toISOString(),
    updatedAt: file.updatedAt || new Date().toISOString(),
  };
}

function normalisePlans(rawPlans) {
  if (!Array.isArray(rawPlans)) return [];
  return rawPlans.map((plan, planIndex) => ({
    id: plan.id || `plan-${Date.now()}-${planIndex}`,
    task: plan.task || "Untitled plan",
    fileId: plan.fileId || null,
    spiceLevel: plan.spiceLevel || 2,
    steps: Array.isArray(plan.steps)
      ? plan.steps.map((step, stepIndex) =>
          typeof step === "string"
            ? { id: `${planIndex}-${stepIndex}`, text: step, status: "todo" }
            : {
                id: step.id || `${planIndex}-${stepIndex}`,
                text: step.text || String(step),
                status: step.status || "todo",
              }
        )
      : [],
  }));
}

function formatDate(value) {
  if (!value) return "No deadline";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No deadline";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [studentName, setStudentName] = useState(localStorage.getItem("studentName") || "");
  const [studentEmail, setStudentEmail] = useState(localStorage.getItem("studentEmail") || "");
  const [supportProfile, setSupportProfile] = useState(localStorage.getItem("supportProfile") || "Both");
  const [loginName, setLoginName] = useState(studentName);
  const [loginEmail, setLoginEmail] = useState(studentEmail);
  const [loginSupport, setLoginSupport] = useState(supportProfile);

  const [screen, setScreen] = useState("dashboard");
  const [currentDoc, setCurrentDoc] = useState("Sample Essay");
  const [fontSize, setFontSize] = useState(20);
  const [lineSpacing, setLineSpacing] = useState(1.8);
  const [mode, setMode] = useState("Calm");
  const [chunkMode, setChunkMode] = useState(false);
  const [focusLine, setFocusLine] = useState(0);

  const [studyFiles, setStudyFiles] = useState(() =>
    safeParse(localStorage.getItem("readable:studyFiles"), []).map(normaliseStudyFile)
  );
  const [activeFileId, setActiveFileId] = useState(localStorage.getItem("readable:activeFileId") || "");
  const [newFileTitle, setNewFileTitle] = useState("");
  const [newFileModule, setNewFileModule] = useState("");
  const [newFileType, setNewFileType] = useState("Essay");
  const [newFileDeadline, setNewFileDeadline] = useState("");
  const [newFileStatus, setNewFileStatus] = useState("Not started");
  const [fileNoteInput, setFileNoteInput] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentSessionMinutes, setCurrentSessionMinutes] = useState(0);
  const [customFocusMinutes, setCustomFocusMinutes] = useState(15);
  const [sessionsCompleted, setSessionsCompleted] = useState(Number(localStorage.getItem("sessionsCompleted")) || 0);
  const [xp, setXp] = useState(Number(localStorage.getItem("xp")) || 0);
  const [focusMode, setFocusMode] = useState("Focus Sprint");
  const [timeDisplayMode, setTimeDisplayMode] = useState(
    localStorage.getItem("readable:timeDisplayMode") || "Clock"
  );
  const [timeSliceStyle, setTimeSliceStyle] = useState(
    localStorage.getItem("readable:timeSliceStyle") || "Fuel Tank"
  );
  const [workPadText, setWorkPadText] = useState("");
  const [workPadActivityCount, setWorkPadActivityCount] = useState(0);
  const [lastWorkPadActivityAt, setLastWorkPadActivityAt] = useState(Date.now());
  const [flowerStageIndex, setFlowerStageIndex] = useState(0);
  const [flowerWatered, setFlowerWatered] = useState(false);
  const [bucketDragging, setBucketDragging] = useState(false);
  const [bucketHoveringRoot, setBucketHoveringRoot] = useState(false);
  const [gardenTick, setGardenTick] = useState(Date.now());
  const [lastBloomSaved, setLastBloomSaved] = useState(false);
  const [activeTaskStep, setActiveTaskStep] = useState("");
  const [activePlanId, setActivePlanId] = useState(null);
  const [activeStepId, setActiveStepId] = useState(null);
  const [microMode, setMicroMode] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [lostFocusCount, setLostFocusCount] = useState(Number(localStorage.getItem("lostFocusCount")) || 0);
  const [lastAttentionLoss, setLastAttentionLoss] = useState(localStorage.getItem("lastAttentionLoss") || "No attention drift recorded yet.");
  const [sessionSummary, setSessionSummary] = useState(false);
  const [lastSessionMinutes, setLastSessionMinutes] = useState(0);
  const [lastSessionXp, setLastSessionXp] = useState(0);

  const [taskInput, setTaskInput] = useState("");
  const [spiceLevel, setSpiceLevel] = useState(2);
  const [plannerMode, setPlannerMode] = useState("normal");
  const [plannerSteps, setPlannerSteps] = useState([]);
  const [savedPlans, setSavedPlans] = useState(() => normalisePlans(safeParse(localStorage.getItem("savedPlans"), [])));

  const [brainInput, setBrainInput] = useState("");
  const [brainList, setBrainList] = useState(safeParse(localStorage.getItem("brainList"), []));
  const [deadlineTitle, setDeadlineTitle] = useState(localStorage.getItem("deadlineTitle") || "Coursework deadline");
  const [deadlineDate, setDeadlineDate] = useState(localStorage.getItem("deadlineDate") || "");
  const [dictationText, setDictationText] = useState("");
  const [readingNotes, setReadingNotes] = useState(localStorage.getItem("readingNotes") || "");
  const [isListening, setIsListening] = useState(false);
  const [readingCheckAnswer, setReadingCheckAnswer] = useState("");
  const [readingCheckConfidence, setReadingCheckConfidence] = useState("Medium");
  const [readingCheckFeedback, setReadingCheckFeedback] = useState("");
  const [wordPredictionInput, setWordPredictionInput] = useState("");
  const [syllableAssistEnabled, setSyllableAssistEnabled] = useState(
    localStorage.getItem("readable:syllableAssistEnabled") === "true"
  );
  const [difficultWords, setDifficultWords] = useState(() =>
    safeParse(localStorage.getItem("readable:difficultWords"), [])
  );
  const [selectedWordSupport, setSelectedWordSupport] = useState(null);
  const [emotionalState, setEmotionalState] = useState(
    localStorage.getItem("readable:emotionalState") || ""
  );
  const [recoveryMemory, setRecoveryMemory] = useState(() =>
    safeParse(localStorage.getItem("readable:recoveryMemory"), [])
  );
  const [graphicOrganizer, setGraphicOrganizer] = useState({
    mainIdea: "",
    keyPointOne: "",
    keyPointTwo: "",
    keyPointThree: "",
    unknownWords: "",
    connection: "",
  });

  const [soundMode, setSoundMode] = useState("Rain");
  const [volume, setVolume] = useState(0.35);
  const [isPlaying, setIsPlaying] = useState(false);
  const [studentState, setStudentState] = useState(localStorage.getItem("studentState") || "");
  const [rescueOpen, setRescueOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [quickDumpOpen, setQuickDumpOpen] = useState(false);
  const [quickDumpText, setQuickDumpText] = useState("");
  const [quickDumpListening, setQuickDumpListening] = useState(false);
  const [quickDumpInbox, setQuickDumpInbox] = useState(() =>
    safeParse(localStorage.getItem("readable:quickDumpInbox"), [])
  );
  const [remindersEnabled, setRemindersEnabled] = useState(
    localStorage.getItem("readable:remindersEnabled") === "true"
  );
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification === "undefined" ? "unsupported" : Notification.permission
  );

  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const quickDumpRecognitionRef = useRef(null);
  const flowerPauseNotifiedRef = useRef(false);
  const tabAwayStartedAtRef = useRef(null);
  const tabAwayReminderSentRef = useRef(false);
  const tabAwayTimeoutRef = useRef(null);
  const fullText = documents[currentDoc];
  const activeFile = studyFiles.find((file) => file.id === activeFileId) || null;
  const activeSection = activeFile?.templateSections?.find((section) => section.id === activeFile.activeTemplateSectionId) || activeFile?.templateSections?.[0] || null;
  const currentTemplateInfo = getTemplateInfo(activeFile?.type || "General Study");

  const normalLines = useMemo(() => {
    return fullText.split(/(?<=[.!?])\s+/).map((line) => line.trim()).filter(Boolean);
  }, [fullText]);

  const chunkedLines = useMemo(() => {
    const words = fullText.split(/\s+/).filter(Boolean);
    const chunks = [];
    let current = [];
    words.forEach((word) => {
      current.push(word);
      if (current.length >= 6) {
        chunks.push(current.join(" "));
        current = [];
      }
    });
    if (current.length) chunks.push(current.join(" "));
    return chunks;
  }, [fullText]);

  const displayLines = chunkMode ? chunkedLines : normalLines;
  const isDenseText = fullText.split(/\s+/).length > 18;
  const wordPredictions = useMemo(() => {
    const query = wordPredictionInput.trim().toLowerCase();

    if (!query) return wordPredictionBank.slice(0, 6);

    return wordPredictionBank
      .filter((phrase) => phrase.toLowerCase().includes(query))
      .slice(0, 6);
  }, [wordPredictionInput]);
  const timerMinutes = Math.floor(timeLeft / 60);
  const timerSeconds = String(timeLeft % 60).padStart(2, "0");
  const level = Math.floor(xp / 100) + 1;
  const currentXpProgress = xp % 100;
  const sessionProgress = currentSessionMinutes ? 1 - timeLeft / (currentSessionMinutes * 60) : 0;
  const timeRemainingPercent = currentSessionMinutes
    ? Math.max(0, Math.min(100, (timeLeft / (currentSessionMinutes * 60)) * 100))
    : 100;
  const timeElapsedPercent = 100 - timeRemainingPercent;
  const inactiveMs = timerRunning ? gardenTick - lastWorkPadActivityAt : 0;
  const plantStage = getPlantStage({
    running: timerRunning,
    file: activeFile,
    stageIndex: flowerStageIndex,
    inactiveMs,
    watered: flowerWatered,
    activityCount: workPadActivityCount,
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => localStorage.setItem("readable:studyFiles", JSON.stringify(studyFiles)), [studyFiles]);
  useEffect(() => localStorage.setItem("readable:activeFileId", activeFileId || ""), [activeFileId]);
  useEffect(() => localStorage.setItem("xp", String(xp)), [xp]);
  useEffect(() => localStorage.setItem("sessionsCompleted", String(sessionsCompleted)), [sessionsCompleted]);
  useEffect(() => localStorage.setItem("readable:timeDisplayMode", timeDisplayMode), [timeDisplayMode]);
  useEffect(() => localStorage.setItem("readable:timeSliceStyle", timeSliceStyle), [timeSliceStyle]);
  useEffect(() => localStorage.setItem("lostFocusCount", String(lostFocusCount)), [lostFocusCount]);
  useEffect(() => localStorage.setItem("lastAttentionLoss", lastAttentionLoss), [lastAttentionLoss]);
  useEffect(() => localStorage.setItem("savedPlans", JSON.stringify(savedPlans)), [savedPlans]);
  useEffect(() => localStorage.setItem("brainList", JSON.stringify(brainList)), [brainList]);
  useEffect(() => localStorage.setItem("readable:quickDumpInbox", JSON.stringify(quickDumpInbox)), [quickDumpInbox]);
  useEffect(() => localStorage.setItem("deadlineTitle", deadlineTitle), [deadlineTitle]);
  useEffect(() => localStorage.setItem("deadlineDate", deadlineDate), [deadlineDate]);
  useEffect(() => localStorage.setItem("readingNotes", readingNotes), [readingNotes]);
  useEffect(() => localStorage.setItem("studentState", studentState), [studentState]);
  useEffect(() => {
    localStorage.setItem("readable:remindersEnabled", String(remindersEnabled));
  }, [remindersEnabled]);

  useEffect(() => {
    localStorage.setItem("readable:syllableAssistEnabled", String(syllableAssistEnabled));
  }, [syllableAssistEnabled]);

  useEffect(() => {
    localStorage.setItem("readable:difficultWords", JSON.stringify(difficultWords));
  }, [difficultWords]);

  useEffect(() => {
    localStorage.setItem("readable:emotionalState", emotionalState);
  }, [emotionalState]);

  useEffect(() => {
    localStorage.setItem("readable:recoveryMemory", JSON.stringify(recoveryMemory));
  }, [recoveryMemory]);

  useEffect(() => {
    setFocusLine(0);
  }, [currentDoc, chunkMode]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const timer = setInterval(() => setGardenTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!remindersEnabled || notificationPermission !== "granted") return;

    if (timerRunning && plantStage.status === "paused-root" && !flowerPauseNotifiedRef.current) {
      notifyUser(
        "ReadAble check-in",
        "Your focus flower has returned to root. That is okay — water it, then write one small sentence when you are ready."
      );
      flowerPauseNotifiedRef.current = true;
    }

    if (plantStage.status !== "paused-root") {
      flowerPauseNotifiedRef.current = false;
    }
  }, [remindersEnabled, notificationPermission, timerRunning, plantStage.status]);

  useEffect(() => {
    function clearTabAwayTimer() {
      if (tabAwayTimeoutRef.current) {
        clearTimeout(tabAwayTimeoutRef.current);
        tabAwayTimeoutRef.current = null;
      }
    }

    function sendTabAwayReminder() {
      if (!remindersEnabled || notificationPermission !== "granted") return;
      if (!timerRunning) return;
      if (document.visibilityState !== "hidden") return;
      if (tabAwayReminderSentRef.current) return;

      notifyUser(
        "ReadAble focus nudge",
        activeFile
          ? `Still working on ${activeFile.title}? Come back, water your focus root, and write one small sentence.`
          : "Your focus session is still running. Come back when you are ready and restart with one small sentence."
      );

      tabAwayReminderSentRef.current = true;
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        tabAwayStartedAtRef.current = Date.now();
        tabAwayReminderSentRef.current = false;
        clearTabAwayTimer();

        tabAwayTimeoutRef.current = setTimeout(sendTabAwayReminder, 60000);
        return;
      }

      tabAwayStartedAtRef.current = null;
      tabAwayReminderSentRef.current = false;
      clearTabAwayTimer();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTabAwayTimer();
    };
  }, [remindersEnabled, notificationPermission, timerRunning, activeFile?.title]);

  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishFocusSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerRunning, timeLeft]);

  useEffect(() => {
    if (!isPlaying || !audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume, isPlaying]);

  function getPlantStage({ running, file, stageIndex, inactiveMs, watered, activityCount }) {
    const stages = [
      {
        icon: "🌰",
        label: "Root planted",
        detail: "You have started. One small step is enough.",
      },
      {
        icon: "🌱",
        label: "Shoot growing",
        detail: "Keep going — even messy progress counts.",
      },
      {
        icon: "🌿",
        label: "Bud forming",
        detail: "Your focus is taking shape.",
      },
      {
        icon: "🌷",
        label: "Flower opening",
        detail: "Your effort is turning into progress.",
      },
      {
        icon: "🌸",
        label: "Blossoming",
        detail: "Nice work. Save what you have written.",
      },
    ];

    if (!file) {
      return {
        icon: "🌰",
        label: "Choose a study file",
        detail: "Your flower saves to a study file after a focus session.",
        status: "no-file",
        needsWater: false,
      };
    }

    if (!running && activityCount === 0) {
      return {
        ...stages[0],
        detail: `Ready to grow for ${file.title}. Start a focus session and write in the Work Pad.`,
        status: "ready",
        needsWater: false,
      };
    }

    if (watered && running) {
      return {
        icon: "💧",
        label: "Root watered",
        detail: "Good restart. Now write one sentence in the Work Pad to help it grow again.",
        status: "watered",
        needsWater: false,
      };
    }

    if (running && inactiveMs >= 120000) {
      return {
        icon: "🌰",
        label: "Focus paused — returned to root",
        detail: "Drag the water bucket onto the root, then write one sentence to regrow.",
        status: "paused-root",
        needsWater: true,
      };
    }

    return {
      ...stages[Math.min(stageIndex, stages.length - 1)],
      status: running ? "growing" : "complete",
      needsWater: false,
    };
  }

  function updateFile(fileId, updater) {
    setStudyFiles((prev) =>
      prev.map((file) => {
        if (file.id !== fileId) return file;
        const updated = typeof updater === "function" ? updater(file) : { ...file, ...updater };
        return { ...updated, updatedAt: new Date().toISOString() };
      })
    );
  }

  function notifyUser(title, body) {
    if (!remindersEnabled) return;
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;

    new Notification(title, {
      body,
      silent: false,
    });
  }

  async function enableSupportReminders() {
    if (typeof Notification === "undefined") {
      setToast("Browser reminders are not supported in this browser.");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === "granted") {
      setRemindersEnabled(true);
      setToast("Motivational browser reminders are on.");
      new Notification("ReadAble reminders enabled", {
        body: "I will nudge you gently when your focus flower pauses, a sprint finishes, or you leave the app during focus.",
      });
    } else {
      setRemindersEnabled(false);
      setToast("Notification permission was not granted.");
    }
  }

  function disableSupportReminders() {
    setRemindersEnabled(false);
    setToast("Motivational browser reminders are off.");
  }

  function playFocusAlarm() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const audioContext = new AudioContext();
      const notes = [660, 880, 660];

      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const startTime = audioContext.currentTime + index * 0.22;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, startTime);
        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.18, startTime + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.2);
      });

      setTimeout(() => audioContext.close(), 1000);
    } catch {
      // Alarm is optional. If the browser blocks audio, the session summary still appears.
    }
  }

  function saveQuickDumpThought(text, source = "Voice Inbox") {
    const cleanText = text.trim();

    if (!cleanText) return;

    const item = {
      id: `quick-${Date.now()}`,
      text: cleanText,
      tag: "Review Later",
      source,
      createdAt: new Date().toISOString(),
    };

    setQuickDumpInbox((prev) => [item, ...prev]);
    setBrainList((prev) => [{ id: Date.now(), text: cleanText, source: "Quick-Dump Voice Inbox" }, ...prev]);
    setQuickDumpText("");
    setQuickDumpOpen(false);
    setQuickDumpListening(false);
    setToast("Thought parked in Review Later. Return to your study task.");
  }

  function startQuickDumpVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    setQuickDumpOpen(true);
    setQuickDumpText("");

    if (!SpeechRecognition) {
      setToast("Voice capture works best in Chrome or Edge. You can type the thought instead.");
      return;
    }

    quickDumpRecognitionRef.current?.stop?.();

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-GB";

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      finalTranscript = transcript.trim();
      setQuickDumpText(finalTranscript);
    };

    recognition.onerror = () => {
      setQuickDumpListening(false);
      setToast("Quick-Dump stopped. Check microphone permission or type the thought.");
    };

    recognition.onend = () => {
      setQuickDumpListening(false);

      if (finalTranscript.trim()) {
        saveQuickDumpThought(finalTranscript, "Voice Inbox");
      }
    };

    quickDumpRecognitionRef.current = recognition;
    recognition.start();
    setQuickDumpListening(true);
  }

  function closeQuickDump() {
    quickDumpRecognitionRef.current?.stop?.();
    setQuickDumpListening(false);
    setQuickDumpOpen(false);
  }

  function saveQuickDumpManual() {
    saveQuickDumpThought(quickDumpText, "Quick-Dump typed fallback");
  }

  function deleteQuickDumpItem(id) {
    setQuickDumpInbox((prev) => prev.filter((item) => item.id !== id));
  }

  function sendQuickDumpToPlanner(item) {
    setTaskInput(item.text);
    deleteQuickDumpItem(item.id);
    goToScreen("planner");
    setToast("Parked thought moved into Study Planner.");
  }

  function handleLogin(event) {
    event.preventDefault();
    if (!loginName.trim()) {
      setToast("Please enter your name to start ReadAble.");
      return;
    }
    const cleanName = loginName.trim();
    const cleanEmail = loginEmail.trim();
    setStudentName(cleanName);
    setStudentEmail(cleanEmail);
    setSupportProfile(loginSupport);
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("studentName", cleanName);
    localStorage.setItem("studentEmail", cleanEmail);
    localStorage.setItem("supportProfile", loginSupport);
    setToast(`Welcome to ReadAble, ${cleanName}.`);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    stopSound();
    setScreen("dashboard");
  }

  function goToScreen(nextScreen) {
    setScreen(nextScreen);
    setTimeout(() => {
      document.querySelector(".shell-main")?.scrollTo({ top: 0, behavior: "smooth" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }

  function createStudyFile(event) {
    event?.preventDefault?.();
    if (!newFileTitle.trim()) {
      setToast("Give the study file a title first.");
      return;
    }
    const templateSections = createTemplateSections(newFileType);
    const file = normaliseStudyFile({
      id: `file-${Date.now()}`,
      title: newFileTitle.trim(),
      module: newFileModule.trim() || "General study",
      type: newFileType,
      deadline: newFileDeadline,
      status: newFileStatus,
      supportFocus: supportProfile === "Prefer not to say" ? "Study support" : supportProfile,
      templateSections,
      activeTemplateSectionId: templateSections[0]?.id || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setStudyFiles((prev) => [file, ...prev]);
    setActiveFileId(file.id);
    setNewFileTitle("");
    setNewFileModule("");
    setNewFileType("Essay");
    setNewFileDeadline("");
    setNewFileStatus("Not started");
    goToScreen("work");
    setToast(`Study file created: ${file.title}`);
  }

  function deleteStudyFile(fileId) {
    setStudyFiles((prev) => prev.filter((file) => file.id !== fileId));
    if (activeFileId === fileId) setActiveFileId("");
  }

  function setActiveTemplateSection(fileId, sectionId) {
    updateFile(fileId, (file) => ({ ...file, activeTemplateSectionId: sectionId }));
  }

  function updateTemplateSection(fileId, sectionId, content) {
    updateFile(fileId, (file) => ({
      ...file,
      templateSections: file.templateSections.map((section) =>
        section.id === sectionId ? { ...section, content, updatedAt: new Date().toISOString() } : section
      ),
    }));
  }

  function addFileNote(fileId, text, source = "Manual note") {
    if (!fileId || !text.trim()) return;
    updateFile(fileId, (file) => ({
      ...file,
      notes: [
        { id: `note-${Date.now()}`, text: text.trim(), source, createdAt: new Date().toISOString() },
        ...file.notes,
      ],
    }));
    setFileNoteInput("");
    setToast("Saved to study file.");
  }

  function saveDraftToFile() {
    if (!activeFile) {
      setToast("Choose a study file first so ReadAble knows where to save the draft.");
      goToScreen("work");
      return;
    }
    if (!workPadText.trim()) {
      setToast("Write something in the Work Pad first.");
      return;
    }
    updateFile(activeFile.id, (file) => ({
      ...file,
      drafts: [
        {
          id: `draft-${Date.now()}`,
          text: workPadText.trim(),
          linkedStep: activeTaskStep || "Focus work",
          createdAt: new Date().toISOString(),
        },
        ...file.drafts,
      ],
    }));
    setToast(`Draft saved to ${activeFile.title}.`);
  }

  function saveWorkPadToTemplate() {
    if (!activeFile || !activeSection) {
      setToast("Choose a study file section first.");
      goToScreen("work");
      return;
    }
    updateTemplateSection(activeFile.id, activeSection.id, workPadText);
    setToast(`Saved to ${activeSection.title}.`);
  }

  function handleWorkPadChange(nextText) {
    setWorkPadText(nextText);

    if (!timerRunning) return;

    setLastWorkPadActivityAt(Date.now());
    setFlowerWatered(false);

    setWorkPadActivityCount((count) => {
      const nextCount = count + 1;

      if (flowerWatered) {
        setFlowerStageIndex(1);
      } else if (nextCount % 5 === 0) {
        setFlowerStageIndex((stage) => Math.min(stage + 1, 4));
      }

      return nextCount;
    });
  }

  function waterFlower() {
    if (!timerRunning) {
      setToast("Start a focus session first, then water your root when you need to restart.");
      return;
    }

    setFlowerWatered(true);
    setBucketDragging(false);
    setBucketHoveringRoot(false);
    setLastWorkPadActivityAt(Date.now());
    setFlowerStageIndex(0);
    setToast("Root watered. Now write one sentence to help it grow again.");
  }

  function handleBucketDragStart(event) {
    event.dataTransfer?.setData("text/plain", "readable-water-bucket");
    event.dataTransfer?.setDragImage?.(event.currentTarget, 24, 24);
    setBucketDragging(true);
  }

  function handleBucketDragEnd() {
    setBucketDragging(false);
    setBucketHoveringRoot(false);
  }

  function handleRootDragOver(event) {
    if (!plantStage.needsWater) return;
    event.preventDefault();
    setBucketHoveringRoot(true);
  }

  function handleRootDragLeave() {
    setBucketHoveringRoot(false);
  }

  function handleRootDrop(event) {
    event.preventDefault();
    if (!plantStage.needsWater) return;
    waterFlower();
  }

  function sendTemplateSectionToPlanner(file, section) {
    setActiveFileId(file.id);
    setTaskInput(`${file.title}: work on ${section.title}`);
    setSpiceLevel(2);
    setPlannerMode("normal");
    setPlannerSteps([
      { id: `template-${Date.now()}-1`, text: `Open ${section.title}.`, status: "todo" },
      { id: `template-${Date.now()}-2`, text: section.prompt, status: "todo" },
      { id: `template-${Date.now()}-3`, text: "Write a rough version without trying to make it perfect.", status: "todo" },
      { id: `template-${Date.now()}-4`, text: "Save progress back to the study file.", status: "todo" },
    ]);
    goToScreen("planner");
    setToast(`${section.title} moved into Study Planner.`);
  }

  function startFocusOnTemplateSection(file, section) {
    setActiveFileId(file.id);
    setActiveTemplateSection(file.id, section.id);
    setActiveTaskStep(`${file.title}: ${section.title}`);
    setWorkPadText(section.content || "");
    setFocusMode("Focus Sprint");
    goToScreen("focus");
    startFocusSession(10);
    setToast(`Focus started on ${section.title}.`);
  }

  function startFocusFromFile(file) {
    const section = file.templateSections.find((item) => item.id === file.activeTemplateSectionId) || file.templateSections[0];
    startFocusOnTemplateSection(file, section);
  }

  function speakText() {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    window.speechSynthesis.cancel();
  }

  function startDictation() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setToast("Speech recognition works best in Chrome or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-GB";
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i += 1) transcript += event.results[i][0].transcript;
      setDictationText(transcript.trim());
    };
    recognition.onerror = () => {
      setIsListening(false);
      setToast("Dictation stopped. Check microphone permission.");
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  function stopDictation() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  function useDictationAsPlannerTask() {
    if (!dictationText.trim()) return;
    setTaskInput(dictationText.trim());
    setDictationText("");
    goToScreen("planner");
    setToast("Dictation moved into Study Planner.");
  }

  function useDictationAsNotes() {
    if (!dictationText.trim()) return;
    setReadingNotes((prev) => (prev ? `${prev}\n\n${dictationText.trim()}` : dictationText.trim()));
    if (activeFile) addFileNote(activeFile.id, dictationText, "Dictation from Reading Lab");
    setDictationText("");
    setToast(activeFile ? "Dictation added to notes and active file." : "Dictation added to Reading Notes.");
  }

  function sendDictationToBrainDump() {
    if (!dictationText.trim()) return;
    setBrainList((prev) => [{ id: Date.now(), text: dictationText.trim(), source: "Dictation" }, ...prev]);
    setDictationText("");
    setToast("Dictation sent to Brain Dump.");
  }

  function runReadingCheck() {
    const answer = readingCheckAnswer.trim();
    if (!answer) {
      setReadingCheckFeedback("Write one sentence first. It does not need to be perfect.");
      return;
    }
    if (answer.split(/\s+/).length < 8) {
      setReadingCheckFeedback("Good start. Add one more detail from the reading so it is easier to remember later.");
      return;
    }
    if (readingCheckConfidence === "Low") {
      setReadingCheckFeedback("Useful answer. Because confidence is low, try Read Aloud or reread one chunk before moving on.");
      return;
    }
    setReadingCheckFeedback("Nice. You have enough understanding to save this as a note or turn it into a task.");
  }

  function useReadingCheckAsNote() {
    if (!readingCheckAnswer.trim()) return;
    setReadingNotes((prev) => (prev ? `${prev}\n\nReading check: ${readingCheckAnswer.trim()}` : `Reading check: ${readingCheckAnswer.trim()}`));
    if (activeFile) addFileNote(activeFile.id, readingCheckAnswer, "Understanding check");
    setReadingCheckFeedback("Saved as a note.");
  }

  function rememberRecoveryTool(tool) {
    setRecoveryMemory((prev) => {
      const withoutDuplicate = prev.filter((item) => item !== tool);
      return [tool, ...withoutDuplicate].slice(0, 5);
    });
  }

  function handleEmotionalState(nextState) {
    setEmotionalState(nextState);
    const modeInfo = emotionalStudyModes[nextState];

    if (nextState === "Overwhelmed") {
      rememberRecoveryTool("2-minute micro-start");
      setToast("Overwhelmed mode: ReadAble will keep the next action small.");
    }

    if (nextState === "Tired") {
      rememberRecoveryTool("Read aloud");
      setToast("Tired mode: use read aloud and shorter study blocks.");
    }

    if (nextState === "Confused") {
      setChunkMode(true);
      setMode("Low Stress");
      rememberRecoveryTool("Chunked View");
      rememberRecoveryTool("Graphic organiser");
      setToast("Confused mode: Chunked View and Reading Lab support are ready.");
    }

    if (nextState === "Distracted") {
      rememberRecoveryTool("Focus Flower");
      rememberRecoveryTool("Browser reminders");
      setToast("Distracted mode: restart with Focus Cockpit or a micro-start.");
    }

    if (nextState === "Motivated") {
      setToast("Motivated mode: continue a file section or turn momentum into a plan.");
    }

    return modeInfo;
  }

  function runEmotionalPrimaryAction() {
    if (emotionalState === "Overwhelmed") {
      startMicroCommitment();
      return;
    }

    if (emotionalState === "Tired") {
      speakText();
      rememberRecoveryTool("Read aloud");
      return;
    }

    if (emotionalState === "Confused") {
      setChunkMode(true);
      setMode("Low Stress");
      rememberRecoveryTool("Chunked View");
      rememberRecoveryTool("Graphic organiser");
      goToScreen("reading");
      return;
    }

    if (emotionalState === "Distracted") {
      goToScreen("focus");
      return;
    }

    if (emotionalState === "Motivated") {
      if (activeFile && activeSection) startFocusOnTemplateSection(activeFile, activeSection);
      else goToScreen("work");
      return;
    }

    setToast("Choose how you feel first.");
  }

  function runEmotionalSecondaryAction() {
    if (emotionalState === "Overwhelmed") {
      startDeadlineRescue();
      return;
    }

    if (emotionalState === "Tired") {
      goToScreen("focus");
      startFocusSession(5);
      return;
    }

    if (emotionalState === "Confused") {
      setChunkMode(true);
      rememberRecoveryTool("Chunked View");
      return;
    }

    if (emotionalState === "Distracted") {
      startMicroCommitment();
      return;
    }

    if (emotionalState === "Motivated") {
      goToScreen("planner");
      return;
    }

    setToast("Choose a study mode first.");
  }

  function useRecoveryRoutine() {
    if (recoveryMemory.length === 0) {
      setToast("No recovery routine saved yet. Use support tools and ReadAble will remember what helps.");
      return;
    }

    if (recoveryMemory.includes("Chunked View")) {
      setChunkMode(true);
      setMode("Low Stress");
    }

    if (recoveryMemory.includes("Graphic organiser")) {
      goToScreen("reading");
    }

    if (recoveryMemory.includes("2-minute micro-start")) {
      startMicroCommitment();
      return;
    }

    if (recoveryMemory.includes("Focus Flower")) {
      goToScreen("focus");
      return;
    }

    if (recoveryMemory.includes("Read aloud")) {
      speakText();
      return;
    }

    setToast(`Recovery routine ready: ${recoveryMemory.join(" + ")}`);
  }

  function handleDifficultWordClick(rawWord) {
    const support = getWordSupport(rawWord);
    if (!support.word) return;

    setSelectedWordSupport(support);

    setDifficultWords((prev) => {
      if (prev.includes(support.word)) return prev;
      return [support.word, ...prev].slice(0, 20);
    });

    setGraphicOrganizer((prev) => {
      const existing = prev.unknownWords
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);

      if (existing.includes(support.word)) return prev;

      return {
        ...prev,
        unknownWords: prev.unknownWords
          ? `${prev.unknownWords}, ${support.word}`
          : support.word,
      };
    });

    rememberRecoveryTool("Difficult word collector");
  }

  function removeDifficultWord(word) {
    setDifficultWords((prev) => prev.filter((item) => item !== word));
  }

  function saveDifficultWordsToFile() {
    if (difficultWords.length === 0) {
      setToast("Click words in the reading first.");
      return;
    }

    const wordsText = difficultWords.map((word) => `- ${word}`).join("\n");

    setReadingNotes((prev) =>
      prev ? `${prev}\n\nWords I need to check:\n${wordsText}` : `Words I need to check:\n${wordsText}`
    );

    if (activeFile) {
      addFileNote(activeFile.id, wordsText, "Difficult word collector");

      if (activeFile.type === "Reading Notes") {
        const wordsSection = activeFile.templateSections.find((section) => section.id === "words");
        const existing = wordsSection?.content?.trim();

        updateTemplateSection(
          activeFile.id,
          "words",
          existing ? `${existing}\n\n${wordsText}` : wordsText
        );
      }
    }

    rememberRecoveryTool("Difficult word collector");
    setToast(activeFile?.type === "Reading Notes" ? "Words saved into Reading Notes template." : "Words saved to notes.");
  }

  function makeRevisionCardsFromWords() {
    if (difficultWords.length === 0) {
      setToast("Collect difficult words first.");
      return;
    }

    const revisionTask = `Create revision cards for: ${difficultWords.join(", ")}`;
    setTaskInput(revisionTask);
    setPlannerMode("normal");
    setSpiceLevel(2);
    setPlannerSteps(
      difficultWords.slice(0, 6).map((word, index) => ({
        id: `word-card-${Date.now()}-${index}`,
        text: `Make a revision card for "${word}" using meaning, syllables, and one example sentence.`,
        status: "todo",
      }))
    );
    goToScreen("planner");
    setToast("Difficult words turned into revision card steps.");
  }

  function renderReadableLine(line) {
    return line.split(/(\s+)/).map((part, index) => {
      if (/^\s+$/.test(part)) return part;

      const clean = cleanReadingWord(part);
      const isCollected = difficultWords.includes(clean);
      const isLongWord = clean.length >= 8;

      return (
        <button
          key={`${part}-${index}`}
          className={
            isCollected
              ? "readable-word collected"
              : syllableAssistEnabled && isLongWord
                ? "readable-word syllable-candidate"
                : "readable-word"
          }
          onClick={(event) => {
            event.stopPropagation();
            handleDifficultWordClick(part);
          }}
          title="Click to collect this word"
        >
          {syllableAssistEnabled && isLongWord ? createSyllableBreakdown(part) : part}
        </button>
      );
    });
  }

  function insertPrediction(phrase) {
    setReadingNotes((prev) => (prev ? `${prev} ${phrase}` : phrase));
    setWordPredictionInput("");
    setToast("Prediction added to Reading Notes.");
  }

  function updateGraphicOrganizer(field, value) {
    setGraphicOrganizer((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function saveGraphicOrganizerToNotes() {
    const organiserText = [
      graphicOrganizer.mainIdea && `Main idea: ${graphicOrganizer.mainIdea}`,
      graphicOrganizer.keyPointOne && `Key point 1: ${graphicOrganizer.keyPointOne}`,
      graphicOrganizer.keyPointTwo && `Key point 2: ${graphicOrganizer.keyPointTwo}`,
      graphicOrganizer.keyPointThree && `Key point 3: ${graphicOrganizer.keyPointThree}`,
      graphicOrganizer.unknownWords && `Words to check: ${graphicOrganizer.unknownWords}`,
      graphicOrganizer.connection && `How this connects: ${graphicOrganizer.connection}`,
    ]
      .filter(Boolean)
      .join("\n");

    if (!organiserText.trim()) {
      setToast("Add something to the graphic organiser first.");
      return;
    }

    setReadingNotes((prev) =>
      prev ? `${prev}\n\nGraphic organiser:\n${organiserText}` : `Graphic organiser:\n${organiserText}`
    );

    if (activeFile) {
      addFileNote(activeFile.id, organiserText, "Graphic organiser");

      if (activeFile.type === "Reading Notes") {
        const sectionUpdates = [
          ["main-idea", graphicOrganizer.mainIdea],
          [
            "key-points",
            [graphicOrganizer.keyPointOne, graphicOrganizer.keyPointTwo, graphicOrganizer.keyPointThree]
              .filter(Boolean)
              .join("\n"),
          ],
          ["words", graphicOrganizer.unknownWords],
          ["assignment-link", graphicOrganizer.connection],
        ];

        sectionUpdates.forEach(([sectionId, content]) => {
          if (content?.trim()) {
            const existingSection = activeFile.templateSections.find((section) => section.id === sectionId);
            const existingContent = existingSection?.content?.trim();

            updateTemplateSection(
              activeFile.id,
              sectionId,
              existingContent ? `${existingContent}\n\n${content.trim()}` : content.trim()
            );
          }
        });
      }
    }

    rememberRecoveryTool("Graphic organiser");

    setToast(
      activeFile?.type === "Reading Notes"
        ? "Graphic organiser saved into your Reading Notes file."
        : "Graphic organiser saved to Reading Notes."
    );
  }

  function sendOrganizerToPlanner() {
    const task = graphicOrganizer.mainIdea
      ? `Turn this reading into study notes: ${graphicOrganizer.mainIdea}`
      : `Turn ${currentDoc} into study notes`;

    setTaskInput(task);
    setPlannerMode("normal");
    setSpiceLevel(2);
    setPlannerSteps([
      { id: `organiser-${Date.now()}-1`, text: "Review the main idea from the graphic organiser.", status: "todo" },
      { id: `organiser-${Date.now()}-2`, text: "Choose the strongest key point.", status: "todo" },
      { id: `organiser-${Date.now()}-3`, text: "Add one example, quote, or explanation.", status: "todo" },
      { id: `organiser-${Date.now()}-4`, text: "Save the summary back to the study file.", status: "todo" },
    ]);
    goToScreen("planner");
    setToast("Graphic organiser moved into Study Planner.");
  }

  function startFocusSession(minutes) {
    const safeMinutes = Math.max(1, Math.min(120, Number(minutes) || 1));
    setCurrentSessionMinutes(safeMinutes);
    setTimeLeft(safeMinutes * 60);
    setTimerRunning(true);
    setRecoveryMode(false);
    setMicroMode(safeMinutes <= 2);
    setWorkPadActivityCount(0);
    setLastWorkPadActivityAt(Date.now());
    setFlowerStageIndex(0);
    setFlowerWatered(false);
    setBucketDragging(false);
    setBucketHoveringRoot(false);
    setLastBloomSaved(false);
  }

  function startMicroCommitment() {
    setFocusMode("Micro-start");
    setMicroMode(true);
    setActiveTaskStep(activeTaskStep || "Work for two minutes only. Your only job is to begin.");
    goToScreen("focus");
    startFocusSession(2);
  }

  function startRecovery() {
    setFocusMode("Recovery");
    setRecoveryMode(true);
    setActiveTaskStep("Return to one tiny action. No catching up, just restart.");
    rememberRecoveryTool("Recovery prompt");
    goToScreen("focus");
  }

  function finishFocusSession() {
    setTimerRunning(false);
    playFocusAlarm();
    const earnedXp = Math.max(5, currentSessionMinutes * 2);
    setXp((prev) => prev + earnedXp);
    setSessionsCompleted((prev) => prev + 1);
    setLastSessionMinutes(currentSessionMinutes);
    setLastSessionXp(earnedXp);
    setSessionSummary(true);

    const hasEnoughWorkForBloom =
      workPadActivityCount >= 5 || workPadText.trim().length >= 80;

    notifyUser(
      "Focus sprint complete",
      hasEnoughWorkForBloom
        ? "Nice work — your focus flower blossomed. Save what you wrote before moving on."
        : "You finished the sprint. Your work is still safe — write one more sentence or save a note when you are ready."
    );

    setLastBloomSaved(Boolean(activeFile && hasEnoughWorkForBloom));

    if (activeFile) {
      updateFile(activeFile.id, (file) => ({
        ...file,
        garden: hasEnoughWorkForBloom
          ? [
              {
                id: `flower-${Date.now()}`,
                icon: "🌸",
                minutes: currentSessionMinutes,
                step: activeTaskStep || "Focus session",
                createdAt: new Date().toISOString(),
              },
              ...file.garden,
            ]
          : file.garden,
        focusSessions: [
          {
            id: `session-${Date.now()}`,
            minutes: currentSessionMinutes,
            step: activeTaskStep || "Focus session",
            producedWork: hasEnoughWorkForBloom,
            createdAt: new Date().toISOString(),
          },
          ...file.focusSessions,
        ],
      }));
    }

    if (activePlanId && activeStepId) updatePlanStepStatus(activePlanId, activeStepId, "done");
  }

  function startPlannerStep(plan, step) {
    setActivePlanId(plan.id);
    setActiveStepId(step.id);
    setActiveTaskStep(step.text);
    if (plan.fileId) setActiveFileId(plan.fileId);
    goToScreen("focus");
    startFocusSession(10);
  }

  function startNextStep(plan) {
    const nextStep = plan.steps.find((step) => step.status !== "done");
    if (nextStep) startPlannerStep(plan, nextStep);
  }

  function generatePlan(customTask = taskInput, customSteps = null) {
    const task = customTask.trim();
    if (!task) return;
    const baseSteps = customSteps || [
      `Clarify the outcome for: ${task}`,
      "Choose the smallest possible first action.",
      "Work for one short sprint.",
      "Save progress back to the study file.",
      "Decide the next step.",
    ];
    setPlannerSteps(baseSteps.map((step, index) => ({ id: `step-${Date.now()}-${index}`, text: step, status: "todo" })));
  }

  function saveCurrentPlan() {
    if (!taskInput.trim() || plannerSteps.length === 0) return;
    const plan = { id: `plan-${Date.now()}`, task: taskInput.trim(), fileId: activeFileId || null, spiceLevel, steps: plannerSteps };
    setSavedPlans((prev) => [plan, ...prev]);
    if (activeFile) {
      updateFile(activeFile.id, (file) => ({ ...file, plans: [plan, ...file.plans] }));
    }
    setTaskInput("");
    setPlannerSteps([]);
    setPlannerMode("normal");
    setToast(activeFile ? `Plan saved to ${activeFile.title}.` : "Plan saved.");
  }

  function updatePlanStepStatus(planId, stepId, newStatus) {
    setSavedPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, steps: plan.steps.map((step) => (step.id === stepId ? { ...step, status: newStatus } : step)) } : plan)));
  }

  function deletePlan(id) {
    setSavedPlans((prev) => prev.filter((plan) => plan.id !== id));
  }

  function resetPlanProgress(planId) {
    setSavedPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, steps: plan.steps.map((step) => ({ ...step, status: "todo" })) } : plan)));
  }

  function getPlanProgress(plan) {
    if (!plan.steps.length) return 0;
    const done = plan.steps.filter((step) => step.status === "done").length;
    return Math.round((done / plan.steps.length) * 100);
  }

  function addBrainItem() {
    if (!brainInput.trim()) return;
    setBrainList((prev) => [{ id: Date.now(), text: brainInput.trim(), source: "Brain Dump" }, ...prev]);
    setBrainInput("");
  }

  function deleteBrainItem(id) {
    setBrainList((prev) => prev.filter((item) => item.id !== id));
  }

  function sendToPlanner(text) {
    setTaskInput(text);
    goToScreen("planner");
    setToast("Thought moved into Study Planner.");
  }

  function startDeadlineRescue() {
    const task = activeFile ? `Deadline rescue: ${activeFile.title}` : `Deadline rescue: ${deadlineTitle}`;
    const rescueSteps = [
      "Confirm exactly what needs to be submitted.",
      "Find the deadline date, marking criteria, or assignment requirements.",
      "Decide the minimum acceptable version you could submit if time is tight.",
      "Choose the smallest section you can start in the next 10 minutes.",
      "Work on that one section only.",
      "Save progress and choose the next rescue sprint.",
    ];
    setPlannerMode("deadline-rescue");
    setTaskInput(task);
    setSpiceLevel(4);
    setPlannerSteps(rescueSteps.map((step, index) => ({ id: `deadline-${Date.now()}-${index}`, text: step, status: "todo" })));
    setActiveTaskStep(rescueSteps[0]);
    goToScreen("planner");
    setToast("Deadline Rescue opened. Start with one small action.");
  }

  function chooseRescueNeed(need) {
    setRescueOpen(false);
    if (need === "Deadline is close") startDeadlineRescue();
    if (need === "Too much text") {
      setMode("Low Stress");
      setChunkMode(true);
      goToScreen("reading");
      setToast("Reading load reduced with Chunked View and Low Stress Mode.");
    }
    if (need === "I can’t start") startMicroCommitment();
    if (need === "I lost focus") startRecovery();
    if (need === "I don’t understand") {
      setChunkMode(true);
      goToScreen("reading");
      setToast("Open the understanding check after reading one chunk.");
    }
  }

  function getDeadlineInfo() {
    const date = activeFile?.deadline || deadlineDate;
    if (!date) return { label: "No deadline set", progress: 0, urgency: "Set one key academic deadline." };
    const today = new Date();
    const deadline = new Date(date);
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    const progress = daysLeft <= 2 ? 95 : daysLeft <= 7 ? 78 : daysLeft <= 14 ? 55 : 25;
    const urgency = daysLeft <= 2 ? "Urgent. Use Deadline Rescue." : daysLeft <= 7 ? "Important this week. Use short focus blocks." : "Start gently and make a plan.";
    return { label: daysLeft < 0 ? `${Math.abs(daysLeft)} day(s) overdue` : `${daysLeft} day(s) left`, progress, urgency };
  }

  function getFocusState() {
    if (recoveryMode) return "Recovery";
    if (microMode) return "Micro Focus";
    if (timerRunning && currentSessionMinutes >= 10) return "Deep Focus";
    return "Ready";
  }

  function focusStateWidth() {
    const state = getFocusState();
    if (state === "Recovery") return "35%";
    if (state === "Micro Focus") return "55%";
    if (state === "Deep Focus") return "90%";
    return "65%";
  }

  function getNextPlannableItem() {
    for (const plan of savedPlans) {
      const step = plan.steps.find((item) => item.status !== "done");
      if (step) return { plan, step };
    }
    return null;
  }

  function getNextBestAction() {
    const nextPlanItem = getNextPlannableItem();
    if (!activeFile) {
      return {
        title: "Create a study file first",
        body: "ReadAble saves notes, plans, drafts, and focus blooms inside study files.",
        primary: "Create Saved Work",
        secondary: "Open Reading Lab",
        action: () => goToScreen("work"),
        secondaryAction: () => goToScreen("reading"),
        tag: "Study workspace",
      };
    }
    if (plannerMode === "deadline-rescue") {
      return {
        title: "Deadline Rescue active",
        body: "Your emergency plan is ready. Start the first 10-minute action.",
        primary: "Start Rescue Sprint",
        secondary: "Open File",
        action: () => {
          goToScreen("focus");
          startFocusSession(10);
        },
        secondaryAction: () => goToScreen("work"),
        tag: "Deadline rescue",
      };
    }
    if (dictationText.trim()) {
      return {
        title: "Speech captured",
        body: "Turn your dictated idea into a note, a planner task, or save it to the active file.",
        primary: "Save to File",
        secondary: "Use as Task",
        action: () => addFileNote(activeFile.id, dictationText, "Dictation"),
        secondaryAction: useDictationAsPlannerTask,
        tag: "Capture support",
      };
    }
    if (nextPlanItem) {
      return {
        title: "Next step available",
        body: nextPlanItem.step.text,
        primary: "Start Step",
        secondary: "Open Planner",
        action: () => startPlannerStep(nextPlanItem.plan, nextPlanItem.step),
        secondaryAction: () => goToScreen("planner"),
        tag: "Next action",
      };
    }
    return {
      title: `Continue ${activeFile.title}`,
      body: activeSection ? `Work on ${activeSection.title}: ${activeSection.prompt}` : "Open the file workspace and choose a section.",
      primary: "Focus on Section",
      secondary: "Open File",
      action: () => activeSection && startFocusOnTemplateSection(activeFile, activeSection),
      secondaryAction: () => goToScreen("work"),
      tag: "Study flow",
    };
  }

  function toggleSound() {
    if (isPlaying) {
      stopSound();
      return;
    }
    const audio = new Audio(soundOptions[soundMode]);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;
    audio.play();
    setIsPlaying(true);
  }

  function stopSound() {
    audioRef.current?.pause();
    audioRef.current = null;
    setIsPlaying(false);
  }

  function changeSoundMode(nextMode) {
    setSoundMode(nextMode);
    if (isPlaying) {
      stopSound();
      setTimeout(() => {
        const audio = new Audio(soundOptions[nextMode]);
        audio.loop = true;
        audio.volume = volume;
        audioRef.current = audio;
        audio.play();
        setIsPlaying(true);
      }, 50);
    }
  }

  const support = getNextBestAction();
  const deadlineInfo = getDeadlineInfo();
  const focusState = getFocusState();

  if (showSplash) {
    return (
      <div className="splash-screen">
        <div className="splash-orb splash-orb-one" />
        <div className="splash-orb splash-orb-two" />
        <div className="splash-card">
          <div className="brand-mark">R</div>
          <h1>ReadAble</h1>
          <p>University study support for reading, planning, focus, and saved work.</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        {toast && <div className="toast">{toast}</div>}
        <section className="login-brand-side">
          <div className="brand-lockup">
            <div className="brand-mark">R</div>
            <div>
              <h1>ReadAble</h1>
              <p>Adaptive university support for dyslexia and ADHD.</p>
            </div>
          </div>
          <h2>Your study workspace, not just a timer.</h2>
          <p className="login-large-copy">Create study files, read material, save notes, plan assignments, focus with a Work Pad, and grow your Focus Garden.</p>
          <div className="login-feature-grid">
            <div className="login-feature-card"><strong>Saved Work</strong><span>Files, templates, drafts, notes, and focus history.</span></div>
            <div className="login-feature-card"><strong>Reading support</strong><span>Chunked text, read aloud, dictation, and checks.</span></div>
            <div className="login-feature-card"><strong>Focus support</strong><span>Work Pad, Focus Garden, sounds, and recovery.</span></div>
          </div>
        </section>
        <section className="login-form-card">
          <span className="eyebrow">Student access</span>
          <h2>Welcome to ReadAble</h2>
          <p>Local demo login. Your study workspace is saved in this browser.</p>
          <form onSubmit={handleLogin}>
            <label>Name<input value={loginName} onChange={(event) => setLoginName(event.target.value)} placeholder="e.g. Alex" /></label>
            <label>University email<input value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} placeholder="e.g. alex@university.ac.uk" /></label>
            <label>Support focus<select value={loginSupport} onChange={(event) => setLoginSupport(event.target.value)}><option>Dyslexia</option><option>ADHD</option><option>Both</option><option>Prefer not to say</option></select></label>
            <button type="submit">Enter ReadAble</button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="shell">
      {toast && <div className="toast">{toast}</div>}

      <button
        className={quickDumpListening ? "quick-dump-float listening" : "quick-dump-float"}
        onClick={startQuickDumpVoice}
        aria-label="Quick-Dump Voice Inbox"
        title="Quick-Dump Voice Inbox"
      >
        🎙️
      </button>

      {quickDumpOpen && (
        <div className="quick-dump-popover">
          <div>
            <span className="eyebrow">Quick-Dump Voice Inbox</span>
            <h3>{quickDumpListening ? "Listening..." : "Park a thought"}</h3>
            <p>
              Capture a distracting thought, save it to Review Later, then return
              to your study task.
            </p>
          </div>

          <textarea
            value={quickDumpText}
            onChange={(event) => setQuickDumpText(event.target.value)}
            placeholder="Example: Email boss about Friday shift..."
          />

          <div className="button-row">
            <button onClick={saveQuickDumpManual}>Park Thought</button>
            <button className="secondary-button" onClick={startQuickDumpVoice}>
              Record Again
            </button>
            <button className="secondary-button" onClick={closeQuickDump}>
              Close
            </button>
          </div>
        </div>
      )}

      <aside className="sidebar">
        <div className="sidebar-brand"><div className="brand-mark">R</div><div><h1>ReadAble</h1><p>Study workspace</p></div></div>
        <div className="sidebar-profile-card"><span className="profile-label">Student profile</span><strong>{studentName || "Student"}</strong><small>{studentEmail || "University account"}</small><div className="student-pill">{supportProfile} support focus</div></div>
        <nav>{navItems.map((item) => <button key={item.id} className={screen === item.id ? "nav-button active" : "nav-button"} onClick={() => goToScreen(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav>
        <div className="sidebar-demo-flow"><span>Study flow</span><ol><li>Create file</li><li>Read and capture</li><li>Plan sections</li><li>Focus in Work Pad</li><li>Review progress</li></ol></div>
        <button className="logout-button" onClick={handleLogout}>Log out</button>
      </aside>

      <main className="shell-main">
        <section className="focus-bar smart-support-banner">
          <div>
            <span className="eyebrow">Next best action</span>
            <h2>{support.title}</h2>
            <p>{support.body}</p>
          </div>
          <div className="support-actions">
            <button className="rescue-button" onClick={() => setRescueOpen(true)}>I’m stuck</button>
            <span className="support-tag">{support.tag}</span>

            {emotionalState && (
              <span className="support-context-chip">Mode: {emotionalState}</span>
            )}

            {recoveryMemory.length > 0 && (
              <button className="secondary-button compact-context-button" onClick={useRecoveryRoutine}>
                Use recovery pattern
              </button>
            )}

            <button onClick={support.action}>{support.primary}</button>
            <button className="secondary-button" onClick={support.secondaryAction}>{support.secondary}</button>
          </div>
        </section>

        {rescueOpen && (
          <div className="modal-backdrop">
            <div className="rescue-modal">
              <span className="eyebrow">Study rescue</span>
              <h2>What kind of stuck are you?</h2>
              <p>Choose the closest problem. ReadAble will move you to the correct support mode.</p>
              <div className="rescue-grid">
                {["Deadline is close", "Too much text", "I can’t start", "I lost focus", "I don’t understand"].map((need) => <button key={need} onClick={() => chooseRescueNeed(need)}>{need}</button>)}
              </div>
              <button className="secondary-button" onClick={() => setRescueOpen(false)}>Cancel</button>
            </div>
          </div>
        )}

        {screen === "dashboard" && (
          <section className="page">
            <div className="dashboard-hero">
              <div>
                <span className="eyebrow">Today’s Study Desk</span>
                <h1>Build your work, then study from it.</h1>
                <p>ReadAble now centres everything around saved study files: templates, notes, plans, focus drafts, and progress.</p>
                <div className="hero-actions"><button onClick={() => goToScreen("work")}>Create / Open Study File</button><button className="secondary-button" onClick={startDeadlineRescue}>Deadline Rescue</button></div>
              </div>
              <button
                className="hero-demo-card clickable-active-file"
                onClick={() => goToScreen("work")}
              >
                <span>{activeFile ? "Continue active file" : "No active file"}</span>
                <strong>{activeFile?.title || "Create a study file"}</strong>
                <p>
                  {activeFile
                    ? `${activeFile.type} · ${activeFile.module} · ${formatDate(activeFile.deadline)}`
                    : "Create a study file to start saving work."}
                </p>
                <em>{activeFile ? "Open workspace →" : "Create / open file →"}</em>
              </button>
            </div>

            <div className="study-flow-row">
              {[
                { label: "Create file", screen: "work" },
                { label: "Read", screen: "reading" },
                { label: "Plan", screen: "planner" },
                { label: "Focus", screen: "focus" },
                { label: "Review", screen: "insights" },
              ].map((step, index) => (
                <button
                  key={step.label}
                  className="flow-step"
                  onClick={() => goToScreen(step.screen)}
                >
                  <span>{index + 1}</span>
                  <strong>{step.label}</strong>
                  <small>
                    {index === 0 && "Open your study file workspace"}
                    {index === 1 && "Use reading support"}
                    {index === 2 && "Break work into steps"}
                    {index === 3 && "Write with the flower timer"}
                    {index === 4 && "Check progress"}
                  </small>
                </button>
              ))}
            </div>

            <div className="adaptive-mode-panel">
              <div>
                <span className="eyebrow">Study Mode Check-in</span>
                <h2>How should ReadAble support this session?</h2>
                <p>
                  This controls the tone of the app’s next action. It connects
                  emotional state, recovery memory, Reading Lab tools, and Focus
                  Cockpit into one support route.
                </p>
              </div>

              <div className="emotion-chip-row">
                {Object.keys(emotionalStudyModes).map((state) => (
                  <button
                    key={state}
                    className={emotionalState === state ? "emotion-chip active" : "emotion-chip"}
                    onClick={() => handleEmotionalState(state)}
                  >
                    {state}
                  </button>
                ))}
              </div>

              {emotionalState && (
                <div className="emotion-result-card">
                  <div>
                    <strong>{emotionalStudyModes[emotionalState].title}</strong>
                    <p>{emotionalStudyModes[emotionalState].body}</p>
                  </div>

                  <div className="button-row">
                    <button onClick={runEmotionalPrimaryAction}>
                      {emotionalStudyModes[emotionalState].primary}
                    </button>
                    <button className="secondary-button" onClick={runEmotionalSecondaryAction}>
                      {emotionalStudyModes[emotionalState].secondary}
                    </button>
                  </div>
                </div>
              )}

              <div className="recovery-memory-card">
                <span>Recovery Memory</span>
                <strong>
                  {recoveryMemory.length
                    ? `ReadAble remembered: ${recoveryMemory.join(" + ")}`
                    : "Use support tools and ReadAble will learn what helps you restart."}
                </strong>
                <p>
                  This is why the app feels adaptive: it can reuse the support
                  route that helped you last time.
                </p>
                <button className="secondary-button" onClick={useRecoveryRoutine}>
                  Use my recovery routine
                </button>
              </div>
            </div>

            <div className="dashboard-grid">
              <button className="navigation-tile work-tile" onClick={() => goToScreen("work")}><span>Saved Work</span><strong>Study files</strong><p>Create files with essay, revision, research, exam, or presentation templates.</p></button>
              <button className="navigation-tile reading-tile" onClick={() => goToScreen("reading")}><span>Reading Lab</span><strong>Dyslexia support</strong><p>Read aloud, chunk text, dictate notes, and save understanding to your file.</p></button>
              <button className="navigation-tile focus-tile" onClick={() => goToScreen("focus")}><span>Focus Cockpit</span><strong>Work Pad + Garden</strong><p>Write inside a linked file while your focus tree grows.</p></button>
              <div className="card deadline-card"><span className="eyebrow">Deadline</span><h3>{activeFile?.deadline ? activeFile.title : deadlineTitle}</h3><p className="deadline-label">{deadlineInfo.label}</p><div className="progress-track"><div className="progress-fill" style={{ width: `${deadlineInfo.progress}%` }} /></div><p>{deadlineInfo.urgency}</p><button onClick={startDeadlineRescue}>Open Deadline Rescue</button></div>
              <div className="card"><span className="eyebrow">Brain dump</span><h3>Unload thoughts</h3><div className="inline-input"><input value={brainInput} onChange={(event) => setBrainInput(event.target.value)} placeholder="Type a worry, task, or idea..." /><button onClick={addBrainItem}>Add</button></div><div className="mini-list">{brainList.slice(0, 3).map((item) => <div key={item.id} className="mini-list-item"><span>{item.text}</span><button onClick={() => sendToPlanner(item.text)}>Plan</button></div>)}</div></div>
              <div className="card quick-inbox-card"><span className="eyebrow">Review Later</span><h3>{quickDumpInbox.length} parked thought(s)</h3><p>Quick-Dump catches distracting thoughts so you can return to the main study task.</p><div className="mini-list">{quickDumpInbox.slice(0, 3).map((item) => <div key={item.id} className="mini-list-item"><span>{item.text}</span><div className="button-row"><button onClick={() => sendQuickDumpToPlanner(item)}>Plan</button><button className="secondary-button" onClick={() => deleteQuickDumpItem(item.id)}>Done</button></div></div>)}</div></div>
              <div className="card adaptive-card"><span className="eyebrow">Focus Garden</span><h3>{activeFile ? `${activeFile.garden.length} flower bloom(s) grown` : "No file selected"}</h3><p>{activeFile ? `Blooms grown for ${activeFile.title}.` : "Blooms save to a study file after focus sessions."}</p></div>
            </div>
          </section>
        )}

        {screen === "work" && (
          <section className="page">
            <div className="page-header"><span className="eyebrow">Saved Work</span><h1>Study Files</h1><p>Create work files with useful structures, then save notes, drafts, plans, focus sessions, and Focus Garden blooms inside them.</p></div>
            <div className="saved-work-layout">
              <form className="card create-file-card" onSubmit={createStudyFile}>
                <h3>Create new study file</h3>
                <label>Title<input value={newFileTitle} onChange={(event) => setNewFileTitle(event.target.value)} placeholder="e.g. Business Law Essay" /></label>
                <label>Module / class<input value={newFileModule} onChange={(event) => setNewFileModule(event.target.value)} placeholder="e.g. Business Law" /></label>
                <label>Work type<select value={newFileType} onChange={(event) => setNewFileType(event.target.value)}>{workTypeOptions.map((type) => <option key={type}>{type}</option>)}</select></label>
                <label>Deadline<input type="date" value={newFileDeadline} onChange={(event) => setNewFileDeadline(event.target.value)} /></label>
                <label>Status<select value={newFileStatus} onChange={(event) => setNewFileStatus(event.target.value)}><option>Not started</option><option>Reading</option><option>Planning</option><option>Drafting</option><option>Revising</option><option>Complete</option></select></label>
                <button type="submit">Create Study File</button>
              </form>

              <div className="file-list-column">
                {studyFiles.length === 0 && <div className="empty-state">No study files yet. Create one to unlock templates, Work Pad saving, and Focus Garden progress.</div>}
                {studyFiles.map((file) => (
                  <div key={file.id} className={activeFileId === file.id ? "study-file-card active" : "study-file-card"}>
                    <div><span className="eyebrow">{file.type}</span><h3>{file.title}</h3><p>{file.module} · {formatDate(file.deadline)} · {file.status}</p></div>
                    <div className="file-stats"><span>{file.notes.length} notes</span><span>{file.drafts.length} drafts</span><span>{file.garden.length} blooms</span></div>
                    <div className="button-row"><button onClick={() => setActiveFileId(file.id)}>Open File</button><button className="secondary-button" onClick={() => startFocusFromFile(file)}>Start Focus</button><button className="secondary-button" onClick={() => deleteStudyFile(file.id)}>Delete</button></div>
                  </div>
                ))}
              </div>
            </div>

            {activeFile && (
              <div className="file-workspace">
                <div className="file-workspace-header"><div><span className="eyebrow">Open study file</span><h2>{activeFile.title}</h2><p>{activeFile.type} · {activeFile.module} · {formatDate(activeFile.deadline)}</p></div><div className="button-row"><button onClick={() => startFocusFromFile(activeFile)}>Focus on this file</button><button className="secondary-button" onClick={startDeadlineRescue}>Deadline Rescue</button></div></div>

                <div className="template-workspace-card">
                  <div className="template-header"><span className="eyebrow">Work type template</span><h2>{currentTemplateInfo.label}</h2><p>{currentTemplateInfo.description}</p></div>
                  <div className="template-layout">
                    <div className="template-section-list">
                      {activeFile.templateSections.map((section) => <button key={section.id} className={activeFile.activeTemplateSectionId === section.id ? "template-section-button active" : "template-section-button"} onClick={() => setActiveTemplateSection(activeFile.id, section.id)}><strong>{section.title}</strong><span>{section.content.trim() ? "Started" : "Empty"}</span></button>)}
                    </div>
                    <div className="template-editor">
                      {activeSection ? (
                        <>
                          <span className="eyebrow">Current section</span>
                          <h3>{activeSection.title}</h3>
                          <p>{activeSection.prompt}</p>
                          <textarea value={activeSection.content} onChange={(event) => updateTemplateSection(activeFile.id, activeSection.id, event.target.value)} placeholder="Write here..." />
                          <div className="button-row"><button onClick={() => startFocusOnTemplateSection(activeFile, activeSection)}>Focus on this section</button><button className="secondary-button" onClick={() => sendTemplateSectionToPlanner(activeFile, activeSection)}>Send to Planner</button></div>
                        </>
                      ) : <p>No section selected.</p>}
                    </div>
                  </div>
                </div>

                <div className="file-detail-grid">
                  <div className="card"><h3>Add note to file</h3><textarea value={fileNoteInput} onChange={(event) => setFileNoteInput(event.target.value)} placeholder="Save a note, idea, quote, or reminder..." /><button onClick={() => addFileNote(activeFile.id, fileNoteInput)}>Save Note</button></div>
                  <div className="card"><h3>Drafts</h3><div className="mini-list">{activeFile.drafts.slice(0, 4).map((draft) => <div className="mini-list-item" key={draft.id}><span>{draft.text.slice(0, 120)}...</span></div>)}</div></div>
                  <div className="card"><h3>Notes</h3><div className="mini-list">{activeFile.notes.slice(0, 4).map((note) => <div className="mini-list-item" key={note.id}><span>{note.text.slice(0, 120)}...</span></div>)}</div></div>
                </div>
              </div>
            )}
          </section>
        )}

        {screen === "reading" && (
          <section className="page">
            <div className="page-header">
              <span className="eyebrow">Dyslexia support</span>
              <h1>Reading Lab</h1>
              <p>
                Make academic text easier to read, speak ideas instead of typing,
                collect difficult words, and save organised notes into your active
                study file.
              </p>
            </div>

            <div className="reading-layout">
              <article
                className={`reading-paper mode-${mode.toLowerCase().replace(/\s+/g, "-")}`}
                style={{ fontSize: `${fontSize}px`, lineHeight: lineSpacing }}
              >
                <div className="document-topline">
                  <span>{currentDoc}</span>
                  <span>{chunkMode ? "Chunked View" : "Normal View"}</span>
                </div>

                {displayLines.map((line, index) => (
                  <p
                    key={`${line}-${index}`}
                    className={mode === "Focus Sprint" && index !== focusLine ? "dimmed-line" : "reading-line"}
                    onClick={() => setFocusLine(index)}
                  >
                    {renderReadableLine(line)}
                  </p>
                ))}
              </article>

              <aside className="tool-panel">
                <h3>Reading controls</h3>

                <div className="dyslexia-toolkit-path">
                  <span className="eyebrow">Dyslexia toolkit route</span>
                  <div className="toolkit-steps">
                    <span>1. Read</span>
                    <span>2. Collect words</span>
                    <span>3. Organise meaning</span>
                    <span>4. Save to file</span>
                  </div>
                  <p>
                    The Reading Lab tools are designed to work together, not as
                    separate buttons. Use the text settings first, click difficult
                    words, then build a graphic organiser.
                  </p>
                </div>

                <label>
                  Document
                  <select value={currentDoc} onChange={(event) => setCurrentDoc(event.target.value)}>
                    {Object.keys(documents).map((doc) => (
                      <option key={doc}>{doc}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Mode
                  <select value={mode} onChange={(event) => setMode(event.target.value)}>
                    <option>Calm</option>
                    <option>Low Stress</option>
                    <option>Focus Sprint</option>
                  </select>
                </label>

                <label>
                  Font size: {fontSize}px
                  <input
                    type="range"
                    min="16"
                    max="30"
                    value={fontSize}
                    onChange={(event) => setFontSize(Number(event.target.value))}
                  />
                </label>

                <label>
                  Line spacing: {lineSpacing}
                  <input
                    type="range"
                    min="1.3"
                    max="2.4"
                    step="0.1"
                    value={lineSpacing}
                    onChange={(event) => setLineSpacing(Number(event.target.value))}
                  />
                </label>

                <button
                  onClick={() => {
                    setChunkMode((prev) => !prev);
                    rememberRecoveryTool("Chunked View");
                  }}
                >
                  {chunkMode ? "Switch to Normal View" : "Switch to Chunked View"}
                </button>

                <div className="button-row">
                  <button onClick={speakText}>Read Aloud</button>
                  <button className="secondary-button" onClick={stopSpeaking}>
                    Stop
                  </button>
                </div>

                <div className="difficult-word-card">
                  <span className="eyebrow">Dyslexia word support</span>
                  <h3>Difficult Word Collector</h3>
                  <p>
                    Click directly on words inside the reading. ReadAble collects
                    them, shows a syllable breakdown, and can save them into the
                    “Words I need to check” section of a Reading Notes file.
                  </p>

                  <button
                    className={syllableAssistEnabled ? "active-toggle-button" : "secondary-button"}
                    onClick={() => setSyllableAssistEnabled((prev) => !prev)}
                  >
                    {syllableAssistEnabled ? "Syllable Assist On" : "Turn On Syllable Assist"}
                  </button>

                  {selectedWordSupport && (
                    <div className="word-support-result">
                      <span>Selected word</span>
                      <strong>{selectedWordSupport.word}</strong>
                      <p><b>Breakdown:</b> {selectedWordSupport.breakdown}</p>
                      <p><b>Meaning:</b> {selectedWordSupport.meaning}</p>
                      <p><b>Use:</b> {selectedWordSupport.sentence}</p>
                    </div>
                  )}

                  <div className="difficult-word-list">
                    {difficultWords.length === 0 && <small>No words collected yet.</small>}
                    {difficultWords.map((word) => (
                      <button key={word} className="difficult-word-pill" onClick={() => removeDifficultWord(word)}>
                        {word} ×
                      </button>
                    ))}
                  </div>

                  <div className="stacked-actions">
                    <button onClick={saveDifficultWordsToFile}>Save Words to Reading Notes</button>
                    <button className="secondary-button" onClick={makeRevisionCardsFromWords}>
                      Make Revision Card Steps
                    </button>
                  </div>
                </div>

                <div className="dictation-box">
                  <span className="eyebrow">Speech-to-text</span>
                  <h3>Dictate instead of typing</h3>
                  <p>
                    Speak your idea, then save it as a note, send it to Brain Dump,
                    or turn it into a planner task.
                  </p>

                  <div className="button-row">
                    {!isListening ? (
                      <button onClick={startDictation}>Start Dictation</button>
                    ) : (
                      <button onClick={stopDictation}>Stop Dictation</button>
                    )}
                  </div>

                  <textarea
                    value={dictationText}
                    onChange={(event) => setDictationText(event.target.value)}
                    placeholder="Dictated text appears here..."
                  />

                  <div className="stacked-actions">
                    <button onClick={useDictationAsNotes}>Save as Note</button>
                    <button onClick={sendDictationToBrainDump}>Send to Brain Dump</button>
                    <button onClick={useDictationAsPlannerTask}>Use as Planner Task</button>
                  </div>
                </div>

                <div className="word-prediction-card">
                  <span className="eyebrow">Word prediction</span>
                  <h3>Sentence starters</h3>
                  <p>
                    Add sentence starters into Reading Notes so writing begins
                    with a useful phrase instead of a blank box.
                  </p>

                  <input
                    value={wordPredictionInput}
                    onChange={(event) => setWordPredictionInput(event.target.value)}
                    placeholder="Type a word like main, evidence, connect..."
                  />

                  <div className="prediction-chip-list">
                    {wordPredictions.map((phrase) => (
                      <button
                        key={phrase}
                        className="prediction-chip"
                        onClick={() => insertPrediction(phrase)}
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="graphic-organiser-card">
                  <span className="eyebrow">Graphic organiser</span>
                  <h3>Build meaning visually</h3>
                  <p>
                    Break the reading into a main idea, key points, words to check,
                    and how it connects to your work.
                  </p>

                  <label>
                    Main idea
                    <textarea
                      value={graphicOrganizer.mainIdea}
                      onChange={(event) => updateGraphicOrganizer("mainIdea", event.target.value)}
                      placeholder="The main idea is..."
                    />
                  </label>

                  <div className="organiser-grid">
                    <label>
                      Key point 1
                      <input
                        value={graphicOrganizer.keyPointOne}
                        onChange={(event) => updateGraphicOrganizer("keyPointOne", event.target.value)}
                        placeholder="First key point"
                      />
                    </label>

                    <label>
                      Key point 2
                      <input
                        value={graphicOrganizer.keyPointTwo}
                        onChange={(event) => updateGraphicOrganizer("keyPointTwo", event.target.value)}
                        placeholder="Second key point"
                      />
                    </label>

                    <label>
                      Key point 3
                      <input
                        value={graphicOrganizer.keyPointThree}
                        onChange={(event) => updateGraphicOrganizer("keyPointThree", event.target.value)}
                        placeholder="Third key point"
                      />
                    </label>

                    <label>
                      Words to check
                      <input
                        value={graphicOrganizer.unknownWords}
                        onChange={(event) => updateGraphicOrganizer("unknownWords", event.target.value)}
                        placeholder="cognitive load, visual stress..."
                      />
                    </label>
                  </div>

                  <label>
                    How this connects
                    <textarea
                      value={graphicOrganizer.connection}
                      onChange={(event) => updateGraphicOrganizer("connection", event.target.value)}
                      placeholder="This connects to my assignment because..."
                    />
                  </label>

                  <div className="button-row">
                    <button onClick={saveGraphicOrganizerToNotes}>Save Organiser</button>
                    <button className="secondary-button" onClick={sendOrganizerToPlanner}>
                      Send to Planner
                    </button>
                  </div>

                  {activeFile?.type === "Reading Notes" && (
                    <div className="reading-template-link">
                      Saves directly into your Reading Notes template sections.
                    </div>
                  )}
                </div>

                <div className="reading-check-card">
                  <span className="eyebrow">Understanding check</span>
                  <h3>Check the main idea</h3>
                  <textarea
                    value={readingCheckAnswer}
                    onChange={(event) => setReadingCheckAnswer(event.target.value)}
                    placeholder="The main idea is..."
                  />

                  <label>
                    Confidence
                    <select
                      value={readingCheckConfidence}
                      onChange={(event) => setReadingCheckConfidence(event.target.value)}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </label>

                  <div className="stacked-actions">
                    <button onClick={runReadingCheck}>Check Understanding</button>
                    <button className="secondary-button" onClick={useReadingCheckAsNote}>
                      Save to File / Notes
                    </button>
                  </div>

                  {readingCheckFeedback && <div className="reading-feedback">{readingCheckFeedback}</div>}
                </div>

                <div className="notes-box">
                  <h3>Reading notes</h3>
                  <textarea
                    value={readingNotes}
                    onChange={(event) => setReadingNotes(event.target.value)}
                    placeholder="Notes, predicted phrases, and organiser summaries can collect here..."
                  />
                </div>
              </aside>
            </div>
          </section>
        )}

        {screen === "planner" && (
          <section className="page">
            <div className="page-header"><span className="eyebrow">Executive function support</span><h1>Study Planner</h1><p>Break work into steps. Plans can link back to your active study file.</p></div>
            {plannerMode === "deadline-rescue" && <div className="deadline-rescue-panel"><div><span className="eyebrow">Deadline Rescue Mode</span><h2>Make the deadline smaller.</h2><p>You do not need to finish everything right now. First, identify the minimum useful version and start one 10-minute action.</p></div><div className="rescue-next-step"><span>First rescue step</span><strong>{plannerSteps[0]?.text}</strong></div><div className="button-row"><button onClick={() => { goToScreen("focus"); startFocusSession(10); }}>Start 10-Min Rescue Sprint</button><button className="secondary-button" onClick={() => setPlannerMode("normal")}>Exit Rescue Mode</button></div></div>}
            <div className="planner-layout"><div className="card"><h3>Break down a task</h3><textarea value={taskInput} onChange={(event) => setTaskInput(event.target.value)} placeholder="Example: Start my essay introduction..." /><label>Task spiciness: {spiceLevel}<input type="range" min="1" max="4" value={spiceLevel} onChange={(event) => setSpiceLevel(Number(event.target.value))} /></label><div className="button-row"><button onClick={() => generatePlan()}>Generate Steps</button><button className="secondary-button" onClick={saveCurrentPlan}>Save Plan</button></div><div className="generated-steps">{plannerSteps.map((step) => <div key={step.id} className="step-row"><span>{step.text}</span></div>)}</div></div><div className="card"><h3>Brain dump</h3><div className="inline-input"><input value={brainInput} onChange={(event) => setBrainInput(event.target.value)} placeholder="Unload a thought..." /><button onClick={addBrainItem}>Add</button></div><div className="brain-list">{brainList.map((item) => <div key={item.id} className="brain-item"><span>{item.text}</span><div><button onClick={() => sendToPlanner(item.text)}>Plan</button><button className="secondary-button" onClick={() => deleteBrainItem(item.id)}>Delete</button></div></div>)}</div></div></div>
            <div className="saved-plans"><h2>Saved plans</h2>{savedPlans.length === 0 && <div className="empty-state">No saved plans yet.</div>}{savedPlans.map((plan) => <div key={plan.id} className="saved-plan-card"><div className="saved-plan-header"><div><span className="eyebrow">{plan.fileId ? studyFiles.find((file) => file.id === plan.fileId)?.title || "Linked file" : "Standalone plan"}</span><h3>{plan.task}</h3></div><div className="plan-actions"><button onClick={() => startNextStep(plan)}>Start First Step</button><button className="secondary-button" onClick={() => resetPlanProgress(plan.id)}>Reset</button><button className="secondary-button" onClick={() => deletePlan(plan.id)}>Delete</button></div></div><div className="progress-track"><div className="progress-fill" style={{ width: `${getPlanProgress(plan)}%` }} /></div><div className="plan-step-list">{plan.steps.map((step) => <div key={step.id} className={step.status === "done" ? "plan-step done" : "plan-step"}><span>{step.text}</span><div><button onClick={() => startPlannerStep(plan, step)}>Start</button><button className="secondary-button" onClick={() => updatePlanStepStatus(plan.id, step.id, step.status === "done" ? "todo" : "done")}>{step.status === "done" ? "Undo" : "Mark Done"}</button></div></div>)}</div></div>)}</div>
          </section>
        )}

        {screen === "focus" && (
          <section className="page">
            <div className="page-header">
              <span className="eyebrow">ADHD support</span>
              <h1>Focus Cockpit</h1>
              <p>Work on one file section while your Focus Flower grows.</p>
            </div>

            <div className="focus-work-layout">
              <div className="card focus-card-large">
                <span className="eyebrow">Current focus state</span>
                <h2>{focusState}</h2>

                <div className="focus-state-track">
                  <div
                    className="focus-state-fill"
                    style={{ width: focusStateWidth() }}
                  />
                </div>

                <div className="time-display-toggle">
                  {["Clock", "Time Slice", "Hidden"].map((displayMode) => (
                    <button
                      key={displayMode}
                      className={timeDisplayMode === displayMode ? "time-toggle active" : "time-toggle"}
                      onClick={() => setTimeDisplayMode(displayMode)}
                    >
                      {displayMode}
                    </button>
                  ))}
                </div>

                {timeDisplayMode === "Clock" && (
                  <div className="timer-display">
                    {timerMinutes}:{timerSeconds}
                  </div>
                )}

                {timeDisplayMode === "Hidden" && (
                  <div className="hidden-time-card">
                    <strong>Timer hidden</strong>
                    <p>
                      The session is still running, but the countdown is hidden.
                      ReadAble will play a gentle alarm when the focus session ends.
                    </p>
                  </div>
                )}

                {timeDisplayMode === "Time Slice" && (
                  <div className={`time-slice-card unique-time-slice ${timeSliceStyle.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="time-style-row">
                      {["Fuel Tank", "Battery", "Hourglass"].map((style) => (
                        <button
                          key={style}
                          className={timeSliceStyle === style ? "time-style-pill active" : "time-style-pill"}
                          onClick={() => setTimeSliceStyle(style)}
                        >
                          {style}
                        </button>
                      ))}
                    </div>

                    <div className="unique-time-stage">
                      {timeSliceStyle === "Fuel Tank" && (
                        <div className="fuel-tank-visual-unique">
                          <div className="fuel-tank-body">
                            <div
                              className="fuel-tank-level"
                              style={{ width: `${timeRemainingPercent}%` }}
                            />
                            <span>{Math.round(timeRemainingPercent)}% fuel left</span>
                          </div>
                          <div className="fuel-tank-cap" />
                        </div>
                      )}

                      {timeSliceStyle === "Battery" && (
                        <div className="battery-visual-unique">
                          <div className="battery-shell">
                            <div
                              className="battery-charge"
                              style={{ width: `${timeRemainingPercent}%` }}
                            />
                            <span>{timerMinutes}:{timerSeconds}</span>
                          </div>
                          <div className="battery-tip-unique" />
                        </div>
                      )}

                      {timeSliceStyle === "Hourglass" && (
                        <div className="hourglass-visual-unique">
                          <div className="hourglass-top-unique">
                            <div
                              className="hourglass-sand top"
                              style={{ height: `${timeRemainingPercent}%` }}
                            />
                          </div>
                          <div className="hourglass-neck-unique" />
                          <div className="hourglass-bottom-unique">
                            <div
                              className="hourglass-sand bottom"
                              style={{ height: `${timeElapsedPercent}%` }}
                            />
                          </div>
                          <strong>{timerMinutes}:{timerSeconds}</strong>
                        </div>
                      )}
                    </div>

                    <div>
                      <strong>{timeSliceStyle}</strong>
                      <p>
                        Each option has its own visual shape so students can pick the
                        time view that makes the most sense to them.
                      </p>
                    </div>
                  </div>
                )}

                <div className={`garden-card flower-${plantStage.status}`}>
                  <div
                    className={
                      bucketHoveringRoot
                        ? "plant-icon root-drop-zone hover"
                        : "plant-icon root-drop-zone"
                    }
                    onDragOver={handleRootDragOver}
                    onDragLeave={handleRootDragLeave}
                    onDrop={handleRootDrop}
                  >
                    {plantStage.icon}
                  </div>

                  <div>
                    <strong>{plantStage.label}</strong>
                    <p>{plantStage.detail}</p>

                    {plantStage.needsWater && (
                      <div className="bucket-rescue">
                        <button
                          className={bucketDragging ? "water-bucket dragging" : "water-bucket"}
                          draggable
                          onDragStart={handleBucketDragStart}
                          onDragEnd={handleBucketDragEnd}
                          onClick={waterFlower}
                          aria-label="Drag water bucket to the root"
                        >
                          🪣
                        </button>
                        <span>Drag the bucket onto the root to restart gently.</span>
                      </div>
                    )}
                  </div>
                </div>

                {activeTaskStep && (
                  <div className="active-step">
                    <span>Current step</span>
                    <strong>{activeTaskStep}</strong>
                  </div>
                )}

                <div className="quick-sprints">
                  {[2, 5, 10, 25].map((minutes) => (
                    <button key={minutes} onClick={() => startFocusSession(minutes)}>
                      {minutes} min
                    </button>
                  ))}
                </div>

                <div className="custom-focus-duration">
                  <label>
                    Custom focus length
                    <div className="custom-duration-row">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={customFocusMinutes}
                        onChange={(event) => setCustomFocusMinutes(event.target.value)}
                      />
                      <span>minutes</span>
                      <button onClick={() => startFocusSession(customFocusMinutes)}>
                        Start Custom
                      </button>
                    </div>
                  </label>
                </div>

                <div className="button-row">
                  <button
                    onClick={() => {
                      setFocusMode("Body Double");
                      startFocusSession(10);
                    }}
                  >
                    Body Double
                  </button>
                  <button className="secondary-button" onClick={startMicroCommitment}>
                    Micro-start
                  </button>
                  <button className="secondary-button" onClick={startRecovery}>
                    Recovery
                  </button>
                </div>
              </div>

              <div className="card work-pad-card">
                <span className="eyebrow">Focus Work Pad</span>
                <h2>{activeFile?.title || "No active file"}</h2>
                <p>
                  {activeSection
                    ? `Section: ${activeSection.title}`
                    : "Choose a study file to save drafts and flower blooms."}
                </p>

                <textarea
                  value={workPadText}
                  onChange={(event) => handleWorkPadChange(event.target.value)}
                  placeholder="Write your draft, paragraph, notes, or ideas here..."
                />

                <div className="button-row">
                  <button onClick={saveDraftToFile}>Save Draft to File</button>
                  <button className="secondary-button" onClick={saveWorkPadToTemplate}>
                    Save to Section
                  </button>
                  <button className="secondary-button" onClick={() => goToScreen("work")}>
                    Open File
                  </button>
                </div>
              </div>

              <div className="card">
                <span className="eyebrow">Sound environment</span>
                <h3>Reduce distractions</h3>

                <label>
                  Sound
                  <select
                    value={soundMode}
                    onChange={(event) => changeSoundMode(event.target.value)}
                  >
                    <option>Rain</option>
                    <option>Brown</option>
                    <option>Library</option>
                  </select>
                </label>

                <label>
                  Volume
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(event) => setVolume(Number(event.target.value))}
                  />
                </label>

                <button onClick={toggleSound}>
                  {isPlaying ? "Stop Sound" : "Play Sound"}
                </button>
              </div>

              <div className="card reminder-card">
                <span className="eyebrow">Motivational reminders</span>
                <h3>Gentle browser nudges</h3>
                <p>
                  ReadAble can send supportive browser reminders when your focus
                  flower pauses, a focus sprint finishes, or you switch tabs for
                  over one minute during a focus session.
                </p>

                <div className="reminder-status">
                  <strong>
                    {notificationPermission === "unsupported"
                      ? "Not supported"
                      : notificationPermission === "granted" && remindersEnabled
                        ? "Reminders on"
                        : notificationPermission === "denied"
                          ? "Blocked in browser"
                          : "Reminders off"}
                  </strong>
                  <span>
                    {remindersEnabled
                      ? "You will get gentle motivation, not pressure."
                      : "Turn this on if supportive nudges help you restart."}
                  </span>
                </div>

                <div className="button-row">
                  <button
                    onClick={enableSupportReminders}
                    disabled={notificationPermission === "unsupported"}
                  >
                    Enable reminders
                  </button>
                  <button className="secondary-button" onClick={disableSupportReminders}>
                    Turn off
                  </button>
                </div>
              </div>
            </div>

            {sessionSummary && (
              <div className="modal-backdrop">
                <div className="session-modal">
                  <span className="eyebrow">Session complete</span>
                  <h2>
                    {lastBloomSaved
                      ? "Nice work — your flower blossomed."
                      : "Focus session complete."}
                  </h2>
                  <p>
                    You completed {lastSessionMinutes} minute(s) and earned{" "}
                    {lastSessionXp} XP.
                  </p>
                  <p>
                    {lastBloomSaved
                      ? activeFile
                        ? `A flower bloom was saved to ${activeFile.title}.`
                        : "A flower bloom was saved."
                      : "Your work is still safe. Write a little more next time to save a flower bloom."}
                  </p>
                  <button onClick={() => setSessionSummary(false)}>
                    Close Summary
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {screen === "insights" && (
          <section className="page"><div className="page-header"><span className="eyebrow">Progress and reflection</span><h1>Insights Hub</h1><p>See work progress, drafts, sessions, and Focus Garden growth.</p></div><div className="insights-grid"><div className="card"><span className="eyebrow">Level</span><h2>Level {level}</h2><div className="progress-track"><div className="progress-fill" style={{ width: `${currentXpProgress}%` }} /></div><p>{currentXpProgress}/100 XP towards next level</p></div><div className="card"><span className="eyebrow">Study files</span><h2>{studyFiles.length}</h2><p>{studyFiles.reduce((sum, file) => sum + file.drafts.length, 0)} drafts saved</p></div><div className="card"><span className="eyebrow">Focus Garden</span><h2>{studyFiles.reduce((sum, file) => sum + file.garden.length, 0)}</h2><p>Flower blooms grown across all study files</p></div><div className="card adaptive-card"><span className="eyebrow">Recommended next step</span><h3>{support.title}</h3><p>{support.body}</p><button onClick={support.action}>{support.primary}</button></div></div></section>
        )}
      </main>
    </div>
  );
}
