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

Tradeoffs: правила пока markdown-only, без кодового engine.

## 2026-07: Static website is not safety confirmation

Decision: текущая безопасность Батура не подтверждается статической страницей.

Reason: безопасность и доступность меняются во времени.

Tradeoffs: менеджер должен делать ручную live-проверку.

## 2026-07: No OpenAI API yet

Decision: пока нет OpenAI API integration.

Reason: сначала нужна надежная knowledge architecture и decision flow.

Tradeoffs: нет генерации ответов в продукте.
