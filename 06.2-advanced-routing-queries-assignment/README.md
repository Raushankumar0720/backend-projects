# Notes Advanced API — REST API with Route Params, Query Params, Pagination & Sorting

A fresh implementation of the Notes Management API extending basic CRUD capabilities with advanced querying features (route parameters, query parameters, sorting, and pagination). Follows the clean **MVC (Model-View-Controller)** pattern.

---

## 🔗 Links
- **Postman Published Documentation:** [View API Docs](https://documenter.getpostman.com/view/50841514/2sBXwpQCgC)
- **Postman Import File:** [`Notes_Advanced_API.postman_collection.json`](./Notes_Advanced_API.postman_collection.json)
- **Live Deployed API:** [View Live API](https://backend-projects-6ocn.onrender.com/)

---

## 🛠️ Features & Key Concepts

### 1. Route Parameters (Dynamic URL Paths)
- Fetch notes of a specific category directly in the URL: `/category/work`
- Fetch notes based on pinned status: `/status/true`
- Retrieve note summaries, excluding the body `content`: `/:id/summary`

### 2. Query Parameters (Optional Filters)
- Dynamic filtering by multiple optional criteria (e.g. `?category=study&isPinned=false`)
- Dedicated pinned filter with optional sub-filtering
- Custom field filter `?name=work`
- Date range query filtering by `from` and `to` dates (`createdAt` `$gte` and `$lte`)

### 3. Pagination
- Returns results in pages to avoid data overload.
- Formula: `skip = (page - 1) * limit`
- Custom metadata block returned in response:
  ```json
  "pagination": {
    "total": 21,
    "page": 2,
    "limit": 5,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": true
  }
  ```

### 4. Sorting
- Dynamic sorting by `title`, `createdAt`, `updatedAt`, and `category` in `asc` or `desc` order.
- Validates the sort fields to protect the database query from invalid input.

---

## ⚡ API Endpoints

### CRUD Mappings
- **POST** `/api/notes` — Create note
- **POST** `/api/notes/bulk` — Create bulk notes
- **GET** `/api/notes` — Read all notes
- **GET** `/api/notes/:id` — Read note by ID
- **PUT** `/api/notes/:id` — Replace note completely
- **PATCH** `/api/notes/:id` — Update specific fields
- **DELETE** `/api/notes/:id` — Delete note
- **DELETE** `/api/notes/bulk` — Delete bulk notes by IDs

### Route Parameters
- **GET** `/api/notes/category/:category` — Filter by category (e.g. `/category/work`)
- **GET** `/api/notes/status/:isPinned` — Filter by pinned status (e.g. `/status/true`)
- **GET** `/api/notes/:id/summary` — Excludes `content` field from payload

### Query Parameters
- **GET** `/api/notes/filter` — Dynamic filtering (`?category=work&isPinned=true`)
- **GET** `/api/notes/filter/pinned` — Get pinned notes (`?category=study`)
- **GET** `/api/notes/filter/category` — Filter by category name query (`?name=work`)
- **GET** `/api/notes/filter/date-range` — Date range query (`?from=2024-01-01&to=2024-12-31`)

### Pagination & Sorting
- **GET** `/api/notes/paginate` — Paginate all notes (`?page=1&limit=5`)
- **GET** `/api/notes/paginate/category/:category` — Paginated category notes
- **GET** `/api/notes/sort` — Sort notes (`?sortBy=title&order=asc`)
- **GET** `/api/notes/sort/pinned` — Sort pinned notes (`?sortBy=createdAt&order=desc`)

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Raushankumar0720/backend-projects.git
   cd backend-projects/06.2-advanced-routing-queries-assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the root of the folder.
   - Copy-paste variables from `.env.example` and set your MongoDB Atlas credentials:
     ```env
     MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/notes-db
     PORT=5000
     ```

4. **Run Server:**
   ```bash
   npm run dev
   ```
