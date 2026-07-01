# Grok CLI — Тренажер slash-команд

Інтерактивний HTML-тренажер команд **Grok CLI / TUI** українською за документацією xAI [Modes and Commands](https://docs.x.ai/build/modes-and-commands).

**Без API** — статичні `index.html` + `trainer.js`, працюють локально або на GitHub Pages.

## Швидкий старт

```bash
open index.html
```

## GitHub Pages

https://stszu.github.io/grok-cli-course/

## Сторінки

| Сторінка | Зміст |
|----------|--------|
| **index.html** | Емулятор TUI — 8 розділів, slash-команди, режим тестування |
| **course.html** | Markdown-уроки |
| **cheatsheet.html** | Шпаргалка команд |

## Розділи тренажера

1. Запуск і workflow — `grok`, `git status`, `/`
2. Сесії — `/new`, `/resume`, `/fork`, `/quit`
3. Контекст і план — `/context`, `/plan`, `/compact`, `/rewind`
4. Модель і UI — `/model`, `/theme`, `/multiline`
5. Режими і безпека — `/always-approve`, `grok --always-approve`
6. Extensions — `/hooks`, `/plugins`, `/skills`, `/mcps`
7. Shell commands — `/memory`, `/flush`, `/imagine`
8. Skills і ризики — `/commit`, `/local:commit`

## Принцип

> Головна мета — не вивчити всі команди Grok CLI, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії.

## Структура

```
grok-cli/
├── index.html
├── trainer.js
├── course.html
├── cheatsheet.html
├── grok-cli-course/    # Markdown-уроки
└── README.md
```

MIT
