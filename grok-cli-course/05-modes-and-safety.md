# Урок 5 — Режими і безпека

## Про що цей урок

**Always-approve** прибирає підтвердження на tool calls — швидше, але небезпечно. Налаштування `permission_mode` у `~/.grok/config.toml` і `/logout` на спільних машинах.

**Головна мета — не вивчити всі команди Grok CLI, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії.**

---

## Permission modes

| Режим | Поведінка | Коли |
|-------|-----------|------|
| `ask` (default) | Підтвердження на кожен tool call | Щоденна робота, продакшн-код |
| `always-approve` | Без prompts — агент виконує tools одразу | Лише ізольоване sandbox-оточення |

**Plan mode** (`/plan`, `Shift+Tab`) — інший тип безпеки: блокує write-tools до схвалення плану.

---

## Команди і налаштування

### `/always-approve`

| | |
|---|---|
| **Що робить** | Toggle always-approve mode в активній TUI-сесії |
| **Коли** | **Рідко.** Лише коли свідомо приймаєш ризик |
| **Приклад** | `/always-approve` |
| **Результат** | `⚠ Always-approve ON` або `✓ Always-approve OFF` |
| **Помилки** | Легко увімкнути випадково — перевір індикатор у TUI |
| **Ризик** | **ВИСОКИЙ** — `rm`, `git push`, зміна конфігів без твого «так» |

---

### `grok --always-approve`

| | |
|---|---|
| **Що робить** | Запускає TUI одразу в always-approve mode |
| **Коли** | Автоматизація в CI/sandbox (якщо взагалі потрібно) |
| **Приклад** | `grok --always-approve` |
| **Результат** | TUI стартує без permission prompts |
| **Помилки** | `grok --help` — перевір інші прапорці |
| **Ризик** | **ВИСОКИЙ** |

---

### `permission_mode` у `~/.grok/config.toml`

| | |
|---|---|
| **Що робить** | Задає default permission behavior для всіх сесій |
| **Коли** | Хочеш стабільну політику без toggle кожного разу |
| **Приклад** | Див. блок нижче |
| **Результат** | `ask` — prompts; `always-approve` — без них |
| **Помилки** | Файл у **глобальному** `~/.grok/`, не в проєктному `.grok/` |
| **Ризик** | **ВИСОКИЙ** при `always-approve` |

```toml
# ~/.grok/config.toml
[ui]
permission_mode = "ask"
# permission_mode = "always-approve"  # ⚠ не для щоденної роботи
```

Legacy keys `approval_mode` і `yolo = true` ще приймаються, але **`permission_mode` має пріоритет**.

---

### `/logout`

| | |
|---|---|
| **Що робить** | Вихід з поточного xAI акаунта в CLI |
| **Коли** | Спільний комп'ютер; передача ноутбука; зміна акаунта |
| **Приклад** | `/logout` |
| **Результат** | `✓ Logged out` — наступний `grok` попросить login |
| **Помилки** | — |
| **Ризик** | **Низький** |

---

## Три рівні «швидкості vs безпеки»

```
Найбезпечніше:  permission_mode = "ask"  +  /plan  +  git status
Швидше:         /always-approve в одній сесії (тимчасово)
Небезпечно:     grok --always-approve  +  permission_mode = "always-approve"
```

---

## Сценарій: безпечний день розробника

```bash
git status
grok
# permission_mode = ask — на кожен write tool дивишся, що саме змінюється
/plan
# після реалізації:
git diff
git add -p
git commit -m "feat: ..."
```

**Ніколи** не комбінуй always-approve з продакшн-репозиторієм без git backup.

---

## Практичне завдання

1. `grok --help` — знайди `--always-approve`. Запиши, чому не варто використовувати щодня.
2. Перевір `~/.grok/config.toml` — яке `permission_mode`? Якщо файлу немає — за замовчуванням `ask`.
3. У TUI: `/always-approve` ON → одразу `/always-approve` OFF.
4. `/plan` — порівняй з always-approve: що безпечніше для першого контакту з новим репо?
5. **Тренажер:** модуль «5. Режими і безпека».

---

## Міні-чекліст

- [ ] Default — `permission_mode = "ask"`
- [ ] `/always-approve` вимкнений після експерименту
- [ ] Не запускаю `grok --always-approve` на важливих репо
- [ ] `/plan` перед великими змінами
- [ ] `/logout` на спільній машині
