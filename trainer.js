"use strict";
/* Grok CLI Trainer — емуляція TUI Grok CLI (Grok Build) і кількох команд zsh без API.
   Джерела: docs.x.ai/build/modes-and-commands, /build/features/{permissions,sessions,plan-mode,worktrees,sandbox,hooks},
   /build/cli/reference, /build/cli/headless-scripting, /build/keyboard-shortcuts (звірено 2026-09-18).
   Зарахування — лише повний збіг після нормалізації (див. matches). */

const STORAGE_KEY = "cli-grok-cli-v1-trainer";
const CWD = "~/Projects/demo";
const MODEL = "grok-4.6";

// Пункти чекліста: [команда, підказка українською]. Підказка — також питання тест-режиму.
const MODULE_LIST = [
  { id: "launch", title: "1. Запуск і перший сеанс", intro: "Перевірка встановлення, довідка, git status перед агентом, запуск TUI, palette і /help.", commands: [
    ["which grok", "Перевірити, чи встановлено Grok CLI і де лежить його файл."],
    ["grok version", "Показати версію встановленого Grok CLI (підкоманда, не прапорець)."],
    ["grok --help", "Показати довідку по підкомандах і прапорцях запуску grok."],
    ["git status", "Перед запуском агента подивитися, які файли в репозиторії вже змінено."],
    ["grok", "Запустити інтерактивний TUI Grok у поточній папці проєкту."],
    ["/", "Показати підказки slash-команд всередині TUI."],
    ["/help", "Переглянути всі команди й гарячі клавіші TUI."],
    ["!git status", "Не виходячи з TUI, у shell-режимі (!) перевірити стан git."]
  ] },
  { id: "session", title: "2. Сесії", intro: "Нова сесія, назва, інформація, перемикання, fork, share, вихід і продовження.", commands: [
    ["/new", "Почати нову сесію з чистим контекстом (аліас — /clear)."],
    ["/rename fix-auth", "Дати поточній сесії назву fix-auth (аліас — /title)."],
    ["/session-info", "Показати інформацію про поточну сесію: id, назву, модель, режим."],
    ["/sessions", "Перемкнути, перейменувати або закрити активні сесії."],
    ["/fork", "Відгалузити поточну сесію в окремого паралельного агента."],
    ["/home", "Повернутися на welcome screen, не закриваючи Grok."],
    ["/resume", "Відновити одну з попередніх сесій зі списку всередині TUI."],
    ["/share", "Отримати URL для перегляду сесії іншими людьми (перевір, чи немає секретів)."],
    ["/quit", "Вийти з Grok CLI і повернутися в shell (аліас — /exit)."],
    ["grok -c", "З shell продовжити найсвіжішу сесію для поточної папки."]
  ] },
  { id: "context", title: "3. Контекст, план і відкат", intro: "Скільки контексту зайнято, стиснення, питання «до речі», витрати, plan mode, rewind і git diff.", commands: [
    ["/context", "Подивитися, яку частину контекстного вікна вже зайнято."],
    ["/compact", "Стиснути історію розмови, щоб звільнити контекст."],
    ["/compact-mode", "Перемкнути щільніший вигляд інтерфейсу (контекст не змінюється)."],
    ["/btw як працює MCP?", "Поставити побічне питання «як працює MCP?», не перериваючи основну задачу."],
    ["/usage", "Подивитися використання кредитів або керування оплатою."],
    ["/plan", "Увійти в plan mode: до схвалення edit tools змінюють лише файл плану."],
    ["/view-plan", "Переглянути поточний план сесії."],
    ["git diff", "У shell переглянути незакомічені зміни у файлах (перед відкатом)."],
    ["git stash", "Відкласти незакомічені зміни, щоб відкат їх не знищив."],
    ["/rewind", "Відновити файли й розмову до обраного промпту (незакомічене після точки втрачається)."]
  ] },
  { id: "model", title: "4. Модель і налаштування", intro: "Список моделей, перемикання моделі, reasoning effort, тема, multiline, налаштування, feedback.", commands: [
    ["grok models", "З shell вивести список моделей, доступних твоєму акаунту."],
    ["/model grok-4.6", "Перемкнути активну модель на grok-4.6 (аліас — /m)."],
    ["/effort", "Налаштувати рівень reasoning effort для поточної моделі."],
    ["/theme", "Відкрити вибір кольорової теми TUI (аліас — /t)."],
    ["/multiline", "Увімкнути або вимкнути багаторядковий ввід (аліас — /ml)."],
    ["/settings", "Відкрити вікно налаштувань (аліас — /config)."],
    ["/feedback", "Надіслати відгук про поточну сесію (без секретів у тексті)."]
  ] },
  { id: "modes", title: "5. Режими дозволів", intro: "Ask (типовий), Plan, Auto з класифікатором, Always-approve; вхід і вихід з акаунта.", commands: [
    ["/auto", "Перемкнути Auto mode: класифікатор сам схвалює безпечні tools, небезпечні можуть питати."],
    ["/always-approve", "Перемкнути режим, у якому tool calls виконуються без запитів на дозвіл."],
    ["grok --always-approve", "Запустити TUI одразу без запитів на дозвіл (те саме — --yolo)."],
    ["grok --sandbox workspace", "Запустити TUI з пісочницею ОС: shell агента пише лише в поточну папку, ~/.grok і temp."],
    ["grok login", "Увійти в акаунт xAI з shell."],
    ["/logout", "Вийти з акаунта всередині TUI."],
    ["grok logout", "З shell вийти з акаунта й стерти збережені облікові дані."]
  ] },
  { id: "extensions", title: "6. Розширення", intro: "Hooks, plugins, marketplace, skills, MCP — одне вікно extensions; огляд з shell.", commands: [
    ["/hooks", "Відкрити вікно extensions на вкладці Hooks."],
    ["/plugins", "Відкрити вікно extensions на вкладці Plugins."],
    ["/marketplace", "Відкрити вікно extensions на вкладці Marketplace."],
    ["/skills", "Відкрити вікно extensions на вкладці Skills."],
    ["/mcps", "Відкрити вікно extensions на вкладці MCP-серверів."],
    ["grok inspect", "З shell показати знайдені правила, skills, plugins, hooks і MCP-сервери."],
    ["grok mcp list", "З shell вивести список налаштованих MCP-серверів."],
    ["/hooks-trust", "Довіритися папці, щоб запускались проєктні hooks, MCP і LSP (лише після перевірки)."]
  ] },
  { id: "memory", title: "7. Пам'ять і генерація", intro: "Нотатки пам'яті, перегляд, flush, dream (коли пам'ять увімкнено) і генерація зображень/відео.", commands: [
    ["/remember тести запускаю через npm test", "Зберегти в пам'ять нотатку «тести запускаю через npm test»."],
    ["/memory", "Переглянути й керувати збереженими спогадами (аліас — /mem)."],
    ["/flush", "Примусово записати пам'ять розмови на диск."],
    ["/dream", "Запустити консолідацію пам'яті."],
    ["/imagine logo", "Згенерувати зображення за описом logo."],
    ["/imagine-video demo", "Згенерувати відео за описом demo."]
  ] },
  { id: "skills", title: "8. Skills і безпечний workflow", intro: "Skills як slash-команди, qualified names, git навколо агента, headless-запуск.", commands: [
    ["/commit", "Викликати встановлений skill commit як slash-команду."],
    ["/local:commit", "Викликати саме локальний skill commit, коли імена конфліктують."],
    ["git log -1 --stat", "Після коміту skill перевірити останній коміт і змінені файли."],
    ["grok -p \"Explain this repo\"", "Запустити Grok без TUI (headless) з промптом Explain this repo."],
    ["grok -w experiment", "Запустити сесію в окремому git worktree з назвою experiment."],
    ["grok worktree list", "Показати worktree, створені Grok."]
  ] }
];

