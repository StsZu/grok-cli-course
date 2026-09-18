window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m08", order: 8, title: "Skills і безпечний workflow", subtitle: "Skills як команди, git навколо агента, headless і worktree", icon: "git",
  goal: "Після модуля ти викликаєш skills свідомо, перевіряєш усі зміни агента через git і запускаєш Grok у скриптах та окремих worktree без ризику для основної гілки.",
  lessons: [
    {
      id: "m08-l01", title: "Skills як slash-команди і коміт після агента", minutes: 11,
      steps: [
        { type: "story", title: "Одна команда — і коміт готовий",
          body: "<p>У проєкті є skill <code>commit</code>: він сам збирає зміни, пише повідомлення і комітить. Зручно — але якщо агент змінив зайвий файл, він теж потрапить у коміт.</p>" },
        { type: "concept", title: "Skill — готовий сценарій",
          body: "<p>Кожен user-invocable skill автоматично стає slash-командою <code>/&lt;skill-name&gt;</code>. Якщо два skills мають однакове ім'я, використовуй кваліфіковану форму — документація наводить приклад <code>/local:commit</code>. Префікс перед <code>:</code> вказує, звідки skill; які саме префікси є у твоїй установці, дивись у <code>/skills</code>.</p>",
          analogy: "Skill — як кнопка «зварити капучино» на кавомашині: зручно, але ти маєш знати, що саме вона наллє. Два однакові рецепти від різних бариста розрізняєш за підписом — це і є `local:`." },
        { type: "cli", title: "Skills",
          commands: [
            { cmd: "/skills", explain: "Вкладка Skills: які сценарії доступні і звідки вони.", risk: "low" },
            { cmd: "/commit", explain: "Викликає skill <code>commit</code>, якщо його встановлено. Змінює історію git.", risk: "medium" },
            { cmd: "/local:commit", explain: "Однозначно викликає локальний skill <code>commit</code> при конфлікті імен.", risk: "medium" }
          ] },
        { type: "check", title: "Конфлікт імен",
          question: "Є локальний і глобальний skill `commit`. Як точно викликати саме локальний?",
          options: ["`/commit`", "`/commit --local`", "`/local:commit`"],
          correct: 2, feedback: "Кваліфікована форма `/<scope>:<name>` прибирає неоднозначність." },
        { type: "cli", title: "Git навколо агента",
          commands: [
            { cmd: "git diff", explain: "Перегляд усіх незакомічених змін — до будь-якого коміту.", risk: "low" },
            { cmd: "git add -p", explain: "Додати зміни частинами, погоджуючи кожен фрагмент.", risk: "medium" },
            { cmd: "git log -1 --stat", explain: "Останній коміт і список змінених файлів.", output: "commit 7c1d2e9 (HEAD -> feature/auth)\n    fix(auth): validate empty user\n src/auth.ts      | 2 ++\n src/auth.test.ts | 9 +++++++++", risk: "low" },
            { cmd: "git push --force", explain: "Перезаписує історію на сервері — чужі коміти можуть зникнути.", risk: "high" }
          ] },
        { type: "callout", variant: "danger", title: "Force-push — не для агента",
          body: "<p><code>git push --force</code> перезаписує історію віддаленої гілки: коміти колег можуть зникнути без сліду. Не дозволяй агенту робити це без твого перегляду, а в Always-approve — тим паче.</p><p>Безпечніше: звичайний <code>git push</code>, а якщо перезапис справді потрібен — <code>git push --force-with-lease</code> і лише у власній гілці.</p>" },
        { type: "terminal", title: "Спробуй: перевір коміт skill",
          task: "Skill щойно зробив коміт. Подивись останній коміт і список змінених у ньому файлів.",
          prompt: "Stas@MacBook-Pro demo %",
          expected: ["git log -1 --stat", "git log --stat -1", "git log -n 1 --stat"], output: "commit 7c1d2e9 (HEAD -> feature/auth)\nAuthor: Stas\n    fix(auth): validate empty user\n src/auth.ts      | 2 ++\n src/auth.test.ts | 9 +++++++++\n 2 files changed, 11 insertions(+)",
          hint: "Журнал git, лише один запис, зі статистикою файлів.",
          explain: "Два файли, обидва очікувані. Якби тут був `.env` чи чужий файл — час робити `git reset --soft HEAD~1` і розбиратися." },
        { type: "check", title: "Порядок дій",
          question: "Агент закінчив задачу. Який порядок найбезпечніший?",
          options: ["`git diff` → перевірка → `/commit` або `git add -p` → `git log -1 --stat`", "Одразу `/commit` і `git push --force`", "`/commit` в Always-approve, не дивлячись"],
          correct: 0, feedback: "Спершу бачиш зміни, потім комітиш, потім перевіряєш результат. Force-push тут не потрібен." },
        { type: "summary", title: "Підсумок",
          points: ["Skills стають командами `/<skill-name>`; при конфлікті — `/local:commit`.", "`/commit` змінює історію git — ризик середній.", "Перед комітом — `git diff`, після — `git log -1 --stat`.", "`git push --force` — високий ризик; безпечніше `--force-with-lease` у своїй гілці."] }
      ],
      glossary: [
        { term: "Skill", def: "Готовий сценарій, доступний як slash-команда `/<skill-name>`." },
        { term: "Кваліфіковане ім'я", def: "Форма `/<scope>:<name>`, напр. `/local:commit`." },
        { term: "git add -p", def: "Покрокове додавання змін до коміту з підтвердженням кожного фрагмента." }
      ],
      quiz: [
        { question: "Як дізнатися, які skills доступні як slash-команди?", options: ["`/skills`", "`/model`", "`git skills`"], correct: 0, feedback: "`/skills` відкриває вкладку Skills у вікні extensions." },
        { question: "Чому `/commit` має середній ризик?", options: ["Видаляє репозиторій", "Змінює історію git і може закомітити зайве", "Вмикає always-approve"], correct: 1, feedback: "Коміт оборотний, але в нього може потрапити не те — тому спершу `git diff`." },
        { question: "У `git log -1 --stat` ти бачиш у коміті файл `.env`. Що робити?", options: ["Нічого", "Одразу `git push`", "Скасувати коміт (`git reset --soft HEAD~1`), прибрати `.env` і замінити секрети, якщо коміт вже був опублікований"], correct: 2, feedback: "Секрети в історії git — витік. Не пушити і виправити до публікації." },
        { question: "Безпечніша альтернатива `git push --force`?", options: ["`git push --force-with-lease` у власній гілці", "`git push --yolo`", "`rm -rf .git`"], correct: 0, feedback: "`--force-with-lease` відмовить, якщо на сервері є чужі нові коміти." },
        { question: "Навіщо `git add -p` замість `git add .` після роботи агента?", options: ["Так швидше", "Щоб переглянути й погодити кожен фрагмент змін", "Щоб видалити зміни"], correct: 1, feedback: "`-p` показує зміни частинами — зайве не потрапить у коміт." },
        { question: "Що робить `/local:commit`?", options: ["Комітить лише локальні файли", "Створює новий skill", "Викликає skill `commit` саме з локальної області при конфлікті імен"], correct: 2, feedback: "Префікс `local:` вказує джерело skill (приклад з документації), а не тип файлів. Точні назви префіксів перевір у `/skills`." }
      ]
    },
    {
      id: "m08-l02", title: "Headless-запуск і окремий worktree", minutes: 11,
      steps: [
        { type: "story", title: "Агент у скрипті",
          body: "<p>Тобі треба щоранку отримувати короткий огляд змін у репозиторії. Відкривати TUI не хочеться — хочеться однієї команди в скрипті.</p><p>А для сміливих експериментів — окремої копії робочої папки, щоб основна гілка лишилася чистою.</p>" },
        { type: "concept", title: "Headless і worktree",
          body: "<p><strong>Headless</strong>: <code>grok -p \"промпт\"</code> виконує задачу без TUI і друкує результат; <code>--output-format streaming-json</code> — для програм. <strong>Worktree</strong>: <code>grok -w</code> запускає сесію в новому git worktree — окремій робочій копії в <code>~/.grok/worktrees/&lt;repo&gt;/&lt;name&gt;</code>. Це не нова гілка: копія <strong>detached</strong> на поточному коміті (HEAD) і стартує <strong>разом з твоїми незакоміченими змінами</strong>; чистий старт — <code>--ref main</code>. Worktree лишається на диску й після кінця сесії, доки не прибереш його <code>grok worktree rm</code> або <code>grok worktree gc</code>.</p><p>Worktree розводить <em>файли</em>, але не обмежує shell: команди агента бачать увесь твій диск і мережу. Для обмеження — <code>--sandbox</code> (модуль 5).</p><p>Обмеження теж є: <code>--max-turns</code> — максимум кроків агента.</p>",
          analogy: "Worktree — як окремий верстак у тій самій майстерні: деталь, яку ти пиляєш, не лежить на головному столі. Але двері майстерні відчинені: інструмент (shell) дістане будь-що. І верстак сам не зникне — його треба прибрати." },
        { type: "cli", title: "Запуск без TUI",
          commands: [
            { cmd: "grok -p \"Explain this repo\"", explain: "Одна задача без інтерфейсу; відповідь — у stdout.", output: "Це навчальний TypeScript-проєкт: src/ — код, src/auth.ts — логін…", risk: "medium" },
            { cmd: "grok -p \"Explain the architecture\" --output-format streaming-json", explain: "Те саме, але вивід у JSON-потоці для інших програм.", risk: "medium" },
            { cmd: "grok -p \"Summarize recent changes\" --max-turns 5", explain: "Обмежити кількість кроків агента.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: headless-запит",
          task: "Без відкриття TUI попроси Grok пояснити репозиторій промптом `Explain this repo`.",
          prompt: "Stas@MacBook-Pro demo %",
          expected: ["grok -p \"Explain this repo\"", "grok -p 'Explain this repo'", "grok --single \"Explain this repo\"", "grok --single 'Explain this repo'"], output: "Це навчальний TypeScript-проєкт: src/ — код, src/auth.ts — логін,\nтести поруч (*.test.ts).",
          hint: "Назва програми, короткий прапорець «print/prompt» і текст у лапках.",
          explain: "Headless-запуск читає ті самі правила дозволів. Що саме станеться, коли tool потребує дозволу без TUI, залежить від версії — тому для скриптів задавай allow/deny явно й не додавай `--always-approve` бездумно." },
        { type: "check", title: "Головна небезпека скрипта",
          question: "Колега пропонує в cron: `grok -p \"виправ усі баги\" --always-approve`. Що не так?",
          options: ["Нічого, так швидше", "Агент без нагляду і без запитів змінюватиме код, можливо в основній гілці", "cron не вміє запускати grok"],
          correct: 1, feedback: "Автоматизація + always-approve = дії без жодного контролю. Для скриптів — завдання лише на читання, або worktree, `--max-turns` і deny-правила." },
        { type: "cli", title: "Окремий worktree",
          commands: [
            { cmd: "grok -w", explain: "Сесія в новому git worktree: окрема робоча копія, detached на поточному коміті, з копією незакомічених змін. Shell не ізольовано.", risk: "medium" },
            { cmd: "grok -w experiment", explain: "Те саме з назвою worktree. Разом з промптом краще <code>--worktree=experiment</code>, щоб промпт не став назвою.", risk: "medium" },
            { cmd: "grok worktree list", explain: "Список worktree, створених Grok.", risk: "low" },
            { cmd: "grok worktree rm experiment", explain: "Видалити worktree разом з його папкою. Незакомічене в ній може зникнути безповоротно — спершу <code>git diff</code> і коміт у тій папці.", risk: "high" },
            { cmd: "grok worktree gc", explain: "Прибрати worktree, чиї папки зникли або які довго простоюють (<code>--max-age</code>). Може забрати й забуту незакомічену роботу — спершу <code>grok worktree list</code>.", risk: "high" }
          ] },
        { type: "callout", variant: "danger", title: "Прибирання worktree — безповоротне",
          body: "<p><code>grok worktree rm</code> і <code>grok worktree gc</code> видаляють папку worktree. Усе, що агент або ти змінили там і не закомітили, зникне — git цього не зберігав.</p><p>Безпечніше: зайди в папку worktree, переглянь <code>git status</code> і <code>git diff</code>, закоміть потрібне в гілку (<code>git switch -c experiment</code> і коміт) — і лише потім прибирай.</p>" },
        { type: "terminal", title: "Спробуй: ізольований експеримент",
          task: "Запусти Grok у новому git worktree з назвою `experiment`.",
          prompt: "Stas@MacBook-Pro demo %",
          expected: ["grok -w experiment", "grok --worktree experiment", "grok --worktree=experiment"], output: "● Worktree: ~/.grok/worktrees/demo/experiment (detached @ 3f9c2e1, з незакоміченими змінами)\n● Grok TUI · Mode: Ask",
          hint: "Короткий прапорець від слова worktree і назва.",
          explain: "Правки файлів агента лежать в окремій робочій копії, основна папка їх не бачить. Результат забирай свідомо (коміт у worktree → гілка → merge), а потім `grok worktree rm`. Shell-команди агента worktree не обмежує." },
        { type: "check", title: "Навіщо worktree",
          question: "Хочеш дати агенту більше свободи для експерименту. Що найбільше зменшить ризик для основної гілки?",
          options: ["`grok -w` — окрема робоча копія (worktree)", "Запуск з `~`", "`/compact`"],
          correct: 0, feedback: "Правки файлів ідуть в окрему копію, основна папка лишається чистою. Але shell агента worktree не ізолює — для ризикованих команд додай `--sandbox` або контейнер." },
        { type: "summary", title: "Підсумок",
          points: ["`grok -p \"…\"` — headless-запуск для скриптів; `--output-format streaming-json` — для програм.", "`--max-turns` обмежує кількість кроків агента.", "`grok -w [назва]` — окрема робоча копія (detached, з незакоміченими змінами); живе до `grok worktree rm`/`gc`; shell не ізольовано.", "Автоматизація + `--always-approve` без ізоляції — рецепт аварії."] }
      ],
      glossary: [
        { term: "grok -p", def: "Headless-запуск з промптом без TUI." },
        { term: "Worktree", def: "Додаткова робоча папка того самого git-репозиторію; у Grok — `~/.grok/worktrees/…`, detached на базовому коміті." },
        { term: "--max-turns", def: "Максимальна кількість кроків агента за запуск." }
      ],
      quiz: [
        { question: "Чим `grok -p \"…\"` відрізняється від `grok`?", options: ["Виконує одну задачу без TUI і друкує результат", "Вмикає plan mode", "Видаляє сесію"], correct: 0, feedback: "`-p` — headless: зручно для скриптів і конвеєрів." },
        { question: "Для чого `--output-format streaming-json`?", options: ["Для кольорового виводу", "Щоб результат могла читати інша програма", "Щоб зберегти пам'ять"], correct: 1, feedback: "JSON-потік легко розбирати скриптами й ботами." },
        { question: "Що дає `grok -w`?", options: ["Вмикає always-approve", "Оновлює Grok", "Сесію в новому git worktree — окремій робочій копії"], correct: 2, feedback: "Правки файлів не змішуються з основною папкою. Це не окрема гілка (копія detached) і не пісочниця для shell." },
        { question: "Як обмежити, скільки кроків агент зробить у скрипті?", options: ["`--max-turns`", "`--effort`", "`/compact`"], correct: 0, feedback: "`--max-turns <N>` зупиняє агента після N кроків." },
        { question: "Які правила дозволів діють у headless-запуску?", options: ["Жодних — headless завжди без обмежень", "Ті самі механізми: режим, allow/deny, прапорці запуску", "Лише plan mode"], correct: 1, feedback: "Headless не скасовує безпеки: задавай режим і правила явно (поведінку запиту дозволу без TUI перевір для своєї версії)." },
        { question: "Найбезпечніший спосіб регулярно отримувати огляд репозиторію скриптом?", options: ["`grok -p` з `--always-approve` у `main`", "Запуск з кореня диска", "`grok -p` із задачею лише на читання, `--max-turns` і deny-правилами"], correct: 2, feedback: "Читання + обмеження кроків + заборони = мінімальний ризик." }
      ]
    }
  ]
});
