window.CLI_COURSE_CONFIG = {
  id: "grok-cli",
  title: "Grok CLI (Grok Build)",
  subtitle: "AI-агент xAI у терміналі: запуск, сесії, контекст і план, режими дозволів, розширення, пам'ять і безпечний workflow з git.",
  overline: "Курс для новачків · AI-агент · TUI + shell",
  brandSub: "курс Grok CLI",
  storageKey: "cli-grok-cli-v1",
  caseInsensitive: false,
  prompt: "grok>",
  termTitle: "Grok CLI — навчальний TUI",
  sandbox: "trainer.html",
  factsCheckedAt: "2026-09-18",
  quizBank: null,
  skills: [
    ["terminal", "Встановити й запустити `grok` у папці проєкту, відрізняти shell-команди від slash-команд TUI."],
    ["replay", "Керувати сесіями: `/new`, `/rename`, `/resume`, `/fork`, `grok -c`."],
    ["dashboard", "Стежити за контекстом (`/context`, `/compact`) і планувати зміни в plan mode."],
    ["shield", "Обирати режим дозволів: Ask, Plan, Auto (`/auto`), Always-approve — і розуміти ризик кожного."],
    ["hub", "Перевіряти розширення: hooks, plugins, skills, MCP (`/mcps`, `grok inspect`)."],
    ["git", "Тримати роботу агента під контролем git: `git status`, `git diff`, коміт після перевірки."]
  ],
  audience: "<p>Для тих, хто вже відкривав Terminal і хоче працювати з AI-агентом Grok CLI (Grok Build від xAI) у своїх проєктах — безпечно й усвідомлено.</p><p>Головна мета — не вивчити всі команди, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії.</p><p>Потрібні: macOS, Linux або WSL, акаунт xAI і базові навички shell (<code>cd</code>, <code>ls</code>, <code>git status</code>).</p>",
  safety: "<p>Кроки «Спробуй сам» і тренажер — імітація: вони нічого не запускають. У справжньому Grok агент читає і змінює файли, тому запускай <code>grok</code> лише в папці проєкту під git, починай у режимі Ask або Plan, а <code>--always-approve</code> / <code>--yolo</code> вмикай тільки в ізольованому середовищі (контейнер, VM або <code>--sandbox</code>; окремий worktree shell не ізолює). Перед <code>/rewind</code> роби коміт або <code>git stash</code>: відкат відновлює файли на диску, і незакомічені зміни втрачаються.</p>",
  sources: [
    { href: "https://docs.x.ai/build/overview", label: "xAI — Grok Build: огляд і встановлення" },
    { href: "https://docs.x.ai/build/modes-and-commands", label: "xAI — Modes and Commands" },
    { href: "https://docs.x.ai/build/features/permissions", label: "xAI — Permissions" },
    { href: "https://docs.x.ai/build/cli/reference", label: "xAI — CLI Reference" },
    { href: "https://docs.x.ai/build/features/sessions", label: "xAI — Sessions (resume, rewind, fork)" },
    { href: "https://docs.x.ai/build/features/plan-mode", label: "xAI — Plan mode" },
    { href: "https://docs.x.ai/build/features/worktrees", label: "xAI — Worktrees" },
    { href: "https://docs.x.ai/build/features/sandbox", label: "xAI — Sandbox" },
    { href: "https://docs.x.ai/build/features/hooks", label: "xAI — Hooks (довіра до папки)" }
  ]
};
