const UK_HINTS = {
  "which grok": "Перевіряє, чи Grok CLI встановлено і де лежить бінарник.",
  "grok": "Запускає Grok CLI / TUI в поточній папці проєкту.",
  "grok --help": "Довідка по прапорцях запуску (напр. --always-approve).",
  "grok --always-approve": "⚠ Запуск без permission prompts — зручно, але ризиковано.",
  "git status": "Перед агентом — перевір зміни; зроби commit або backup.",
  "/": "Command palette: список доступних slash-команд у TUI.",
  "/quit": "Вийти з Grok CLI / TUI.",
  "/exit": "Alias для /quit.",
  "/home": "Повернутися на welcome screen.",
  "/new": "Почати нову сесію (новий контекст).",
  "/resume": "Продовжити попередню сесію.",
  "/sessions": "Список минулих сесій — вибір для resume.",
  "/fork": "Fork поточної сесії в нову гілку розмови.",
  "/rename": "Перейменувати поточну сесію (аргумент — назва).",
  "/share": "Поділитися сесією через URL (якщо увімкнено в акаунті).",
  "/session-info": "Метадані сесії: id, назва, модель, час.",
  "/context": "Скільки context window зайнято — критично перед великою задачею.",
  "/plan": "Plan mode: Grok планує, write-tools заблоковані (крім session plan).",
  "/compact": "Стиснути історію розмови, звільнити context window.",
  "/compact-mode": "Щільніший UI layout у TUI.",
  "/rewind": "Відкотитися до попередньої точки розмови.",
  "/btw": "Side-question без переривання основної задачі.",
  "/usage": "Token / credit usage для поточної сесії.",
  "/model": "Перемкнути активну модель Grok.",
  "/theme": "Змінити тему кольорів TUI.",
  "/multiline": "Увімкнути/вимкнути multiline input.",
  "/feedback": "Надіслати feedback по сесії.",
  "/always-approve": "⚠ Toggle: без confirmation на tool calls.",
  "/logout": "Вийти з поточного xAI акаунта в CLI.",
  "/hooks": "Extensions modal → вкладка Hooks.",
  "/plugins": "Extensions modal → вкладка Plugins.",
  "/skills": "Extensions modal → вкладка Skills (user-invocable).",
  "/mcps": "Extensions modal → вкладка MCP servers.",
  "/flush": "Примусово записати conversation memory на диск.",
  "/memory": "Пошук і редагування persistent memory entries.",
  "/dream": "Offline memory-consolidation pass (shell-provided).",
  "/imagine": "Згенерувати зображення з текстового prompt.",
  "/imagine-video": "Згенерувати відео з текстового prompt.",
  "/commit": "Приклад skill-as-command: commit workflow (якщо skill встановлено).",
  "/local:commit": "Qualified skill name при конфлікті імен.",
  welcome: "Головна мета — не вивчити всі команди, а швидко знаходити потрібну, розуміти ризик і застосовувати в реальному сценарії.",
  "module-switch": "Список команд зліва оновився для нового розділу.",
  unknown: "Введи / для palette або обери команду з чеклісту зліва.",
  prompt: "Звичайні промпти в TUI не емулюються — тренуй slash-команди та workflow.",
  "ctrl-c": "Перервано. Введи /quit для виходу з TUI."
};

const MODULES = {
  launch: {
    id: "launch",
    title: "1. Запуск і workflow",
    intro: "Встановлення, запуск TUI, git status перед агентом, command palette.",
    termTitle: "grok — ~/Projects/demo",
    commands: ["which grok", "grok", "grok --help", "git status", "/"]
  },
  session: {
    id: "session",
    title: "2. Сесії",
    intro: "Нова сесія, resume, fork, rename, share, вихід.",
    termTitle: "grok TUI — sessions",
    commands: [
      "/new", "/resume", "/sessions", "/fork", "/rename fix-auth",
      "/share", "/session-info", "/home", "/quit", "/exit"
    ]
  },
  context: {
    id: "context",
    title: "3. Контекст і план",
    intro: "Context window, plan mode, compact, rewind, usage.",
    termTitle: "grok TUI — context",
    commands: [
      "/context", "/plan", "/compact", "/compact-mode", "/rewind",
      "/btw як працює MCP?", "/usage"
    ]
  },
  model: {
    id: "model",
    title: "4. Модель і UI",
    intro: "Модель, тема, multiline, feedback.",
    termTitle: "grok TUI — settings",
    commands: ["/model grok-3", "/theme dark", "/multiline", "/feedback"]
  },
  modes: {
    id: "modes",
    title: "5. Режими і безпека",
    intro: "always-approve, permission_mode у config, logout.",
    termTitle: "grok TUI — permissions",
    commands: ["/always-approve", "grok --always-approve", "/logout"]
  },
  extensions: {
    id: "extensions",
    title: "6. Extensions",
    intro: "Hooks, plugins, skills, MCP — один modal, різні вкладки.",
    termTitle: "grok TUI — extensions",
    commands: ["/hooks", "/plugins", "/skills", "/mcps"]
  },
  shell: {
    id: "shell",
    title: "7. Shell commands",
    intro: "Команди xai-grok-shell: memory, flush, dream, imagine.",
    termTitle: "grok TUI — shell",
    commands: ["/flush", "/memory", "/dream", "/imagine logo", "/imagine-video demo"]
  },
  skills: {
    id: "skills",
    title: "8. Skills і ризики",
    intro: "Skills як slash-команди, qualified names, безпечний workflow.",
    termTitle: "grok TUI — skills",
    commands: ["/skills", "/commit", "/local:commit", "git status"]
  }
};