// Документовані аліаси та еквівалентні форми. Лише повні рядки — жодних префіксів.
const ALIASES = {
  "/quit": ["/exit"],
  "/new": ["/clear"],
  "/rename fix-auth": ["/title fix-auth"],
  "/model grok-4.6": ["/m grok-4.6"],
  "/theme": ["/t"],
  "/multiline": ["/ml"],
  "/settings": ["/config"],
  "/memory": ["/mem"],
  "grok -c": ["grok --continue"],
  "grok --always-approve": ["grok --yolo"],
  "git diff": ["git --no-pager diff"],
  "grok -p \"Explain this repo\"": ["grok -p 'Explain this repo'", "grok --single \"Explain this repo\"", "grok --single 'Explain this repo'"],
  "grok -w experiment": ["grok --worktree experiment", "grok --worktree=experiment"],
  "/view-plan": ["/show-plan", "/plan-view"]
};

// Документовані команди, яких немає в чеклістах: відповідаємо коротко, але не зараховуємо.
const EXTRA_SLASH = {
  "/copy": "Копіює останню (або N-ту з кінця) відповідь.",
  "/find": "Пошук у прокрутці розмови.",
  "/transcript": "Повний транскрипт у pager.",
  "/loop": "Запуск промпту з інтервалом.",
  "/tasks": "Фонові задачі, субагенти, заплановані задачі.",
  "/create-workflow": "Створити й зберегти workflow (.grok/workflows/).",
  "/workflow": "Запустити збережений workflow.",
  "/workflows": "Панель запусків workflow.",
  "/deep-research": "Фонове дослідження за запитом.",
  "/queue": "Промпти в черзі за поточним ходом.",
  "/dashboard": "Agent Dashboard.",
  "/vim-mode": "Vim-клавіші для прокрутки.",
  "/timestamps": "Час повідомлень.",
  "/terminal-setup": "Перевірка терміналу й буфера обміну.",
  "/config-agents": "Керування визначеннями агентів.",
  "/agents": "Аліас /config-agents.",
  "/personas": "Керування персонами.",
  "/import-claude": "Імпорт налаштувань Claude.",
  "/release-notes": "Нотатки до релізу.",
  "/changelog": "Аліас /release-notes.",
  "/privacy": "Приватність і зберігання даних."
};

const UK_HINTS = {};
const MODULES = {};
MODULE_LIST.forEach(m => {
  MODULES[m.id] = { id: m.id, title: m.title, intro: m.intro, commands: m.commands.map(c => c[0]) };
  m.commands.forEach(c => { if (!UK_HINTS[c[0]]) UK_HINTS[c[0]] = c[1]; });
});

/* ---------- строгий матчинг ---------- */
function normalizeCommand(s) {
  return String(s || "").replace(/[“”„«»]/g, "\"").replace(/[‘’ʼ]/g, "'").replace(/\s+/g, " ").trim();
}
function matches(input, listed) {
  const a = normalizeCommand(input);
  if (!a) return false;
  if (a === normalizeCommand(listed)) return true;
  return (ALIASES[listed] || []).some(x => normalizeCommand(x) === a);
}
function allCommands() {
  const seen = new Set(), out = [];
  MODULE_LIST.forEach(m => m.commands.forEach(c => { if (!seen.has(c[0])) { seen.add(c[0]); out.push(c[0]); } }));
  return out;
}
function findListedAnywhere(input) { return allCommands().find(c => matches(input, c)) || null; }
window.TRAINER = { commands: allCommands, matches: matches };

/* ---------- стан емулятора ---------- */
const SIM = {};
let DRY = false;                 // сухий прогін для recognizes: без DOM і без збереження стану
function initSim() {
  SIM.inTui = false;
  SIM.permission = "ask";        // ask | auto | always-approve
  SIM.planMode = false;
  SIM.model = MODEL;
  SIM.multiline = false;
  SIM.compactUi = false;
  SIM.contextPct = 42;
  SIM.sessionTitle = "demo-session";
  SIM.loggedIn = true;
  SIM.memory = ["Проєкт demo: TypeScript, тести через vitest"];
  SIM.committed = false;
  SIM.dirty = true;              // src/auth.ts змінено, не закомічено
  SIM.stashed = false;
  SIM.worktrees = [];
  SIM.trusted = false;
}

const state = {
  currentModule: "launch",
  history: [], histIdx: 0,
  triedByModule: Object.fromEntries(Object.keys(MODULES).map(k => [k, new Set()])),
  testMode: { active: false, queue: [], index: 0, correct: 0, wrong: 0, answered: false }
};

function saveProgress() {
  try {
    const tried = {};
    Object.keys(state.triedByModule).forEach(k => { tried[k] = [...state.triedByModule[k]]; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, module: state.currentModule, tried }));
  } catch (e) { /* сховище недоступне — прогрес лише в цій сесії */ }
}
function loadProgress() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch (e) { data = null; }
  if (!data || typeof data !== "object") return;
  if (data.tried && typeof data.tried === "object") {
    Object.keys(MODULES).forEach(k => {
      const list = Array.isArray(data.tried[k]) ? data.tried[k] : [];
      list.forEach(c => { if (MODULES[k].commands.includes(c)) state.triedByModule[k].add(c); });
    });
  }
  if (data.module && MODULES[data.module]) state.currentModule = data.module;
}

const $ = id => document.getElementById(id);
const livePanel = $("livePanel"), outputStatus = $("outputStatus"), cmdInput = $("cmdInput");
const progressBar = $("progressBar"), progressText = $("progressText"), cmdChecklist = $("cmdChecklist");
const moduleBadge = $("moduleBadge"), moduleNav = $("moduleNav"), termTitle = $("termTitle"), promptLabel = $("promptLabel");
const MAX_ENTRIES = 40;
let viewChunks = [];

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function getModule() { return MODULES[state.currentModule]; }
function getCurrentCommands() { return getModule().commands; }
function getTried() { return state.triedByModule[state.currentModule]; }

function beginView(cmd) {
  viewChunks = [];
  if (cmd != null) viewChunks.push(`<div class="line-user">${esc(promptLabel.textContent)} ${esc(cmd)}</div>`);
}
function print(html, cls = "line-sys") { viewChunks.push(`<div class="${cls}">${html}</div>`); }
function ukHint(text) { return `<div class="line-uk-hint">${esc(text)}</div>`; }
function printResult(title, body, type = "ok", hint = null) {
  const cls = { warn: "result-box warn", purple: "result-box purple", danger: "result-box danger" }[type] || "result-box";
  viewChunks.push(`<div class="${cls}"><div class="result-title">${esc(title)}</div>${body}${hint ? ukHint(hint) : ""}</div>`);
}
function out(lines, cls = "line-ok") { return `<pre class="${cls}">${esc(Array.isArray(lines) ? lines.join("\n") : lines)}</pre>`; }
function flushView(status, replace) {
  const entry = document.createElement("div");
  entry.className = "entry";
  entry.innerHTML = viewChunks.join("");
  if (replace) livePanel.innerHTML = "";
  livePanel.appendChild(entry);
  while (livePanel.children.length > MAX_ENTRIES) livePanel.removeChild(livePanel.firstChild);
  livePanel.scrollTop = livePanel.scrollHeight;
  if (status) outputStatus.textContent = status;
}

