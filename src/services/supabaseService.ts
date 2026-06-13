import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Local storage or mock data might be used.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  date: string;
  createdAt: string;
}

export const newsService = {
  async fetchNews() {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data as NewsArticle[];
  },

  async uploadArticle(article: Omit<NewsArticle, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('news_articles')
      .insert([{
        ...article,
        createdAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data as NewsArticle;
  }
};
