window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m05", order: 5, title: "Режими дозволів і безпека", subtitle: "Ask, Plan, Auto (/auto), Always-approve, правила allow/deny", icon: "shield",
  goal: "Після модуля ти обираєш режим дозволів під задачу, розумієш ризик /auto і /always-approve і налаштовуєш типовий режим та правила в config.toml.",
  lessons: [
    {
      id: "m05-l01", title: "Чотири режими: Ask, Plan, Auto, Always-approve", minutes: 12,
      steps: [
        { type: "story", title: "Сто разів натиснути «так»",
          body: "<p>Агент питає дозволу на кожне читання файлу і кожен <code>npm test</code>. Після двадцятого запиту хочеться вимкнути всі питання. Саме тут трапляються аварії: разом із безпечними діями без питань проходять і небезпечні.</p><p>Grok пропонує кілька рівнів довіри — треба знати, що саме кожен вимикає.</p>" },
        { type: "concept", title: "Режими і що вони означають",
          body: "<table><thead><tr><th>Режим</th><th>Що відбувається</th><th>Ризик</th></tr></thead><tbody><tr><td>Ask (типовий)</td><td>Питає про все, що не дозволено правилами</td><td>низький</td></tr><tr><td>Plan</td><td>До схвалення плану edit tools змінюють лише файл плану; bash — за режимом дозволів</td><td>низький</td></tr><tr><td>Auto (<code>/auto</code>)</td><td>Класифікатор сам схвалює безпечні tools, небезпечні можуть питати</td><td>середній</td></tr><tr><td>Always-approve</td><td>Tool calls без запитів; діють лише deny-правила і hooks</td><td>високий</td></tr></tbody></table><p><span class=\"kbd\">Shift</span> + <span class=\"kbd\">Tab</span> перемикає по колу: Normal → Plan → Auto → Always-approve. Auto і команда <code>/auto</code> з'являються лише тоді, коли функцію auto mode увімкнено для твого акаунта чи версії — інакше коло без Auto.</p>",
          analogy: "Ask — охоронець перевіряє кожну перепустку. Auto — охоронець пропускає знайомих кур'єрів сам, а незнайомих зупиняє, але може й помилитися. Always-approve — двері навстіж: зайде будь-хто, кого не внесено в чорний список (deny-правила)." },
        { type: "cli", title: "Перемикання режимів у TUI",
          commands: [
            { cmd: "/auto", explain: "Вмикає або вимикає Auto mode з класифікатором ризику (команда доступна, лише коли функцію auto mode увімкнено). Класифікатор може помилитися, тому ризик середній.", output: "● Auto mode ON — класифікатор схвалює безпечні tools", risk: "medium" },
            { cmd: "/always-approve", explain: "Вмикає або вимикає режим без запитів. Агент зможе видаляти, пушити, міняти конфіги без твого «так». Те саме — <span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">O</span> (в Apple Terminal ця клавіша ще й перериває агента — interject).", risk: "high" },
            { cmd: "grok --always-approve", explain: "Запуск одразу в цьому режимі; аліас прапорця — <code>--yolo</code>.", risk: "high" },
            { cmd: "grok --sandbox workspace", explain: "Запуск з пісочницею ОС для shell-команд агента: писати можна лише в поточну папку, <code>~/.grok/</code> і temp. Інші профілі — <code>read-only</code>, <code>strict</code>; те саме через <code>GROK_SANDBOX=workspace</code> або <code>[sandbox] profile</code> у <code>~/.grok/config.toml</code>.", risk: "medium" }
          ] },
        { type: "callout", variant: "danger", title: "Always-approve: без права на «ні»",
          body: "<p>У режимі Always-approve агент виконує shell-команди й правки без запитів. Помилка моделі або шкідлива інструкція у файлі проєкту — і <code>rm</code>, <code>git push --force</code> чи зміна конфігурації стануться без тебе. Це може бути незворотним.</p><p>Безпечна альтернатива: <code>/auto</code> або Ask з allow-правилами для рутинних команд (<code>git status</code>, тести). Always-approve — лише в ізольованому середовищі (контейнер, VM або <code>--sandbox workspace</code> / <code>read-only</code> / <code>strict</code>) і після коміту. Окремий worktree <strong>не</strong> ізолює: shell агента бачить увесь диск. На macOS профілі <code>read-only</code> і <code>strict</code> не блокують мережу дочірніх процесів — це працює лише на Linux.</p>" },
        { type: "terminal", title: "Спробуй: Auto mode",
          task: "Тобі набридли запити на безпечні дії, але небезпечні ти хочеш і далі бачити. Увімкни відповідний режим.",
          expected: ["/auto"], output: "● Auto mode ON — класифікатор схвалює безпечні tools\nНебезпечні дії можуть і далі питати дозволу",
          hint: "Slash і коротке слово «автоматично».",
          explain: "Auto — компроміс: рутина без питань, ризиковане — з запитом. Повторний `/auto` повертає Ask." },
        { type: "check", title: "Auto чи Always-approve",
          question: "Чим `/auto` безпечніший за `/always-approve`?",
          options: ["Нічим, це синоніми", "У Auto класифікатор пропускає лише безпечні tools, небезпечні можуть питати; Always-approve пропускає все, крім deny-правил", "Auto вимикає агента"],
          correct: 1, feedback: "Always-approve знімає запити повністю. Auto залишає «фільтр», хоч і не ідеальний." },
        { type: "terminal", title: "Спробуй: вимкни ризикований режим",
          task: "Ти помітив, що в сесії ввімкнено Always-approve. Вимкни його тією самою slash-командою.",
          expected: ["/always-approve"], output: "✓ Always-approve OFF → Ask",
          hint: "Команда-перемикач: та сама, що вмикає.",
          explain: "`/always-approve` працює як вимикач. Після вимкнення агент знову питає дозволу." },
        { type: "check", title: "Режими не складаються",
          question: "Увімкнено Always-approve, і ти вводиш `/auto`. Що станеться?",
          options: ["Діятимуть обидва режими одночасно", "Нічого", "Режим перемкнеться на Auto — режими не складаються"],
          correct: 2, feedback: "За документацією `/auto` при ввімкненому always-approve (і навпаки) перемикає режим, а не додає." },
        { type: "summary", title: "Підсумок",
          points: ["Ask — типовий режим; Plan — спершу план.", "`/auto` — класифікатор схвалює безпечне, ризик середній; є, лише коли auto mode увімкнено.", "`/always-approve`, Ctrl+O, `grok --always-approve` / `--yolo` — ризик високий: лише в ізоляції (контейнер, VM, `--sandbox`) і після коміту; worktree — не ізоляція.", "Shift+Tab: Normal → Plan → Auto → Always-approve; режими не складаються."] }
      ],
      glossary: [
        { term: "Ask", def: "Типовий режим дозволів: запит на все, що не дозволено правилами." },
        { term: "Auto mode", def: "Класифікатор автоматично схвалює безпечні tools: `/auto`." },
        { term: "Always-approve", def: "Режим без запитів; діють лише deny-правила і hooks. Прапорці `--always-approve`, `--yolo`." },
        { term: "Класифікатор", def: "Модель, що оцінює, чи безпечна дія агента." },
        { term: "Sandbox", def: "Обмеження ОС для shell-команд агента: `--sandbox workspace | read-only | strict`, `GROK_SANDBOX`, `[sandbox] profile`." }
      ],
      quiz: [
        { question: "Який режим дозволів типовий у Grok CLI?", options: ["Always-approve", "Auto", "Ask — запит на все, що не дозволено"], correct: 2, feedback: "За документацією xAI типовий режим — Ask." },
        { question: "Новий незнайомий репозиторій. Який старт найбезпечніший?", options: ["Ask або Plan після `git status`", "`grok --yolo`", "Always-approve, щоб швидше"], correct: 0, feedback: "У новому коді ти ще не знаєш, що там — спершу план і запити." },
        { question: "Що з цього теж вмикає always-approve?", options: ["`/plan`", "`--yolo` під час запуску або Ctrl+O у TUI", "`/auto`"], correct: 1, feedback: "`--yolo` — аліас `--always-approve`; Ctrl+O — гаряча клавіша режиму." },
        { question: "Що все ще діє в режимі Always-approve?", options: ["Нічого", "Лише plan mode", "Deny-правила і PreToolUse hooks"], correct: 2, feedback: "Документація: always-approve схвалює tool calls, але deny-правила і hooks працюють. Пам'ятай: hooks fail-open — якщо hook впав чи завис, дію буде виконано." },
        { question: "Чому `/auto` має середній, а не низький ризик?", options: ["Класифікатор може помилково визнати дію безпечною", "Він видаляє файли", "Він відкриває доступ з інтернету"], correct: 0, feedback: "Автоматика не бездоганна. Git і перегляд `git diff` лишаються обов'язковими." },
        { question: "Коли Always-approve хоч якось виправданий?", options: ["У продакшн-репозиторії на `main`", "На спільному сервері", "В ізольованому середовищі (контейнер, VM, `--sandbox`) після коміту"], correct: 2, feedback: "Ізоляція і коміт обмежують шкоду. Worktree розводить лише файли репозиторію — shell агента він не обмежує." }
      ]
    },
    {
      id: "m05-l02", title: "Налаштування дозволів і акаунт", minutes: 11,
      steps: [
        { type: "story", title: "Щоб не вмикати режим щоразу",
          body: "<p>Ти щодня працюєш з Grok і хочеш, щоб <code>git status</code> і тести проходили без запитів, а <code>rm -rf</code> — ніколи. Для цього є типовий режим і правила allow/deny у конфігу.</p>" },
        { type: "concept", title: "config.toml: режим і правила",
          body: "<p>Типовий режим задається лише в користувацькому конфігу <code>~/.grok/config.toml</code>, секція <code>[ui]</code>, ключ <code>permission_mode</code> зі значенням <code>\"ask\"</code>, <code>\"auto\"</code> або <code>\"always-approve\"</code>. Старі ключі <code>approval_mode</code> і <code>yolo = true</code> ще приймаються, але <code>permission_mode</code> має пріоритет.</p><p>Правила — у секції <code>[permission]</code>: <code>{ action = \"allow\", tool = \"bash\", pattern = \"git *\" }</code>. <strong>Deny завжди перемагає allow.</strong> Але шаблон — це текст із <code>*</code>, а не розуміння команди: deny <code>rm -rf *</code> не зловить <code>rm -fr build</code> чи <code>rm -r -f build</code>. А PreToolUse hooks працюють за принципом fail-open: якщо hook упав, завис або повернув некоректну відповідь, tool call виконається — блокує лише явний <code>deny</code>.</p>",
          analogy: "Правила — як список гостей на вході: allow — «ці проходять без питань», deny — «цих не пускати ніколи». Якщо людина в обох списках, охоронець не пускає: заборона сильніша." },
        { type: "cli", title: "Перевірити конфіг і акаунт",
          commands: [
            { cmd: "cat ~/.grok/config.toml", explain: "Показати вміст конфігу: <code>permission_mode</code>, правила. Лише читає.", output: "[ui]\npermission_mode = \"ask\"", risk: "low" },
            { cmd: "grok login", explain: "Вхід в акаунт xAI. <code>--device-auth</code> — вхід кодом пристрою, коли браузера немає.", risk: "low" },
            { cmd: "grok logout", explain: "Вихід і очищення збережених облікових даних. Потім знову потрібен вхід.", risk: "medium" },
            { cmd: "/logout", explain: "Вихід з акаунта всередині TUI.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: який типовий режим?",
          task: "Подивись вміст користувацького конфігу Grok, щоб дізнатися типовий режим дозволів.",
          prompt: "Stas@MacBook-Pro demo %",
          expected: ["cat ~/.grok/config.toml", "cat /Users/Stas/.grok/config.toml"], output: "[ui]\npermission_mode = \"ask\"\n\n[permission]\nrules = [\n  { action = \"allow\", tool = \"bash\", pattern = \"git *\" },\n  { action = \"deny\",  tool = \"bash\", pattern = \"rm -rf *\" },\n]",
          hint: "Виведи файл `config.toml` з прихованої папки `.grok` у домашній.",
          explain: "Тут типовий режим Ask, git-команди дозволено без запитів, а команди, що збігаються з шаблоном `rm -rf *`, заборонено навіть в always-approve. Варіанти на кшталт `rm -fr` цей шаблон не ловить." },
        { type: "check", title: "Хто переможе",
          question: "Є правило allow для `bash` з шаблоном `*` і deny для `rm -rf *`. Агент хоче виконати `rm -rf build`. Що буде?",
          options: ["Виконається — allow `*` ширше", "Заборонено: deny завжди перемагає allow", "Grok спитає модель"],
          correct: 1, feedback: "У Grok deny завжди виграє в allow, незалежно від порядку." },
        { type: "callout", variant: "danger", title: "Не став always-approve типовим",
          body: "<p><code>permission_mode = \"always-approve\"</code> (або старе <code>yolo = true</code>) вмикає режим без запитів у <strong>кожній</strong> сесії, у кожному проєкті — і про це легко забути. Наслідки дій агента можуть бути незворотні.</p><p>Безпечніше: типово <code>\"ask\"</code> або <code>\"auto\"</code> плюс allow-правила для рутинних команд і deny для руйнівних.</p>" },
        { type: "terminal", title: "Спробуй: вийди з акаунта",
          task: "Ти працював на спільному комп'ютері. З shell вийди з акаунта xAI і очисти збережені облікові дані.",
          prompt: "Stas@MacBook-Pro demo %",
          expected: ["grok logout"], output: "✓ Signed out, cached credentials cleared",
          hint: "Підкоманда grok зі словом «вийти з системи».",
          explain: "Наступний запуск попросить увійти знову. На своєму ноутбуці це не потрібно, на чужому — обов'язково." },
        { type: "check", title: "Старі ключі",
          question: "У конфігу є і `yolo = true`, і `permission_mode = \"ask\"`. Який режим діятиме?",
          options: ["Always-approve, бо `yolo` старший", "Жоден — конфіг зламано", "Ask: `permission_mode` має пріоритет над старими ключами"],
          correct: 2, feedback: "Документація: legacy `approval_mode` і `yolo` приймаються, але `permission_mode` важливіший. Старий ключ краще видалити, щоб не плутатися." },
        { type: "summary", title: "Підсумок",
          points: ["Типовий режим — `permission_mode` у `~/.grok/config.toml` (`ask` | `auto` | `always-approve`).", "`approval_mode` і `yolo` — застарілі ключі; `permission_mode` має пріоритет.", "Правила `[permission]`: allow для рутини, deny для руйнівного; deny перемагає.", "`grok logout` / `/logout` — на спільних машинах."] }
      ],
      glossary: [
        { term: "config.toml", def: "Користувацький конфіг Grok: `~/.grok/config.toml`." },
        { term: "permission_mode", def: "Ключ секції `[ui]`, що задає типовий режим дозволів." },
        { term: "Правило allow/deny", def: "Дозвіл або заборона tool за шаблоном; deny сильніший." }
      ],
      quiz: [
        { question: "Де задається типовий режим дозволів?", options: ["У `~/.grok/config.toml`, ключ `permission_mode` у `[ui]`", "У `.bashrc`", "У файлі README проєкту"], correct: 0, feedback: "Документація: типовий режим — лише в користувацькому конфігу." },
        { question: "Хочеш, щоб `git status` виконувався без запитів, а решта — з запитами. Що налаштувати?", options: ["`permission_mode = \"always-approve\"`", "Allow-правило для `bash` з шаблоном `git *` у режимі Ask", "Нічого не можна зробити"], correct: 1, feedback: "Allow-правило точково знімає запити для рутини, не відкриваючи все інше." },
        { question: "Що означає `yolo = true` у старому конфігу?", options: ["Режим plan", "Темна тема", "Застарілий спосіб увімкнути always-approve"], correct: 2, feedback: "`yolo` — legacy-ключ; сьогодні — `permission_mode`, а ризик той самий: високий." },
        { question: "Є deny-правило для `bash` з шаблоном `rm -rf *`. Агент в always-approve запускає `rm -fr build`. Що буде?", options: ["Заблокується — deny діє завжди", "Може виконатися: шаблон збігається з текстом команди, а `rm -fr` — інший текст", "Grok спитає модель"], correct: 1, feedback: "Deny перемагає allow лише коли шаблон збігся. Руйнівні варіанти пиши кількома правилами і не покладайся на них як на єдиний захист — потрібні коміт і пісочниця." },
        { question: "Навіщо `grok login --device-auth`?", options: ["Щоб увійти без пароля назавжди", "Щоб увійти кодом пристрою там, де немає браузера", "Щоб увімкнути always-approve"], correct: 1, feedback: "Device-code авторизація потрібна на серверах і в headless-середовищах." },
        { question: "Який ризик у `grok logout`?", options: ["Високий — видаляє проєкт", "Низький — нічого не змінює", "Середній — стирає збережені облікові дані, потім потрібен повторний вхід"], correct: 2, feedback: "Код не зачіпається, але стан входу змінюється — оборотно через `grok login`." }
      ]
    }
  ]
});
