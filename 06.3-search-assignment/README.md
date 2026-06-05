# Notes Search & Combined Queries API — REST API with Search, Filters, Pagination & Sorting

A robust backend REST API built from scratch with **Node.js, Express, and MongoDB (Mongoose)** following the clean **MVC (Model-View-Controller)** pattern. This assignment implements comprehensive text search using MongoDB regex and combines filtering, sorting, pagination, and search concepts into dynamic query endpoints.

---

## 🔗 Links
- **Postman Published Documentation:** [View API Docs](https://documenter.getpostman.com/view/50841514/2sBXwpQCgC) *(Update once published)*
- **Live Deployed API:** [View Live API](https://backend-projects-6ocn.onrender.com/)

---

## 📁 Project Structure
The project strictly implements the clean MVC folder architecture:
```
notes-app/
├── src/
│   ├── config/
│   │   └── db.js                 # Mongoose connection bootstrapper
│   ├── models/
│   │   └── note.model.js         # Schema definition with validations
│   ├── controllers/
│   │   └── note.controller.js    # Implementation of 18 endpoint handlers
│   ├── routes/
│   │   └── note.routes.js        # Route precedence mapping
│   ├── app.js                    # Express app configuration & middlewares
│   └── index.js                  # Entry point (connects DB & boots server)
├── .env                          # Local environment variables (ignored by Git)
├── .env.example                  # Template variables
├── package.json                  # Dependencies configuration
└── Notes_Search_API.postman_collection.json # Postman Import File
```

---

## ⚡ API Endpoints

### CRUD Endpoints (1-8)
- **POST** `/api/notes` — Create a single note
- **POST** `/api/notes/bulk` — Create multiple notes in one request
- **GET** `/api/notes` — Fetch all notes
- **GET** `/api/notes/:id` — Fetch note details by ID
- **PUT** `/api/notes/:id` — Replace note completely (fields not sent reset to defaults)
- **PATCH** `/api/notes/:id` — Partially update selected note fields
- **DELETE** `/api/notes/:id` — Delete a note by ID
- **DELETE** `/api/notes/bulk` — Delete bulk notes by providing IDs array in request body

### Search Endpoints (9-11)
- **GET** `/api/notes/search?q=<keyword>` — Search case-insensitively in note title only
- **GET** `/api/notes/search/content?q=<keyword>` — Search case-insensitively in content field only
- **GET** `/api/notes/search/all?q=<keyword>` — Search keyword in either title or content (uses MongoDB `$or`)

### Two Concepts Combined Endpoints (12-15)
- **GET** `/api/notes/filter-sort` — Filter results by category/pinned status, and sort dynamically
- **GET** `/api/notes/filter-paginate` — Filter results and paginate them (returns metadata block)
- **GET** `/api/notes/sort-paginate` — Sort all notes and paginate
- **GET** `/api/notes/search-filter` — Search text and apply filter filters concurrently

### Three Concepts Combined Endpoints (16-17)
- **GET** `/api/notes/search-sort-paginate` — Search keyword, sort results, and paginate
- **GET** `/api/notes/filter-sort-paginate` — Filter by criteria, sort, and paginate

### Master Query Endpoint (18)
- **GET** `/api/notes/query` — Supports any combination of search (`q`), filter (`category`/`isPinned`), sorting (`sortBy`/`order`), and pagination (`page`/`limit`). Every parameter is optional.

---

## ⚙️ Setup and Installation

1. **Clone & Navigate:**
   ```bash
   git clone https://github.com/Raushankumar0720/backend-projects.git
   cd backend-projects/06.3-search-assignment
   ```

2. **Install Packages:**
   ```bash
   npm install
   ```

3. **Configure Variables:**
   Create a `.env` file in the folder root:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/notes-db
   PORT=5000
   ```

4. **Boot Server:**
   ```bash
   npm run dev
   ```