function modeLabel() {
  const p = { ask: "Ask", auto: "Auto", "always-approve": "Always-approve" }[SIM.permission];
  return SIM.planMode ? `Plan · ${p}` : p;
}
function updatePrompt() {
  if (DRY) return;
  promptLabel.textContent = SIM.inTui ? "grok>" : "Stas@MacBook-Pro demo %";
  termTitle.textContent = SIM.inTui ? `grok — ${CWD} — ${modeLabel()}` : `Stas@MacBook-Pro — zsh — ${CWD}`;
}

function updateProgress() {
  const cmds = getCurrentCommands();
  const n = cmds.filter(c => getTried().has(c)).length;
  moduleBadge.textContent = getModule().title;
  progressBar.style.width = cmds.length ? `${(n / cmds.length) * 100}%` : "0%";
  progressText.textContent = `${n} / ${cmds.length} команд` + (n === cmds.length ? " — розділ пройдено!" : "");
  cmdChecklist.querySelectorAll("button[data-cmd]").forEach(b => {
    const done = getTried().has(b.dataset.cmd);
    b.parentElement.classList.toggle("done", done);
    b.setAttribute("aria-label", b.dataset.cmd + (done ? " — виконано" : " — ще не виконано") + ". Вставити в поле вводу");
  });
  updatePrompt();
}

function updateModuleNav() {
  moduleNav.innerHTML = Object.values(MODULES).map(mod => {
    const t = mod.commands.filter(c => state.triedByModule[mod.id].has(c)).length;
    const pct = mod.commands.length ? Math.round((t / mod.commands.length) * 100) : 0;
    const act = mod.id === state.currentModule;
    return `<button type="button" class="btn${act ? " active" : ""}" data-module="${mod.id}"${act ? " aria-current=\"true\"" : ""}>${esc(mod.title)} · ${t}/${mod.commands.length} (${pct}%)</button>`;
  }).join("");
  moduleNav.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => switchModule(btn.dataset.module)));
}

function buildChecklist() {
  cmdChecklist.innerHTML = getCurrentCommands().map(c =>
    `<li><button type="button" class="cmd-btn" data-cmd="${esc(c)}" title="${esc(UK_HINTS[c] || "")}"><code>${esc(c)}</code></button></li>`
  ).join("");
  cmdChecklist.querySelectorAll("button[data-cmd]").forEach(b => {
    b.addEventListener("click", () => { cmdInput.value = b.dataset.cmd; cmdInput.focus(); });
  });
  updateProgress();
  updateModuleNav();
}

function switchModule(id) {
  if (!MODULES[id]) return;
  state.currentModule = id;
  saveProgress();
  buildChecklist();
  beginView(null);
  const m = getModule();
  printResult(`Розділ: ${m.title}`, `<span class="line-muted">${esc(m.intro)}</span><br><span class="line-hl">Команд:</span> ${m.commands.length}`,
    "purple", SIM.inTui ? "Ти в TUI Grok (prompt grok>). Команди shell виконуються в другій вкладці терміналу." : "Prompt % — ти в zsh. Для slash-команд спершу запусти grok.");
  flushView(`${SIM.inTui ? "grok>" : "%"} · ${m.title}`);
}

function welcome() {
  beginView(null);
  print(`<span class="line-muted">Grok CLI Trainer — емуляція TUI і zsh (без API, без реального виконання)</span>`);
  printResult("Почни з розділу «Запуск і перший сеанс»", `
    <span class="line-cmd">which grok</span> · <span class="line-cmd">git status</span> · <span class="line-cmd">grok</span> · <span class="line-cmd">/help</span><br>
    <span class="line-muted">8 розділів · сесії · контекст і план · режими дозволів · extensions · пам'ять · skills</span>`,
    "ok", "Головна мета — не вивчити всі команди, а швидко знаходити потрібну, розуміти ризик і застосовувати в реальному сценарії.");
  flushView("% · Grok CLI емулятор", true);
}

/* ---------- розбір рядка ---------- */
// Результат обробника: "ok" (змістовна відповідь, зараховується, якщо це пункт чекліста),
// "known" (змістовна відповідь або помилка в стилі інструмента, не зараховується), false (невідомо).
function tokenize(s) {
  const out = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(s))) out.push(m[1] != null ? { v: m[1], q: true } : m[2] != null ? { v: m[2], q: true } : { v: m[3], q: false });
  return out;
}
const MODELS = [MODEL];
const SANDBOX_PROFILES = ["workspace", "read-only", "strict", "off", "devbox"];
const OUTPUT_FORMATS = ["plain", "json", "streaming-json"];

function clapError(c, msg, tip) {
  printResult(c, out([`error: ${msg}`, "", "For more information, try '--help'."], "line-err"), "warn", tip || "Перевір прапорці в grok --help своєї версії.");
  return "known";
}

/* ---------- shell (zsh) ---------- */
function gitStatusLines() {
  if (SIM.committed && !SIM.dirty) return ["On branch feature/auth", "nothing to commit, working tree clean"];
  if (!SIM.dirty) return ["On branch feature/auth", "nothing to commit, working tree clean" + (SIM.stashed ? "  (є stash@{0})" : "")];
  return ["On branch feature/auth", "Changes not staged for commit:", "        modified:   src/auth.ts", "Untracked files:", "        src/auth.test.ts"];
}

