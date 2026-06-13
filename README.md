# Chittoor Times (చిత్తూరు టైమ్స్)

An AI-powered bilingual local news platform replicating the look and feel of a classic Indian print newspaper. Deployed with a custom high-performance Node.js full-stack architecture, it automatically harvests, translates, and designs local, national, and international headlines.

---

## 📰 Concept Overview

**Chittoor Times** merges modern React engineering with the editorial aesthetic of historical print media. Styled dynamically using Tailwind CSS with rich off-white palettes, serif typography, multiple-column grids, and delicate borders, the application acts as a living portal where regional stories from Andhra Pradesh are published alongside global news.

### Key Features
1. **Live Edition**: Access today's active local, national, or international articles at a glance.
2. **AI-Powered Crawler & Translators**: Automatically scans online wire feeds, utilizes **Gemini 3.5 Flash** for editorial re-writing, and translates headlines and body prose natively into Telugu script.
3. **Historical Archives Page**: Filters and reads complete newspaper logs sorted by calendar days, powered by an archival index.
4. **Interactive Editor Desk**: Draft, translate, review, and manually publish custom columns straight to the editorial feed.
5. **Robust Local-Cloud Failovers**: Synchronizes primarily with a **Supabase (PostgreSQL)** database while providing seamless fallback mechanics to local flat file storage (`news_data.json`) during disconnects or setup states.

---

## 🛠️ Architecture and Stack

- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express, tsx (direct TypeScript execution)
- **AI Integrations**: `@google/genai` (utilizing Gemini 3.5 Flash and Google Search Grounding)
- **Database**: Supabase JS SDK (PostgreSQL primary with Row-Level Security)
- **Build System**: Vite (client-side bundling) + Esbuild (optimized server compilation into standard CommonJS)

---

## 🚀 Speed Start (Local Development)

### 1. Requirements
Ensure you have **Node.js** (v18 or higher) installed on your system.

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a file named `.env` in the root directory and specify your API credentials:

```env
# Gemini API Access
GEMINI_API_KEY=your_gemini_api_key

# Supabase Storage Integration (Optional)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Boot Dev Environment
Start the unified full-stack Express server containing Vite development middleware:
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`**.

### 5. Build for Production
To bundle the frontend application assets and compile the server TypeScript into a self-contained production bundle:
```bash
npm run build
```

Then run the production container directly:
```bash
npm run start
```

---

## 🗄️ Relational Database Scheme

If configuring Supabase, run this initial migration script inside your SQL Editor to establish the RLS security policies and indices:

```sql
-- Create news articles storage table
create table news_articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  title_te text,
  content_te text,
  category text not null,
  author text not null,
  date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Index timestamps for speed-indexing
create index idx_news_articles_created_at on news_articles(created_at desc);

-- Enable Row-Level Security
alter table news_articles enable row level security;

-- Setup anonymous reading policy
create policy "Allow public read" on news_articles
  for select using (true);

-- Setup insert authorization policy
create policy "Allow public insert" on news_articles
  for insert with check (true);
```

---

## 🎨 Design Philosophy

- **Balanced Negative Space**: Leverages clean paddings and traditional line breaks to resemble high-quality broadsheets.
- **Micro-Animations**: Uses contextual fade-in staggering for news items, allowing smooth visual tracking.
- **Contrast Ratios**: Strictly adheres to accessible contrast criteria, combining charcoal grays (`#1A1A1A`) and paper tones (`#F5F5F0`) to ensure comfortable reading.
- **Offline Integrity**: Operates beautifully even without api-keys or server access, relying on a pre-seeded mock wire pool.
