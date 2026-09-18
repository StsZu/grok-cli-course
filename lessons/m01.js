window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m01", order: 1, title: "Запуск і перший сеанс", subtitle: "Встановлення, довідка, git перед агентом, TUI", icon: "terminal",
  goal: "Після модуля ти встановлюєш Grok CLI, перевіряєш його, запускаєш у папці проєкту і відрізняєш команди shell, slash-команди і промпти.",
  lessons: [
    {
      id: "m01-l01", title: "Що таке Grok CLI і як його встановити", minutes: 10,
      steps: [
        { type: "story", title: "Агент, який працює в терміналі",
          body: "<p>Grok CLI (у документації xAI — <strong>Grok Build</strong>) — це AI-агент, який запускається командою <code>grok</code> прямо в папці проєкту. Він читає файли, запускає інструменти (tools) і може змінювати код.</p><p>Тому перше правило курсу: спершу зрозуміти, що саме агент може зробити, а вже потім давати йому задачу.</p>" },
        { type: "concept", title: "Агент — не чат, а виконавець",
          body: "<p>Звичайний чат лише відповідає текстом. Агент ще й <strong>діє</strong>: читає файли, запускає shell-команди, редагує код. Кожна така дія — <em>tool call</em>, і типово Grok питає дозволу перед нею.</p><p>Працює Grok у трьох формах: інтерактивний TUI (<code>grok</code>), headless-запуск у скриптах (<code>grok -p</code>) і через протокол ACP в інших програмах.</p>",
          analogy: "Grok — як майстер, якого ти впустив у квартиру з ключами. Він може лише подивитися й порадити, а може взяти дриль. Тому ти показуєш йому одну кімнату (папку проєкту) і спершу домовляєшся, що без твого «так» він нічого не свердлить (запит дозволу на кожен tool call)." },
        { type: "cli", title: "Встановлення і перевірка",
          intro: "<p>Офіційний спосіб для macOS, Linux і WSL — інсталятор з x.ai. Він кладе файл у <code>~/.grok/bin/grok</code>.</p>",
          commands: [
            { cmd: "curl -fsSL https://x.ai/cli/install.sh | bash", explain: "Завантажує офіційний скрипт і одразу виконує його. Змінює систему (додає програму), тому ризик середній; обережніше — спершу завантажити скрипт у файл і прочитати.", risk: "medium" },
            { cmd: "which grok", explain: "Показує, який файл запуститься за командою <code>grok</code>. Порожньо або <code>not found</code> — програма не в <code>PATH</code>.", output: "/Users/Stas/.grok/bin/grok", risk: "low" },
            { cmd: "grok version", explain: "Друкує версію. Це підкоманда, як <code>grok login</code> чи <code>grok models</code>.", risk: "low" },
            { cmd: "grok update", explain: "Перевіряє оновлення або встановлює конкретну версію. Змінює встановлену програму.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: де лежить grok?",
          task: "Перевір, чи встановлено Grok CLI і який саме файл запуститься за командою `grok`.",
          prompt: "Stas@MacBook-Pro demo %",
          expected: ["which grok", "command -v grok"], output: "/Users/Stas/.grok/bin/grok",
          hint: "Англійське «який саме» + назва програми.",
          explain: "Шлях `~/.grok/bin/grok` — сюди ставить офіційний інсталятор. Якщо відповідь порожня, додай `~/.grok/bin` у `PATH` або відкрий нове вікно терміналу." },
        { type: "check", title: "Після встановлення",
          question: "Інсталятор завершився без помилок, але `grok` відповідає `command not found`. Що перевірити першим?",
          options: ["Чи є папка `~/.grok/bin` у `PATH` (або відкрий нове вікно терміналу)", "Перевстановити macOS", "Запустити `sudo grok`"],
          correct: 0, feedback: "Shell шукає програми лише в папках з `PATH`. Нове вікно підхоплює оновлений `PATH`; `sudo` тут нічого не виправить, лише додасть ризику." },
        { type: "cli", title: "Довідка — перш ніж пробувати прапорці",
          commands: [
            { cmd: "grok --help", explain: "Список підкоманд і прапорців. Повний і актуальний перелік — саме тут, бо прапорці змінюються з версіями.", output: "Usage: grok [OPTIONS] [COMMAND]\n  login  logout  models  inspect  mcp  plugin  sessions  update  version …\n  -c, --continue   Continue the most recent session\n  --always-approve Auto-approve all tool executions\n(скорочено й приблизно — точний вивід залежить від версії)", risk: "low" },
            { cmd: "grok login", explain: "Вхід в акаунт xAI. Під час першого запуску <code>grok</code> браузер відкриється сам.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: відкрий довідку",
          task: "Виведи довідку Grok CLI зі списком підкоманд і прапорців.",
          prompt: "Stas@MacBook-Pro demo %",
          expected: ["grok --help"], output: "Usage: grok [OPTIONS] [COMMAND]\n  login  logout  models  inspect  mcp  plugin  sessions  update  version …\n  -c, --continue   Continue the most recent session\n  --always-approve Auto-approve all tool executions\n(скорочено й приблизно — точний вивід залежить від версії)",
          hint: "Назва програми і довгий прапорець «допомога» з двома дефісами.",
          explain: "Довідка лише читає — ризик низький. Зверни увагу на `--always-approve`: прапорець є, але вмикати його ми будемо свідомо й пізніше." },
        { type: "check", title: "Прапорці змінюються",
          question: "У статті з блогу бачиш прапорець, якого немає в `grok --help` твоєї версії. Що робити?",
          options: ["Вгадати схожий прапорець", "Довіритися своєму `grok --help` і документації xAI: прапорці залежать від версії", "Запустити з ним у важливому репозиторії й подивитися"],
          correct: 1, feedback: "AI-інструменти швидко змінюються. Джерело правди — `grok --help` твоєї версії і docs.x.ai, а не чужі статті." },
        { type: "summary", title: "Підсумок",
          points: ["Grok CLI (Grok Build) — AI-агент, який читає файли й виконує tool calls у папці проєкту.", "Встановлення: `curl -fsSL https://x.ai/cli/install.sh | bash`, файл — `~/.grok/bin/grok`.", "`which grok` і `grok version` лише перевіряють; `grok update` змінює програму.", "`grok --help` — джерело правди про прапорці твоєї версії."] }
      ],
      glossary: [
        { term: "Grok Build", def: "Офіційна назва агента xAI для коду; запускається командою `grok`." },
        { term: "TUI", def: "Текстовий інтерфейс у терміналі: вікно з полем вводу, меню й підказками." },
        { term: "Tool call", def: "Дія агента: прочитати файл, виконати shell-команду, змінити код." },
        { term: "Headless", def: "Запуск без інтерфейсу, напр. `grok -p \"…\"` у скрипті." }
      ],
      quiz: [
        { question: "Чим агент Grok відрізняється від звичайного чату?", options: ["Нічим, лише інший колір", "Він може виконувати дії: читати й змінювати файли, запускати команди", "Він працює лише без інтернету"], correct: 1, feedback: "Агент робить tool calls — реальні дії з файлами й командами. Тому до нього потрібні правила безпеки." },
        { question: "Який ризик у команди `which grok`?", options: ["Низький — лише показує шлях", "Середній — змінює PATH", "Високий — перевстановлює grok"], correct: 0, feedback: "`which` нічого не змінює, лише показує, який файл запуститься." },
        { question: "Навіщо перед `curl … | bash` варто спершу подивитися на скрипт?", options: ["Щоб скрипт працював швидше", "Так вимагає macOS", "Конвеєр одразу виконує завантажений код — ти маєш знати, звідки він і що робить"], correct: 2, feedback: "`| bash` виконує все, що прийшло з мережі. Для офіційного інсталятора з x.ai це прийнятно, але звичка перевіряти джерело захищає від підробок." },
        { question: "Як дізнатися версію Grok CLI?", options: ["`grok version`", "`grok /version`", "`version grok`"], correct: 0, feedback: "Версію друкує підкоманда `grok version`. Slash-команди працюють лише всередині TUI." },
        { question: "Ти хочеш дізнатися, чи є в твоїй версії певний прапорець. Найнадійніше джерело?", options: ["Старий відеоурок", "Пам'ять колеги", "`grok --help` і документація docs.x.ai"], correct: 2, feedback: "Прапорці залежать від версії. Довідка встановленої програми завжди відповідає саме їй." },
        { question: "Що робить `grok update`?", options: ["Оновлює всі пакети Homebrew", "Перевіряє оновлення Grok CLI або ставить конкретну версію", "Оновлює код проєкту до останнього коміту"], correct: 1, feedback: "`grok update` стосується лише самого Grok CLI. Проєкт і інші програми не зачіпає." }
      ]
    },
    {
      id: "m01-l02", title: "Перший запуск у проєкті", minutes: 11,
      steps: [
        { type: "story", title: "Правильна папка — половина безпеки",
          body: "<p>Grok працює з тією папкою, де ти його запустив. Запуск у <code>~</code> відкриває агенту всі твої документи, а запуск у папці проєкту — лише проєкт.</p><p>А щоб потім бачити, що саме змінив агент, перед стартом варто подивитися стан git.</p>" },
        { type: "concept", title: "Три види вводу",
          body: "<table><thead><tr><th>Що вводиш</th><th>Де</th><th>Приклад</th></tr></thead><tbody><tr><td>Команда shell</td><td>zsh, prompt <code>%</code></td><td><code>git status</code>, <code>grok</code></td></tr><tr><td>Slash-команда</td><td>TUI Grok</td><td><code>/help</code>, <code>/context</code></td></tr><tr><td>Промпт</td><td>TUI Grok</td><td>«Поясни структуру проєкту»</td></tr><tr><td>Shell-режим</td><td>TUI Grok, <code>!</code> на порожньому рядку</td><td><code>!git status</code></td></tr></tbody></table><p>Slash-команди керують сесією, промпти дають агенту задачу, shell — твій звичний термінал. Якщо ввести <code>!</code> на порожньому рядку TUI, Grok перейде в shell-режим: команда виконається напряму, без участі агента — це твоя власна дія, тож і відповідальність твоя.</p>",
          analogy: "У ресторані ти можеш покликати офіціанта («рахунок, будь ласка» — slash-команда), замовити страву (промпт — робота для кухні) або вийти на вулицю й зателефонувати (shell). Сказати «рахунок» на вулиці марно — так само `/help` не працює в zsh." },
        { type: "cli", title: "Безпечний старт",
          commands: [
            { cmd: "cd ~/Projects/demo", explain: "Перейти в папку проєкту — саме її бачитиме агент.", risk: "low" },
            { cmd: "git status", explain: "Що вже змінено до агента. Бажано почати з чистого стану або зробити коміт.", output: "On branch feature/auth\nnothing to commit, working tree clean", risk: "low" },
            { cmd: "grok", explain: "Запускає TUI у поточній папці. Типовий режим дозволів — Ask: перед діями агент питає.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: стан репозиторію",
          task: "Перед запуском агента перевір, чи є в репозиторії незбережені зміни.",
          prompt: "Stas@MacBook-Pro demo %",
          expected: ["git status"], output: "On branch feature/auth\nnothing to commit, working tree clean",
          hint: "Git + слово «стан» англійською.",
          explain: "`working tree clean` — ідеальний старт: усе, що з'явиться після сесії, зробив агент, і `git diff` це покаже." },
        { type: "check", title: "Де запускати",
          question: "Ти хочеш, щоб агент допоміг з проєктом `demo`. Звідки запускати `grok`?",
          options: ["З домашньої папки `~` — хай бачить усе", "З кореня диска `/`", "З `~/Projects/demo` після `git status`"],
          correct: 2, feedback: "Агент працює з поточною папкою. Лише папка проєкту під git — і доступ мінімальний, і зміни видно." },
        { type: "cli", title: "Перші slash-команди",
          intro: "<p>Ці команди вводяться вже в TUI, після <code>grok</code>.</p>",
          commands: [
            { cmd: "/", explain: "Символ <code>/</code> на початку рядка показує підказки slash-команд (вигляд залежить від версії). Повна command palette за документацією — <span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">P</span> або <span class=\"kbd\">?</span>.", risk: "low" },
            { cmd: "/help", explain: "Усі команди й гарячі клавіші. <span class=\"kbd\">Shift</span> + <span class=\"kbd\">Tab</span> перемикає режими сесії.", risk: "low" },
            { cmd: "/quit", explain: "Вийти з Grok у shell. Аліас — <code>/exit</code>. Сесія зберігається.", risk: "low" },
            { cmd: "!git status", explain: "<code>!</code> на порожньому рядку — shell-режим: <code>git status</code> виконається прямо з TUI, не виходячи з Grok.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: список команд TUI",
          task: "Ти в TUI Grok. Відкрий повний перелік команд і гарячих клавіш.",
          expected: ["/help"], output: "Commands: /new /resume /sessions /fork /rename /context /compact /plan /auto …\nKeys: Shift+Tab — cycle modes",
          hint: "Slash і англійське слово «допомога».",
          explain: "`/help` — найкоротший шлях знайти потрібну команду, не пам'ятаючи її назву. Саме цього вчить курс." },
        { type: "check", title: "Команда не в тому місці",
          question: "Ти ввів `/help` у звичайному zsh (prompt `%`) і отримав помилку. Чому?",
          options: ["Slash-команди працюють лише всередині TUI — спершу треба запустити `grok`", "Grok зламався і його треба перевстановити", "Потрібно ввести `sudo /help`"],
          correct: 0, feedback: "Slash-команди — частина інтерфейсу Grok. У zsh `/help` сприймається як шлях до файлу." },
        { type: "callout", variant: "tip", title: "Звичка на кожен день",
          body: "<p><code>git status</code> → <code>grok</code> → робота → <code>/quit</code> → <code>git status</code> і <code>git diff</code>. Так ти завжди знаєш, що змінилось і хто це зробив.</p>" },
        { type: "summary", title: "Підсумок",
          points: ["Запускай `grok` лише в папці проєкту, бажано під git і з чистим `git status`.", "Shell-команди — у zsh, slash-команди й промпти — у TUI.", "`/`, `/help` і command palette (Ctrl+P або `?`) допомагають знайти команду без запам'ятовування; `!` на порожньому рядку — shell-режим.", "`/quit` (або `/exit`) виходить з TUI, сесія зберігається."] }
      ],
      glossary: [
        { term: "Slash-команда", def: "Команда керування сесією в TUI, починається з `/`: `/help`, `/new`." },
        { term: "Промпт", def: "Звичайний текст-задача для агента: «Додай тест для login»." },
        { term: "Command palette", def: "Список дій сесії, контексту, моделі й tools; за документацією відкривається Ctrl+P або `?`." },
        { term: "Shell-режим", def: "`!` на порожньому рядку TUI: наступна команда виконується в shell напряму." },
        { term: "Робоче дерево чисте", def: "`working tree clean` у `git status`: незбережених змін немає." }
      ],
      quiz: [
        { question: "Що з цього — промпт, а не команда?", options: ["`/context`", "«Поясни, що робить src/auth.ts, нічого не змінюй»", "`git status`"], correct: 1, feedback: "Промпт — задача природною мовою. `/context` — slash-команда TUI, `git status` — команда shell." },
        { question: "Навіщо `git status` перед запуском агента?", options: ["Щоб потім відрізнити свої зміни від змін агента", "Щоб агент працював швидше", "Щоб увійти в акаунт xAI"], correct: 0, feedback: "Знаючи стан до сесії, після неї ти бачиш через `git diff` саме те, що зробив агент." },
        { question: "Ти забув назву slash-команди для контексту. Найшвидший спосіб знайти?", options: ["Перезапустити grok", "Ввести `/` або `/help` і пошукати в списку", "Вийти в zsh і ввести `man grok`"], correct: 1, feedback: "`/` показує підказки slash-команд, `/help` — повний перелік із гарячими клавішами; ще є palette через Ctrl+P або `?`." },
        { question: "Як вийти з TUI Grok?", options: ["`/quit` або `/exit`", "`exit()`", "Закрити ноутбук"], correct: 0, feedback: "`/quit` і його аліас `/exit` коректно виходять і зберігають сесію для продовження." },
        { question: "Чому запуск `grok` у домашній папці `~` — погана ідея?", options: ["Grok там не запускається", "Домашня папка лише для читання", "Агент отримує доступ до всіх твоїх файлів, а не до одного проєкту"], correct: 2, feedback: "Робоча папка визначає, що агент бачить і може змінити. Чим вужча — тим безпечніше." },
        { question: "Який режим дозволів діє після звичайного запуску `grok`?", options: ["Always-approve — без жодних запитань", "Ask — агент питає дозволу на дії, які ще не дозволені", "Лише читання, змінювати файли неможливо"], correct: 1, feedback: "За документацією xAI типовий режим — Ask. Інші режими вмикаються свідомо." }
      ]
    }
  ]
});
