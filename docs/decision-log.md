# Decision log

## 2026-07: Russian-first knowledge

Decision: технические имена остаются на английском, manager-facing markdown пишется на русском.

Reason: первые пользователи — русскоязычные менеджеры MBT, но код и структура должны оставаться удобными для разработки.

Tradeoffs: в markdown встречаются технические field names на английском.

## 2026-07: Batur-only MVP

Decision: активный MVP ограничен Mount Batur.

Reason: нужно полностью спроектировать и проверить одну knowledge architecture перед расширением.

Tradeoffs: Ubud, Uluwatu и Bali overview временно архивированы.

## 2026-07: Snapshot import вместо scraping

Decision: использовать ручной `batur-source-snapshot.md`, а не автоматический scraper.

Reason: важно не выдумывать факты и не строить хрупкий scraper до стабилизации схемы.

Tradeoffs: импорт медленнее и требует менеджера.

## 2026-07: Variants separated

Decision: каждый Batur variant хранится в отдельном файле.

Reason: цены, включения, трансфер, hot springs и формат могут отличаться.

Tradeoffs: появляется риск рассинхронизации с matrix.

## 2026-07: Matrix first

Decision: `variant-matrix.md` должен заполняться перед variant-файлами.

Reason: менеджеру проще сравнивать варианты в таблице.

Tradeoffs: нужен процесс синхронизации matrix и variant files.

## 2026-07: Manager logic separated from facts

Decision: rules/playbooks отделены от facts.

Reason: правила выбора должны работать по подтвержденным свойствам, а не утверждать свойства сами.

Tradeoffs: рекомендация невозможна, пока факты не заполнены.

## 2026-07: Recommendation rules exist

Decision: создать generic recommendation rules.

Reason: ассистент должен думать как senior sales manager и объяснять "почему этот вариант".

Tradeoffs: правила теперь существуют и в markdown, и частично в коде; нужно поддерживать согласованность между `knowledge/rules/batur-recommendation-rules.md` и `lib/recommendBaturVariant.ts`.

## 2026-07: Static website is not safety confirmation

Decision: текущая безопасность Батура не подтверждается статической страницей.

Reason: безопасность и доступность меняются во времени.

Tradeoffs: менеджер должен делать ручную live-проверку.

## 2026-07: No OpenAI API yet

Decision: пока нет OpenAI API integration.

Reason: сначала нужна надежная knowledge architecture и decision flow.

Tradeoffs: нет генерации ответов в продукте.

## 2026-07-12: Sales methodology separated from product facts

Date: 2026-07-12.

Decision: `knowledge/sales/` хранит постоянную sales methodology отдельно от `knowledge/tours/`.

Reason: стиль коммуникации, квалификация, follow-up и работа с возражениями применимы ко многим турам и не должны смешиваться с ценами, включениями и условиями конкретных вариантов.

Tradeoffs: ассистент должен читать несколько слоев знаний, а не один файл.

## 2026-07-12: Chat Insights are raw import source

Date: 2026-07-12.

Decision: `knowledge/imports/mbt-chat-insights.md` считается raw source, а не permanent knowledge.

Reason: исторические наблюдения за чатами нужно обобщать в принципы, а не копировать как готовые правила.

Tradeoffs: требуется ручная переработка и проверка методологии.

## 2026-07-12: Historical manager wording is not automatically correct

Date: 2026-07-12.

Decision: формулировки из прошлых диалогов не считаются автоматически правильными для будущих ответов.

Reason: реальные сообщения могли зависеть от контекста, старых условий, конкретного менеджера или неподтвержденных фактов.

Tradeoffs: меньше прямого reuse готовых фраз, больше работы по обобщению.

## 2026-07-12: Recommendations optimize for suitability

Date: 2026-07-12.

Decision: рекомендации должны оптимизироваться под suitability клиента, а не под максимальную выручку.

Reason: задача ассистента — помочь менеджеру выбрать наиболее подходящий вариант и сохранить доверие клиента.

Tradeoffs: система может рекомендовать более простой или дешевый вариант, если он лучше подходит.

## 2026-07-12: Prefer suitable variant over automatic upsell

Date: 2026-07-12.

Decision: если другой ticket variant уже включает нужную услугу, нужно предпочитать подходящий вариант, а не автоматически допродавать услугу отдельно.

Reason: клиенту важнее получить цельный подходящий продукт, чем набор искусственных дополнений.

Tradeoffs: требуется лучше знать свойства вариантов и сравнивать их по подтвержденным данным.

## 2026-07-12: Deterministic analysis before OpenAI

Date: 2026-07-12.

Decision: сначала реализован deterministic client-message analysis в `lib/analyzeClientMessage.ts`.

Reason: нужно проверить структуру входных данных, constraints, missing information и next actions до подключения генеративной модели.

Tradeoffs: keyword matching ограничен и пропускает часть живых формулировок.

## 2026-07-12: Batur end-to-end before more tours

Date: 2026-07-12.

Decision: Mount Batur должен заработать end-to-end перед расширением на другие туры.

Reason: один полностью проверенный продукт лучше, чем несколько неполных knowledge islands.

Tradeoffs: Ubud, Uluwatu, Bali overview и другие туры остаются в архиве до стабилизации Batur MVP.
