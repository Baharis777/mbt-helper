# Поддержка документации

## Назначение

Этот файл описывает, какие документы обновлять после изменений. Документация должна отражать фактическое состояние репозитория, а не планы или намерения.

## После feature work

Обновить:

- `docs/project-state.md`;
- `docs/current-priorities.md`;
- `docs/session-handoff.md`;
- профильный документ фичи, если он есть, например `docs/client-analysis.md`;
- `docs/roadmap.md`, если изменился статус phase.

## После architecture changes

Обновить:

- `docs/architecture.md`;
- `docs/decision-log.md`;
- `docs/session-handoff.md`;
- `docs/README.md`, если меняется reading order;
- `docs/project-state.md`.

## После добавления нового тура

Обновить:

- `docs/project-state.md`;
- `docs/knowledge-schema.md`;
- `docs/architecture.md`, если меняется структура;
- `knowledge/sources.md`;
- соответствующие `knowledge/tours/`;
- соответствующие `knowledge/rules/`;
- соответствующие `knowledge/playbooks/`;
- `docs/current-priorities.md`;
- `docs/session-handoff.md`.

Новый тур нельзя считать активным, пока у него нет понятной структуры facts/rules/playbook и неподтвержденные поля помечены `NEEDS_REVIEW`.

## После изменения sales methodology

Обновить:

- `knowledge/sales/README.md`;
- измененные файлы в `knowledge/sales/`;
- `docs/project-state.md`;
- `docs/current-priorities.md`, если меняется следующий шаг;
- `docs/decision-log.md`, если принято новое архитектурное решение;
- `docs/session-handoff.md`, если меняется процесс работы будущего AI-сеанса.

## После изменения client analysis или recommendation logic

Обновить:

- `docs/client-analysis.md`;
- `docs/project-state.md`;
- `docs/current-priorities.md`;
- `docs/session-handoff.md`;
- `docs/roadmap.md`, если меняется статус Phase 2;
- test scripts в `package.json`, если добавлены новые проверки.

## Постоянные правила

- `docs/session-handoff.md` и `docs/current-priorities.md` не должны быть устаревшими.
- Raw import files нельзя представлять как approved knowledge.
- `NEEDS_REVIEW`, `needs_review`, `needs_import` и `NEEDS_INPUT` не являются подтвержденными фактами.
- Документация должна описывать реальное состояние репозитория, а не желаемое состояние.
- Нельзя писать, что фича работает, если нет файла, кода, теста или явного подтверждения в репозитории.
- Большие разделы не нужно копировать между файлами; лучше ссылаться на профильный документ.

## Checklist для закрытия development session

- Проверить `git status --short`.
- Проверить, что изменены только ожидаемые файлы.
- Обновить `docs/project-state.md`, если изменилось состояние проекта.
- Обновить `docs/current-priorities.md`, если изменился следующий шаг.
- Обновить `docs/session-handoff.md`, если будущему AI нужны новые инструкции.
- Добавить запись в `docs/decision-log.md`, если принято архитектурное решение.
- Запустить существующие tests из `package.json`.
- Убедиться, что новые ссылки на файлы указывают на существующие пути.
- Убедиться, что raw imports не описаны как подтвержденная knowledge base.
- В финальном ответе назвать тесты и текущий milestone.
