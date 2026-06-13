-- Table for storing news articles
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

-- Row Level Security (Secure it for your needs)
alter table news_articles enable row level security;

-- Policy: Allow anyone to read
create policy "Allow public read" on news_articles
  for select using (true);

-- Policy: Allow authenticated insert (modify if using public insert for demo)
create policy "Allow public insert" on news_articles
  for insert with check (true);

-- Table for storing registered users
create table app_users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamp with time zone default now()
);

alter table app_users enable row level security;

create policy "Allow public read users" on app_users
  for select using (true);

create policy "Allow public insert users" on app_users
  for insert with check (true);

-- Table for storing comments
create table comments (
  id uuid default gen_random_uuid() primary key,
  article_id text not null,
  author_name text not null,
  author_email text not null,
  content text not null,
  created_at timestamp with time zone default now()
);

alter table comments enable row level security;

create policy "Allow public read comments" on comments
  for select using (true);

create policy "Allow public insert comments" on comments
  for insert with check (true);

-- Table for citizen issues
create table citizen_issues (
  id uuid default gen_random_uuid() primary key,
  reporter_name text not null,
  reporter_email text not null,
  category text not null,
  location text not null,
  subject text not null,
  description text not null,
  converted_news_id text,
  created_at timestamp with time zone default now()
);

alter table citizen_issues enable row level security;

create policy "Allow public read issues" on citizen_issues
  for select using (true);

create policy "Allow public insert issues" on citizen_issues
  for insert with check (true);

