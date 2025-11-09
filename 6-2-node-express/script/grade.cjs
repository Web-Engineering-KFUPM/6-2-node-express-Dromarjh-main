/* eslint-disable no-console */
/**
 * Flexible autograder for 6-2 Node/Express lab
 * Scoring:
 * - Total 100 = 80 (lab TODOs) + 20 (submission)
 * - Each TODO = 16 points: 8 completeness, 4 correctness, 4 quality
 * - Late submission = 10/20, on time = 20/20 (Riyadh time, due: 2025-11-10 23:59:59 +03:00)
 * - Feedback includes what was implemented/missed for each TODO (no mention of grace marks).
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// --- Config ---
const DUE_UTC_ISO = "2025-11-10T20:59:59Z"; // 23:59:59 +03:00 converted to UTC
const ROOT = process.cwd();

// Output dir for artifacts
const OUT_DIR = path.join(ROOT, "dist", "grading");
fs.mkdirSync(OUT_DIR, { recursive: true });

// Handy read helper
function safeRead(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

// Recursive file finder (shallow but adequate)
function findFirst(filename, start = ROOT, depth = 5) {
  if (depth < 0) return null;
  const entries = fs.readdirSync(start, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(start, e.name);
    if (e.isFile() && e.name === filename) return full;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      const found = findFirst(filename, path.join(start, e.name), depth - 1);
      if (found) return found;
    }
  }
  return null;
}

// Find a file by hints (some labs may vary structure)
function findOneOf(possiblePaths) {
  for (const p of possiblePaths) {
    const abs = path.join(ROOT, p);
    if (fs.existsSync(abs)) return abs;
  }
  return null;
}

// Basic presence regex checker
function has(txt, regex) {
  if (!txt) return false;
  return regex.test(txt);
}

// ---- Locate likely files ----
const serverJs = findOneOf([
  "server.js",
  "6-2-node-express/server.js",
  "6-2-node-express/src/server.js",
]) || findFirst("server.js");

const randomJs = findOneOf([
  "backend/utils/random.js",
  "6-2-node-express/backend/utils/random.js",
]) || findFirst("random.js");

const quotesJs = findOneOf([
  "quotes.js",
  "backend/quotes.js",
  "6-2-node-express/backend/quotes.js",
]) || findFirst("quotes.js");

// Read contents
const serverSrc = safeRead(serverJs);
const randomSrc = safeRead(randomJs);
const quotesSrc = safeRead(quotesJs);

// ------------- Scoring helpers -------------
function scoreBucket(hitFlags, maxPoints) {
  const hits = hitFlags.filter(Boolean).length;
  // Lenient: partial credit scales linearly
  return Math.round((hits / hitFlags.length) * maxPoints);
}

function qualitative(ok, ptsIfOk) {
  return ok ? ptsIfOk : Math.round(ptsIfOk / 2); // lenient fallback
}

// ------------- TODO 1: Initialize Express App -------------
const t1_feedback = [];
const t1_checks = {
  importedExpress:
    has(serverSrc, /\bimport\s+express\s+from\s+["']express["']/) ||
    has(serverSrc, /\bconst\s+express\s*=\s*require\(["']express["']\)/),
  appCreated: has(serverSrc, /\bconst\s+app\s*=\s*express\(\)/),
  portDefined: has(serverSrc, /\b(const|let|var)\s+PORT\s*=\s*3000\b/) ||
    has(serverSrc, /\b(process\.env\.PORT)\b/),
  listen: has(serverSrc, /\bapp\.listen\(\s*PORT/) || has(serverSrc, /\bapp\.listen\(/),
};

t1_feedback.push(
  t1_checks.importedExpress ? "✅ Imported express." : "❌ Missing express import/require.",
  t1_checks.appCreated ? "✅ Created app with express()." : "❌ Missing app initialization.",
  t1_checks.portDefined ? "✅ Defined PORT (3000 or env)." : "❌ Missing PORT constant.",
  t1_checks.listen ? "✅ Started server with app.listen." : "❌ Missing app.listen."
);

const t1_completeness = scoreBucket(Object.values(t1_checks), 8);
const t1_correctness = qualitative(t1_checks.listen, 4);
const t1_quality = qualitative(t1_checks.portDefined && t1_checks.importedExpress, 4);
const t1_total = t1_completeness + t1_correctness + t1_quality;

// ------------- TODO 2: Random Int util -------------
const t2_feedback = [];
const t2_checks = {
  filePresent: Boolean(randomSrc),
  exported:
    has(randomSrc, /\bexport\s+function\s+getRandomInt\s*\(/) ||
    has(randomSrc, /\bmodule\.exports\s*=\s*{[^}]*getRandomInt/) ||
    has(randomSrc, /\bexports\.getRandomInt\s*=\s*/),
  usesRandom: has(randomSrc, /Math\.random\s*\(\s*\)/),
  usesFloor: has(randomSrc, /Math\.floor\s*\(/),
};

