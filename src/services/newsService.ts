export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  title_te?: string;
  content_te?: string;
  category: string;
  author: string;
  date: string;
  createdAt: string;
}

export async function generateDailyNews(topic: string = "latest news in Chittoor district", category: string = "Local"): Promise<NewsArticle[]> {
  const response = await fetch('/api/news/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, category })
  });

  if (!response.ok) {
    throw new Error(`Failed to generate news via API: ${response.statusText}`);
  }

  return await response.json();
}
