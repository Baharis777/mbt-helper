# Session handoff

## Что это за проект

MBT Manager Assistant — внутренний экспертный ассистент для менеджеров MyBaliTrips. Это не chatbot и не энциклопедия туров. Цель — помогать менеджеру понять клиента, выбрать подходящий вариант, увидеть риски и определить следующий безопасный шаг.

## Что уже завершено

- Активный MVP сфокусирован на Mount Batur.
- Небатурные туры архивированы.
- Создана Batur knowledge architecture: family page, variants, matrix, audit.
- Создан manual source snapshot workflow.
- Созданы policies, live-status, rules, playbooks, checklists и examples.
- Создан постоянный sales methodology layer в `knowledge/sales/`.
- Реализован keyword-based knowledge search.
- Реализован deterministic client-message analysis.
- Реализовано базовое ранжирование Batur variant candidates по `variant-matrix.md`.
- Добавлены тестовые скрипты `test:knowledge` и `test:analysis`.

## Current scope

Только Mount Batur. Дополнительные туры не активны. UI, OpenAI API, CRM integration и автоматический scraping не входят в текущий этап.

## Какие файлы читать первыми

1. `docs/README.md`
2. `docs/project-vision.md`
3. `docs/project-state.md`
4. `docs/current-priorities.md`
5. `docs/architecture.md`
6. `docs/client-analysis.md`
7. `knowledge/sales/README.md`
8. `knowledge/tours/batur-sunrise/variant-matrix.md`
9. `lib/analyzeClientMessage.ts`
10. `lib/recommendBaturVariant.ts`

## Где хранятся product facts

Product facts хранятся в:

- `knowledge/tours/batur-sunrise/page.md`
- `knowledge/tours/batur-sunrise/variant-matrix.md`
- `knowledge/tours/batur-sunrise/variants/*.md`
- `knowledge/policies/*.md`
- `knowledge/live-status/batur.md`

Факты со статусом `NEEDS_REVIEW`, `needs_review` или `needs_import` нельзя использовать как подтвержденные.

## Где хранятся sales principles

Sales principles и manager methodology хранятся в `knowledge/sales/`, особенно:

- `knowledge/sales/sales-principles.md`
- `knowledge/sales/communication-style.md`
- `knowledge/sales/qualification-strategy.md`
- `knowledge/sales/recommendation-strategy.md`

Этот слой не подтверждает продуктовые факты.

## Где хранятся decision rules

Decision rules хранятся в:

- `knowledge/rules/batur-recommendation-rules.md`
- `docs/batur-decision-flow.md`
- кодовом слое `lib/recommendBaturVariant.ts`
- кодовом слое `lib/getNextBestAction.ts`

Правила должны работать по подтвержденным свойствам, а не придумывать свойства.

## Где хранятся raw imports

Raw imports находятся в `knowledge/imports/`:

- `batur-source-snapshot.md`
- `batur-import-notes.md`
- `mbt-chat-insights.md`

Raw imports являются источниками для переработки. Их нельзя представлять как утвержденную operational knowledge без проверки.

## Какие факты нельзя придумывать

Нельзя выдумывать:

- цены;
- доступность;
- текущую безопасность;
- открытость маршрута;
- факт проведения тура;
- точные pickup times;
- включения и исключения;
- правила отмены и оплаты;
- формат private/group;
- наличие hot springs;
- возрастные и health restrictions;
- точные названия вариантов на сайте.

## Текущая незавершенная задача

Текущая задача — валидация sales methodology layer и structured client-message analysis layer на реальных менеджерских сценариях. После этого нужно заполнить или подтвердить variant facts в `variant-matrix.md`, чтобы ranking мог выдавать более сильные рекомендации.

## Что новому сеансу сделать первым

1. Прочитать `docs/README.md` и этот файл.
2. Сверить документацию с реальными файлами репозитория.
3. Проверить `docs/current-priorities.md`.
4. Не менять product facts без подтвержденного источника.
5. Продолжить с immediate priority.

## Как тестировать изменения

Запускать:

```bash
npm run test:analysis
npm run test:knowledge
```

Если `tsx` не может создать IPC pipe в sandbox, запустить тесты с разрешением вне sandbox.

## Какие документы обновлять после крупных изменений

- `docs/project-state.md`
- `docs/current-priorities.md`
- `docs/session-handoff.md`
- `docs/decision-log.md`
- `docs/roadmap.md`
- `docs/documentation-maintenance.md`, если меняются правила поддержки документации.

## Startup prompt для нового Codex session

```text
Read docs/README.md and docs/session-handoff.md, inspect the repository, verify the stated project status against the actual files, then continue with the immediate priority from docs/current-priorities.md. Do not invent product facts or change confirmed business rules.
```