function handleGrok(c, toks, hint, side) {
  const sub = toks[1] ? toks[1].v : "";
  const rest = toks.slice(2).map(t => t.v);
  // підкоманди
  if (sub === "version" && !rest.length) { printResult(c, side + out("grok x.y.z (версія залежить від встановлення)"), "ok", hint); return "ok"; }
  if (sub === "--help" && !rest.length) {
    printResult(c, side + out([
      "Usage: grok [OPTIONS] [COMMAND]",
      "  login | logout | models | inspect | mcp | plugin | sessions | worktree | memory | update | version …",
      "  -c, --continue        Continue the most recent session",
      "  -r, --resume [<ID>]   Resume a session",
      "  -m, --model <MODEL>   Model ID to use",
      "  -w, --worktree [<NAME>]",
      "  -p <PROMPT>           Run headless (no TUI)",
      "  --sandbox <PROFILE>",
      "  --always-approve      Auto-approve all tool executions (alias --yolo)",
      "(скорочено й приблизно; повний список — у реальному grok --help)"
    ]), "ok", hint);
    return "ok";
  }
  if (sub === "update" && !rest.length) { printResult(c, side + out(["Checking for updates…", "grok is up to date (емуляція)"]), "ok", hint || "Оновлює лише сам Grok CLI."); return "ok"; }
  if (sub === "login") {
    if (!rest.length) { SIM.loggedIn = true; printResult(c, side + out(["Opening browser for sign-in…", "✓ Signed in"]), "ok", hint); return "ok"; }
    if (rest.length === 1 && rest[0] === "--device-auth") {
      SIM.loggedIn = true;
      printResult(c, side + out(["Open https://accounts.x.ai/device on any device", "and enter the code: ABCD-EFGH (емуляція)", "✓ Signed in"]), "ok", "Вхід кодом пристрою — для SSH, контейнерів, серверів без браузера.");
      return "ok";
    }
    return clapError(c, `unexpected argument '${rest[0]}' found`);
  }
  if (sub === "logout" && !rest.length) { SIM.loggedIn = false; printResult(c, side + out("✓ Signed out, cached credentials cleared"), "ok", hint); return "ok"; }
  if (sub === "models" && !rest.length) { printResult(c, side + out(["Available models (емуляція; реальний список залежить від акаунта):", "  " + MODEL + "  (default)", "  …"]), "ok", hint); return "ok"; }
  if (sub === "inspect" && (!rest.length || (rest.length === 1 && rest[0] === "--json"))) {
    printResult(c, side + out(rest.length
      ? ['{ "rules": ["AGENTS.md"], "skills": ["commit (local)", "review (global)"], "plugins": [], "hooks": ["pre-tool: lint-check"], "mcp": ["github"] }']
      : ["Rules:   AGENTS.md", "Skills:  commit (local), review (global)", "Plugins: —", "Hooks:   pre-tool: lint-check", "MCP:     github"]), "ok", hint);
    return "ok";
  }
  if (sub === "mcp") {
    if (rest.length === 1 && rest[0] === "list") { printResult(c, side + out(["github   (stdio)   enabled"]), "ok", hint); return "ok"; }
    return clapError(c, rest.length ? `unrecognized subcommand '${rest[0]}'` : "'grok mcp' requires a subcommand: list | add | remove | doctor");
  }
  if (sub === "plugin") {
    if (rest.length === 1 && rest[0] === "list") { printResult(c, side + out("No plugins installed."), "ok", hint); return "ok"; }
    if (rest[0] === "install" && rest.length === 2) {
      printResult(c, side + out([`Installing plugin «${rest[1]}»… (емуляція, нічого не встановлено)`, "Plugin отримує можливості агента: перевір автора і що він виконує"], "line-warn"), "warn", hint || "Лише з перевіреного джерела.");
      return "ok";
    }
    return clapError(c, rest.length ? `unrecognized subcommand '${rest[0]}'` : "'grok plugin' requires a subcommand: list | install | uninstall | …");
  }
  if (sub === "export" && rest.length >= 1 && rest.length <= 2) {
    printResult(c, side + out(`✓ Exported session ${rest[0]} → ${rest[1] || rest[0] + ".md"}`), "ok", hint || "Експорт локальний — без публічного посилання.");
    return "ok";
  }
  if (sub === "memory") {
    if (rest[0] === "clear" && rest.length <= 2 && (rest.length === 1 || ["--workspace", "--global", "--all"].includes(rest[1]))) {
      const scope = rest[1] || "--workspace";
      printResult(c, side + out([`⚠ grok memory clear ${scope}: файли пам'яті ${scope === "--all" ? "проєкту й глобальні" : scope === "--global" ? "глобальні" : "цього проєкту"} буде стерто безповоротно`, "(тренажер нічого не видаляє)"], "line-warn"), "danger",
        (hint || "") + " Спершу точкове редагування в /memory.");
      return "ok";
    }
    return clapError(c, "usage: grok memory clear [--workspace|--global|--all]");
  }
  if (sub === "worktree") {
    if (rest.length === 1 && rest[0] === "list") {
      printResult(c, side + out(SIM.worktrees.length ? SIM.worktrees.map(w => `${w}   ~/.grok/worktrees/demo/${w}   detached @ 3f9c2e1`) : "No tracked worktrees."), "ok", hint);
      return "ok";
    }
    if (rest[0] === "rm" && rest.length >= 2) {
      const ids = rest.slice(1);
      SIM.worktrees = SIM.worktrees.filter(w => !ids.includes(w));
      printResult(c, side + out([`✓ Removed worktree(s): ${ids.join(", ")} (емуляція)`, "⚠ Незакомічені зміни в цих папках, якщо були, втрачено"], "line-warn"), "danger",
        "Перед rm: git status і коміт у папці worktree.");
      return "ok";
    }
    if (rest[0] === "gc" && (rest.length === 1 || (rest[1] === "--max-age" && rest.length === 3))) {
      printResult(c, side + out(["✓ Pruned worktrees with missing directories" + (rest[2] ? ` and idle > ${rest[2]}` : ""), "⚠ Незакомічена робота в прибраних worktree втрачається"], "line-warn"), "danger", "Спершу grok worktree list.");
      return "ok";
    }
    return clapError(c, "usage: grok worktree <list|show|rm|gc>");
  }
  if (sub && !sub.startsWith("-") && !toks[1].q) return clapError(c, `unrecognized subcommand '${sub}'`);

  // прапорці запуску
  const o = { cont: false, resume: null, model: null, worktree: null, sandbox: null, yolo: false, trust: false, prompt: null, format: null, maxTurns: null };
  for (let i = 1; i < toks.length; i++) {
    const t = toks[i].v, next = toks[i + 1];
    const eq = t.startsWith("--") && t.includes("=") ? t.split("=") : null;
    const flag = eq ? eq[0] : t;
    const valOf = () => eq ? eq.slice(1).join("=") : (next && !next.v.startsWith("-") ? (i++, next.v) : null);
    if (flag === "-c" || flag === "--continue") o.cont = true;
    else if (flag === "-r" || flag === "--resume") o.resume = valOf() || "latest";
    else if (flag === "-m" || flag === "--model") { o.model = valOf(); if (!o.model) return clapError(c, "a value is required for '--model <MODEL>'"); }
    else if (flag === "-w" || flag === "--worktree") o.worktree = (eq ? eq.slice(1).join("=") : (next && !next.v.startsWith("-") && !next.q ? (i++, next.v) : null)) || "auto-" + (SIM.worktrees.length + 1);
    else if (flag === "--sandbox") { o.sandbox = valOf(); if (!SANDBOX_PROFILES.includes(o.sandbox)) return clapError(c, `invalid value '${o.sandbox || ""}' for '--sandbox <PROFILE>'`, "Профілі: workspace, read-only, strict (а також off, devbox)."); }
    else if (flag === "--always-approve" || flag === "--yolo") o.yolo = true;
    else if (flag === "--trust") o.trust = true;
    else if (flag === "-p" || flag === "--single") { if (!next || !next.q && next.v.startsWith("-")) return clapError(c, "a value is required for '-p <PROMPT>'"); o.prompt = next.v; i++; }
    else if (flag === "--output-format") { o.format = valOf(); if (!OUTPUT_FORMATS.includes(o.format)) return clapError(c, `invalid value '${o.format || ""}' for '--output-format <FORMAT>'`, "Формати: plain, json, streaming-json."); }
    else if (flag === "--max-turns") { o.maxTurns = valOf(); if (!/^\d+$/.test(o.maxTurns || "")) return clapError(c, `invalid value '${o.maxTurns || ""}' for '--max-turns <N>'`); }
    else if (toks[i].q && o.worktree && o.prompt == null && i === toks.length - 1) o.initial = t;
    else return clapError(c, `unexpected argument '${t}' found`);
  }
  if (o.model && !MODELS.includes(o.model)) return clapError(c, `model '${o.model}' is not available for this account`, "Актуальний список — grok models.");
  if ((o.format || o.maxTurns) && o.prompt == null) return clapError(c, "--output-format / --max-turns використовуються з -p (headless)");

  if (o.prompt != null) {
    const answer = /explain this repo/i.test(o.prompt)
      ? ["Це навчальний TypeScript-проєкт: src/ — код, src/auth.ts — логін,", "тести поруч (*.test.ts). (відповідь емульована)"]
      : [`(відповідь на «${o.prompt}» емульована)`];
    const body = o.format === "json" ? [`{"type":"result","session_id":"demo-session","text":"${answer[0]}"}`]
      : o.format === "streaming-json" ? ['{"type":"start","session_id":"demo-session"}', `{"type":"text","text":"${answer[0]}"}`, '{"type":"end"}']
      : answer;
    const extra = o.maxTurns ? [`(зупинка після ${o.maxTurns} кроків агента)`] : [];
    printResult(c, side + out(body.concat(extra)), o.yolo ? "danger" : "ok",
      hint || (o.yolo ? "Headless + always-approve: жодного запиту — лише в ізоляції." : "Headless-запуск: без TUI, результат у stdout."));
    return "ok";
  }

  if (SIM.inTui) { printResult(c, out("Grok уже запущено в цій вкладці. Спершу /quit.", "line-warn"), "warn", hint); return "known"; }
  SIM.inTui = true;
  if (o.yolo) SIM.permission = "always-approve";
  if (o.model) SIM.model = o.model;
  if (o.worktree && !SIM.worktrees.includes(o.worktree)) SIM.worktrees.push(o.worktree);
  updatePrompt();
  const lines = ["● Grok TUI · cwd " + (o.worktree ? `~/.grok/worktrees/demo/${o.worktree}` : CWD)];
  if (o.worktree) lines.push(`● Worktree «${o.worktree}»: detached @ 3f9c2e1, з копією незакомічених змін`, "  shell агента не ізольовано; прибрати — grok worktree rm " + o.worktree);
  if (o.cont) lines.push(`● Continue: ${SIM.sessionTitle} (${CWD})`, "Історія розмови відновлена");
  if (o.resume) lines.push(o.resume === "latest" ? `● Resume: ${SIM.sessionTitle} (найсвіжіша)` : `● Resume: сесія ${o.resume}`);
  if (o.model) lines.push(`Model: ${o.model}`);
  if (o.sandbox) lines.push(`Sandbox: ${o.sandbox}` + (o.sandbox === "workspace" ? " — запис лише в cwd, ~/.grok, temp" : o.sandbox === "off" ? " — вимкнено" : ""));
  if (o.trust) lines.push("⚠ Folder trusted: проєктні hooks, MCP і LSP буде запущено");
  if (o.initial) lines.push(`Prompt: «${o.initial}»`);
  if (o.yolo) lines.push("⚠ Mode: Always-approve — tool calls без запитів", "  (deny-правила і hooks усе одно діють)");
  else lines.push("Mode: Ask · Shift+Tab — режими", "Введи / для підказок або /help");
  const danger = o.yolo || o.trust;
  printResult(c, out(lines, danger ? "line-warn" : "line-ok"), danger ? "danger" : "ok",
    (hint || "") + (o.yolo ? " Лише в ізольованому середовищі й з git-комітом перед стартом." : ""));
  return "ok";
}

