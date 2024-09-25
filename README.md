# Todolist API

## Instalasi

1. Clone repository:

    ```bash
    git clone https://github.com/safiarazl/todolist-expressjs.git
    ```
2. Masuk ke direktori project:

    ```bash
    cd todolist-expressjs
    ```
3. Install dependencies:

    ```bash
    npm install
    ```
4. Copy file `.env.example` ke `.env`:

    ```bash
    cp .env.example .env
    ```
5. Sesuaikan konfigurasi database pada file `.env`:

    ```env
    DB_HOST
    DB_USER
    DB_PASSWORD
    DB_NAME
    ```
6. Jalankan migrasi database:

    ```bash
    npx prisma migrate dev
    ```
7. Jalankan aplikasi:

    ```bash
    npm run dev
    ```
8. Aplikasi dapat diakses pada `http://localhost:3000`.
9. Untuk menjalankan user test:

    ```bash
    npm run testUser
    ```
10. Untuk menjalankan task test:

    ```bash
    npm run testTask
    ```
11. Untuk menjalankan test user dan task:

    ```bash
    npm run test
    ```


# User API Spec

## Register User API

Endpoint : POST /api/users/register

Request Body :

```json
{
  "username": "safiar",
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "safiar"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username already exists"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "safiar",
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "safiar",
    "token": "jwt-token"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username or password wrong"
}
```

## Update User API

Endpoint : PATCH /api/users/current

Headers :

- Authorization : token

Request Body :

```json
{
  "newusername": "safiarbaru", // optional
  "password": "new password" // optional
}
```

Response Body Success :

```json
{
  "data": {
    "username": "safiarbaru"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Get User API

Endpoint : GET /api/users/current

Headers :

- Authorization : token

Response Body Success:

```json
{
  "data": {
    "username": "safiarbaru",
    "token": "jwt-token"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

# Task API Spec

## Create Task API

Endpoint : POST /api/Task/create

Headers :

- Authorization : token

Request Body :

```json
{
  "title": "task pertama", //required
  "description": "melakukan test dengan benar", //optional
  "completed": false //optional
}
```

Response Body Success :

```json
{
  "data": {
    "title": "task pertama",
    "description": "melakukan test dengan benar",
    "completed": false,
    "username": "safiarbaru"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Update Task API

Endpoint : PUT /api/task/:taskid

Headers :

- Authorization : token

Request Body :

```json
{
  "id": 1, //required
  "title": "pembaruan task", //optional
  "description": "melakukan test yang baru dengan benar", //optional
  "completed": true //optional
}
```

Response Body Success :

```json
{
  "data": {
    "title": "pembaruan task",
    "description": "melakukan test yang baru dengan benar",
    "completed": true,
    "username": "safiarbaru"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Get Task API

Endpoint : GET /api/task/:taskid

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "title": "task pertama",
    "description": "melakukan test dengan benar",
    "completed": false,
    "username": "akunbaru"
  }
}
```

Response Body Error :

```json
{
  "errors": "Task is not found"
}
```

## Search Task API

Endpoint : GET /api/Task

Headers :

- Authorization : token

Query params :

- title : Search by title, using like, optional
- description : Search by description using like, optional
- completed : Search by completed using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "title": "pembaruan test",
      "description": "melakukan test yang baru dengan benar",
      "completed": false,
      "username": "safiarbaru"
    },
    {
      "title": "test 2",
      "description": "melakukan test 2 dengan benar",
      "completed": false,
      "username": "safiarbaru"
    },
    {
      "title": "test 3",
      "description": "melakukan test 3 dengan benar",
      "completed": false,
      "username": "safiarbaru"
    },
    {
      "title": "berbenah",
      "description": "melakukan test 4 dengan benar",
      "completed": false,
      "username": "safiarbaru"
    }
  ],
  "paging": {
    "page": 1,
    "totalItems": 4,
    "totalPages": 1
  }
}
```

Response Body Error :

## Remove Task API

Endpoint : DELETE /api/task/:taskid

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Task is not found"
}
```
