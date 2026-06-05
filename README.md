# 🚀 Node.js Backend Projects Portfolio

Welcome to my backend projects collection built with **Node.js, Express, and MongoDB (Mongoose)** following the clean **MVC (Model-View-Controller)** pattern. This repository showcases a step-by-step progress from basic CRUD services to advanced pagination, dynamic sorting, and case-insensitive regex search engines.

---

## 📂 Repository Index

| Project Folder | Assignment | Key Highlights | Links & Docs |
| :--- | :--- | :--- | :--- |
| **[`6.1-notes-crud-assignment`](./6.1-notes-crud-assignment/)** | **Assignment 01** | Basic CRUD, bulk endpoints, Mongoose schema validations, status code management. | [📖 Postman Docs](https://documenter.getpostman.com/view/50841514/2sBXwpQCXH) <br> [🌐 Live Deployed API](https://backend-projects-lho4.onrender.com/) |
| **[`06.2-advanced-routing-queries-assignment`](./06.2-advanced-routing-queries-assignment/)** | **Assignment 02** | Route parameters, dynamic query filters, pagination metadata, custom sorting fields. | [📖 Postman Docs](https://documenter.getpostman.com/view/50841514/2sBXwpQCgC) <br> [🌐 Live Deployed API](https://backend-projects-6ocn.onrender.com/) |
| **[`06.3-search-assignment`](./06.3-search-assignment/)** | **Assignment 03** | Text search via MongoDB `$regex`, dual/triple concepts merge, Master Query Builder. | [📖 Postman Docs](https://documenter.getpostman.com/view/50841514/2sBXwqqA6C) <br> [🌐 Live Deployed API](https://backend-projects-1-9ukj.onrender.com/) |

---

## 💻 Projects Overview

### 1. Notes Management CRUD API (`6.1-notes-crud-assignment`)
* **Objective:** Implement a solid backend CRUD foundation from scratch.
* **Key Features:**
  - Create, read, update, replace, and delete notes.
  - Supports bulk creation (`POST /api/notes/bulk`) and bulk deletion (`DELETE /api/notes/bulk`).
  - Implements custom Mongoose validation for title and content fields.
  - Returns standard API response payloads in JSON format.

---

### 2. Advanced Routing & Queries API (`06.2-advanced-routing-queries-assignment`)
* **Objective:** Learn dynamic route variables and backend query parameters.
* **Key Features:**
  - Dynamic route parameter path routing: `/api/notes/category/:category` and `/api/notes/status/:isPinned`.
  - Exclude fields from JSON payloads using MongoDB projection: `/api/notes/:id/summary`.
  - Pagination offset calculations: `(page - 1) * limit` with detailed metadata block (totalPages, hasNextPage, total records count).
  - Dynamic column sorting (`asc`/`desc`) using validation logic to block invalid sort params.

---

### 3. Notes Search & Combined Queries API (`06.3-search-assignment`)
* **Objective:** Combine multiple queries, sorting, pagination, and text search into production-level endpoints.
* **Key Features:**
  - Case-insensitive regex text search across titles, content, or both using MongoDB `$or` logic.
  - Merged logic endpoints (e.g. search + paginate, filter + sort + paginate) that safely combine query parameters before querying the database.
  - **Master Query Endpoint (`GET /api/notes/query`):** A single request handler supporting optional search keywords (`q`), category filters, pinning flags, dynamic sorting fields, and pagination limits simultaneously.

---

## ⚙️ How to Run Locally

To boot any of the assignments locally:
1. Clone the repository and navigate into the target folder:
   ```bash
   git clone https://github.com/Raushankumar0720/backend-projects.git
   cd backend-projects/<folder-name>
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Setup env variables:
   Create a `.env` file in the folder root:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. Run server in development mode:
   ```bash
   npm run dev
   ```