function handleShell(cmd) {
  const c = normalizeCommand(cmd);
  const listed = findListedAnywhere(c);
  const hint = listed ? UK_HINTS[listed] : null;
  const side = SIM.inTui ? `<span class="line-muted">(у другій вкладці терміналу — Grok у першій працює далі)</span><br>` : "";
  const toks = tokenize(c);
  if (!toks.length) return false;
  const w0 = toks[0].v;

  if (c === "curl -fsSL https://x.ai/cli/install.sh | bash") {
    printResult(c, side + out(["⚠ Скрипт з інтернету виконується одразу (емуляція — нічого не завантажено)", "Grok уже встановлено: /Users/Stas/.grok/bin/grok"], "line-warn"), "warn", "Встановлюй лише з офіційної адреси x.ai.");
    return "ok";
  }
  if (c === "which grok") { printResult(c, side + out("/Users/Stas/.grok/bin/grok"), "ok", hint); return "ok"; }
  if (w0 === "cd" && toks.length <= 2) {
    const p = toks[1] ? toks[1].v.replace(/\/$/, "") : "~";
    if (["~/Projects/demo", "/Users/Stas/Projects/demo", "."].includes(p)) { printResult(c, side + out(`(тепер у ${CWD})`, "line-muted"), "ok", "Grok працюватиме з цією папкою."); return "ok"; }
    printResult(c, side + out(`У тренажері доступна лише папка ${CWD}.`, "line-warn"), "warn"); return "known";
  }
  if (c === "cat ~/.grok/config.toml" || c === "cat /Users/Stas/.grok/config.toml") {
    printResult(c, side + out(["[ui]", 'permission_mode = "ask"', "", "[permission]", "rules = [", '  { action = "allow", tool = "bash", pattern = "git *" },', '  { action = "deny",  tool = "bash", pattern = "rm -rf *" },', "]"]), "ok", "Лише читання. Шаблон rm -rf * не зловить rm -fr.");
    return "ok";
  }
  if (w0 === "git") {
    const g = toks.slice(1).map(t => t.v).join(" ");
    if (g === "status") { printResult(c, side + out(gitStatusLines()), "ok", hint || "Перед агентом і після нього — git status."); return "ok"; }
    if (g === "diff" || c === "git --no-pager diff") {
      printResult(c, side + out(SIM.dirty ? ["diff --git a/src/auth.ts b/src/auth.ts", "@@ -12,3 +12,5 @@ export function login(user) {", "-  return check(user)", "+  if (!user) throw new Error(\"no user\")", "+  return check(user)"] : "(незакомічених змін немає)"), "ok", hint);
      return "ok";
    }
    if (g === "stash" || g === "stash push") {
      if (!SIM.dirty) { printResult(c, side + out("No local changes to save"), "ok"); return "ok"; }
      SIM.dirty = false; SIM.stashed = true;
      printResult(c, side + out("Saved working directory and index state WIP on feature/auth: 3f9c2e1 Add login form"), "ok", "Повернути — git stash pop. Тепер /rewind не зачепить ці зміни.");
      return "ok";
    }
    if (g === "stash pop") {
      if (!SIM.stashed) { printResult(c, side + out("No stash entries found.", "line-err"), "warn"); return "known"; }
      SIM.stashed = false; SIM.dirty = true;
      printResult(c, side + out(["Changes not staged for commit:", "        modified:   src/auth.ts", "Dropped refs/stash@{0}"]), "ok"); return "ok";
    }
    if (/^restore (\.|src\/auth\.ts|src\/auth\.test\.ts)$/.test(g)) {
      const had = SIM.dirty;
      if (g === "restore ." || g === "restore src/auth.ts") SIM.dirty = false;
      printResult(c, side + out(had ? ["⚠ Незакомічені правки викинуто — git їх не зберігав і не поверне"] : ["(змін не було — нічого не втрачено)"], had ? "line-warn" : "line-muted"), had ? "danger" : "ok",
        "Безпечніше: спершу git diff, а якщо сумніваєшся — git stash.");
      return "ok";
    }
    if (g === "add -p") {
      printResult(c, side + out(SIM.dirty ? ["diff --git a/src/auth.ts b/src/auth.ts", "+  if (!user) throw new Error(\"no user\")", "(1/1) Stage this hunk [y,n,q,a,d,e,?]? y"] : "No changes."), "ok", "Кожен фрагмент погоджуєш окремо.");
      return "ok";
    }
    if (g === "log -1 --stat" || g === "log --stat -1" || g === "log -n 1 --stat") {
      printResult(c, side + out(SIM.committed
        ? ["commit 7c1d2e9 (HEAD -> feature/auth)", "Author: Stas", "    fix(auth): validate empty user", " src/auth.ts      | 2 ++", " src/auth.test.ts | 9 +++++++++", " 2 files changed, 11 insertions(+)"]
        : ["commit 3f9c2e1 (HEAD -> feature/auth)", "Author: Stas", "    Add login form", " src/login.ts | 20 ++++++++++++++++++++"]), "ok", hint);
      return "ok";
    }
    if (g === "push --force" || g === "push -f") {
      printResult(c, side + out(["⚠ Тренажер не виконує force-push.", "Перезапис історії віддаленої гілки: коміти колег можуть зникнути."], "line-warn"), "danger", "Безпечніше: git push --force-with-lease і лише у власній гілці.");
      return "ok";
    }
    if (g === "push --force-with-lease") { printResult(c, side + out("✓ Pushed (емуляція): lease перевірено, чужих нових комітів на сервері немає"), "ok"); return "ok"; }
    return false;
  }
  if (w0 === "grok") return handleGrok(c, toks, hint, side);
  return false;
}

