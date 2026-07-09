# Аудит базы знаний Батура

## Статус аудита

Черновик. Аудит отражает текущую активную структуру только по Батуру и не подтверждает факты о турах.

## Текущие активные Batur-файлы

- `knowledge/tours/batur-sunrise/page.md`
- `knowledge/tours/batur-sunrise/variant-matrix.md`
- `knowledge/tours/batur-sunrise/audit.md`
- `knowledge/tours/batur-sunrise/variants/batur-variant-1906.md`
- `knowledge/tours/batur-sunrise/variants/batur-variant-2095.md`
- `knowledge/tours/batur-sunrise/variants/batur-variant-1728.md`
- `knowledge/tours/batur-sunrise/variants/batur-variant-1008.md`
- `knowledge/tours/batur-sunrise/variants/batur-variant-1905.md`
- `knowledge/tours/batur-sunrise/variants/batur-variant-1009.md`
- `knowledge/tours/batur-sunrise/variants/batur-variant-2094.md`
- `knowledge/live-status/batur.md`
- `knowledge/policies/volcano-safety.md`
- `knowledge/policies/price-availability.md`
- `knowledge/policies/booking-rules.md`
- `knowledge/sales/tone-of-voice.md`
- `knowledge/sources.md`

## Все файлы вариантов

| variant_id | file_path | status |
| --- | --- | --- |
| batur-variant-1906 | `knowledge/tours/batur-sunrise/variants/batur-variant-1906.md` | needs_import |
| batur-variant-2095 | `knowledge/tours/batur-sunrise/variants/batur-variant-2095.md` | needs_import |
| batur-variant-1728 | `knowledge/tours/batur-sunrise/variants/batur-variant-1728.md` | needs_import |
| batur-variant-1008 | `knowledge/tours/batur-sunrise/variants/batur-variant-1008.md` | needs_import |
| batur-variant-1905 | `knowledge/tours/batur-sunrise/variants/batur-variant-1905.md` | needs_import |
| batur-variant-1009 | `knowledge/tours/batur-sunrise/variants/batur-variant-1009.md` | needs_import |
| batur-variant-2094 | `knowledge/tours/batur-sunrise/variants/batur-variant-2094.md` | needs_import |

## Все source URL из `knowledge/sources.md`

| item_id | source_url | source_type | status |
| --- | --- | --- | --- |
| batur-sunrise | https://mybalitrips.com/ru/climbing-to-batur-volcano/ | website | needs_import |
| batur-variant-1906 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#1906 | website_anchor | needs_import |
| batur-variant-2095 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#2095 | website_anchor | needs_import |
| batur-variant-1728 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#1728 | website_anchor | needs_import |
| batur-variant-1008 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#1008 | website_anchor | needs_import |
| batur-variant-1905 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#1905 | website_anchor | needs_import |
| batur-variant-1009 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#1009 | website_anchor | needs_import |
| batur-variant-2094 | https://mybalitrips.com/ru/climbing-to-batur-volcano/#2094 | website_anchor | needs_import |
| volcano-safety | NEEDS_REVIEW | NEEDS_REVIEW | needs_review |
| booking-rules | NEEDS_REVIEW | NEEDS_REVIEW | needs_review |
| price-availability | NEEDS_REVIEW | NEEDS_REVIEW | needs_review |
| batur-live-status | NEEDS_REVIEW | NEEDS_REVIEW | needs_review |

## Поля, отсутствующие или отмеченные NEEDS_REVIEW

### Семейная карточка

- Статус импорта: NEEDS_REVIEW
- Точные названия вариантов: NEEDS_REVIEW
- Возрастные ограничения: NEEDS_REVIEW
- Требования к физической форме: NEEDS_REVIEW
- Ограничения при беременности: NEEDS_REVIEW
- Ограничения при травмах, проблемах с коленями или здоровьем: NEEDS_REVIEW
- Подходит ли детям: NEEDS_REVIEW
- Подходит ли пожилым участникам: NEEDS_REVIEW
- Вариант с меньшей нагрузкой: NEEDS_REVIEW
- Вариант без пешего восхождения: NEEDS_REVIEW
- Вариант с горячими источниками: NEEDS_REVIEW
- Цена, длительность, время выезда, включения, исключения, точная программа, отмена, доступность, безопасность: NEEDS_REVIEW

### Все варианты

Для каждого variant-файла не подтверждены:

- Последняя проверка.
- Точное название на сайте.
- Позиционирование для клиента.
- Формат.
- Цена.
- Продолжительность.
- Время выезда.
- Включен ли трансфер.
- Правила районов трансфера.
- Включены ли горячие источники.
- Приватный или групповой формат.
- Что включено.
- Что не включено.
- Точная программа.
- Правила отмены.
- Доступность.
- Статус безопасности.
- Ограничения по возрасту.
- Ограничения по здоровью и физической нагрузке.

### Live status

- Безопасность, открытость маршрута, разрешение на проведение туров, доступность семейства и всех вариантов, ограничения маршрутов, погодные или операционные ограничения, источник, время и ответственный за проверку: NEEDS_REVIEW

### Политики

- Источники для безопасности, цены, доступности, бронирования, отмены, переноса, предоплаты, оплаты, неявки, плохой погоды и закрытия маршрута: NEEDS_REVIEW

## Возможные дубли или неясные поля

- `status`, `Статус`, `Статус импорта` и `Статус карточки` могут смешивать состояние файла и состояние источника. Рекомендуется отдельно хранить состояние файла и состояние импорта.
- `Доступность` может означать наличие мест, доступность маршрута или пригодность для клиента. Рекомендуется разделить на наличие мест, статус маршрута и пригодность по здоровью.
- `Статус безопасности` пересекается с `live-status/batur.md` и `volcano-safety.md`. Рекомендуется использовать live-status как единственный источник текущей безопасности.
- `Формат без восхождения`, `джип`, `меньшая нагрузка` и `горячие источники` пока не привязаны к конкретным variant ID.
- `source_url` для политик и live-status пока не подтвержден.

## Рекомендации по структуре

1. Сначала импортировать страницу и anchor-блоки, не меняя ручные предупреждения.
2. Подтвердить точные названия вариантов и заменить временные ID только после проверки.
3. Заполнить `variant-matrix.md` перед расширением текстовых карточек вариантов.
4. Не переносить цену, включения, трансфер или отмену из одного варианта в другой.
5. Использовать `page.md` только для общих правил выбора и предупреждений.
6. Использовать `live-status/batur.md` как единственный файл для текущей безопасности и доступности.
7. После заполнения матрицы добавить тестовые менеджерские вопросы для каждого важного сценария: безопасность, цена, ребенок, горячие источники, без восхождения, трансфер.
