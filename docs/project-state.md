# Состояние проекта

## Project name

MBT Helper / MBT Manager Assistant.

## Project goal

Создать внутреннего экспертного ассистента для менеджеров MyBaliTrips. Ассистент должен понимать ситуацию клиента, знать продукты, выбирать подходящий вариант Батура, задавать нужные уточнения, знать, что нельзя обещать, и помогать формировать ответ клиенту.

## Current MVP scope

Активный MVP ограничен Mount Batur:

- семейство рассветного Батура;
- временные варианты страницы Батура по anchor ID;
- политики безопасности, цены, доступности и бронирования;
- live-status Батура;
- правила рекомендаций;
- playbooks и чеклисты менеджера;
- простой поиск по markdown-знаниям.

Небатурные туры находятся в архиве и не являются активным MVP.

## What already works

- Структура Batur-only knowledge base.
- Markdown-карточки семейства и 7 временных вариантов.
- Variant matrix с полями для будущего заполнения.
- Ручной snapshot workflow для вставки текста источника.
- Политики: безопасность вулкана, цена/доступность, бронирование.
- Live-status файл, который явно не подтверждает безопасность.
- Rules/playbooks/checklists для sales decision layer.
- Простая keyword-based knowledge search в `lib/knowledgeSearch.ts`.
- Тестовый скрипт `npm run test:knowledge`.

## What is partially implemented

- Decision system описан в markdown, но не реализован как кодовый ranking engine.
- Variant properties существуют в матрице, но почти все факты остаются `NEEDS_REVIEW`.
- Snapshot import создает placeholders, но не парсит и не переносит факты автоматически.
- Knowledge search ищет релевантные markdown-файлы, но не генерирует финальный ответ.

## What is still missing

- Подтвержденные названия вариантов с сайта.
- Цены, включения, исключения, трансфер, правила отмены, длительность и программы вариантов.
- Настоящий live-status источник и процесс обновления.
- Кодовый decision engine.
- Генерация ответов менеджеру.
- UI.
- OpenAI API интеграция.
- CRM/booking integration.

## Current repository structure

```text
docs/
examples/
knowledge/
lib/
scripts/
types/
```

## Important folders

- `knowledge/tours/batur-sunrise/`: активная Batur tour architecture.
- `knowledge/tours/batur-sunrise/variants/`: временные variant-файлы.
- `knowledge/imports/`: ручной импорт текста источника.
- `knowledge/rules/`: правила рекомендаций.
- `knowledge/playbooks/`: менеджерская логика, playbook и чеклисты.
- `knowledge/policies/`: ограничения и safety/booking/price policies.
- `knowledge/live-status/`: текущий статус, который требует ручной проверки.
- `examples/conversations/`: примеры диалогов для Batur-сценариев.
- `lib/`: TypeScript search utilities.
- `scripts/`: локальные utility scripts.

## Current Batur implementation status

Batur architecture готова как каркас. Она объясняет, как разделять общие факты, факты вариантов, правила выбора, playbook и examples. Операционные факты еще не импортированы, поэтому система пока не должна делать окончательные рекомендации по конкретному variant ID.

## Current known limitations

- Большинство полей вариантов `NEEDS_REVIEW`.
- Нет автоматического scrape/import.
- Нет генерации ответа.
- Нет ранжирования вариантов в коде.
- Search keyword-based и не понимает смысл глубоко.
- Safety нельзя подтверждать из статической страницы.

## Next development milestone

Заполнить `knowledge/imports/batur-source-snapshot.md` вручную из источника, затем перенести подтвержденные свойства в `variant-matrix.md`. Только после этого строить кодовый decision engine.