const ALIASES = { "/exit": "/quit" };

const SIM = {
  cwd: "~/Projects/demo",
  inTui: false,
  alwaysApprove: false,
  planMode: false,
  model: "grok-3",
  theme: "dark",
  multiline: false,
  compacted: false,
  sessionTitle: "demo-session",
  contextPct: 42,
  gitDirty: ["src/app.ts"],
  skills: ["commit", "review"]
};

const state = {
  currentModule: "launch",
  history: [], histIdx: -1,
  triedByModule: Object.fromEntries(Object.keys(MODULES).map(k => [k, new Set()])),
  testMode: { active: false, queue: [], index: 0, correct: 0, wrong: 0 }
};

const livePanel = document.getElementById("livePanel");
const outputStatus = document.getElementById("outputStatus");
const cmdInput = document.getElementById("cmdInput");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const cmdChecklist = document.getElementById("cmdChecklist");
const moduleBadge = document.getElementById("moduleBadge");
const moduleNav = document.getElementById("moduleNav");
const termTitle = document.getElementById("termTitle");
const promptLabel = document.getElementById("promptLabel");
let viewChunks = [];

function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function getModule() { return MODULES[state.currentModule]; }
function getCurrentCommands() { return getModule().commands; }
function getTried() { return state.triedByModule[state.currentModule]; }

function updatePrompt() {
  promptLabel.textContent = SIM.inTui ? "grok>" : "%";
  termTitle.textContent = getModule().termTitle;
}

function commandBase(cmd) {
  const c = cmd.trim().toLowerCase();
  const base = c.split(/\s+/)[0];
  return ALIASES[base] || base;
}

function matchesListed(cmd, listed) {
  const lower = cmd.trim().toLowerCase();
  const l = listed.toLowerCase();
  if (lower === l) return true;
  const lb = l.split(/\s+/)[0];
  const cb = lower.split(/\s+/)[0];
  if (cb === lb && l.includes(" ")) return lower.startsWith(l.split(" ")[0] + " ");
  if (lower.startsWith(l + " ")) return true;
  if (cb === lb && listed.split(" ").length === 1) return true;
  return false;
}

function findListed(cmd, list) {
  return list.find(x => matchesListed(cmd, x)) || null;
}

function normalizeCmd(raw) {
  const cur = findListed(raw, getCurrentCommands());
  if (cur) return cur;
  for (const mod of Object.values(MODULES)) {
    const ex = findListed(raw, mod.commands);
    if (ex) return ex;
  }
  const base = commandBase(raw);
  return ALIASES[base] || raw.trim();
}

function isInCurrentModule(cmd) { return !!findListed(cmd, getCurrentCommands()); }
function findModuleForCommand(cmd) {
  for (const mod of Object.values(MODULES)) {
    if (findListed(cmd, mod.commands)) return mod.id;
  }
  return null;
}

