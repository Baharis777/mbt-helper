# Session handoff

## Для будущего AI assistant

Этот репозиторий уже содержит архитектуру Batur-only MVP. Не нужно читать старые чаты, чтобы продолжить. Начни с `docs/README.md`, затем прочитай документы в указанном порядке.

## Что уже сделано

- Создана Batur-only knowledge architecture.
- Небатурные туры архивированы.
- Созданы Batur family page, variant files и matrix.
- Создан manual source snapshot workflow.
- Созданы policies, live-status, rules, playbooks, checklists и conversation examples.
- Реализован простой keyword search по markdown.
- Добавлены npm scripts:
  - `npm run test:knowledge`
  - `npm run import:batur:snapshot`

## Что никогда не менять без явного запроса

- Не добавлять OpenAI API.
- Не добавлять UI.
- Не скрапить сайт автоматически.
- Не выдумывать цены, включения, трансфер, cancellation rules, availability или safety status.
- Не превращать проект в tour encyclopedia.
- Не смешивать facts, decision rules, manager logic и examples.
- Не подтверждать safety из статической страницы.

## Самые важные файлы

- `docs/project-state.md`
- `docs/architecture.md`
- `docs/current-priorities.md`
- `knowledge/tours/batur-sunrise/variant-matrix.md`
- `knowledge/tours/batur-sunrise/page.md`
- `knowledge/tours/batur-sunrise/variants/*.md`
- `knowledge/imports/batur-source-snapshot.md`
- `knowledge/rules/batur-recommendation-rules.md`
- `knowledge/playbooks/batur-sales-playbook.md`
- `knowledge/playbooks/batur-checklists.md`
- `lib/knowledgeSearch.ts`

## Как работает knowledge base

Facts должны попадать из source snapshot в matrix, затем в variant-файлы. Policies задают ограничения. Live-status требует ручной проверки. Rules объясняют, как выбирать по подтвержденным свойствам. Playbooks объясняют менеджерскую логику. Examples показывают форму ответа.

## Как работают recommendation rules

Rules generic. Они не hardcode variant IDs, если можно использовать property:

- нужен transfer → искать `transfer_included`;
- нужны hot springs → искать `hot_springs_included`;
- бюджет ограничен → искать самый дешевый подходящий вариант;
- есть дети → проверять возраст, нагрузку, логистику и safety.

## Как продолжить разработку

1. Не добавлять новые факты вручную из памяти.
2. Заполнить `knowledge/imports/batur-source-snapshot.md` скопированным текстом.
3. Перенести подтвержденные свойства в `variant-matrix.md`.
4. Синхронизировать variant-файлы.
5. Только после этого проектировать кодовый decision engine.

## Что реализовать следующим

Следующий логичный шаг — parser/validator для заполненного snapshot или ручная процедура проверки matrix. Кодовый engine стоит делать только после появления реальных свойств вариантов.
