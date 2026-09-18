window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.cheatsheet = {
  sections: [
    { title: "Встановлення і запуск (shell)", rows: [
      { cmd: "curl -fsSL https://x.ai/cli/install.sh | bash", desc: "Офіційне встановлення (macOS/Linux/WSL); файл — `~/.grok/bin/grok`", risk: "medium" },
      { cmd: "which grok", desc: "Де лежить grok / чи є в PATH", risk: "low" },
      { cmd: "grok version", desc: "Версія Grok CLI", risk: "low" },
      { cmd: "grok --help", desc: "Підкоманди й прапорці твоєї версії", risk: "low" },
      { cmd: "grok update", desc: "Перевірити / встановити оновлення", risk: "medium" },
      { cmd: "git status", desc: "Стан репозиторію перед і після агента", risk: "low" },
      { cmd: "grok", desc: "Запустити TUI у поточній папці (типовий режим — Ask)", risk: "medium" },
      { cmd: "grok login / grok login --device-auth", desc: "Вхід в акаунт; кодом пристрою — без браузера", risk: "low" },
      { cmd: "grok logout", desc: "Вийти й очистити збережені облікові дані", risk: "medium" }
    ] },
    { title: "Довідка і вихід (TUI)", rows: [
      { cmd: "/", desc: "Підказки slash-команд (вигляд залежить від версії)", risk: "low" },
      { cmd: "Ctrl+P / ?", desc: "Command palette (за документацією xAI)", risk: "low", outsideTrainer: true },
      { cmd: "!git status", desc: "`!` на порожньому рядку — shell-режим: команда без участі агента", risk: "low" },
      { cmd: "/help", desc: "Усі команди й гарячі клавіші", risk: "low" },
      { cmd: "/quit (/exit)", desc: "Вийти в shell, сесія зберігається", risk: "low" },
      { cmd: "/logout", desc: "Вийти з акаунта в TUI", risk: "medium" }
    ] },
    { title: "Сесії", rows: [
      { cmd: "/new (/clear)", desc: "Нова сесія з чистим контекстом", risk: "low" },
      { cmd: "/rename <title> (/title)", desc: "Назва сесії, напр. `/rename fix-auth`", risk: "low" },
      { cmd: "/session-info", desc: "Інформація про поточну сесію (склад залежить від версії)", risk: "low" },
      { cmd: "/sessions", desc: "Перемкнути, перейменувати, закрити активні сесії", risk: "low" },
      { cmd: "/home", desc: "Стартовий екран, сесія не закривається", risk: "low" },
      { cmd: "/resume", desc: "Відновити попередню сесію зі списку", risk: "low" },
      { cmd: "grok -c / grok -r [ID]", desc: "З shell: продовжити найсвіжішу для папки / за ID", risk: "medium" },
      { cmd: "/fork", desc: "Відгалузити сесію в паралельного агента", risk: "low" },
      { cmd: "/share", desc: "URL на транскрипт — перевір, чи немає секретів", risk: "medium" },
      { cmd: "/export · grok export <session-id>", desc: "Експорт розмови у файл / Markdown", risk: "low" }
    ] },
    { title: "Контекст, план, відкат", rows: [
      { cmd: "/context", desc: "Скільки контекстного вікна зайнято", risk: "low" },
      { cmd: "/compact [context]", desc: "Стиснути історію; деталі можуть зникнути", risk: "medium" },
      { cmd: "/compact-mode", desc: "Лише щільніший вигляд UI", risk: "low" },
      { cmd: "/btw <question>", desc: "Побічне питання без переривання задачі", risk: "low" },
      { cmd: "/usage", desc: "Кредити й оплата", risk: "low" },
      { cmd: "/plan [description] · /view-plan", desc: "Plan mode: до схвалення edit tools змінюють лише план; bash — за режимом дозволів. Вихід — q або Shift+Tab", risk: "low" },
      { cmd: "/rewind", desc: "Відновити файли на диску й обрізати розмову до обраного промпту (також Esc Esc). Незакомічене після точки втрачається — спершу `git diff` і commit / stash", risk: "high" },
      { cmd: "git diff", desc: "Що реально змінено у файлах", risk: "low" },
      { cmd: "git stash", desc: "Відкласти зміни з можливістю повернути", risk: "medium" },
      { cmd: "git restore <файл>", desc: "Викинути незакомічені правки файлу — безповоротно", risk: "high" }
    ] },
    { title: "Модель і налаштування", rows: [
      { cmd: "grok models", desc: "Актуальний список моделей акаунта", risk: "low" },
      { cmd: "/model <name> (/m)", desc: "Перемкнути модель; назву бери з `grok models`", risk: "low" },
      { cmd: "grok -m <model>", desc: "Запуск з певною моделлю", risk: "medium" },
      { cmd: "/effort", desc: "Reasoning effort поточної моделі", risk: "low" },
      { cmd: "/theme (/t) · /multiline (/ml)", desc: "Тема; багаторядковий ввід", risk: "low" },
      { cmd: "/settings (/config)", desc: "Вікно налаштувань", risk: "medium" },
      { cmd: "/feedback [text]", desc: "Відгук про сесію — без секретів", risk: "low" }
    ] },
    { title: "Режими дозволів", rows: [
      { cmd: "Shift+Tab", desc: "Normal → Plan → Auto (якщо увімкнено) → Always-approve", risk: "medium", outsideTrainer: true },
      { cmd: "/auto", desc: "Auto mode: класифікатор схвалює безпечні tools, небезпечні можуть питати; є, лише коли функцію увімкнено", risk: "medium" },
      { cmd: "/always-approve", desc: "Без запитів на tool calls; діють лише deny-правила і hooks", risk: "high" },
      { cmd: "Ctrl+O", desc: "Перемкнути always-approve (в Apple Terminal — ще й interject)", risk: "high", outsideTrainer: true },
      { cmd: "grok --always-approve (--yolo)", desc: "Запуск без запитів — лише в ізоляції (контейнер, VM, `--sandbox`) після коміту", risk: "high" },
      { cmd: "grok --sandbox workspace", desc: "Пісочниця ОС для shell агента; також `read-only`, `strict`, `GROK_SANDBOX`, `[sandbox] profile`. Worktree — не пісочниця", risk: "medium" },
      { cmd: "cat ~/.grok/config.toml", desc: "Типовий режим `permission_mode` і правила", risk: "low" },
      { cmd: "permission_mode = \"ask\" | \"auto\" | \"always-approve\"", desc: "Рядок у `~/.grok/config.toml`, секція `[ui]`; старі `approval_mode`, `yolo` — нижчий пріоритет", risk: "medium", outsideTrainer: true },
      { cmd: "{ action = \"deny\", tool = \"bash\", pattern = \"rm -rf *\" }", desc: "Правило в `[permission] rules`; deny перемагає allow, але шаблон текстовий — `rm -fr` не зловить; hooks fail-open", risk: "medium", outsideTrainer: true }
    ] },
    { title: "Розширення", rows: [
      { cmd: "/hooks · /plugins · /marketplace · /skills · /mcps", desc: "Одне вікно extensions, різні вкладки", risk: "low" },
      { cmd: "grok inspect [--json]", desc: "Правила, skills, plugins, hooks, MCP, які знайдено", risk: "low" },
      { cmd: "grok mcp list", desc: "MCP-сервери", risk: "low" },
      { cmd: "grok plugin list", desc: "Встановлені plugins", risk: "low" },
      { cmd: "grok plugin install <name>", desc: "Встановити plugin — лише з перевіреного джерела (формат аргументу залежить від версії)", risk: "medium" },
      { cmd: "/hooks-trust", desc: "Довіритися папці: дозволити проєктні hooks, MCP і LSP (або `grok --trust`, `~/.grok/trusted_folders.toml`) — лише після перевірки репозиторію", risk: "high" }
    ] },
    { title: "Пам'ять і генерація", rows: [
      { cmd: "/remember <note>", desc: "Нотатка в пам'ять між сесіями — без секретів", risk: "medium" },
      { cmd: "/memory (/mem)", desc: "Переглянути й редагувати спогади", risk: "low" },
      { cmd: "/flush · /dream", desc: "Записати пам'ять на диск · консолідувати пам'ять", risk: "medium" },
      { cmd: "grok memory clear --workspace | --global | --all", desc: "Стерти файли пам'яті — безповоротно", risk: "high" },
      { cmd: "/imagine <prompt> · /imagine-video <prompt>", desc: "Зображення / відео; витрачає кредити", risk: "low" }
    ] },
    { title: "Skills і автоматизація", rows: [
      { cmd: "/<skill-name> · /local:commit", desc: "Skill як команда; кваліфіковане ім'я при конфлікті", risk: "medium" },
      { cmd: "git add -p", desc: "Додати зміни агента частинами", risk: "medium" },
      { cmd: "git log -1 --stat", desc: "Перевірити останній коміт", risk: "low" },
      { cmd: "git push --force", desc: "Перезапис історії на сервері; краще `--force-with-lease` у своїй гілці", risk: "high" },
      { cmd: "grok -p \"…\" [--output-format streaming-json]", desc: "Headless-запуск для скриптів (також `--single`; формати `plain`, `json`, `streaming-json`)", risk: "medium" },
      { cmd: "grok -p \"…\" --max-turns 5", desc: "Обмежити кількість кроків агента", risk: "medium" },
      { cmd: "grok -w [name]", desc: "Окремий worktree у `~/.grok/worktrees/…`: detached на HEAD, з незакоміченими змінами; shell не ізольовано", risk: "medium" },
      { cmd: "grok worktree list", desc: "Worktree, створені Grok", risk: "low" },
      { cmd: "grok worktree rm <id> · grok worktree gc", desc: "Видалити worktree / прибрати зниклі й давні — незакомічене в них зникне; спершу commit", risk: "high" }
    ] }
  ]
};
