# Документация проекта

Этот каталог — точка входа для нового Codex или ChatGPT-сеанса. После чтения этих документов ассистент должен понимать текущее состояние проекта, ограничения и ближайший следующий шаг без доступа к прошлым чатам.

## Reading order

1. [project-vision.md](project-vision.md)
2. [project-state.md](project-state.md)
3. [architecture.md](architecture.md)
4. [current-priorities.md](current-priorities.md)
5. [decision-log.md](decision-log.md)
6. [session-handoff.md](session-handoff.md)
7. [roadmap.md](roadmap.md)

Дополнительно читать при изменении соответствующего слоя:

- [client-analysis.md](client-analysis.md) — детерминированный анализ клиентского сообщения.
- [batur-decision-flow.md](batur-decision-flow.md) — логика выбора варианта Батура.
- [knowledge-schema.md](knowledge-schema.md) — правила структуры базы знаний.
- [documentation-maintenance.md](documentation-maintenance.md) — как поддерживать документацию актуальной.

## Starting a new AI session

Используйте этот prompt:

```text
Read docs/README.md and docs/session-handoff.md, inspect the repository, verify the stated project status against the actual files, then continue with the immediate priority from docs/current-priorities.md. Do not invent product facts or change confirmed business rules.
```

Новый AI-сеанс обязан сверить документацию с реальными файлами репозитория перед изменениями. Если документация и код расходятся, сначала нужно зафиксировать реальное состояние, затем обновлять документы или код по задаче.

## Главное ограничение

Проект пока не про UI и не про OpenAI API. Текущая цель — довести Batur-only MVP до надежной связки: подтвержденные факты → анализ сообщения клиента → рекомендация подходящего варианта → безопасный следующий шаг для менеджера.