function beginView(cmd) {
  viewChunks = [];
  if (cmd != null) viewChunks.push(`<div class="line-user">${esc(promptLabel.textContent)} ${esc(cmd)}</div>`);
}
function print(html, cls = "line-sys") { viewChunks.push(`<div class="${cls}">${html}</div>`); }
function ukHint(text, compact = false) {
  const c = compact ? "line-uk-hint compact" : "line-uk-hint";
  return `<div class="${c}">${esc(text)}</div>`;
}
function printResult(title, body, type = "ok", hint = null) {
  const cls = type === "warn" ? "result-box warn" : type === "purple" ? "result-box purple"
    : type === "danger" ? "result-box danger" : "result-box";
  viewChunks.push(`<div class="${cls}"><div class="result-title">${esc(title)}</div>${body}${hint ? ukHint(hint) : ""}</div>`);
}
function flushView(status) {
  livePanel.innerHTML = viewChunks.join("");
  livePanel.scrollTop = livePanel.scrollHeight;
  if (status) outputStatus.textContent = status;
}

function markTried(cmd) {
  const norm = findListed(cmd, getCurrentCommands());
  if (norm) { getTried().add(norm); updateProgress(); updateModuleNav(); }
}

function updateProgress() {
  const cmds = getCurrentCommands();
  const n = getTried().size;
  moduleBadge.textContent = getModule().title;
  termTitle.textContent = getModule().termTitle;
  progressBar.style.width = cmds.length ? `${(n / cmds.length) * 100}%` : "0%";
  progressText.textContent = `${n} / ${cmds.length} команд`;
  cmdChecklist.querySelectorAll("li").forEach(li => {
    li.classList.toggle("done", getTried().has(li.dataset.cmd));
  });
  updatePrompt();
}

function updateModuleNav() {
  moduleNav.innerHTML = Object.values(MODULES).map(mod => {
    const t = state.triedByModule[mod.id];
    const pct = mod.commands.length ? Math.round((t.size / mod.commands.length) * 100) : 0;
    const act = mod.id === state.currentModule ? " active" : "";
    return `<button type="button" class="btn${act}" data-module="${mod.id}">${esc(mod.title)} · ${t.size}/${mod.commands.length} (${pct}%)</button>`;
  }).join("");
  moduleNav.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => switchModule(btn.dataset.module));
  });
}

function buildChecklist() {
  cmdChecklist.innerHTML = getCurrentCommands().map(c =>
    `<li data-cmd="${esc(c)}" title="Клік — виконати"><code>${esc(c)}</code></li>`
  ).join("");
  cmdChecklist.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", () => { execute(li.dataset.cmd); cmdInput.value = ""; cmdInput.focus(); });
  });
  updateProgress();
  updateModuleNav();
}

function switchModule(id) {
  if (!MODULES[id]) return;
  state.currentModule = id;
  buildChecklist();
  beginView(null);
  const m = getModule();
  printResult(`Розділ: ${m.title}`, `
    <span class="line-muted">${esc(m.intro)}</span><br>
    <span class="line-hl">Команд:</span> ${m.commands.length}
  `, "purple", UK_HINTS["module-switch"]);
  flushView(`grok> · ${m.title}`);
}

function welcome() {
  beginView(null);
  print(`<span class="line-muted">Grok CLI Trainer — емуляція TUI (без API)</span>`);
  printResult("Почни з запуску", `
    <span class="line-cmd">which grok</span> · <span class="line-cmd">grok</span> · <span class="line-cmd">/</span><br>
    <span class="line-muted">Документація: Modes and Commands (xAI)</span>
  `, "ok", UK_HINTS.welcome);
  flushView("grok> · введи команду або /slash");
}

function listSlashCommands() {
  print(`<span class="line-hl">Slash commands (${esc(getModule().title)}):</span>`);
  getCurrentCommands().filter(c => c.startsWith("/")).forEach(c => {
    print(`  <span class="line-cmd">${esc(c.padEnd(24))}</span>`);
    if (UK_HINTS[c] || UK_HINTS[c.split(" ")[0]]) {
      print(ukHint(UK_HINTS[c] || UK_HINTS[c.split(" ")[0]], true));
    }
  });
}

