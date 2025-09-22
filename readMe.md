# readRate
Backend API for book reviews with advanced features like search, filtered book listings, pagination, user reviews, and automatic average rating calculation.

## Steps to use and test this locally 

1. Do git clone  <link to this repo> 

2. npm i 

3. Create .env with this data inside : 
    PORT=3000
    MONGO_URI=<your-mongodb-connection-string>
    SECRET=<your-jwt-secret>
    SALT=10

4. Do -> nodemon index.js and node seedBooks.js( for putting some sampling data inside the db )

### Testing 

1. signUp : 
    curl -X POST http://localhost:3000/signup \
    -H "Content-Type: application/json" \
    -d '{"username":"ashish","email":"ashish@example.com","password":"12345678"}'

2. login : 
    curl -X POST http://localhost:3000/signup \
    -H "Content-Type: application/json" \
    -d '{"username":"ashish","email":"ashish@example.com","password":"12345678"}'

3. add book
    curl -X POST http://localhost:3000/books \
    -H "Content-Type: application/json" \
    -H "Cookie: token=<your-jwt-token>" \
    -d '{"title":"The Alchemist","description":"Story of Santiago","author":"Paulo Coelho","genre":"Fiction"}'

4. get all books 
    curl "http://localhost:3000/books?page=1&limit=5&author=Paulo&genre=Fiction"

5. search books 
    curl "http://localhost:3000/search?query=alchemist"


# All possible Testing 
Here’s the **complete Postman testing guide** formatted for a `.md` file, all in one page and without any emojis:

````markdown
# ReadRate API - Postman Testing Guide

This guide lists all possible tests for the ReadRate backend API. Use Postman or curl to test endpoints.

## 1. User Authentication

### Sign Up
- **POST** `/signup`  
- **Body (JSON):**
```json
{
  "username": "ashish",
  "email": "ashish@example.com",
  "password": "12345678"
}
````

* **Tests:**

  * Success: returns 201 and user data
  * Fail: email already exists → 400
  * Fail: missing fields → 400

### Login

* **POST** `/login`
* **Body (JSON):**

```json
{
  "email": "ashish@example.com",
  "password": "12345678"
}
```

* **Tests:**

  * Success: returns 200 and token in cookie
  * Fail: wrong password → 400
  * Fail: email not registered → 400

## 2. Books

### Add New Book (Authenticated)

* **POST** `/books`
* **Headers:** `Cookie: token=<jwt>`
* **Body (JSON):**

```json
{
  "title": "The Alchemist",
  "description": "Story of Santiago, shepherd boy",
  "author": "Paulo Coelho",
  "genre": "Fiction"
}
```

* **Tests:**

  * Success: 201 + book object
  * Fail: missing fields → 400
  * Fail: unauthenticated → 401 or 403

### Get All Books (Pagination & Filters)

* **GET** `/books?page=1&limit=5&author=Paulo&genre=Fiction`
* **Tests:**

  * Success: 200 + paginated books array
  * Filters working → returns correct subset
  * Pagination: page 1 vs page 2 returns different books

### Get Book Details (with Reviews & Average Rating)

* **GET** `/books/:id?page=1&limit=5`
* **Tests:**

  * Success: returns book details + averageRating + reviews
  * Non-existent book → 404 error

### Search Books

* **GET** `/search?query=alchemist`
* **Tests:**

  * Success: returns all books matching title or author (partial, case-insensitive)
  * Empty query → 400 error

## 3. Reviews

### Add Review (Authenticated)

* **POST** `/books/:id/reviews`
* **Headers:** `Cookie: token=<jwt>`
* **Body (JSON):**

```json
{
  "rating": 5,
  "comment": "Amazing book!"
}
```

* **Tests:**

  * Success: 201 + review object
  * Fail: rating or comment missing → 400
  * Fail: user already reviewed → 400

### Update Review (Authenticated, Own Review)

* **PUT** `/reviews/:id`
* **Headers:** `Cookie: token=<jwt>`
* **Body (JSON, optional fields):**

```json
{
  "rating": 4,
  "comment": "Changed my mind, very good"
}
```

* **Tests:**

  * Success: 200 + updated review
  * Fail: updating someone else's review → 403
  * Fail: review not found → 404

### Delete Review (Authenticated, Own Review)

* **DELETE** `/reviews/:id`
* **Headers:** `Cookie: token=<jwt>`
* **Tests:**

  * Success: 200 + message
  * Fail: deleting someone else's review → 403
  * Fail: review not found → 404