/* ---------- slash-команди TUI ---------- */
const SLASH_ALIAS = { "/exit": "/quit", "/clear": "/new", "/title": "/rename", "/m": "/model", "/t": "/theme", "/ml": "/multiline", "/config": "/settings", "/mem": "/memory", "/show-plan": "/view-plan", "/plan-view": "/view-plan" };
const SKILLS = { "commit": "local", "review": "global" };
function emulateSlash(cmd, listed) {
  const c = normalizeCommand(cmd);
  const rawBase = c.split(" ")[0];
  const base = SLASH_ALIAS[rawBase] || rawBase;
  const arg = c.slice(rawBase.length).trim();
  const hint = listed ? UK_HINTS[listed] : null;
  const R = (body, type = "ok") => { printResult(c, body, type, hint); return "ok"; };
  const noArg = (fn) => arg ? (printResult(c, out(`${rawBase} не приймає аргументів.`, "line-warn"), "warn"), "known") : fn();

  switch (base) {
    case "/": return noArg(() => R(out(["/help  /new  /resume  /sessions  /context  /compact  /plan", "/auto  /always-approve  /model  /skills  /mcps  /quit  …", "(повна command palette — Ctrl+P або ?)"])));
    case "/help": return R(out(["Commands: /new /resume /sessions /fork /rename /context /compact /plan /rewind /auto …", "Keys: Shift+Tab — cycle modes (Normal → Plan → Auto → Always-approve)", "      Ctrl+P / ? — command palette · Esc Esc — rewind · ! — shell mode"]));
    case "/new": return noArg(() => { SIM.contextPct = 3; SIM.sessionTitle = "untitled"; return R(out("✓ New session · context cleared")); });
    case "/rename":
      if (!arg) { printResult(c, out("Usage: /rename <title> — вкажи назву, напр. /rename fix-auth", "line-warn"), "warn"); return "known"; }
      SIM.sessionTitle = arg; return R(out(`✓ Session renamed → ${arg}`));
    case "/session-info": return noArg(() => R(out([`Title:  ${SIM.sessionTitle}`, `Model:  ${SIM.model}`, `Mode:   ${modeLabel()}`, `Cwd:    ${CWD}`, "(склад полів у реальному CLI залежить від версії)"])));
    case "/sessions": return R(out([`▸ ${SIM.sessionTitle} (active)`, "  refactor-api", "Enter — перемкнути · r — перейменувати · x — закрити"]));
    case "/fork": return R(out(`✓ Forked «${SIM.sessionTitle}» → peer agent «${SIM.sessionTitle}-fork»` + (arg ? ` · directive: ${arg}` : "")));
    case "/home": return noArg(() => R(out(["● Welcome screen", "Сесія не закрита: /resume або нова задача"])));
    case "/resume": return R(out(["Resume a session:", `  1. ${SIM.sessionTitle} · 5 хв тому`, "  2. refactor-api · вчора"]));
    case "/share": return R(out(["✓ Share link created (емуляція)", "Вважай, що переглянути зможе будь-хто з посиланням.", "Перевір транскрипт: жодних ключів, паролів, внутрішніх адрес"], "line-warn"), "warn");
    case "/export": return R(out(`✓ Conversation exported → ${arg || SIM.sessionTitle + ".md"} (локально)`));
    case "/quit": return noArg(() => { SIM.inTui = false; SIM.planMode = false; updatePrompt(); return R(out("✓ Grok closed · сесія збережена (grok -c / /resume)")); });
    case "/context": return noArg(() => R(out([`Context: ${SIM.contextPct}% used`, SIM.contextPct > 60 ? "Порада: /compact після завершеного етапу" : "Місця достатньо"])));
    case "/compact": SIM.contextPct = Math.max(12, SIM.contextPct - 25); return R(out(`✓ History summarized${arg ? ` (збережено акцент: «${arg}»)` : ""} · context ${SIM.contextPct}%`));
    case "/compact-mode": return noArg(() => { SIM.compactUi = !SIM.compactUi; return R(out(`Compact UI: ${SIM.compactUi ? "ON" : "OFF"} (контекст не змінився)`)); });
    case "/btw":
      if (!arg) { printResult(c, out("Usage: /btw <question>", "line-warn"), "warn"); return "known"; }
      return R(out([/mcp/i.test(arg) ? "Side answer: MCP — протокол, яким агент під'єднує зовнішні tools." : `Side answer на «${arg}» (емуляція)`, "Основна задача продовжується."]));
    case "/usage": return noArg(() => R(out(["Credits used this period: 12.4 (емуляція)", "Billing: відкрий посилання з /usage у реальному CLI"])));
    case "/plan":
      SIM.planMode = true; updatePrompt();
      return R(out(["● Plan mode" + (arg ? ` · задача: ${arg}` : ""), "Edit tools: лише файл плану, доки ти не схвалиш план",
        `Bash — за режимом дозволів (${modeLabel().replace("Plan · ", "")})`, "Вихід: q на екрані схвалення або Shift+Tab"]));
    case "/view-plan": return noArg(() => R(out(SIM.planMode ? ["Plan:", "1. Прочитати src/auth.ts", "2. Додати перевірку порожнього user", "3. Написати тест"] : "Плану ще немає — /plan <опис>")));
    case "/rewind": {
      const lost = SIM.dirty;
      if (lost) SIM.dirty = false;
      SIM.contextPct = Math.max(5, SIM.contextPct - 15);
      return R(out(["Rewind points: 1. «Поясни src/auth.ts»  2. «Додай перевірку user»  ◂ обрано 1",
        "✓ Files restored to point 1 · conversation truncated",
        lost ? "⚠ Незакомічені зміни після точки (src/auth.ts) втрачено" : (SIM.stashed || SIM.committed ? "Твої зміни були в stash/коміті — їх можна повернути через git" : "Незакомічених змін не було")],
        "line-warn"), "danger");
    }
    case "/model":
      if (!arg) { printResult(c, out("Usage: /model <name> — назву бери з grok models", "line-warn"), "warn"); return "known"; }
      if (!MODELS.includes(arg)) { printResult(c, out(`Model «${arg}» is not available for this account. Список — grok models у shell.`, "line-err"), "warn"); return "known"; }
      SIM.model = arg; return R(out(`● Model: ${SIM.model}`));
    case "/effort": return R(out("Reasoning effort: low · medium · high (вибір залежить від моделі)"));
    case "/theme": return noArg(() => R(out("Theme picker: обери тему стрілками, Enter — застосувати")));
    case "/multiline": return noArg(() => { SIM.multiline = !SIM.multiline; return R(out(`Multiline: ${SIM.multiline ? "ON" : "OFF"}`)); });
    case "/settings": return noArg(() => R(out("● Settings modal")));
    case "/feedback": return R(out("✓ Feedback form opened" + (arg ? " з текстом" : "") + " · не вставляй секрети"));
    case "/auto":
      return noArg(() => {
        SIM.permission = SIM.permission === "auto" ? "ask" : "auto"; updatePrompt();
        return R(out(SIM.permission === "auto"
          ? ["● Auto mode ON — класифікатор схвалює безпечні tools", "Небезпечні дії можуть і далі питати дозволу", "(у реальному CLI /auto є, лише коли функцію auto mode увімкнено)"] : ["✓ Auto mode OFF → Ask"]), SIM.permission === "auto" ? "warn" : "ok");
      });
    case "/always-approve":
      return noArg(() => {
        SIM.permission = SIM.permission === "always-approve" ? "ask" : "always-approve"; updatePrompt();
        return R(out(SIM.permission === "always-approve"
          ? ["⚠ Always-approve ON — tool calls без запитів", "Deny-правила і PreToolUse hooks діють (hooks fail-open); усе інше — без твого «так»"] : ["✓ Always-approve OFF → Ask"], SIM.permission === "always-approve" ? "line-warn" : "line-ok"),
          SIM.permission === "always-approve" ? "danger" : "ok");
      });
    case "/logout": return noArg(() => { SIM.loggedIn = false; return R(out("✓ Signed out · для роботи агента знову потрібен вхід (/login або grok login)")); });
    case "/login": return noArg(() => { SIM.loggedIn = true; return R(out("✓ Signed in")); });
    case "/hooks": return noArg(() => R(out(["● Extensions → Hooks", "pre-tool: lint-check (enabled)", SIM.trusted ? "Folder: trusted" : "Проєктні hooks чекають на довіру: /hooks-trust"])));
    case "/hooks-trust":
      return noArg(() => { SIM.trusted = true; return R(out(["⚠ Folder trusted: ~/Projects/demo", "Проєктні hooks, MCP і LSP тепер запускатимуться", "Запис збережено в ~/.grok/trusted_folders.toml"], "line-warn"), "danger"); });
    case "/plugins": return noArg(() => R(out(["● Extensions → Plugins", "(немає встановлених)"])));
    case "/marketplace": return noArg(() => R(out(["● Extensions → Marketplace", "Перед встановленням читай, що plugin виконує"])));
    case "/skills": return noArg(() => R(out(["● Extensions → Skills", "commit (local) · review (global)"])));
    case "/mcps": return noArg(() => R(out(["● Extensions → MCP", "github — enabled"])));
    case "/remember":
      if (!arg) { printResult(c, out("Usage: /remember <note>", "line-warn"), "warn"); return "known"; }
      SIM.memory.push(arg); return R(out("✓ Memory note saved"));
    case "/memory": return R(out(["Memories:"].concat(SIM.memory.map((m, i) => `  ${i + 1}. ${m}`))));
    case "/flush": return noArg(() => R(out("✓ Conversation memory flushed to disk")));
    case "/dream": return noArg(() => R(out("✓ Memory consolidation started")));
    case "/imagine":
    case "/imagine-video":
      if (!arg) { printResult(c, out(`Usage: ${base} <prompt>`, "line-warn"), "warn"); return "known"; }
      return R(out([`✓ ${base === "/imagine" ? "Image" : "Video"} generation started: «${arg}»`, base === "/imagine" ? "Витрачає кредити" : "Витрачає більше кредитів, ніж зображення"]));
  }
  // skills: /<name> і кваліфікована форма /<scope>:<name>
  const sk = /^\/(?:([a-z]+):)?([a-z][\w-]*)$/.exec(base);
  if (sk && SKILLS[sk[2]] && (!sk[1] || sk[1] === SKILLS[sk[2]])) {
    const name = sk[2];
    if (name === "commit") SIM.committed = true, SIM.dirty = false;
    return R(out([`● Skill ${sk[1] ? sk[1] + ":" : ""}${name}`].concat(name === "commit" ? ["Staged: src/auth.ts, src/auth.test.ts", "✓ fix(auth): validate empty user"] : ["✓ Review done (емуляція)"])),
      SIM.permission === "always-approve" ? "danger" : "ok");
  }
  if (sk && sk[1]) { printResult(c, out(`${c}: skill «${sk[2]}» у scope «${sk[1]}» не знайдено. Див. /skills.`, "line-err"), "warn"); return "known"; }
  // Документовані, але не емульовані
  if (EXTRA_SLASH[base]) { printResult(c, out(EXTRA_SLASH[base] + " (у тренажері не емулюється і не зараховується)", "line-muted"), "ok"); return false; }
  printResult("Невідома команда", out(`${c}: такої slash-команди немає. Введи /help або / для списку.`, "line-err"), "warn");
  return false;
}

