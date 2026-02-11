# BlogPost Platform

A full-featured blog posting platform with user authentication, blog management, comments, likes, ratings, and search functionality.  
Built with **Node.js, Express, PostgreSQL, Prisma ORM, JWT authentication**, and thoroughly tested with **Jest & Supertest**.

---

## 🧠 Features

### Authentication & Authorization
✔ User registration and login with JWT  
✔ Secure routes with authorization checks  
✔ Only owners can modify their own content  

### Blog Management
✔ Create, read, update, delete (CRUD) blog posts  
✔ Public read access, authenticated write access  
✔ Blog search by title and content  

### Interactions
✔ Comments — create, update, delete (owner only)  
✔ Likes — toggle like/unlike  
✔ Ratings — 1–5 rating per user per blog  

### Testing
✔ Automated test coverage using Jest + Supertest

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT (JSON Web Tokens) |
| Testing | Jest, Supertest |

---

## 📦 Getting Started

### Clone the Repository

```bash
git clone https://github.com/ermiHageez/BlogPost.git

cd BlogPost/backend

Install Dependencies

npm install

Environment Variables

Create a .env file with:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/blogdb"

JWT_SECRET="your_jwt_secret"

PORT=5000

Run Database Migration
npx prisma migrate dev --name init

Start the Server (Development)
npm run dev

📡 API Endpoints
Authentication
Method	Path	Description
POST	/auth/register	Register new user
POST	/auth/login	Login and get JWT
Blogs
Method	Path	Description
GET	/blogs	List blogs
POST	/blogs	Create blog (auth)
GET	/blogs/:id	Get single blog
PATCH	/blogs/:id	Update blog (owner only)
DELETE	/blogs/:id	Delete blog (owner only)
Comments
Method	Path	Description
POST	/comments	Create comment
PATCH	/comments/:id	Update comment
DELETE	/comments/:id	Delete comment
Likes
Method	Path	Description
POST	/likes	Like/Unlike blog
Ratings
Method	Path	Description
POST	/ratings	Rate a blog (1–5)
Search
Method	Path	Description
GET	/search/blogs?q=…	Search blogs
GET	/search/users?q=…	Search users

🧪 Running Tests

npm test

📌 Notes

✔ Secure and extensible backend design
✔ Clean route separation and authorization logic
✔ Easily integratable with frontend frameworks (React, Next.js, etc.)

📈 Next Improvements

AI text enhancement workflow using Hugging Face

Pagination and rate limiting
---
