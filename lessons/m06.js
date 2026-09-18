window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m06", order: 6, title: "Розширення", subtitle: "Hooks, plugins, marketplace, skills, MCP", icon: "hub",
  goal: "Після модуля ти перевіряєш, які розширення бачить Grok, розумієш, що кожне з них може зробити, і не довіряєш невідомим.",
  lessons: [
    {
      id: "m06-l01", title: "Одне вікно extensions і аудит з shell", minutes: 12,
      steps: [
        { type: "story", title: "Що ще працює в цьому проєкті?",
          body: "<p>Ти клонуєш чужий репозиторій, а в ньому вже лежать правила, hooks, skills і MCP-сервери. Правила (<code>AGENTS.md</code>, <code>CLAUDE.md</code>, <code>.grok/rules/</code>, а також <code>.claude/rules/</code> і <code>.cursor/rules/</code>) Grok читає автоматично. Він розуміє й чужі формати: MCP з <code>.mcp.json</code> і <code>.cursor/mcp.json</code>, hooks з <code>.claude/settings.json</code> і <code>.cursor/hooks.json</code>.</p><p>Проєктні hooks, MCP- і LSP-сервери запускаються лише після того, як ти <strong>довіришся папці</strong>: <code>/hooks-trust</code> у TUI, прапорець <code>--trust</code> під час запуску або запис у <code>~/.grok/trusted_folders.toml</code>. Довіра = дозвіл виконувати чужий код на твоїй машині, тож спершу подивись, що саме підхопилося.</p>" },
        { type: "concept", title: "Чотири види розширень",
          body: "<table><thead><tr><th>Вид</th><th>Що робить</th></tr></thead><tbody><tr><td>Hooks</td><td>Автоматично запускають дії до/після tool calls — можуть виконувати shell-код</td></tr><tr><td>Plugins</td><td>Додають можливості й tools; ставляться з marketplace</td></tr><tr><td>Skills</td><td>Готові сценарії, доступні як <code>/назва</code></td></tr><tr><td>MCP</td><td>Сервери, що дають агенту доступ до зовнішніх систем: GitHub, БД, браузер</td></tr></tbody></table><p><code>/hooks</code>, <code>/plugins</code>, <code>/marketplace</code>, <code>/skills</code>, <code>/mcps</code> відкривають <strong>одне</strong> вікно extensions на різних вкладках.</p>",
          analogy: "Розширення — як додатки на новому телефоні, який тобі віддав знайомий. Перш ніж вводити пароль банку, перевір, що там встановлено і які дозволи мають ці додатки." },
        { type: "cli", title: "Вкладки extensions у TUI",
          commands: [
            { cmd: "/hooks", explain: "Вкладка Hooks: що виконується автоматично.", risk: "low" },
            { cmd: "/plugins", explain: "Вкладка Plugins: встановлені plugins.", risk: "low" },
            { cmd: "/marketplace", explain: "Вкладка Marketplace: джерела plugins для встановлення.", risk: "low" },
            { cmd: "/skills", explain: "Вкладка Skills: які <code>/назва</code> доступні.", risk: "low" },
            { cmd: "/mcps", explain: "Вкладка MCP: підключені сервери.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: які MCP-сервери підключено?",
          task: "У TUI відкрий вікно extensions одразу на вкладці MCP-серверів.",
          expected: ["/mcps"], output: "● Extensions → MCP\ngithub — enabled",
          hint: "Slash і абревіатура протоколу в множині.",
          explain: "Підключено `github` — агент може працювати з репозиторіями й issues від твого імені. Проєктний MCP-сервер з чужого репозиторію стартує лише після довіри до папки — не давай її наосліп." },
        { type: "check", title: "Найризикованіше",
          question: "Яке розширення може непомітно виконувати shell-код при кожному tool call?",
          options: ["Тема інтерфейсу", "Hook", "Файл плану"],
          correct: 1, feedback: "Hooks спрацьовують автоматично на події сесії. Невідомий hook — привід зупинитися й прочитати, що він робить." },
        { type: "cli", title: "Аудит з shell",
          commands: [
            { cmd: "grok inspect", explain: "Показує знайдені правила, skills, plugins, hooks і MCP-сервери. Є <code>--json</code>.", output: "Rules:   AGENTS.md\nSkills:  commit (local), review (global)\nHooks:   pre-tool: lint-check\nMCP:     github", risk: "low" },
            { cmd: "grok mcp list", explain: "Список MCP-серверів.", risk: "low" },
            { cmd: "grok plugin list", explain: "Список plugins.", risk: "low" },
            { cmd: "grok plugin install <name>", explain: "Встановлює plugin — розширює можливості агента. Перевір джерело. Точний формат аргументу (ім'я, marketplace, шлях) залежить від версії — див. <code>grok plugin install --help</code>.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: повний аудит",
          task: "З shell виведи всі знайдені Grok правила, skills, plugins, hooks і MCP-сервери одним списком.",
          prompt: "Stas@MacBook-Pro demo %",
          expected: ["grok inspect"], output: "Rules:   AGENTS.md\nSkills:  commit (local), review (global)\nPlugins: —\nHooks:   pre-tool: lint-check\nMCP:     github",
          hint: "Підкоманда grok від слова «оглянути».",
          explain: "Одна команда — і видно все, що підхопилося з проєкту та з твого профілю, ще до запуску TUI." },
        { type: "callout", variant: "danger", title: "Довіра до папки — не формальність",
          body: "<p><code>/hooks-trust</code>, <code>--trust</code> або запис у <code>~/.grok/trusted_folders.toml</code> дозволяють проєктним hooks, MCP- і LSP-серверам виконувати код з репозиторію. У чужому клоні спершу <code>grok inspect</code> і читання <code>.grok/</code>, <code>.claude/settings.json</code>, <code>.mcp.json</code> — і лише потім довіра.</p>" },
        { type: "check", title: "Невідомий plugin",
          question: "У marketplace знайшовся plugin «super-deploy» без опису. Що робити?",
          options: ["Встановити й подивитися, що буде", "Встановити й увімкнути Always-approve", "Не встановлювати, доки не зрозумієш, що він виконує і хто автор"],
          correct: 2, feedback: "Plugin отримує можливості агента. Невідоме джерело — ризик для коду й облікових даних." },
        { type: "summary", title: "Підсумок",
          points: ["`/hooks`, `/plugins`, `/marketplace`, `/skills`, `/mcps` — одне вікно extensions.", "Hooks і MCP найризикованіші: автоматичний код і доступ до зовнішніх систем; проєктні запускаються лише після довіри до папки (`/hooks-trust`, `--trust`).", "`grok inspect` — аудит усього, що підхопилося, з shell.", "`grok plugin install` — ризик середній: лише перевірені джерела."] }
      ],
      glossary: [
        { term: "Hook", def: "Дія, що автоматично виконується на подію сесії чи tool call." },
        { term: "Plugin", def: "Пакет, що додає агенту можливості; ставиться через marketplace." },
        { term: "MCP", def: "Model Context Protocol — спосіб підключити агенту зовнішні tools." },
        { term: "AGENTS.md", def: "Файл з правилами проєкту, який Grok читає автоматично (як і `CLAUDE.md`, `.grok/rules/*.md`)." },
        { term: "Довіра до папки", def: "Дозвіл запускати проєктні hooks, MCP і LSP: `/hooks-trust`, `--trust`, `~/.grok/trusted_folders.toml`." }
      ],
      quiz: [
        { question: "Що спільного у `/hooks`, `/skills` і `/mcps`?", options: ["Відкривають одне вікно extensions на різних вкладках", "Усі видаляють розширення", "Усі працюють лише з shell"], correct: 0, feedback: "Документація: ці команди відкривають уніфікований extensions modal." },
        { question: "Навіщо запускати `grok inspect` у щойно клонованому репозиторії?", options: ["Щоб оновити Grok", "Щоб побачити, які правила, hooks, skills і MCP підхопляться", "Щоб закомітити зміни"], correct: 1, feedback: "Аудит до першого промпту показує, що саме працюватиме разом з агентом." },
        { question: "Чому MCP-сервер `github` підвищує ризик?", options: ["Він сповільнює TUI", "Він змінює тему", "Агент отримує доступ до зовнішньої системи від твого імені"], correct: 2, feedback: "MCP дає tools для реальних дій: створювати issues, коментарі, зміни в репозиторіях." },
        { question: "Який ризик у встановленні plugin через `grok plugin install`?", options: ["Середній: plugin розширює можливості агента", "Нульовий", "Лише косметичний"], correct: 0, feedback: "Встановлення змінює середовище агента; оборотне, але потребує довіри до джерела." },
        { question: "Як з shell подивитися лише MCP-сервери?", options: ["`/mcps`", "`grok mcp list`", "`grok models`"], correct: 1, feedback: "`/mcps` — у TUI; з shell — підкоманда `grok mcp list`." },
        { question: "У проєкті є незнайомий hook. Найкраща дія?", options: ["Ігнорувати", "Увімкнути Always-approve, щоб не заважав", "Прочитати, що він виконує, і вимкнути, якщо не довіряєш"], correct: 2, feedback: "Hook може запускати код автоматично — його треба розуміти до роботи." }
      ]
    }
  ]
});
