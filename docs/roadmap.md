# Roadmap

## Phase 1: Batur MVP

Status: in progress.

Goal: создать безопасную Batur-only knowledge architecture.

Deliverables:

- Batur family page — completed.
- Variant files — completed as draft structure.
- Variant matrix — completed as structure, facts still need review.
- Policies — completed as draft operational guardrails.
- Live-status placeholder — completed.
- Manual source snapshot workflow — completed.
- Basic knowledge search — completed and tested.
- Sales methodology layer — completed as draft, needs manager validation.

Definition of Done:

- Все активные знания относятся к Батуру.
- Неподтвержденные факты помечены `NEEDS_REVIEW`.
- Небатурные туры архивированы.
- Search test проходит.
- Sales methodology проверена менеджером.
- Key Batur variant facts подтверждены в matrix.

## Phase 2: Decision Engine

Status: in progress.

Goal: превратить знания в систему выбора подходящего варианта.

Deliverables:

- Кодовый extractor needs/constraints — completed as deterministic first version.
- Missing information logic — completed as first version.
- Next best action logic — completed as first version.
- Variant ranking logic по matrix — completed as first version.
- Заполненная variant matrix — not completed.
- Расширенные tests на реальные сценарии — partially completed.

Definition of Done:

- Система может объяснить, почему вариант подходит или почему данных недостаточно.
- Нельзя рекомендовать вариант по неподтвержденному свойству.
- Есть тесты, где подтвержденные варианты становятся `suitable`.
- Есть тесты для safety, children, health, transfer, hot springs, budget и availability.

## Phase 3: Assistant Generation

Status: not started.

Goal: генерировать ответы менеджеру и черновики клиенту.

Deliverables:

- Manager answer generator.
- Client draft generator.
- Safety guardrails.
- Response templates.
- Citation/reference to knowledge files.
- OpenAI prompt/response pipeline, если будет явно разрешено.

Definition of Done:

- Ответ содержит рекомендацию, причины, проверки и осторожные формулировки.
- Неподтвержденные факты не выдаются как подтвержденные.
- OpenAI API используется только после утверждения архитектуры.

## Phase 4: UI

Status: not started.

Goal: дать менеджеру простой интерфейс для запросов и проверки рекомендаций.

Deliverables:

- Internal manager UI.
- Search/recommendation screen.
- Source/reference display.
- Manual confirmation workflow.

Definition of Done:

- Менеджер видит, что подтверждено, что неизвестно и что нужно проверить.

## Phase 5: Additional Tours

Status: not started.

Goal: расширить систему за пределы Батура.

Deliverables:

- Новый tour family template.
- Архитектура для Ubud, Uluwatu, Bali overview и других туров.
- Separate policies where needed.
- Rules/playbooks/examples для каждого нового направления.

Definition of Done:

- Новые туры добавляются без смешивания с Batur logic.
- Для каждого тура есть facts, rules, playbook и examples.

## Phase 6: CRM Integration

Status: not started.

Goal: подключить рабочие данные и процессы продаж.

Deliverables:

- CRM customer context.
- Booking/availability hooks.
- Manager activity notes.
- Escalation and confirmation records.

Definition of Done:

- Ассистент помогает в реальном sales workflow и сохраняет проверяемую историю решений.
