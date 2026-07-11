# Roadmap

## Phase 1: Batur MVP

Goal: создать безопасную Batur-only knowledge architecture.

Deliverables:

- Batur family page.
- Variant files.
- Variant matrix.
- Policies.
- Live-status placeholder.
- Manual source snapshot workflow.
- Basic knowledge search.

Definition of Done:

- Все активные знания относятся к Батуру.
- Неподтвержденные факты помечены `NEEDS_REVIEW`.
- Небатурные туры архивированы.
- Search test проходит.

## Phase 2: Decision Engine

Goal: превратить знания в систему выбора подходящего варианта.

Deliverables:

- Заполненная variant matrix.
- Кодовый extractor needs/constraints.
- Ranking logic по подтвержденным свойствам.
- Clarification question generator.

Definition of Done:

- Система может объяснить, почему вариант подходит или почему данных недостаточно.
- Нельзя рекомендовать вариант по неподтвержденному свойству.

## Phase 3: Assistant Generation

Goal: генерировать ответы менеджеру и черновики клиенту.

Deliverables:

- Prompt/response pipeline.
- Safety guardrails.
- Response templates.
- Citation/reference to knowledge files.

Definition of Done:

- Ответ содержит рекомендацию, причины, проверки и осторожные формулировки.
- OpenAI API используется только после утверждения архитектуры.

## Phase 4: UI

Goal: дать менеджеру простой интерфейс для запросов и проверки рекомендаций.

Deliverables:

- Internal manager UI.
- Search/recommendation screen.
- Source/reference display.
- Manual confirmation workflow.

Definition of Done:

- Менеджер видит, что подтверждено, что неизвестно и что нужно проверить.

## Phase 5: Additional Tours

Goal: расширить систему за пределы Батура.

Deliverables:

- Новый tour family template.
- Архитектура для Ubud, Uluwatu, Bali overview и других туров.
- Separate policies where needed.

Definition of Done:

- Новые туры добавляются без смешивания с Batur logic.
- Для каждого тура есть facts, rules, playbook и examples.

## Phase 6: CRM Integration

Goal: подключить рабочие данные и процессы продаж.

Deliverables:

- CRM customer context.
- Booking/availability hooks.
- Manager activity notes.
- Escalation and confirmation records.

Definition of Done:

- Ассистент помогает в реальном sales workflow и сохраняет проверяемую историю решений.
