# WB Tariffs Collector

Микросервис для регулярного сбора тарифов Wildberries и синхронизации с Google Таблицами.

## Функциональность

- Ежечасное получение данных о тарифах WB через API
- Сохранение данных в PostgreSQL с ежедневным обновлением
- Синхронизация актуальных тарифов с Google Таблицами

## Технологии

- **Node.js** + **TypeScript**
- **PostgreSQL** + **Knex.js**
- **Docker** + **Docker Compose**
- **Google Sheets API**

## Быстрый запуск

1. **Клонируйте репозиторий:**

   ```bash
   git clone https://github.com/Nick55555554/test-wb_google-sheets_tracking
   cd test-wb_google-sheets_tracking
   ```

2. **Создайте файл `.env` в корне проекта** со следующим содержимым:

   ```env
    POSTGRES_PORT=5432
    POSTGRES_DB=postgres
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    APP_PORT=3000
    NODE_ENV=development
    API_KEY=eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjUwNTIwdjEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTc2NTY3MDIyOSwiaWQiOiIwMTk3NmU0Yy1mZTgwLTc1NDAtODkyMi02NGE5ZWUzYTU4MzYiLCJpaWQiOjQ1OTExNjA5LCJvaWQiOjExMzA0NiwicyI6MTA3Mzc0MTgzMiwic2lkIjoiOTMyYzE3NmEtNTA4NS01YzZmLWJjMzMtNGU4NGNkZjU4ZDdlIiwidCI6ZmFsc2UsInVpZCI6NDU5MTE2MDl9.wDoH8FLdZu1049uPCmhx3UHaw28YJB-CylWeD2LgkpRZFIMlOsUlnlVmfmYKy__JWNjfbDkOtdJ69QpSD5EKag
    GOOGLE_CLIENT_EMAIL=nick-631@enduring-byte-476519-d3.iam.gserviceaccount.com
    GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD3pU5wIWU37Lva\nyuALLG70RVzAWxJy6lVq2CXeqBT06X9uIJuMFxa9vt7K4eGRMV04lcKRs+FghqyY\nxUhYiJGxNGgMhDy7hqCSeeQcuJemHrNfcdlTNqF3YJeokPKog+Ggo/MM7VOfyAAv\nByktsPjudCbilCz0L1AYn82m5ae3s/6gFNHkEEjTxGs2STPlZIm405RGvGG7z+Gm\nkTOo83ny5Ygvkg47Lv72TO3kb/rF5riK01e175dzSY/G2m7xhMut/7JWCOr0rYoZ\nj9DN3QS8OJ59Ct37HXzeZJi8q4zJ8ak4UHwBP2bXtg0WdLD3OQKxxyLgjKPz7zbi\n4pr+U8mbAgMBAAECggEAB0xwbN6XGJhaCv86rimflYRr0OF+QDPG07DOIOtMPtGY\n51p/qxfNHEeBUnJozvoo+K91Pg0SoeEmOhRqZu2TeakFPgUxswcrOVXtUqlgEs3J\n1JDK6mhsRtPqdFXdSPkmD7F1Sta9xbJDyx8HaCjUlVaIBNqAHqw8TJV9HqObF09g\nZM55pFtHeXEE9hPkIVwfHyBX2/NsbMaxHdTc8Jub9wTcuNFNK+PJ6wsI+X5X+oxI\n25DVvATriHa4C7ZOED7ocEPQz6Y6baevlvZ5q2ohEwMe17t0SXShVqfElsLJhseY\nqjQjKP1nN8j05pgrYyYQySpjbW1HtpHRsUD9jLd/7QKBgQD73iYg8qpLyGWVCOvo\nDQE06GNoJ7fpHMppjZxWphRql6qnD9cRVphHMJBK28skNNOP/d8Q89kpW7QPX801\nmqAC/fRo3YHbxZdhxOkTbfWstVh/sxbEH61yukRoshldU3Ka1KzuqCqREHmmW2yF\n0WL2HBIgWF791luDW6x9b7ur1wKBgQD7tWy+OB5fjuqtvWNdkoGeeSpkaVWrBqbZ\npLjabjjHkboE4sJYYtZ+q5EHbbq1+fHnS3RFDfIsbyjAbaHUmks2aE55dGnj7N4x\nhb+jvip6ASaEmUWtL89c38mbZPq4kOvx2nyahM+fNpy7nYhWLlMs09hRv69R+Q7c\nrAh7TRz33QKBgHWqVdPEqmxXBaX3kgZJtQubmX06OQANtD5VqvkMA7O8gTwk+Uuf\nUerINFDUl/WlPEUjzEdmNEjPD7KzBfKJ90EOlVU8ToN2rv8898pc744s9lhKOVOM\nnQJhJL5ondLsvji5LMUeCSzWLo7aXTuzE3F4sbssrcwWjZAzjsTXIyznAoGARxOB\n82zRVtZ6ejkCeAfIxkEcsWH1KOgl8UtMT5HUQrZpurt1eZPfUcGMoHZhxMUhg9iQ\nqnc3rUhuT3glvG0dU+28SxuOUygtzfoglVI7mFv+zm6heDgJ7AXdXh3zlm6F0bOK\nf++E2UaIl4nyV7OZFQ11BhCEpzcW9UU21+p8hZkCgYEAwoIvkIe/sfS8YlhA+M6+\ns8QqlndYQ0nGdkoWb3lzPF8ABZxhkJMqz3y72wGG3tCkoTm7jct2+ihVfMCTZjLs\nuBYjOgKjIYTcGjJ5mT1lXhQRuEnUsKB90AoRIx5g8MT+V7/eD0yF8+Ps3tjqYIWn\nQgP9AX5xCBc8JEk+0OgC+3Q=\n-----END PRIVATE KEY-----\n
    GOOGLE_SCOPES=https://www.googleapis.com/auth/spreadsheets
    SPREAD_SHEET_ID=1-zQtqgovzdXqgTJf9XUXoPG3Z9HtY6ZtLI0voNaCxEA
   ```

3. **Запустите приложение:**

   ```bash
   docker compose up
   ```


## Проверка работы

1. Откройте таблицу по ID: `1-zQtqgovzdXqgTJf9XUXoPG3Z9HtY6ZtLI0voNaCxEA`.
2. Убедитесь, что данные обновляются в листе `stocks_coefs`.