function handleShell(cmd) {
  const lower = cmd.toLowerCase().trim();
  const listed = findListed(cmd, getCurrentCommands()) || cmd;
  const hint = UK_HINTS[listed] || UK_HINTS[cmd];

  if (lower === "which grok") {
    printResult(cmd, `<span class="line-ok">/opt/homebrew/bin/grok</span>`, "ok", hint);
    return true;
  }
  if (lower === "grok") {
    SIM.inTui = true;
    updatePrompt();
    printResult("grok", `
      <span class="line-ok">● Grok CLI TUI started</span><br>
      <span class="line-muted">cwd: ${esc(SIM.cwd)} · Shift+Tab — session modes</span><br>
      <span class="line-hl">Введи /</span> для command palette
    `, "ok", hint);
    return true;
  }
  if (lower === "grok --help") {
    printResult(cmd, `
      <span class="line-ok">Usage: grok [options]</span><br>
      <span class="line-muted">--always-approve  Skip permission prompts</span><br>
      <span class="line-muted">--help            Show help</span>
    `, "ok", hint);
    return true;
  }
  if (lower === "grok --always-approve") {
    SIM.inTui = true;
    SIM.alwaysApprove = true;
    updatePrompt();
    printResult(cmd, `
      <span class="line-warn">⚠ Always-approve mode ON at launch</span><br>
      <span class="line-muted">Tool calls без підтвердження — перевір ~/.grok/config.toml</span>
    `, "danger", hint);
    return true;
  }
  if (lower === "git status") {
    const dirty = SIM.gitDirty.map(f => ` modified: ${esc(f)}`).join("<br>");
    printResult("git status", `
      <span class="line-ok">On branch main</span><br>
      ${dirty || "<span class='line-muted'>nothing to commit</span>"}<br>
      <span class="line-muted">Перед grok — commit або stash!</span>
    `, "ok", hint);
    return true;
  }
  return false;
}

function emulateSlash(cmd) {
  const base = commandBase(cmd);
  const arg = cmd.slice(base.length).trim();
  const listed = normalizeCmd(cmd);
  const hint = UK_HINTS[listed] || UK_HINTS[base] || UK_HINTS[base.split(" ")[0]];

  const outputs = {
    "/quit": () => { SIM.inTui = false; updatePrompt(); return `<span class="line-ok">✓ Goodbye — Grok CLI closed</span>`; },
    "/home": () => `<span class="line-ok">● Welcome screen</span><br><span class="line-muted">Start new task or /resume</span>`,
    "/new": () => `<span class="line-ok">✓ New session</span> · context cleared`,
    "/resume": () => `<span class="line-ok">● Session picker</span><br><span class="line-muted">1. ${esc(SIM.sessionTitle)} · 2h ago</span>`,
    "/sessions": () => `<span class="line-ok">Sessions:</span><br><span class="line-muted">▸ ${esc(SIM.sessionTitle)} (active)<br>  refactor-api · yesterday</span>`,
    "/fork": () => `<span class="line-ok">✓ Forked → new session branch</span>`,
    "/rename": () => { if (arg) SIM.sessionTitle = arg; return `<span class="line-ok">✓ Renamed → ${esc(arg || SIM.sessionTitle)}</span>`; },
    "/share": () => `<span class="line-ok">✓ Share URL copied</span><br><span class="line-muted">https://share.x.ai/s/demo-abc (emulated)</span>`,
    "/session-info": () => `<span class="line-hl">Title</span> ${esc(SIM.sessionTitle)}<br><span class="line-hl">Model</span> ${esc(SIM.model)}<br><span class="line-hl">Mode</span> ${SIM.planMode ? "plan" : "default"}`,
    "/context": () => `<span class="line-ok">Context: ${SIM.contextPct}% used</span><br><span class="line-muted">~${Math.round((100-SIM.contextPct)*1280/100)} tokens free (emulated)</span>`,
    "/plan": () => { SIM.planMode = true; return `<span class="line-ok">● Plan mode</span><br><span class="line-muted">Write-tools blocked except session plan file</span>`; },
    "/compact": () => { SIM.compacted = true; SIM.contextPct = Math.max(18, SIM.contextPct - 25); return `<span class="line-ok">✓ History summarized</span> · context ${SIM.contextPct}%`; },
    "/compact-mode": () => `<span class="line-ok">✓ Compact UI layout toggled</span>`,
    "/rewind": () => `<span class="line-ok">✓ Rewind to checkpoint</span>`,
    "/btw": () => `<span class="line-ok">Side Q:</span> ${esc(arg || "(empty)")}<br><span class="line-muted">Answer without breaking main task flow</span>`,
    "/usage": () => `<span class="line-ok">Session tokens (emulated):</span> in 12.4k · out 3.1k`,
    "/model": () => { if (arg) SIM.model = arg; return `<span class="line-ok">● ${esc(SIM.model)}</span> active`; },
    "/theme": () => { if (arg) SIM.theme = arg; return `<span class="line-ok">Theme: ${esc(SIM.theme)}</span>`; },
    "/multiline": () => { SIM.multiline = !SIM.multiline; return `<span class="line-ok">Multiline: ${SIM.multiline ? "ON" : "OFF"}</span>`; },
    "/feedback": () => `<span class="line-ok">✓ Feedback sent</span>${arg ? ` · ${esc(arg)}` : ""}`,
    "/always-approve": () => {
      SIM.alwaysApprove = !SIM.alwaysApprove;
      return SIM.alwaysApprove
        ? `<span class="line-warn">⚠ Always-approve ON</span> — tool calls без prompts`
        : `<span class="line-ok">✓ Always-approve OFF</span> · permission_mode=ask`;
    },
    "/logout": () => `<span class="line-ok">✓ Logged out</span> · run grok to login again`,
    "/hooks": () => `<span class="line-ok">● Extensions → Hooks</span>`,
    "/plugins": () => `<span class="line-ok">● Extensions → Plugins</span>`,
    "/skills": () => `<span class="line-ok">● Extensions → Skills</span><br><span class="line-muted">User-invocable: ${SIM.skills.map(s => "/" + s).join(", ")}</span>`,
    "/mcps": () => `<span class="line-ok">● Extensions → MCP</span><br><span class="line-muted">filesystem · github (demo)</span>`,
    "/flush": () => `<span class="line-ok">✓ Conversation memory flushed to disk</span>`,
    "/memory": () => `<span class="line-ok">● Memory editor</span> · search & edit persistent entries`,
    "/dream": () => `<span class="line-ok">✓ Memory consolidation started (offline)</span>`,
    "/imagine": () => `<span class="line-ok">✓ Image generation queued</span>${arg ? `<br><span class="line-muted">prompt: ${esc(arg)}</span>` : ""}`,
    "/imagine-video": () => `<span class="line-ok">✓ Video generation queued</span>${arg ? `<br><span class="line-muted">prompt: ${esc(arg)}</span>` : ""}`,
    "/commit": () => `<span class="line-ok">✓ Skill /commit invoked</span><br><span class="line-muted">Runs commit workflow skill</span>`,
    "/local:commit": () => `<span class="line-ok">✓ Qualified skill local:commit</span>`,
  };

  const fn = outputs[base];
  const body = fn ? fn() : `<span class="line-ok">✓ ${esc(base)} executed</span>`;
  const title = arg ? `${base} ${arg}` : base;
  const type = (base === "/always-approve" && SIM.alwaysApprove) ? "danger" : "ok";
  printResult(title, body, type, hint);
  return true;
}

