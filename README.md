# Advanced-topic-react-js

A lightweight interview preparation platform for advanced frontend engineers. Concise, practical, and developer-first — focuses on real interview problems, code-focused answers, and a live playground for testing solutions.

**Highlights**
- Clean React + Vite + TypeScript frontend with Tailwind styling
- Express + TypeScript backend with MongoDB (Mongoose) and JWT auth
- Question CRUD, answer storage (Markdown + code blocks), topic grouping
- Live coding playground (Monaco) and markdown-rendered answers

Getting started (dev)

1. Install dependencies for both frontend and backend:

```bash
# from repo root (or run per-folder)
npm install
```

2. Run dev servers:

```bash
# backend
cd backend
npm run dev

# frontend
cd ../frontend
npm run dev
```

How to contribute

- Add questions in the admin UI or via `POST /api/questions` with fields: `title`, `slug`, `category`, `tags`, `answer` (Markdown).
- Edit or delete via the UI or `PUT /api/questions/:id` and `DELETE /api/questions/:id`.
- Open a PR for feature work or bug fixes; write tests where relevant.

Notes

- Answers are stored as Markdown; rendering happens on the frontend. For safe rendering, consider `react-markdown` with sanitization plugins.
- The dev setup uses HttpOnly refresh cookies for auth flows; adjust CORS and cookie settings when deploying.

If you want this README shortened further, converted to a one-page checklist, or expanded with deployment and CI steps, tell me which style to use and I'll update it.