/* ---------- диспетчер: та сама логіка для execute і recognizes ---------- */
// Повертає "ok" | "known" | "prompt" | false.
function dispatch(c) {
  if (c.startsWith("/")) {
    if (!SIM.inTui) {
      printResult(c, out(`zsh: no such file or directory: ${c.split(" ")[0]}`, "line-err"), "warn",
        "Slash-команди працюють лише всередині TUI. Спершу запусти grok (або grok -c).");
      return false;
    }
    return emulateSlash(c, findListedAnywhere(c));
  }
  if (c.startsWith("!")) {
    const sh = c.slice(1).trim();
    if (!SIM.inTui) { printResult(c, out(`zsh: event not found: ${sh.split(" ")[0] || "!"}`, "line-err"), "warn", "! — shell-режим лише всередині TUI Grok. У zsh просто введи команду без !."); return false; }
    if (!sh) { printResult(c, out("● Shell mode — введи команду; Esc — назад до промпту", "line-muted"), "ok"); return "known"; }
    print(`<span class="line-muted">Shell-режим TUI (!): команда виконується напряму, без агента.</span>`);
    SIM.inTui = false;
    let r;
    try { r = handleShell(sh); } finally { SIM.inTui = true; }
    if (!r) { printResult(c, out(`zsh: command not found: ${sh.split(" ")[0]}`, "line-err"), "warn"); return false; }
    return r;
  }
  const r = handleShell(c);
  if (r) return r;
  if (SIM.inTui) {
    printResult("Промпт агенту", `<span class="line-ok">«${esc(c)}»</span><br><span class="line-muted">Відповідь AI не емулюється — тренуй slash-команди й workflow.</span>`, "ok");
    return "prompt";
  }
  printResult("Невідома команда", out(`zsh: command not found: ${c.split(" ")[0]}`, "line-err"), "warn", "Обери команду з чекліста зліва.");
  return false;
}

/* ---------- recognizes: сухий прогін dispatch без побічних ефектів ---------- */
const PLACEHOLDER = { "title": "fix-auth", "session-id": "demo-session", "id": "demo-session", "файл": "src/auth.ts", "file": "src/auth.ts", "model": MODEL,
  "question": "як працює MCP?", "note": "тести через npm test", "prompt": "logo", "skill-name": "commit", "context": "завершені кроки", "description": "міграція auth",
  "text": "дякую", "name": "experiment" };
