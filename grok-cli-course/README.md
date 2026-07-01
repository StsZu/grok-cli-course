# Grok CLI — Курс slash-команд і workflow

Практичний курс **Grok CLI** (xAI TUI) українською: запуск, сесії, контекст, режими, extensions, shell-команди та безпечний workflow з skills.

**Головна мета — не вивчити всі команди Grok CLI, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії.**

## Швидкий старт

```bash
# Перевірка встановлення
which grok

# Запуск TUI в папці проєкту
cd ~/Projects/my-app
grok
```

У TUI введи `/` — відкриється command palette зі slash-командами.

## Тренажер

Інтерактивна емуляція TUI без API:

**[Відкрити тренажер →](../index.html)**

Тренажер повторює 8 модулів курсу: прогрес по командах, українські підказки, режим тестування.

## Уроки

| № | Урок | Зміст |
|---|------|-------|
| 1 | [Запуск і workflow](01-launch-and-workflow.md) | `which grok`, `grok`, `grok --help`, `git status`, `/` |
| 2 | [Сесії](02-sessions.md) | `/new`, `/resume`, `/sessions`, `/fork`, `/rename`, `/share`, `/session-info`, `/quit`, `/home` |
| 3 | [Контекст і план](03-context-and-plan.md) | `/context`, `/plan`, `/compact`, `/compact-mode`, `/rewind`, `/btw`, `/usage` |
| 4 | [Модель і UI](04-model-and-ui.md) | `/model`, `/theme`, `/multiline`, `/feedback` |
| 5 | [Режими і безпека](05-modes-and-safety.md) | `/always-approve`, `grok --always-approve`, `permission_mode`, `/logout` |
| 6 | [Extensions](06-extensions.md) | `/hooks`, `/plugins`, `/skills`, `/mcps` |
| 7 | [Shell-команди](07-shell-commands.md) | `/flush`, `/memory`, `/dream`, `/imagine`, `/imagine-video` |
| 8 | [Skills і ризики](08-skills-and-risks.md) | skills як `/commit`, `/local:commit`, безпечний workflow |
| — | [Шпаргалка](cheatsheet.md) | Усі команди в одному місці |

## Для кого

Розробники, які працюють з Grok CLI в терміналі: агентні задачі в репозиторії, планування перед змінами, керування сесіями та контекстом.

## Рекомендований workflow

1. `git status` — перевір зміни перед агентом
2. `grok` — запуск TUI в корені проєкту
3. `/context` — скільки місця в context window
4. `/plan` або `Shift+Tab` — план перед правками
5. Після довгої сесії — `/compact` або `/fork`
6. Перед виходом — `git diff` і commit вручну (не покладайся на always-approve)

## Джерела

- [Modes and Commands (xAI)](https://docs.x.ai/build/modes-and-commands)
- [Settings (xAI)](https://docs.x.ai/build/settings)
- [Grok CLI](https://x.ai/cli)

## Ліцензія

MIT
