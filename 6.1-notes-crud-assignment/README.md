# Notes Management REST API

A clean and professional REST API built with **Node.js, Express, and MongoDB (Mongoose)** following the **MVC (Model-View-Controller)** pattern. This project handles a full set of CRUD operations including both single and bulk operations.

---

## 🔗 Links
- **Postman Published Documentation:** [View API Docs](https://documenter.getpostman.com/view/50841514/2sBXwpQCXH)
- **Live Deployed API:** [View Live API](https://backend-projects-lho4.onrender.com/)

---

## 🛠️ Tech Stack & Dependencies
- **Core:** Node.js (v18+)
- **Framework:** Express.js
- **Database ODM:** Mongoose (MongoDB)
- **Configuration:** Dotenv
- **Development Tool:** Nodemon (Auto-restarts server on file changes)

---

## 📁 Folder Structure
The project strictly follows the clean MVC design pattern:
```
6.1-notes-crud-assignment/
├── src/
│   ├── config/
│   │   └── db.js              # Mongoose database connection setup
│   ├── controllers/
│   │   └── note.controller.js # Business logic, database operations & validations
│   ├── models/
│   │   └── note.model.js      # Note schema definition and validations
│   ├── routes/
│   │   └── note.routes.js     # Endpoint routes definitions
│   ├── middlewares/           # Custom middleware folder
│   ├── app.js                 # Express server configuration & middlewares
│   └── index.js               # Entry point (connects DB & starts listening)
├── .env                       # Environment variables (ignored by git)
├── .env.example               # Example variables for reference
├── package.json               # Node.js configuration & scripts
└── Notes_Management_API.postman_collection.json # Postman Import File
```

---

## ⚡ API Endpoints

Base URL: `/api/notes`

| Method | Endpoint | Description | Payloads / Variables |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Root Welcome Endpoint | *None* |
| **POST** | `/api/notes` | Create a single note | JSON Body with `title`, `content`, `category`, `isPinned` |
| **POST** | `/api/notes/bulk` | Create multiple notes at once | JSON Body with `notes` array |
| **GET** | `/api/notes` | Get all notes | *None* |
| **GET** | `/api/notes/:id` | Get a single note by ID | Path parameter: `id` |
| **PUT** | `/api/notes/:id` | Replace a note completely | JSON Body (omitted fields reset to default) |
| **PATCH** | `/api/notes/:id` | Update specific fields | JSON Body (e.g. `{ "isPinned": true }`) |
| **DELETE** | `/api/notes/:id` | Delete a single note | Path parameter: `id` |
| **DELETE** | `/api/notes/bulk` | Delete multiple notes | JSON Body with `ids` array |

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Raushankumar0720/backend-projects.git
   cd backend-projects/6.1-notes-crud-assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the root of the project.
   - Copy-paste variables from `.env.example`:
     ```env
     MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/notes-db
     PORT=5000
     ```

4. **Run Server:**
   - **Development mode (with Nodemon):**
     ```bash
     npm run dev
     ```
   - **Production mode:**
     ```bash
     npm start
     ```
