# Урок 8 — Skills і ризики

## Про що цей урок

User-invocable **skills** з'являються як slash-команди (`/commit`). Qualified names (`/local:commit`) при конфлікті імен. Безпечний workflow: git, plan mode, без always-approve.

**Головна мета — не вивчити всі команди Grok CLI, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії.**

---

## Skills як slash-команди

Будь-який user-invocable skill може бути доступний як:

```
/<skill-name>
```

Приклади (якщо встановлено):

- `/commit` — workflow коміту
- `/review` — code review skill

Повний список — `/skills` у extensions modal.

---

## Qualified names

Якщо два skills мають однакове ім'я (local vs global):

```
/local:commit
```

Формат: `/<scope>:<skill-name>` — однозначний виклик без плутанини.

---

## Команди

### `/skills`

| | |
|---|---|
| **Що робить** | Список skills + extensions modal |
| **Коли** | Дізнатися, які `/...` workflow доступні |
| **Приклад** | `/skills` |
| **Результат** | `User-invocable: /commit, /review` |
| **Помилки** | Порожній список — skills не встановлені |
| **Ризик** | **Низький** (перегляд) |

---

### `/commit`

| | |
|---|---|
| **Що робить** | Викликає skill commit workflow (якщо встановлено) |
| **Коли** | Стандартизований коміт після роботи агента |
| **Приклад** | `/commit` |
| **Результат** | Skill runs: stage, message, commit (залежить від skill) |
| **Помилки** | Skill не знайдено — встанови через plugins/skills |
| **Ризик** | **Середній–високий** — може закомітити не те, що ти очікуєш |

---

### `/local:commit`

| | |
|---|---|
| **Що робить** | Викликає skill `commit` з scope `local` |
| **Коли** | Конфлікт імен між local і global skill |
| **Приклад** | `/local:commit` |
| **Результат** | Qualified skill invoked |
| **Помилки** | Невірний scope — skill not found |
| **Ризик** | **Середній–високий** — як `/commit` |

---

### `git status` (shell, не skill)

| | |
|---|---|
| **Що робить** | Перевірка змін перед і після skill |
| **Коли** | **Завжди** навколо `/commit` |
| **Приклад** | `git status` → `/commit` → `git log -1` |
| **Результат** | Контроль staged files |
| **Помилки** | — |
| **Ризик** | **Низький** |

---

## Безпечний workflow з skills

```
git status                    # shell: що змінено?
/plan                         # план перед правками
# ... агент працює з ask mode ...
git diff                      # shell: перегляд ВСІХ змін
/skills                       # який commit skill активний?
/commit                       # або ручний git add -p && git commit
git log -1 --stat             # перевірка коміту
```

**Не роби:** `grok --always-approve` → `/commit` на гілці `main` без `git diff`.

---

## Матриця ризиків

| Дія | Ризик | Захист |
|-----|-------|--------|
| `/commit` | Середній–високий | `git diff`, `git add -p` |
| `/always-approve` + skill | **Високий** | Вимкни; `permission_mode = ask` |
| `/share` після skill | Середній | Без секретів у транскрипті |
| `/memory` + skill prefs | Середній | Аудит `/memory` |

---

## Сценарій: коміт після агента

```bash
# у shell після /quit або в другому терміналі:
git status
git diff

# у grok:
/skills
# якщо є /commit — переконайся в message convention skill
/commit
```

Якщо skill зробив зайве — `git reset --soft HEAD~1` (якщо знаєш, що робиш).

---

## Практичне завдання

1. `git status` у тестовому репо.
2. `grok` → `/skills` — які skills доступні в емуляції/у тебе локально?
3. Поясни різницю `/commit` і `/local:commit` одним реченням.
4. Опиши свій «безпечний ланцюжок» з 5 кроків (git + slash).
5. **Тренажер:** модуль «8. Skills і ризики» + режим тестування.

---

## Міні-чекліст

- [ ] Перед `/commit` — `git status` і `git diff`
- [ ] `/skills` — знаю, який skill викликаю
- [ ] При конфлікті імен — `/local:...` або qualified form
- [ ] `permission_mode = ask` для skill workflows
- [ ] Не покладаюсь на skill замість code review людиною
