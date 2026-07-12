# Тестирование

## Назначение

Тесты проверяют текущую deterministic-логику Mount Batur MVP. Они не подтверждают продуктовые факты и не должны использоваться для обхода `NEEDS_REVIEW`.

## Слои тестов

`npm run test:knowledge` проверяет простой поиск по markdown knowledge. Он показывает, какие файлы находятся по типовым Batur-запросам.

`npm run test:analysis` читает `tests/batur/client-analysis-cases.json` и проверяет structured analysis:

- intents;
- profile fields;
- missing information;
- internal warnings;
- next best action;
- лимит не больше 3 уточняющих вопросов.

`npm run test:recommendations` читает `tests/batur/recommendation-cases.json` и проверяет ranking rules на синтетических fixtures. Эти fixtures нужны, чтобы тестировать логику без изменения реальных product facts.

`npm run test:all` запускает все текущие проверки.

## Как добавить regression case

Для анализа сообщения добавьте объект в `tests/batur/client-analysis-cases.json`:

- `id`;
- `message`;
- `expected.intentsInclude`;
- `expected.profile`;
- `expected.missingFieldsInclude` или `expected.missingFieldsExact`;
- `expected.warningsInclude`;
- `expected.nextAction`.

Проверяйте структурные поля, а не полный текст предупреждений или вопросов.

Для рекомендаций добавьте case в `tests/batur/recommendation-cases.json`. Если нужно проверить ranking, используйте `variantFixtures`. Если нужно проверить safety flow, можно использовать `message` и ожидать `check_live_status`.

## Как интерпретировать failures

Failure может означать одно из трех:

- изменилось поведение deterministic logic;
- тест отражает неподтвержденное предположение;
- в базе знаний появились подтвержденные данные, и ожидаемое поведение нужно обновить.

Перед исправлением кода нужно проверить, не требует ли кейс подтвержденных product facts. Нельзя менять реальные факты, чтобы тест стал зеленым.

## Важные правила

- Historical manager replies не являются автоматически правильными.
- Тесты должны отражать подтвержденные знания и approved business logic.
- Safety-вопросы не должны возвращать позитивное подтверждение безопасности.
- Availability должна требовать проверки.
- Если critical facts неизвестны или `NEEDS_REVIEW`, тест не должен требовать уверенной рекомендации variant ID.
- Если нужная услуга уже включена в подходящий вариант, тест должен предпочитать этот вариант, а не автоматическую допродажу отдельной услуги.

## Текущие coverage gaps

- Нет календарной нормализации дат.
- Нет semantic understanding, только deterministic matching.
- Нет проверки реальных цен по числовому сравнению.
- Нет live availability или live safety source.
- Recommendation fixtures не являются реальными продуктами.
