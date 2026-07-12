# Архитектура

## Зачем проект организован так

Проект разделяет raw sources, product facts, live/manual checks, sales methodology, decision rules, playbooks, examples и deterministic code. Это нужно, чтобы ассистент не смешивал подтвержденные данные с предположениями и не обещал клиенту то, что требует проверки.

## knowledge/imports/

`knowledge/imports/` — временная зона источников. Здесь лежит сырой материал:

- скопированный текст страницы Батура;
- инструкции по импорту;
- raw insights из менеджерских диалогов.

Imports не являются approved operational knowledge. Их нужно переработать в постоянные знания перед использованием в рекомендациях.

## knowledge/tours/

`knowledge/tours/` содержит product-specific facts. Для текущего MVP активен только `knowledge/tours/batur-sunrise/`.

Структура Батура:

- `page.md` — общая карточка семейства;
- `variant-matrix.md` — таблица сравнения вариантов;
- `variants/*.md` — отдельные карточки временных вариантов;
- `audit.md` — состояние и пробелы знания.

Если поле содержит `NEEDS_REVIEW`, оно не является фактом.

## knowledge/live-status/

`knowledge/live-status/` хранит место для текущего статуса. Сейчас `knowledge/live-status/batur.md` не подтверждает безопасность, открытость маршрута, доступность или проведение тура.

Любой вопрос про извержение, пепел, дым, лаву, землетрясение, закрытие маршрута, текущую безопасность или доступность требует live/manual check.

## knowledge/policies/

`knowledge/policies/` содержит ограничения и правила, которые защищают менеджера от неподтвержденных обещаний:

- volcano safety;
- price/availability;
- booking rules.

Policies не заменяют факты конкретного варианта.

## knowledge/sales/

`knowledge/sales/` содержит reusable manager methodology:

- стиль коммуникации;
- квалификация клиента;
- стратегия рекомендации;
- бронирование;
- повторные касания;
- работа с возражениями;
- языковые принципы;
- central sales principles.

Этот слой описывает, как думать и общаться, но не подтверждает цену, трансфер, включения, безопасность или доступность.

## knowledge/rules/

`knowledge/rules/` содержит decision logic. Сейчас главный файл — `knowledge/rules/batur-recommendation-rules.md`.

Rules объясняют, как выбирать вариант по подтвержденным свойствам: transfer, hot springs, own transport, budget, children, health, private/group и safety constraints.

## knowledge/playbooks/

`knowledge/playbooks/` содержит applied manager workflows для конкретного продукта:

- `batur-sales-playbook.md`;
- `batur-checklists.md`.

Playbooks помогают менеджеру вести диалог и проверку, но не должны подменять product facts.

## examples/

`examples/conversations/` содержит примеры Batur-сценариев. Examples показывают структуру анализа и ответа, но не являются источником operational facts.

## lib/

`lib/` содержит deterministic TypeScript logic:

- `knowledgeSearch.ts` — keyword-based поиск по markdown knowledge;
- `analyzeClientMessage.ts` — structured analysis клиентского сообщения;
- `recommendBaturVariant.ts` — ранжирование variant candidates по матрице;
- `getMissingInformation.ts` — выбор до 3 уточняющих вопросов;
- `getNextBestAction.ts` — выбор следующего действия;
- `knowledgeTypes.ts` — типы для knowledge search.

Код не использует OpenAI API и не генерирует финальный клиентский ответ.

## types/

`types/assistant.ts` содержит общие TypeScript-типы для product knowledge, sources, response drafts и client analysis.

## scripts/

`scripts/` содержит локальные проверки и utility scripts:

- `testKnowledgeSearch.ts`;
- `testClientAnalysis.ts`;
- `importBaturSourceSnapshot.ts`.

## Tests

Текущие npm scripts:

- `npm run test:knowledge`;
- `npm run test:analysis`.

Они проверяют существующий deterministic behavior, но пока не являются полной regression suite.

## Разница между слоями

Facts — подтвержденные данные из источника или от организатора: цена, трансфер, включения, длительность, правила отмены, формат, ограничения.

Decision rules — правила выбора по свойствам. Они не утверждают, что конкретный вариант имеет эти свойства.

Manager logic — методика продаж и ведения диалога: что спросить, как объяснить различия, когда не рекомендовать треккинг, как не максимизировать revenue ценой suitability.

Conversation examples — обучающие сценарии формы ответа. Они не должны становиться источником фактов.

Deterministic analysis code — первый исполняемый слой, который извлекает intent/profile/constraints и предлагает next action без OpenAI.

## Почему разделение важно

Если raw sources, facts, rules и examples смешать, ассистент начнет делать уверенные выводы из неподтвержденного текста. Разделение позволяет сначала подтвердить факт, затем применить правило, затем сформировать безопасный manager output.
