# Текущие приоритеты

## Immediate next task

Заполнить `knowledge/imports/batur-source-snapshot.md` вручную: основная страница, все anchor-варианты, названия, price blocks, inclusions/exclusions, pickup/transfer, cancellation/payment, hot springs, group/private, age/health restrictions.

## After that

Перенести подтвержденные свойства в `knowledge/tours/batur-sunrise/variant-matrix.md`. Не переносить факты из памяти. Если факт неоднозначен, оставить `NEEDS_REVIEW`.

## After that

Синхронизировать variant-файлы с матрицей и обновить `recommended_for`, `not_recommended_for`, `decision_rules` так, чтобы они стали специфичными для каждого подтвержденного варианта.

## Blocked items

- Кодовый decision engine заблокирован до заполнения matrix.
- Assistant generation заблокирован до появления подтвержденных facts и decision outputs.
- UI заблокирован до стабилизации decision flow.
- Safety automation заблокирована до определения live-status source/process.

## Technical debt

- Search keyword-based и может ранжировать variant-файлы одинаково, пока факты не заполнены.
- В repo есть системные `.DS_Store` файлы, они игнорируются `.gitignore`, но физически могут оставаться локально.
- `variant-matrix.md` и variant-файлы нужно будет синхронизировать вручную или будущим скриптом.
- Нет schema validation для markdown.
- Нет tests для decision rules, только search test.
