# Copilot instructions — katysym

Краткое резюме
- Проект — статический frontend PWA (журнал посещаемости) — single-page приложение.
- Клиент общается с удалённым Worker/Apps Script через `WEBAPP_URL` + `API_KEY`.

Ключевая архитектура (big picture)
- UI и логика: `app.js` (основной, feature-full). Альтернативная/встраиваемая версия — код в `index.html`.
- Статический список учеников в `students.js` (`rawStudents` — многострочный backtick-блок). Некоторые код-файлы ожидают загрузки студентов с API (mode=students).
- PWA: `sw.js` (кеширование), `manifest.json` (подпись и иконки в `favicon_io/`).
- API: все запросы идут на `WEBAPP_URL` с query `mode` (например `classes`, `students`, `report`) или POST с телом JSON. Формат POST для сохранения:
  ```json
  { "key": "API_KEY", "date": "YYYY-MM-DD", "grade": "7", "class_letter": "A", "records": [{"student_id":"...","status_code":"katysty"}, ...] }
  ```

Файлы, на которые обращать внимание
- `app.js` — основная логика: i18n (`I18N`), `STATUS`, `EXCEPTIONS`, `apiGet`/`apiPost`, рендер таблиц, `getRangeFromPeriod()` и экспорт CSV.
- `students.js` — большой `rawStudents` блок. Не ломать формат при редактировании.
- `index.html` — встраиваемая версия приложения и пример использования `WEBAPP_URL` (здесь часто стоит placeholder — заменить при интеграции).
- `sw.js` — service worker: кеширует статические активы; изменять `CACHE_NAME` при необходимости сброса кеша.
- `manifest.json`, `favicon_io/` — PWA/иконки; проверить `start_url` при деплое в подкаталог.

Проектные конвенции и важные паттерны
- Статусы: `katysty`, `keshikti`, `auyrdy`, `sebep`, `sebsez`. Исключения перечислены в `EXCEPTIONS`.
- Классы обрабатываются функциями `normalizeClassValue` / `parseClass` / `splitClass` — ожидается формат "7A" / "0Ә" без пробелов.
- Локальное сохранение: holidays в `localStorage` под ключом `katysym_holidays_v1`.
- Guard при сохранении посещаемости (фронт): ключ формата `att_saved:YYYY-MM-DD:grade:letter` — фронт ставит флаг, сервер делает overwrite/dedupe.
- Даты/периоды: `getRangeFromPeriod()` покрывает day/week/month/quarter/year/all — кварталы жёстко захардкожены в `app.js`.

Dev / run / debug
- Нет сборки — открыть проект через статический HTTP сервер. Примеры:
  - Python: `python -m http.server 8000` (запуститься в корне `/workspaces/katysym`)
  - Node: `npx http-server -c-1 .` (если установлен)
- При тестировании интеграции с API: установите `WEBAPP_URL` в `app.js` (или в `index.html`) и `API_KEY` в обоих местах, если меняете ключ.
- Service Worker может скрывать изменения — при отладке обязательно отключить/удалить SW в DevTools или увеличить `CACHE_NAME` в `sw.js`.

Частые правки и где их вносить
- Добавление/изменение статусов → правка `STATUS` в `app.js` и (при необходимости) в `index.html`.
- Изменение текста UI / переводы → обновлять `I18N` в `app.js` и `index.html` параллельно.
- Обновление списка учеников → редактировать `students.js` `rawStudents` блок. НЕ добавлять лишние обратные кавычки внутри блока.

Проверка корректности изменений
- Проверить UI: открыть `index.html` в браузере, выбрать класс, проверить загрузку списка (через API или `students.js`).
- Проверить сохранение: нажать «Сохранить», посмотреть `saveStatus` и localStorage `att_saved:*` ключи.
- Экспорт CSV: проверить ветвления — если `report.daily` пуст, код формирует экспорт из `report.totals`.

Особые замечания для AI-агента
- Перед изменениями конфигурации (URL/KEY) найдите и обновите оба места: `app.js` и `index.html`.
- Не удаляйте или не изменяйте `rawStudents` структуру — она парсится жёстко.
- При изменениях логики экспорта/импорта учитывать два источника: API (`report.daily`) и локальные структуры (`allStudents`, `studentsCache`).
- Очистка кэша SW обязательна при правке статичных файлов, иначе баги не воспроизводятся.

Если что-то непонятно — укажите файл(ы) и кратко опишите цель (исправление/фича), я дополню инструкцию.
