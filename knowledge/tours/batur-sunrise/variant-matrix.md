# Матрица вариантов Батура

Эта матрица нужна для сравнения вариантов рассветного Батура. Пока данные не импортированы и не проверены, все неподтвержденные поля остаются `NEEDS_REVIEW`.

Перед заполнением матрицы нужно вручную собрать текст основной страницы и каждого якорного варианта в `knowledge/imports/batur-source-snapshot.md`. Не заполняйте факты в матрице из памяти или предположений.

| variant_id | source_url | exact_site_name | format | transfer_included | hot_springs_included | private_or_group | pickup_area_rules | duration | price | included | not_included | cancellation_rules | best_for | not_good_for | manager_notes | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batur-variant-1906 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#1906 | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | Временный ID. Не обещать условия без импорта и ручной проверки. | needs_import |
| batur-variant-2095 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#2095 | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | Временный ID. Не обещать условия без импорта и ручной проверки. | needs_import |
| batur-variant-1728 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#1728 | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | Временный ID. Не обещать условия без импорта и ручной проверки. | needs_import |
| batur-variant-1008 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#1008 | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | Временный ID. Не обещать условия без импорта и ручной проверки. | needs_import |
| batur-variant-1905 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#1905 | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | Временный ID. Не обещать условия без импорта и ручной проверки. | needs_import |
| batur-variant-1009 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#1009 | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | Временный ID. Не обещать условия без импорта и ручной проверки. | needs_import |
| batur-variant-2094 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#2094 | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | NEEDS_REVIEW | Временный ID. Не обещать условия без импорта и ручной проверки. | needs_import |

## Как использовать матрицу

- Сначала заполнить `knowledge/imports/batur-source-snapshot.md`.
- Затем сопоставить `exact_site_name` каждого якорного варианта с временным `variant_id`.
- Сначала проверить, какой вопрос клиента относится к выбору варианта: цена, формат, трансфер, горячие источники, приватность, длительность или отмена.
- Если нужное поле `NEEDS_REVIEW`, менеджер должен проверить источник или организатора.
- Не использовать матрицу как подтверждение цены, доступности или безопасности.
- Не считать статическую страницу сайта подтверждением текущей безопасности Батура.
