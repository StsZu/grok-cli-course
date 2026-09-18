window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m04", order: 4, title: "Модель і налаштування", subtitle: "grok models, /model, /effort, тема, multiline", icon: "settings",
  goal: "Після модуля ти знаходиш доступні моделі, перемикаєш модель і reasoning effort, налаштовуєш зручний ввід — і не хардкодиш назви моделей.",
  lessons: [
    {
      id: "m04-l01", title: "Модель, effort і зручність", minutes: 11,
      steps: [
        { type: "story", title: "Яку модель обрати?",
          body: "<p>Для дрібної правки потужна модель — як вантажівка для хліба. Для складного рефакторингу навпаки: слабка модель зекономить хвилину і забере годину на виправлення.</p><p>Назви моделей xAI змінюються часто, тому вчимося не запам'ятовувати їх, а <strong>знаходити</strong>.</p>" },
        { type: "concept", title: "Модель і reasoning effort",
          body: "<p><strong>Модель</strong> визначає якість і вартість відповідей. <strong>Reasoning effort</strong> — скільки модель «міркує» перед відповіддю. Список моделей твого акаунта — <code>grok models</code>; перемкнути в TUI — <code>/model &lt;name&gt;</code> (аліас <code>/m</code>), при запуску — <code>grok -m &lt;model&gt;</code>.</p><p>На вересень 2026 документація xAI згадує <code>grok-4.6</code>, але актуальний список завжди дає <code>grok models</code>.</p>",
          analogy: "Модель — як вибір фахівця: практикант, досвідчений інженер чи архітектор. Effort — скільки часу ти даєш йому подумати перед відповіддю. Список фахівців на сьогодні — у відділі кадрів (`grok models`), а не в старій візитниці." },
        { type: "cli", title: "Моделі",
          commands: [
            { cmd: "grok models", explain: "З shell: моделі, доступні твоєму акаунту.", output: "grok-4.6 (default)\n… (список залежить від акаунта)", risk: "low" },
            { cmd: "/model grok-4.6", explain: "Перемкнути активну модель у TUI. Назву бери з <code>grok models</code>.", risk: "low" },
            { cmd: "grok -m grok-4.6", explain: "Запустити сесію одразу з потрібною моделлю (<code>--model</code>). Ризик як у <code>grok</code>: запускає агента; сама зміна моделі в TUI (<code>/model</code>) — низький ризик.", risk: "medium" },
            { cmd: "/effort", explain: "Налаштувати reasoning effort поточної моделі.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: які моделі доступні?",
          task: "У shell виведи список моделей, доступних твоєму акаунту.",
          prompt: "Stas@MacBook-Pro demo %",
          expected: ["grok models"], output: "grok-4.6 (default)\n… (список залежить від акаунта)",
          hint: "Назва програми і слово «моделі» англійською.",
          explain: "Список залежить від акаунта й дати. Саме звідси бери назву для `/model`, а не зі старих статей." },
        { type: "check", title: "Стара назва",
          question: "У старому туторіалі написано `/model grok-3`, а в тебе команда повертає помилку. Що робити?",
          options: ["Подивитися актуальні назви через `grok models` і взяти звідти", "Перевстановити Grok", "Повторювати, доки не спрацює"],
          correct: 0, feedback: "Моделі оновлюються. Джерело правди — `grok models` і docs.x.ai на сьогодні." },
        { type: "cli", title: "Зручність інтерфейсу",
          commands: [
            { cmd: "/theme", explain: "Вибір кольорової теми (аліас <code>/t</code>).", risk: "low" },
            { cmd: "/multiline", explain: "Багаторядковий ввід — для довгих інструкцій і вставки JSON (аліас <code>/ml</code>).", risk: "low" },
            { cmd: "/settings", explain: "Вікно налаштувань (аліас <code>/config</code>).", risk: "medium" },
            { cmd: "/feedback", explain: "Відгук про сесію для xAI. Не вставляй туди секрети.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: довгий промпт",
          task: "Хочеш вставити чекліст з кількох рядків. Увімкни багаторядковий ввід.",
          expected: ["/multiline", "/ml"], output: "Multiline: ON",
          hint: "Slash і англійське «багаторядковий».",
          explain: "Тепер можна писати кілька рядків. Не забудь вимкнути тією ж командою, коли закінчиш." },
        { type: "check", title: "Що впливає на код",
          question: "Яка з цих команд може вплинути на якість змін у коді?",
          options: ["`/theme`", "`/multiline`", "`/model` або `/effort`"],
          correct: 2, feedback: "Модель і effort визначають, як агент міркує. Тема й multiline — лише зручність інтерфейсу." },
        { type: "summary", title: "Підсумок",
          points: ["`grok models` — актуальний список моделей; назви не хардкодимо.", "`/model <name>` (аліас `/m`) і `grok -m` — вибір моделі; `/effort` — глибина міркувань.", "`/theme`, `/multiline`, `/settings` — зручність інтерфейсу.", "`/feedback` — без секретів у тексті."] }
      ],
      glossary: [
        { term: "Модель", def: "Нейромережа, що генерує відповіді; вибір впливає на якість і вартість." },
        { term: "Reasoning effort", def: "Скільки модель міркує перед відповіддю: `/effort`, `--effort`." },
        { term: "Multiline", def: "Режим вводу, де Enter додає рядок: `/multiline`." }
      ],
      quiz: [
        { question: "Звідки брати назву моделі для `/model`?", options: ["З `grok models` або з вибору в TUI", "З будь-якої статті в інтернеті", "Вигадати схожу"], correct: 0, feedback: "Лише актуальний список твого акаунта гарантує, що модель існує і доступна." },
        { question: "Як запустити сесію одразу з певною моделлю?", options: ["`grok --theme <model>`", "`grok -m <model>`", "`grok models <model>`"], correct: 1, feedback: "`-m` / `--model` задає модель під час запуску; `grok models` лише показує список." },
        { question: "Який аліас має `/model`?", options: ["`/mo`", "`/models`", "`/m`"], correct: 2, feedback: "За документацією аліас `/model` — `/m`." },
        { question: "Що налаштовує `/effort`?", options: ["Reasoning effort — наскільки глибоко модель міркує", "Швидкість інтернету", "Кількість кредитів на рахунку"], correct: 0, feedback: "Більше effort — зазвичай ретельніше, але довше й дорожче." },
        { question: "Ти вставив у `/feedback` лог з паролем бази даних. Що робити?", options: ["Нічого, це ж xAI", "Змінити пароль: секрет, що пішов за межі твоєї машини, вважається скомпрометованим", "Надіслати ще раз без логу"], correct: 1, feedback: "Будь-який секрет, відправлений у сторонній сервіс, треба замінити." },
        { question: "Навіщо вмикати `/multiline`?", options: ["Щоб агент відповідав довше", "Щоб увімкнути plan mode", "Щоб писати промпт у кілька рядків: чеклісти, JSON, diff"], correct: 2, feedback: "Multiline — лише про ввід. Не забудь вимкнути після довгого промпту." }
      ]
    }
  ]
});