function fillPlaceholders(s) {
  return s.replace(/(\S+)?(\s*)<([^>]+)>/g, (m, prev, sp, ph) => {
    const k = ph.toLowerCase();
    const v = (prev === "/model" || prev === "/m" || prev === "-m" || prev === "--model") ? MODEL : (PLACEHOLDER[k] || "demo");
    return (prev || "") + sp + v;
  });
}
function expandOptional(s) {
  const m = /\s*\[([^\]]+)\]/.exec(s);
  if (!m) return [s];
  const inner = /^[a-zа-яіїє-]+$/i.test(m[1]) && !m[1].startsWith("-") ? (PLACEHOLDER[m[1].toLowerCase()] || "demo") : m[1];
  const without = s.slice(0, m.index) + s.slice(m.index + m[0].length);
  const withIt = s.slice(0, m.index) + " " + inner + s.slice(m.index + m[0].length);
  return expandOptional(without).concat(expandOptional(withIt));
}
// Нотація шпаргалки: «A · B», «grok x / grok y», «--a | --b», «cmd (alias)», «[opt]», «<placeholder>».
function expandNotation(line) {
  let parts = line.split(" · ");
  parts = parts.flatMap(p => {
    const sl = p.split(" / ");
    return sl.length > 1 && sl.every(x => x.split(" ")[0] === sl[0].split(" ")[0]) ? sl : [p];
  });
  parts = parts.flatMap(p => {
    const al = /^(.*\S)\s+\(([^)]+)\)$/.exec(p);
    if (!al) return [p];
    const main = al[1], alias = al[2];
    if (alias.startsWith("/")) return [main, [alias].concat(main.split(" ").slice(1)).join(" ")];
    if (alias.startsWith("-")) { const w = main.split(" "); return [main, w.slice(0, -1).concat(alias).join(" ")]; }
    return [p];
  });
  parts = parts.flatMap(p => {
    const alt = p.split(" | ");
    if (alt.length > 1 && alt.slice(1).every(x => x.startsWith("-"))) { const w = alt[0].split(" "); return [alt[0]].concat(alt.slice(1).map(x => w.slice(0, -1).concat(x).join(" "))); }
    return [p];
  });
  return parts.flatMap(expandOptional).map(fillPlaceholders).map(normalizeCommand);
}
function recognizeOne(c) {
  const snap = Object.assign({}, SIM, { memory: SIM.memory.slice(), worktrees: SIM.worktrees.slice() });
  const chunks = viewChunks;
  DRY = true;
  try {
    for (const tui of [false, true]) {
      Object.assign(SIM, snap, { memory: snap.memory.slice(), worktrees: snap.worktrees.slice(), inTui: tui });
      viewChunks = [];
      let r;
      try { r = dispatch(c); } catch (e) { r = false; }
      if (r === "ok" || r === "known") return true;
    }
    return false;
  } finally {
    Object.assign(SIM, snap);
    viewChunks = chunks;
    DRY = false;
  }
}
function recognizes(cmd) {
  const line = normalizeCommand(cmd);
  if (!line) return false;
  const forms = expandNotation(line);
  return forms.length > 0 && forms.every(recognizeOne);
}
window.TRAINER.recognizes = recognizes;

function execute(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  if (state.testMode.active) { handleTestAnswer(cmd); return; }
  state.history.push(cmd);
  state.histIdx = state.history.length;
  beginView(cmd);
  const listed = getCurrentCommands().find(c => matches(cmd, c)) || null;
  const anyListed = listed || findListedAnywhere(cmd);
  if (!listed && anyListed) {
    const owner = MODULE_LIST.find(m => m.commands.some(c => c[0] === anyListed));
    if (owner) print(`<span class="line-warn">Ця команда — з розділу «${esc(owner.title)}». Тут вона не зараховується.</span>`);
  }
  const c = normalizeCommand(cmd);
  const r = dispatch(c);
  flushView(`${SIM.inTui ? "grok>" : "%"} · ${getModule().title} · ${c}`);
  if (r === "ok" && listed) markTried(listed);
}

function markTried(listed) {
  getTried().add(listed);
  saveProgress();
  updateProgress();
  updateModuleNav();
}

/* ---------- тест-режим ---------- */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function buildTestQueue() { return shuffleArray(allCommands().filter(c => UK_HINTS[c]).map(c => ({ cmd: c, hint: UK_HINTS[c] }))); }
function updateTestButton() {
  const btn = $("btnTest"), skip = $("btnSkip");
  btn.textContent = state.testMode.active ? "Зупинити тест" : "Режим тестування";
  btn.classList.toggle("active", state.testMode.active);
  btn.setAttribute("aria-pressed", state.testMode.active ? "true" : "false");
  skip.hidden = !state.testMode.active;
}
function showTestQuestion() {
  const tm = state.testMode;
  const q = tm.queue[tm.index];
  if (!q) { finishTestMode(); return; }
  tm.answered = false;
  beginView(null);
  printResult(`Тест ${tm.index + 1}/${tm.queue.length}`, `
    <div class="test-question">Яка команда: <em>${esc(q.hint)}</em></div>
    <span class="line-muted">Введи команду і Enter або натисни «Пропустити». Аліаси приймаються. Правильно: ${tm.correct}, помилок: ${tm.wrong}</span>`, "purple");
  flushView(`Тест · ${tm.index + 1}/${tm.queue.length}`);
}
function startTestMode() {
  state.testMode = { active: true, queue: buildTestQueue(), index: 0, correct: 0, wrong: 0, answered: false };
  updateTestButton();
  showTestQuestion();
  cmdInput.focus();
}
function stopTestMode() { state.testMode.active = false; updateTestButton(); welcome(); }
function finishTestMode() {
  const tm = state.testMode;
  const total = tm.queue.length;
  const pct = total ? Math.round((tm.correct / total) * 100) : 0;
  beginView(null);
  printResult("Тест завершено", `<span class="line-ok">Правильно: ${tm.correct} / ${total} (${pct}%)</span><br><span class="line-warn">Помилок / пропущено: ${tm.wrong}</span>`, pct >= 70 ? "ok" : "warn");
  flushView("Тест завершено");
  state.testMode.active = false;
  updateTestButton();
}
function nextTestQuestion() { state.testMode.index++; showTestQuestion(); }
function handleTestAnswer(cmd) {
  const tm = state.testMode;
  const q = tm.queue[tm.index];
  if (!q || tm.answered) return;
  tm.answered = true;
  beginView(cmd);
  if (matches(cmd, q.cmd)) {
    tm.correct++;
    printResult("✓ Правильно!", `<span class="line-ok">${esc(q.cmd)}</span>`, "ok", q.hint);
  } else {
    tm.wrong++;
    printResult("✗ Ні", `<span class="line-err">Очікувалось: ${esc(q.cmd)}</span>`, "warn", q.hint);
  }
  flushView(`Тест · ${tm.correct}✓ ${tm.wrong}✗`);
  setTimeout(() => { if (state.testMode.active && state.testMode.queue[tm.index] === q) nextTestQuestion(); }, 1500);
}
function skipTestQuestion() {
  const tm = state.testMode;
  if (!tm.active) return;
  const q = tm.queue[tm.index];
  if (q && !tm.answered) {
    tm.wrong++;
    beginView(null);
    printResult("Пропущено", `<span class="line-muted">Відповідь: </span><span class="line-cmd">${esc(q.cmd)}</span>`, "warn", q.hint);
    flushView("Тест · пропущено");
  }
  nextTestQuestion();
  cmdInput.focus();
}

/* ---------- init ---------- */
if (/[?&]embed=1/.test(location.search)) document.body.classList.add("embed");

$("cmdForm").addEventListener("submit", e => {
  e.preventDefault();
  execute(cmdInput.value);
  cmdInput.value = "";
});
cmdInput.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (state.histIdx > 0) { state.histIdx--; cmdInput.value = state.history[state.histIdx] || ""; }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (state.histIdx < state.history.length - 1) { state.histIdx++; cmdInput.value = state.history[state.histIdx] || ""; }
    else { state.histIdx = state.history.length; cmdInput.value = ""; }
  } else if (e.key === "Tab" && !e.shiftKey) {
    // Автодоповнення лише коли є що доповнити; інакше Tab переводить фокус далі.
    const val = cmdInput.value;
    if (!val.trim()) return;
    const match = getCurrentCommands().find(c => c.startsWith(val) && c !== val);
    if (match) { e.preventDefault(); cmdInput.value = match; }
  }
});
$("btnTest").addEventListener("click", () => { state.testMode.active ? stopTestMode() : startTestMode(); });
$("btnSkip").addEventListener("click", skipTestQuestion);
$("btnStart").addEventListener("click", () => {
  if (state.testMode.active) { state.testMode.active = false; updateTestButton(); }
  initSim(); updatePrompt(); welcome(); cmdInput.focus();
});
$("btnResetProgress").addEventListener("click", () => {
  if (!confirm("Скинути прогрес усіх розділів тренажера?")) return;
  Object.keys(state.triedByModule).forEach(k => state.triedByModule[k].clear());
  saveProgress(); buildChecklist();
});

initSim();
loadProgress();
buildChecklist();
updatePrompt();
welcome();