t2_feedback.push(
  t2_checks.filePresent ? "✅ Found random.js." : "❌ Missing backend/utils/random.js.",
  t2_checks.exported ? "✅ Exported getRandomInt." : "❌ getRandomInt not exported.",
  t2_checks.usesRandom ? "✅ Uses Math.random()." : "❌ Missing Math.random().",
  t2_checks.usesFloor ? "✅ Uses Math.floor()." : "❌ Missing Math.floor()."
);

const t2_completeness = scoreBucket(
  [t2_checks.filePresent, t2_checks.exported, t2_checks.usesRandom, t2_checks.usesFloor],
  8
);
const t2_correctness = qualitative(t2_checks.usesRandom && t2_checks.usesFloor, 4);
const t2_quality = qualitative(t2_checks.exported, 4);
const t2_total = t2_completeness + t2_correctness + t2_quality;

// ------------- TODO 3: Random Quote helper -------------
const t3_feedback = [];
const t3_checks = {
  filePresent: Boolean(quotesSrc),
  exported:
    has(quotesSrc, /\bexport\s+function\s+getRandomQuote\s*\(/) ||
    has(quotesSrc, /\bmodule\.exports\s*=\s*{[^}]*getRandomQuote/) ||
    has(quotesSrc, /\bexports\.getRandomQuote\s*=\s*/),
  usesQuotesArray: has(quotesSrc, /\bquotes\s*\[/) || has(quotesSrc, /\bquotes\s*=\s*\[/),
  randomIndex: has(quotesSrc, /Math\.floor\s*\(\s*Math\.random\(\)\s*\*\s*quotes\.length\s*\)/),
};

t3_feedback.push(
  t3_checks.filePresent ? "✅ Found quotes.js." : "❌ Missing quotes.js.",
  t3_checks.exported ? "✅ Exported getRandomQuote." : "❌ getRandomQuote not exported.",
  t3_checks.usesQuotesArray ? "✅ Uses a quotes array." : "❌ No quotes array detected.",
  t3_checks.randomIndex ? "✅ Selects random index via Math.floor(Math.random()*quotes.length)." : "❌ No random index logic found."
);

const t3_completeness = scoreBucket(Object.values(t3_checks), 8);
const t3_correctness = qualitative(t3_checks.randomIndex && t3_checks.usesQuotesArray, 4);
const t3_quality = qualitative(t3_checks.exported, 4);
const t3_total = t3_completeness + t3_correctness + t3_quality;

// ------------- TODO 4: CORS middleware -------------
const t4_feedback = [];
const t4_checks = {
  imported:
    has(serverSrc, /\bimport\s+cors\s+from\s+["']cors["']/) ||
    has(serverSrc, /\bconst\s+cors\s*=\s*require\(["']cors["']\)/),
  used: has(serverSrc, /\bapp\.use\s*\(\s*cors\s*\(\s*\)\s*\)/),
};

t4_feedback.push(
  t4_checks.imported ? "✅ Imported cors." : "❌ Missing cors import/require.",
  t4_checks.used ? "✅ Enabled CORS with app.use(cors())." : "❌ Missing app.use(cors())."
);

const t4_completeness = scoreBucket(Object.values(t4_checks), 8);
const t4_correctness = qualitative(t4_checks.used, 4);
const t4_quality = qualitative(t4_checks.imported && t4_checks.used, 4);
const t4_total = t4_completeness + t4_correctness + t4_quality;

// ------------- TODO 5: Routes -------------
const t5_feedback = [];
const t5_checks = {
  // 5.1 root route
  rootRoute: has(serverSrc, /\bapp\.get\s*\(\s*["']\/["']\s*,\s*\(/),
  rootSendsText:
    has(serverSrc, /res\.send\s*\(\s*["'`][^"'`]*Quote Generator API[^"'`]*["'`]\s*\)/) ||
    has(serverSrc, /res\.send\s*\(\s*["'`][^"'`]*Welcome[^"'`]*["'`]\s*\)/) ||
    has(serverSrc, /res\.send\s*\(\s*["'`][^"'`]*["'`]\s*\)/), // lenient: any send() on "/"

  // 5.2 quote API route
  quoteRoute: has(serverSrc, /\bapp\.get\s*\(\s*["']\/api\/quote["']\s*,\s*\(/),
  resJson: has(serverSrc, /res\.json\s*\(\s*{[^}]*}\s*\)/),
  importsHelper:
    has(serverSrc, /\bimport\s*{?\s*getRandomQuote\s*}?\s*from\s*["'][^"']*quotes["']/) ||
    has(serverSrc, /\brequire\(["'][^"']*quotes["']\)/),
};

t5_feedback.push(
  t5_checks.rootRoute ? "✅ Route GET / is defined." : "❌ Missing route GET /.",
  t5_checks.rootSendsText ? "✅ GET / sends text via res.send()." : "❌ GET / should send a welcome text.",
  t5_checks.quoteRoute ? "✅ Route GET /api/quote is defined." : "❌ Missing route GET /api/quote.",
  t5_checks.resJson ? "✅ GET /api/quote responds with res.json({ ... })." : "❌ GET /api/quote should return JSON.",
  t5_checks.importsHelper ? "✅ Server references getRandomQuote helper." : "❌ getRandomQuote not imported/required in server."
);

// completeness: consider two sub-tasks; leniently scale over all flags
const t5_completeness = scoreBucket(
  [t5_checks.rootRoute, t5_checks.rootSendsText, t5_checks.quoteRoute, t5_checks.resJson, t5_checks.importsHelper],
  8
);
const t5_correctness = qualitative(t5_checks.quoteRoute && t5_checks.resJson, 4);
const t5_quality = qualitative(t5_checks.rootRoute && t5_checks.quoteRoute, 4);
const t5_total = t5_completeness + t5_correctness + t5_quality;

// --------- Sum lab points (80) ----------
let labPoints = t1_total + t2_total + t3_total + t4_total + t5_total;

// --------- Attempt detection (only floor if there was a real attempt) ----------
// Strong signals that student actually implemented something (not just file presence)
const attemptFlags = [
  // TODO 1: express app setup signals
  t1_checks.listen || t1_checks.appCreated || t1_checks.importedExpress,

  // TODO 2: random util — must export getRandomInt and actually use randomness/floor
  (t2_checks.exported && (t2_checks.usesRandom || t2_checks.usesFloor)),

  // TODO 3: quote helper — must export getRandomQuote and use random index/quotes array
  (t3_checks.exported && (t3_checks.randomIndex || t3_checks.usesQuotesArray)),

  // TODO 4: cors actually used
  t4_checks.used,

  // TODO 5: any route actually defined
  t5_checks.rootRoute || t5_checks.quoteRoute
];
const attempted = attemptFlags.some(Boolean);

// --------- Floor rule (apply only if attempted) ----------
// If the student attempted at least one task and earned >0 but <60 for lab, floor to 60.
if (attempted && labPoints > 0 && labPoints < 60) {
  labPoints = 60;
}

// --------- Submission timing points (20) ----------
function lastCommitISO() {
  try {
    return execSync("git log -1 --format=%cI").toString().trim();
  } catch {
    return null;
  }
}
const lastCommit = lastCommitISO();
const lastCommitDate = lastCommit ? new Date(lastCommit) : null;
const dueDate = new Date(DUE_UTC_ISO);

let submissionPoints = 10; // default late
let submissionStatus = "Late (10/20)";

if (lastCommitDate && lastCommitDate.getTime() <= dueDate.getTime()) {
  submissionPoints = 20;
  submissionStatus = "On time (20/20)";
}

// --------- Final total ----------
const total = labPoints + submissionPoints;

// --------- Build feedback summary ----------
const perTodo = [
  {
    todo: "TODO 1: Initialize Express App (server.js)",
    points: t1_total,
    breakdown: { completeness: t1_completeness, correctness: t1_correctness, quality: t1_quality },
    feedback: t1_feedback,
  },
  {
    todo: "TODO 2: Random Integer Helper (backend/utils/random.js)",
    points: t2_total,
    breakdown: { completeness: t2_completeness, correctness: t2_correctness, quality: t2_quality },
    feedback: t2_feedback,
  },
  {
    todo: "TODO 3: getRandomQuote (quotes.js)",
    points: t3_total,
    breakdown: { completeness: t3_completeness, correctness: t3_correctness, quality: t3_quality },
    feedback: t3_feedback,
  },
  {
    todo: "TODO 4: Enable CORS (server.js)",
    points: t4_total,
    breakdown: { completeness: t4_completeness, correctness: t4_correctness, quality: t4_quality },
    feedback: t4_feedback,
  },
  {
    todo: "TODO 5: Define Routes (server.js)",
    points: t5_total,
    breakdown: { completeness: t5_completeness, correctness: t5_correctness, quality: t5_quality },
    feedback: t5_feedback,
  },
];

const report = {
  metadata: {
    generatedAt: new Date().toISOString(),
    repoRoot: ROOT,
    dueUTC: DUE_UTC_ISO,
    lastCommitISO: lastCommit || "unknown",
  },
  scoring: {
    labPoints,
    submissionPoints,
    submissionStatus,
    total,
  },
  details: perTodo,
};

// Write JSON artifact
const jsonPath = path.join(OUT_DIR, "grade.json");
fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf8");

// Write Markdown artifact + job summary
const mdLines = [];
mdLines.push(`# Lab Grade Summary`);
mdLines.push(`**Total:** ${total}/100`);
mdLines.push(`- Lab: **${labPoints}/80**`);
mdLines.push(`- Submission: **${submissionPoints}/20** — ${submissionStatus}`);
mdLines.push(`- Due (Riyadh): 2025-11-10 23:59:59 +03:00`);
mdLines.push(`- Last commit: ${lastCommit || "unknown"}`);
mdLines.push(``);
mdLines.push(`## Per-TODO Feedback (what you implemented vs. what’s missing)`);
for (const item of perTodo) {
  mdLines.push(`### ${item.todo} — **${item.points}/16**`);
  mdLines.push(
    `*Completeness:* ${item.breakdown.completeness}/8, *Correctness:* ${item.breakdown.correctness}/4, *Quality:* ${item.breakdown.quality}/4`
  );
  mdLines.push("");
  mdLines.push(item.feedback.map(f => `- ${f}`).join("\n"));
  mdLines.push("");
}

const md = mdLines.join("\n");
const mdPath = path.join(OUT_DIR, "grade.md");
fs.writeFileSync(mdPath, md, "utf8");

// Also write to the GitHub Actions job summary, if available
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
}

// Console echo for logs
console.log(md);

// Exit code: always 0 (we don’t want the workflow to fail on partial work)
process.exit(0);