function handleSlash(cmd) {
  if (!cmd.startsWith("/")) return false;
  if (!isInCurrentModule(cmd)) {
    const owner = findModuleForCommand(cmd);
    if (owner && owner !== state.currentModule) {
      print(`<span class="line-warn">⚠ «${esc(cmd)}» — розділ «${esc(MODULES[owner].title)}»</span>`);
    }
  }
  if (cmd === "/") {
    listSlashCommands();
    return "/";
  }
  const base = commandBase(cmd);
  const known = findListed(cmd, Object.values(MODULES).flatMap(m => m.commands));
  if (known || base.startsWith("/")) {
    emulateSlash(cmd);
    return normalizeCmd(cmd);
  }
  printResult("Невідома команда", `<span class="line-muted">${UK_HINTS.unknown}</span>`, "warn");
  return false;
}

function execute(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  if (state.testMode.active) { handleTestAnswer(cmd); return; }

  state.history.push(cmd);
  state.histIdx = state.history.length;
  beginView(cmd);

  if (cmd.startsWith("/")) {
    const result = handleSlash(cmd);
    flushView(`grok> · ${getModule().title}`);
    if (result !== false) markTried(typeof result === "string" ? result : cmd);
    return;
  }

  if (handleShell(cmd)) {
    flushView(`grok> · ${getModule().title}`);
    markTried(cmd);
    return;
  }

  printResult("Промпт", `
    <span class="line-ok">«${esc(cmd)}»</span><br>
    <span class="line-muted">AI-відповідь не емулюється — тренуй slash-команди та shell workflow.</span>
  `, "ok", UK_HINTS.prompt);
  flushView("grok> · prompt");
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildTestQueue() {
  const seen = new Set(), items = [];
  for (const mod of Object.values(MODULES)) {
    for (const c of mod.commands) {
      const key = c.split(" ")[0];
      const hint = UK_HINTS[c] || UK_HINTS[key];
      if (!seen.has(c) && hint && !c.includes("imagine-video")) {
        seen.add(c);
        items.push({ cmd: c, hint });
      }
    }
  }
  return shuffleArray(items);
}

function updateTestButton() {
  const btn = document.getElementById("btnTest");
  btn.textContent = state.testMode.active ? "Зупинити тест" : "Режим тестування";
  btn.classList.toggle("active", state.testMode.active);
}

function showTestQuestion() {
  const tm = state.testMode;
  const q = tm.queue[tm.index];
  if (!q) { finishTestMode(); return; }
  beginView(null);
  printResult(`Питання ${tm.index + 1} / ${tm.queue.length}`, `
    <div class="test-question">${esc(q.hint)}</div>
    <span class="line-hl">Яка команда?</span>
  `, "purple");
  flushView(`test> · ${tm.index + 1}/${tm.queue.length}`);
  cmdInput.placeholder = "Введи команду…";
  cmdInput.focus();
}

function startTestMode() {
  state.testMode = { active: true, queue: buildTestQueue(), index: 0, correct: 0, wrong: 0 };
  updateTestButton();
  showTestQuestion();
}

function stopTestMode() {
  if (!state.testMode.active) return;
  state.testMode.active = false;
  updateTestButton();
  cmdInput.placeholder = "grok, /context, /plan …";
  beginView(null);
  printResult("Тест зупинено", `<span class="line-ok">✓ ${state.testMode.correct}</span> · <span class="line-err">✗ ${state.testMode.wrong}</span>`, "warn");
  flushView("grok> · тест зупинено");
}

function finishTestMode() {
  const tm = state.testMode;
  const total = tm.queue.length;
  const pct = total ? Math.round((tm.correct / total) * 100) : 0;
  tm.active = false;
  updateTestButton();
  cmdInput.placeholder = "grok, /context, /plan …";
  beginView(null);
  printResult("Тест завершено!", `
    <span class="line-ok">✓ ${tm.correct} / ${total}</span> · <span class="line-err">✗ ${tm.wrong}</span><br>
    <span class="line-hl">Результат: ${pct}%</span>
  `, pct >= 70 ? "ok" : "warn");
  flushView(`grok> · тест ${pct}%`);
}

function handleTestAnswer(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  const tm = state.testMode;
  const q = tm.queue[tm.index];
  beginView(cmd);
  const expected = q.cmd.toLowerCase();
  const got = normalizeCmd(cmd).toLowerCase();
  if (got === expected || cmd.toLowerCase() === expected || matchesListed(cmd, [q.cmd])) {
    tm.correct++;
    printResult("Правильно!", `<span class="line-ok">✓ ${esc(q.cmd)}</span>`, "ok");
    tm.index++;
    setTimeout(showTestQuestion, 400);
  } else {
    tm.wrong++;
    printResult("Неправильно", `
      <span class="line-err">✗ ${esc(cmd)}</span><br>
      <span class="line-ok">Правильно: ${esc(q.cmd)}</span>
    `, "warn");
  }
  flushView(`test> · ${tm.correct}/${tm.queue.length}`);
}

function getCompletions() {
  const vals = [];
  for (const mod of Object.values(MODULES)) vals.push(...mod.commands);
  return [...new Set([...vals, "/"])];
}

document.getElementById("cmdForm").addEventListener("submit", e => {
  e.preventDefault();
  execute(cmdInput.value);
  cmdInput.value = "";
});

cmdInput.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (state.history.length) {
      state.histIdx = Math.max(0, state.histIdx - 1);
      cmdInput.value = state.history[state.histIdx] || "";
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (state.histIdx < state.history.length - 1) {
      state.histIdx++;
      cmdInput.value = state.history[state.histIdx] || "";
    } else { state.histIdx = state.history.length; cmdInput.value = ""; }
  } else if (e.key === "Tab") {
    e.preventDefault();
    const val = cmdInput.value;
    const match = getCompletions().find(c => c.startsWith(val) && c !== val);
    if (match) cmdInput.value = match;
  }
});

document.getElementById("btnTest").addEventListener("click", () => {
  state.testMode.active ? stopTestMode() : startTestMode();
});
document.getElementById("btnStart").addEventListener("click", () => {
  if (state.testMode.active) stopTestMode();
  Object.keys(state.triedByModule).forEach(k => state.triedByModule[k].clear());
  state.currentModule = "launch";
  SIM.inTui = false;
  SIM.alwaysApprove = false;
  SIM.planMode = false;
  SIM.contextPct = 42;
  welcome();
  buildChecklist();
  cmdInput.focus();
});
document.getElementById("btnClear").addEventListener("click", () => { welcome(); buildChecklist(); });

welcome();
buildChecklist();
