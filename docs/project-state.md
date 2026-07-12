# Состояние проекта

## Project name

MBT Helper / MBT Manager Assistant.

## Project goal

Создать внутреннего экспертного ассистента для менеджеров MyBaliTrips. Ассистент должен понимать сообщение клиента, извлекать цели и ограничения, подбирать подходящий вариант Mount Batur, показывать недостающие данные, предупреждать о том, что нельзя обещать, и готовить основу для будущего менеджерского ответа.

## Current MVP scope

Активный MVP ограничен Mount Batur:

- семейство рассветного Батура;
- 7 временных вариантов страницы Батура по anchor ID;
- матрица вариантов;
- политики безопасности, цены, доступности и бронирования;
- live-status Батура как место для ручной проверки;
- sales methodology layer для менеджеров;
- recommendation rules и Batur playbooks;
- keyword-based knowledge search;
- deterministic client-message analysis.

Небатурные туры архивированы и не входят в активный MVP.

## What already works

- Batur-only структура базы знаний.
- `knowledge/tours/batur-sunrise/page.md`, `variant-matrix.md`, `audit.md` и 7 variant-файлов.
- `knowledge/imports/batur-source-snapshot.md` как ручной snapshot workflow.
- `knowledge/imports/mbt-chat-insights.md` как raw source для sales methodology.
- Policies: volcano safety, price/availability, booking rules.
- `knowledge/live-status/batur.md`, который явно не подтверждает текущую безопасность.
- `knowledge/sales/` с постоянной методологией коммуникации и продаж.
- `knowledge/rules/batur-recommendation-rules.md`.
- `knowledge/playbooks/batur-sales-playbook.md` и `batur-checklists.md`.
- Conversation examples для Batur-сценариев.
- `lib/knowledgeSearch.ts` для поиска по markdown-знаниям.
- `lib/analyzeClientMessage.ts` для deterministic анализа сообщения клиента.
- `lib/recommendBaturVariant.ts` для ранжирования вариантов по матрице.
- `lib/getMissingInformation.ts` для выбора до 3 уточняющих вопросов.
- `lib/getNextBestAction.ts` для выбора следующего действия.
- Типы анализа в `types/assistant.ts`.
- Тестовые скрипты `test:knowledge` и `test:analysis`.

## What is partially implemented

- Client-message analysis реализован кодом и покрыт smoke-тестами, но пока использует keyword/phrase matching.
- Variant recommendation реализован кодом, но почти все варианты остаются `candidate_needs_review`, потому что свойства в матрице не подтверждены.
- Sales methodology layer создан из raw insights, но требует проверки менеджером.
- Knowledge search работает, но не является semantic search.
- Manual import workflow создан, но не переносит факты автоматически.

## What is still missing

- Подтвержденные exact site names вариантов.
- Подтвержденные цены, включения, исключения, трансфер, pickup rules, длительность, программа, правила отмены и формат вариантов.
- Реальный процесс обновления live-status и проверки безопасности.
- Нормализация дат в календарный формат.
- Более широкий набор тестов на реальные менеджерские сценарии.
- Генерация менеджерского ответа и черновика клиенту.
- OpenAI API integration.
- UI.
- CRM/booking integration.

## Current active repository structure

```text
docs/
examples/
knowledge/
  imports/
  live-status/
  playbooks/
  policies/
  rules/
  sales/
  tours/batur-sunrise/
lib/
scripts/
types/
```

## Current Batur knowledge base

Batur knowledge base готова как архитектурный каркас. Общие знания семейства хранятся в `knowledge/tours/batur-sunrise/page.md`; сравнение вариантов — в `variant-matrix.md`; отдельные варианты — в `variants/*.md`.

Ключевое ограничение: почти все операционные факты в вариантах и матрице остаются `NEEDS_REVIEW` или `needs_import`. Поэтому система не должна подтверждать конкретный вариант, цену, включения, трансфер, безопасность или доступность без ручной проверки.

## Current sales methodology layer

`knowledge/sales/` содержит постоянные документы по стилю коммуникации, квалификации клиента, рекомендациям, бронированию, follow-up, objections, языковым принципам и central sales principles.

Этот слой описывает методологию менеджера и не является источником продуктовых фактов.

## Current knowledge search

`lib/knowledgeSearch.ts` читает активные markdown roots и ранжирует документы по keyword groups. Скрипт `scripts/testKnowledgeSearch.ts` проверяет основные Batur-сценарии.

## Current client-message analysis

`lib/analyzeClientMessage.ts` принимает `{ message }` и возвращает `ManagerAnalysis`:

- язык клиента;
- intents;
- client profile;
- constraints;
- missing information;
- internal warnings;
- ranked variant candidates;
- next best action;
- knowledge references.

Анализ детерминированный. Он не использует OpenAI и не генерирует финальный ответ клиенту.

## Existing test scripts

- `npm run test:knowledge`
- `npm run test:analysis`

Оба скрипта используют `tsx`.

## Known limitations

- Большинство variant facts еще не подтверждены.
- Рекомендатор не может выдавать уверенную рекомендацию, пока матрица содержит `NEEDS_REVIEW`.
- Safety и availability требуют live/manual checks.
- Matching keyword-based и может пропускать нестандартные формулировки.
- Нет schema validation для markdown.
- Нет автоматической синхронизации matrix и variant-файлов.

## Exact next milestone

Проверить sales methodology layer с менеджером, затем заполнить или подтвердить Batur variant facts в `knowledge/tours/batur-sunrise/variant-matrix.md` из `knowledge/imports/batur-source-snapshot.md`. После этого расширить deterministic tests на реальные менеджерские сценарии и проверить, что `lib/recommendBaturVariant.ts` начинает ранжировать подтвержденные варианты корректно.
