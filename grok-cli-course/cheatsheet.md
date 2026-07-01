# Шпаргалка — Grok CLI

Команди з коротким поясненням. Деталі, ризики й сценарії — в [уроках курсу](README.md).

**Головна мета — не вивчити всі команди Grok CLI, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії.**

---

## Launch

```bash
which grok                      # шлях до бінарника
grok                            # запуск TUI в поточній папці
grok --help                     # довідка по прапорцях
git status                      # зміни перед/після агента
```

У TUI:

```
/                               # command palette — список slash-команд
```

---

## Sessions

```
/new                            # нова сесія, чистий контекст
/resume                         # продовжити попередню сесію
/sessions                       # список усіх сесій
/fork                           # гілка поточної сесії
/rename <title>                 # назва сесії
/share                          # URL сесії (⚠ без секретів)
/session-info                   # id, модель, режим
/home                           # welcome screen
/quit                           # вихід (alias /exit)
```

---

## Context

```
/context                        # % зайнятого context window
/plan                           # plan mode + session plan
/compact [context]              # стиснути історію (⚠ втрата деталей)
/compact-mode                   # щільніший UI (не контекст!)
/rewind                         # відкотити розмову (не git!)
/btw <question>                 # side-question без зламу флоу
/usage                          # tokens / credits сесії
```

`Shift+Tab` — перемикання session modes (Plan, Always-approve…)

---

## Model

```
/model [name]                   # активна модель Grok
/theme [name]                   # тема TUI
/multiline                      # багаторядковий ввід ON/OFF
/feedback [text]                # відгук в xAI (без секретів)
```

---

## Modes

```
/always-approve                 # ⚠ toggle без permission prompts
```

```bash
grok --always-approve           # ⚠ старт без prompts
```

```toml
# ~/.grok/config.toml
[ui]
permission_mode = "ask"         # default — безпечно
# permission_mode = "always-approve"  # ⚠ не для prod
```

```
/logout                         # вийти з xAI акаунта в CLI
```

---

## Extensions

```
/hooks                          # extensions modal → Hooks
/plugins                        # extensions modal → Plugins
/skills                         # extensions modal → Skills
/mcps                           # extensions modal → MCP
```

---

## Shell

```
/flush                          # conversation memory → disk
/memory                         # persistent memory search/edit
/dream                          # offline memory consolidation
/imagine <prompt>               # генерація зображення
/imagine-video <prompt>         # генерація відео
```

---

## Skills

```
/skills                         # список user-invocable skills
/<skill-name>                   # виклик skill (напр. /commit)
/<scope>:<skill-name>           # qualified (напр. /local:commit)
```

```bash
git status                      # перед /commit
git diff                        # перегляд змін агента
```

---

## Danger

| Команда / налаштування | Чому небезпечно |
|------------------------|-----------------|
| `/always-approve` | Tool calls без підтвердження |
| `grok --always-approve` | Те саме з моменту старту |
| `permission_mode = "always-approve"` | Глобально для всіх сесій |
| `/commit` без `git diff` | Закомітити зайве |
| `/share` | Витік коду/шляхів у URL |
| `/rewind` без `git checkout` | Плутанина: діалог відкочено, файли — ні |
| `/memory` з секретами | Секрети в майбутніх сесіях |

**Безпечний мінімум:** `git status` → `grok` → `permission_mode = ask` → `/plan` → `git diff` → ручний commit.

---

## Тренажер

[Інтерактивний тренажер →](../index.html)
