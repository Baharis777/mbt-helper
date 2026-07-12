# Текущие приоритеты

## Immediate next task

Проверить и валидировать новый sales methodology layer в `knowledge/sales/`:

- убедиться, что принципы соответствуют реальной работе менеджеров MBT;
- убрать спорные или слишком общие правила;
- подтвердить, что sales-документы не содержат продуктовых фактов;
- при необходимости обновить `knowledge/sales/README.md` и `sales-principles.md`.

## Next task

Завершить проверку structured client-message analysis layer:

- проверить `lib/analyzeClientMessage.ts` на реальных сообщениях менеджеров;
- расширить набор фраз для intents, transfer, hot springs, children, health, safety и budget;
- убедиться, что `ManagerAnalysis` не содержит неподтвержденных фактов;
- проверить, что `getMissingInformation.ts` не превращает анализ в длинную анкету.

## Next task after that

Связать client analysis с Batur variant recommendation на подтвержденных свойствах:

- заполнить или проверить `knowledge/tours/batur-sunrise/variant-matrix.md`;
- убедиться, что `lib/recommendBaturVariant.ts` использует только подтвержденные свойства;
- добавить сценарии, где варианты становятся `suitable`, а не только `candidate_needs_review`;
- проверить ранжирование по transfer, hot springs, own transport, budget, children и health constraints.

## Then

Добавить deterministic tests для реальных manager scenarios:

- клиент хочет Батур с горячими источниками;
- клиент хочет самый дешевый вариант;
- клиент без транспорта;
- клиент с ребенком;
- клиент с ограничениями по здоровью;
- клиент спрашивает про безопасность, извержение или открытый маршрут;
- клиент готов бронировать.

## Blocked items

- Уверенные рекомендации по конкретным variant IDs заблокированы до подтверждения variant facts.
- Генерация финальных клиентских ответов заблокирована до стабилизации analysis + recommendation outputs.
- OpenAI API integration заблокирована до проверки deterministic flow.
- UI заблокирован до Batur end-to-end validation.
- Additional tours заблокированы до работающего Batur MVP.
- Safety automation заблокирована до определения live-status source/process.

## Technical debt

- Markdown matrix парсится простым split по `|`; это может сломаться, если в ячейках появятся необработанные pipe-символы.
- Нет schema validation для markdown knowledge files.
- Нет автоматической синхронизации `variant-matrix.md` и `variants/*.md`.
- `knowledgeSearch` и `analyzeClientMessage` используют keyword matching.
- Тесты пока smoke-level, не полноценный regression suite.
- В локальном дереве может присутствовать `.DS_Store`; он не является частью логики проекта.

## What should NOT be worked on yet

- Не добавлять UI.
- Не подключать OpenAI API.
- Не расширять MVP на Ubud, Uluwatu, Bali overview или другие туры.
- Не скрейпить сайт автоматически.
- Не генерировать финальные клиентские ответы.
- Не придумывать цены, включения, трансфер, правила отмены, доступность или safety status.
