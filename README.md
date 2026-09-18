# Grok CLI (Grok Build) — курс і тренажер

Курс і тренажер **Grok CLI / TUI** українською за документацією xAI: [Modes and Commands](https://docs.x.ai/build/modes-and-commands), [Permissions](https://docs.x.ai/build/features/permissions), [CLI Reference](https://docs.x.ai/build/cli/reference).

**Без API і без збірки** — статичні файли, працюють з `file://` або на GitHub Pages.

## Шви## Сторінки

| Файл | Зміст |
|------|--------|
| **index.html** | Курс: 8 модулів, 13 уроків, quiz, фінальний іспит, шпаргалка, словник (генерується з `course-config.js` і `lessons/*.js`) |
| **trainer.html** | Тренажер-пісочниця: емуляція TUI і zsh, 8 розділів, строгий матчинг, тест-режим |
| course.html, cheatsheet.html | Редиректи на `index.html#/modules` і `index.html#/cheatsheet` |
| grok-cli-course/ | Архів попередніх Markdown-уроків |

## Модулі

1. Запуск і перший сеанс — встановлення, `grok --help`, `git status`, `/help`
2. Сесії — `/new`, `/rename`, `/sessions`, `grok -c`, `/fork`, `/share`
3. Контекст, план і відкат — `/context`, `/compact`, `/plan`, `/rewind`, `git diff`
4. Модель і налаштування — `grok models`, `/model`, `/effort`
5. Режими дозволів — Ask, Plan, `/auto`, `/always-approve`, `permission_mode`, allow/deny
6. Розширення — `/hooks`, `/plugins`, `/marketplace`, `/skills`, `/mcps`, `grok inspect`
7. Пам'ять і генерація — `/remember`, `/memory`, `/flush`, `/dream`, `/imagine`
8. Skills і безпечний workflow — `/local:commit`, `git log -1 --stat`, `grok -p`, `grok -w`

. Shell commands — `/memory`, `/flush`, `/imagine`
8. Skills і ризики — `/commit`, `/local:commit`

## Принцип

> Головна мета — не вивчити всі команди Grok CLI, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії.

## Структура

```
grok-cli/
├── index.html          # оболонка курсу (генерується)
├── course-config.js
├── lessons/            # m01–m08, exam, cheatsheet
├── engine/             # копія рушія hub (sync-engine.sh)
├── trainer.html + trainer.js
├── course.html, cheatsheet.html   # редиректи
├── grok-cli-course/    # архів Markdown-уроків
└── README.md
```

MIT