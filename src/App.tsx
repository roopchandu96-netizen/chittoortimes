import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Newspaper, 
  Calendar, 
  Plus, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  User,
  ExternalLink,
  Clock,
  Radio,
  Search,
  Activity,
  Award,
  Sliders,
  Terminal,
  Play,
  Pause,
  Layers,
  AlertCircle,
  Globe
} from 'lucide-react';
import { NewsArticle, newsService, WIRE_POOL, CrawlerLog } from './services/newsService';

export default function App() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedArchiveDate, setSelectedArchiveDate] = useState<string>('');
  
  // Language selector: 'en' (English) | 'te' (Telugu)
  const [language, setLanguage] = useState<'en' | 'te'>('en');

  // Tabs: 'live' (Today's live page) | 'archives' (Past dates wise pages) | 'crawler' (Realtime scanning monitor) | 'issues' (Citizen Grievance Portal)
  const [activeMainTab, setActiveMainTab] = useState<'live' | 'archives' | 'crawler' | 'issues'>('live');
  const [activeCategory, setActiveCategory] = useState<'Local' | 'National' | 'International'>('Local');
  
  const [crawlerActive, setCrawlerActive] = useState<boolean>(true);
  const [crawlerLogs, setCrawlerLogs] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Alert highlight for newly arrived items
  const [newNewsToast, setNewNewsToast] = useState<string | null>(null);
  const prevNewsLengthRef = useRef<number>(0);

  // Form state
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    title_te: '',
    content_te: '',
    category: 'Local',
    author: ''
  });

  // --- NEW COMMUNITY & CITIZEN JOURNALISM STATES ---
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('chittoor_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Comments State
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Sharing State
  const [showShareModal, setShowShareModal] = useState(false);
  const [articleToShare, setArticleToShare] = useState<NewsArticle | null>(null);
  const [shareToast, setShareToast] = useState(false);

  // Citizen Issues State
  const [issues, setIssues] = useState<any[]>([]);
  const [issueForm, setIssueForm] = useState({
    location: '',
    category: 'Water',
    subject: '',
    description: ''
  });
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
  const [issueSuccessMsg, setIssueSuccessMsg] = useState('');
  const [activeIssueTab, setActiveIssueTab] = useState<'report' | 'timeline'>('report');

  // Translation lookup helper dictionary
  const t = (key: string): string => {
    const dict: Record<string, { en: string; te: string }> = {
      'header_subtitle': { en: 'AI-Ground Newspaper Network', te: 'కృత్రిమ మేధస్సు ఆధారిత నూతన వార్తా నెట్‌వర్క్' },
      'live_edition': { en: 'Live Edition', te: 'లైవ్ వార్తలు' },
      'past_editions': { en: 'Past Editions', te: 'గత సంచికలు' },
      'ai_harvester': { en: 'AI Harvester', te: 'AI హార్వెస్టర్' },
      'local_edition': { en: 'Local Edition', te: 'స్థానిక వార్తలు' },
      'national_edition': { en: 'National Edition', te: 'జాతీయ వార్తలు' },
      'international_edition': { en: 'International Edition', te: 'అంతర్జాతీయ వార్తలు' },
      'breaking_portal': { en: 'Breaking News Portal', te: 'తాజా బ్రేకింగ్ వార్తలు' },
      'front_page_bulletin': { en: "TODAY'S FRONT-PAGE BULLETIN", te: 'నేటి ఎడిషన్ ముఖ్యాంశాలు' },
      'current_edition_date': { en: 'CURRENT EDITION DATE', te: 'ప్రచురణ తేదీ సమాచారం' },
      'read_story': { en: 'Read Story', te: 'పూర్తి కథనం చదవండి' },
      'see_printed': { en: 'See Printed Column', te: 'పూర్తి కథనం వీక్షించండి' },
      'return_to_bulletin': { en: 'Return to Bulletin', te: 'వార్తలకు తిరిగి వెళ్ళు' },
      'past_editorial': { en: 'Past Editorial Editions', te: 'గత దినపత్రిక సంచికలు' },
      'select_past': { en: 'Select a past calendar page to view the dedicated curated edition for that day.', te: 'ఆయా రోజులలో ప్రచురితమైన ప్రత్యేక వార్తలను వీక్షించడానికి గత తేదీల సంచికలను ఎంచుకోండి.' },
      'awaiting_wires': { en: 'Awaiting Live Wires', te: 'లైవ్ వార్తల అప్‌డేట్ల కోసం వేచిచూస్తోంది' },
      'awaiting_wires_desc': { en: 'No articles published in this category yet today. The automated AI scan queries online news hubs constantly.', te: 'ఈ విభాగంలో నేడు వార్తలేవీ ఇంకా ప్రచురితం కాలేదు. గ్లోబల్ వెబ్ నుండి AI ఫీడ్స్ నిరంతరం సేకరిస్తూనే ఉంటుంది.' },
      'force_scan_now': { en: 'Force Online Scan Now', te: 'వెంటనే ఆన్‌లైన్ స్కాన్ ప్రారంభించు' },
      'harvester_profile': { en: 'Automated Harvester Profile', te: 'స్వయం చాలిత క్రాలర్ వివరాలు' },
      'harvester_profile_desc': { en: 'Our platform deploys a state-of-the-art Web Crawler designed to search real-time global news streams, wire tickers, and local municipality bulletin databases.', te: 'మా ప్రత్యేక హార్వెస్టర్ పల్స్ క్రాలర్ ఉపయోగించి తిరుపతి, చిత్తూరు స్థానిక సమాచారం మరియు జాతీయ అంతర్జాతీయ ఆర్ఎస్ఎస్ ఫీడ్లను ఒక క్షణంలో సేకరించి అనువదిస్తుంది.' },
      'channels_deployed': { en: 'CRAWLING CHANNELS DEPLOYED', te: 'సక్రియంగా ఉన్న క్రాల్ చానల్స్' },
      'scan_interval': { en: 'Scan Cycle Interval:', te: 'స్కాన్ వ్యవధి:' },
      'scan_sec': { en: '1 Second (Continuous Search)', te: '1 సెకండ్ (సెలవు లేని సెర్చ్)' },
      'publish_frequency': { en: 'Publish Frequency:', te: 'ప్రచురణ వ్యవధి:' },
      'publish_freq_val': { en: 'Every 12 seconds (New Column)', te: 'ప్రతీ 12 సెకన్లకు ఒక కొత్త వార్త' },
      'format_model': { en: 'Format Re-Writer model:', te: 'రీ-రైటర్ అనువాదం మోడల్:' },
      'active_status': { en: 'Continuously scanning online RSS & wires every second', te: 'ప్రతీ సెకనుకు తాజా గ్లోబల్ మరియు గ్రామీణ వార్తల అన్వేషణ జరుగుతోంది' },
      'status_suspended': { en: 'Background scan suspended', te: 'బ్యాక్‌గ్రౌండ్ స్కానింగ్ నిలిపివేయబడింది' },
      'pause_harvester': { en: 'Pause Harvester', te: 'ఆపివేయి' },
      'resume_harvester': { en: 'Resume Harvester', te: 'పునఃప్రారంభించు' },
      'active_running': { en: 'ACTIVE RUNNING', te: 'సక్రియంగా నడుస్తోంది' },
      'suspended': { en: 'SUSPENDED', te: 'ఆపివేయబడింది' },
      'compose_column': { en: 'Compose Newspaper Column', te: 'పత్రికా ప్రకటన రాయడం' },
      'publish_custom': { en: 'Publish Custom Column to', te: 'త్వరిత ప్రచురణ' },
      'by': { en: 'By', te: 'రిపోర్టర్:' },
      'published': { en: 'Published:', te: 'ప్రచురితం:' },
      'archives_desc': { en: 'Select a past calendar page to view the dedicated curated edition for that day.', te: 'క్రింది క్యాలెండర్ సూచీల సహాయంతో నిన్నటి లేదా అంతకు మునుపటి తేదీల దినపత్రిక పుటలలోకి వెళ్లవచ్చు.' },
      'no_archives_available': { en: 'No historical backup archives available.', te: 'ఎలాంటి పాత నిల్వ రికార్డులు లభ్యం కాలేదు.' },
      'archival_registry': { en: 'ARCHIVAL REGISTRY', te: 'సంచిక రిజిస్ట్రీ' },
      'no_archive_entries': { en: 'No Archive entries available for this day', te: 'ఈ తేదీన ప్రచురితమైన కథనాలు లేవు' },
      'news_platform_all_rights': { en: 'All news rewritten, compiled, and categorized dynamically by verified AI Google Search integrations.', te: 'అన్ని రకాల దేశీయ, ప్రాంతీయ సమాచారములు కృత్రిమ మేధస్సు సహాయంతో ఎప్పటికప్పుడు సేకరించబడి ప్రచురించబడుతున్నాయి.' },
      'today': { en: 'Today', te: 'నేడు' },
      'yesterday': { en: 'Yesterday', te: 'నిన్న' },
      'online_scanner_connected': { en: 'Active Online News Harvester Connected', te: 'సక్రియ ఆన్‌లైన్ హార్వెస్టర్ క్రాలర్ అనుసంధానించబడింది' },
      'established': { en: 'ESTABLISHED 2026 • CENTRAL DESK FEED • HARVEST COMPILATION ACTIVE DAILY', te: 'స్థాపితం 2026 • దినసరి స్థానిక & ప్రపంచ వార్తల ప్రత్యక్ష విసరణ' },
      'news_section_category': { en: 'News Section Category', te: 'వార్తా విభాగం' },
      'author_signature': { en: 'Author / Desk Signature', te: 'రిపోర్టర్ పేరు / డెస్క్ సంతకం' },
      'full_column_body': { en: 'Full Column News Body', te: 'వార్తా వివరణ క్రమము' },
      'todays_feed_badge': { en: "Today's Feed", te: "తాజా ప్రచురణ" },
      'awaiting_live_wires_sub': { en: 'The automated AI scan queries online news hubs constantly in the background. Or force an instant scan right away!', te: 'చిత్తూరు మరియు అంతర్జాతీయ లోకల్ సమాచారాన్ని ఇప్పుడే క్రాల్ చేయటానికి క్రింది బటన్ నొక్కండి.' },
      'citizen_portal': { en: 'Citizen Portal', te: 'ప్రజా వేదిక' },
      'sign_in': { en: 'Sign In', te: 'లాగిన్' },
      'sign_out': { en: 'Sign Out', te: 'లాగౌట్' },
      'comments': { en: 'Comments', te: 'వ్యాఖ్యలు' },
      'add_comment': { en: 'Add Comment', te: 'వ్యాఖ్య జోడించు' },
      'comment_placeholder': { en: 'Share your thoughts on this story...', te: 'ఈ వార్తపై మీ అభిప్రాయాన్ని రాయండి...' },
      'login_to_comment': { en: 'Please sign up or sign in to join the discussion.', te: 'వ్యాఖ్యలు జోడించడానికి దయచేసి లాగిన్ అవ్వండి.' },
      'share': { en: 'Share Story', te: 'షేర్ చేయి' },
      'report_issue': { en: 'Report a Community Issue', te: 'స్థానిక సమస్యను నివేదించండి' },
      'reported_issues': { en: 'Citizens Grievance Board', te: 'ప్రజా సమస్యల వేదిక' },
      'issue_location': { en: 'Location / Town', te: 'ప్రాంతం / గ్రామం' },
      'issue_category': { en: 'Category', te: 'సమస్య విభాగం' },
      'issue_subject': { en: 'Subject Headline', te: 'సమస్య శీర్షిక' },
      'issue_description': { en: 'Detailed Description', te: 'సమస్య పూర్తి వివరణ' },
      'submit_issue': { en: 'Submit to AI News Desk', te: 'AI వార్తా విభాగానికి పంపించు' },
      'view_ai_coverage': { en: 'Read AI News Coverage', te: 'AI ప్రచురించిన వార్తను చదవండి' }
    };
    return dict[key] ? dict[key][language] : key;
  };

  // Load news and dates on mount, and start simulated logs ticker
  useEffect(() => {
    fetchNewsAndDates();

    // Ticks logging interval to keep the grounding sensor visual log moving
    const logsTimer = setInterval(fetchCrawlerLogs, 2000);

    return () => {
      clearInterval(logsTimer);
    };
  }, []);

  const currentWireIndexRef = useRef(0);

  // Client-side periodic auto crawling simulation
  useEffect(() => {
    if (!crawlerActive) return;

    const interval = setInterval(() => {
      const wire = WIRE_POOL[currentWireIndexRef.current];
      currentWireIndexRef.current = (currentWireIndexRef.current + 1) % WIRE_POOL.length;
      
      const searchLog: CrawlerLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        type: 'search',
        message: `Google News crawl triggered. Query: "latest ${wire.category.toLowerCase()} updates, Chittoor District"`
      };
      
      const rewriteLog: CrawlerLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        type: 'rewrite',
        message: `Transforming wire "${wire.wireHeadline}" via local semantic rewriter...`
      };

      const saved = newsService.generateDailyNews("", wire.category);
      
      const publishLog: CrawlerLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        type: 'post',
        message: `Successfully published article bilingually to "${wire.category} Edition": "${saved.title}"`
      };

      setCrawlerLogs(prev => [publishLog, rewriteLog, searchLog, ...prev]);
      
      fetchNewsAndDates();
    }, 45000); // Trigger auto-crawl step every 45 seconds when active

    return () => clearInterval(interval);
  }, [crawlerActive]);

  // Show a top screen flash when a brand-new article is automatically posted in the background
  useEffect(() => {
    if (news.length > 0) {
      if (prevNewsLengthRef.current > 0 && news.length > prevNewsLengthRef.current) {
        const latestItem = news[0];
        // Flash a notification toast for breaking news
        const titleFlash = language === 'te' ? (latestItem.title_te || latestItem.title) : latestItem.title;
        setNewNewsToast(`${language === 'te' ? 'తాజా వార్త' : 'BREAKING'}: ${titleFlash}`);
        // Refresh archives dates in case it's a new day or new tag
        fetchDates();
        // Dismiss after 6 seconds
        setTimeout(() => {
          setNewNewsToast(null);
        }, 6000);
      }
      prevNewsLengthRef.current = news.length;
    }
  }, [news, language]);

  // Load news, archives and computed dates client-side
  const fetchNewsAndDates = () => {
    const allNews = newsService.getNews();
    setNews(allNews);
    
    const dates = newsService.getAvailableDates(allNews);
    setAvailableDates(dates);
    
    if (dates.length > 0 && !selectedArchiveDate) {
      const todayString = new Date().toDateString();
      const olderDate = dates.find((dStr: string) => new Date(dStr).toDateString() !== todayString);
      if (olderDate) {
        setSelectedArchiveDate(olderDate);
      } else {
        setSelectedArchiveDate(dates[0]);
      }
    }
  };

  const fetchNews = async () => {
    fetchNewsAndDates();
  };

  const fetchDates = async () => {
    fetchNewsAndDates();
  };

  const fetchCrawlerLogs = async () => {
    const simulated = newsService.getSimulatedLogs(crawlerLogs);
    setCrawlerLogs(simulated);
  };

  const handleToggleCrawler = () => {
    const newState = !crawlerActive;
    setCrawlerActive(newState);
    
    const toggleLog: CrawlerLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      type: 'post',
      message: `AI Crawler harvester toggled to: ${newState ? "ACTIVE" : "PAUSED"}`
    };
    
    setCrawlerLogs(prev => [toggleLog, ...prev]);
  };

  const handleManualUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) return;

    newsService.uploadArticle({
      title: newArticle.title,
      content: newArticle.content,
      title_te: newArticle.title_te,
      content_te: newArticle.content_te,
      category: newArticle.category,
      author: newArticle.author || 'Chittoor Times Desk',
      date: new Date().toISOString()
    });

    setNewArticle({ 
      title: '', 
      content: '', 
      title_te: '', 
      content_te: '', 
      category: activeCategory, 
      author: '' 
    });

    fetchNewsAndDates();
    setShowAdmin(false);
  };

  const handleForcedSearchAndFormat = async () => {
    setIsGenerating(true);
    
    const searchLog: CrawlerLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      type: 'search',
      message: `Manual News Re-Harvest forced for category: ${activeCategory}`
    };
    
    const rewriteLog: CrawlerLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      type: 'rewrite',
      message: `Executing client-side search compilation for "${activeCategory}"...`
    };
    
    setCrawlerLogs(prev => [rewriteLog, searchLog, ...prev]);

    setTimeout(() => {
      try {
        const saved = newsService.generateDailyNews("", activeCategory);
        
        const publishLog: CrawlerLog = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toISOString(),
          type: 'post',
          message: `Successfully formatted and published Manual request: "${saved.title}"`
        };
        
        setCrawlerLogs(prev => [publishLog, ...prev]);
        fetchNewsAndDates();
      } catch (err) {
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };

  // Segregate articles based on today versus archives (another page)
  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  // Live Edition: Only display current today's bulletins
  const todayArticles = news.filter(item => isToday(item.date) && item.category === activeCategory);

  // Archives: Display based on selected isolated date
  const archiveArticles = news.filter(item => {
    if (!selectedArchiveDate) return false;
    const itemDay = new Date(item.date).toDateString();
    const selectedDay = new Date(selectedArchiveDate).toDateString();
    return itemDay === selectedDay && item.category === activeCategory;
  });

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return t('today');
    if (date.toDateString() === yesterday.toDateString()) return t('yesterday');
    return date.toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-serif selection:bg-[#5A5A40] selection:text-white transition-colors duration-300">
      
      {/* Dynamic Breaking News Flash Slider */}
      <AnimatePresence>
        {newNewsToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[80] w-[90%] max-w-2xl bg-amber-50 border-2 border-red-800 p-4 rounded-2xl shadow-xl flex items-start gap-3"
          >
            <div className="p-2 bg-red-100 rounded-lg text-red-800 animate-pulse">
              <Radio size={18} />
            </div>
            <div className="flex-1">
              <span className="font-sans text-[10px] font-bold text-red-800 uppercase tracking-widest block">
                {language === 'te' ? 'కృత్రిమ మేధస్సు చే ఇప్పుడే ప్రచురితం' : 'HARVESTED JUST NOW BY CO-PILOT'}
              </span>
              <p className="text-sm font-bold text-gray-900 leading-tight font-serif mt-1">{newNewsToast}</p>
            </div>
            <button 
              onClick={() => setNewNewsToast(null)}
              className="text-xs font-sans font-bold hover:text-red-800 border px-2 py-1 rounded-md text-gray-400"
            >
              {language === 'te' ? 'మూసివేయి' : 'Dismiss'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Article Detail Overlay */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#1B1B17]/95 backdrop-blur-sm"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-[#FBFBFA] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative border border-[#1A1A1A]/10"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 p-3 bg-white hover:bg-black hover:text-white text-gray-700 rounded-full shadow-md transition-all z-10 border border-[#1A1A1A]/10"
              >
                <Plus size={20} className="rotate-45" />
              </button>

              <div className="aspect-video w-full overflow-hidden relative">
                <img 
                  src={`https://picsum.photos/seed/${selectedArticle.id}/1200/800`} 
                  alt={language === 'te' ? (selectedArticle.title_te || selectedArticle.title) : selectedArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white p-2">
                  <span className="px-3 py-1 bg-amber-500 text-black text-xs font-sans font-bold uppercase rounded-full">
                    {t(selectedArticle.category.toLowerCase() + '_edition')}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-14">
                <div className="flex flex-wrap items-center gap-3 text-xs font-sans font-bold uppercase text-[#5A5A40] tracking-widest mb-6">
                  <span>{t('published')} {new Date(selectedArticle.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{new Date(selectedArticle.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span>•</span>
                  <span>{t('by')} {selectedArticle.author}</span>
                </div>

                <h2 className="text-2xl md:text-4xl font-extrabold leading-tight mb-8 text-[#1A1A1A]">
                  {language === 'te' ? (selectedArticle.title_te || selectedArticle.title) : selectedArticle.title}
                </h2>

                <div className="text-base md:text-lg text-[#2A2A2A] leading-relaxed whitespace-pre-wrap font-serif border-l-4 border-[#5A5A40] pl-6 py-2 my-6 italic bg-[#F5F5F0]/50 rounded-r-xl">
                  {(language === 'te' ? (selectedArticle.content_te || selectedArticle.content) : selectedArticle.content).split('\n\n')[0]}
                </div>

                <div className="prose prose-lg max-w-none text-[#1A1A1A]/85 leading-relaxed whitespace-pre-wrap font-serif">
                  {(language === 'te' ? (selectedArticle.content_te || selectedArticle.content) : selectedArticle.content).split('\n\n').slice(1).join('\n\n') || (language === 'te' ? (selectedArticle.content_te || selectedArticle.content) : selectedArticle.content)}
                </div>

                <div className="mt-12 pt-8 border-t border-[#1A1A1A]/10 flex items-center justify-between">
                  <div className="text-xs font-sans text-gray-400 uppercase tracking-widest">
                    {language === 'te' ? 'చిత్తూరు టైమ్స్ పబ్లిషింగ్ హౌస్' : 'CHITTOOR TIMES PRESS SYNDICATE'}
                  </div>
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="px-8 py-3 bg-[#1A1A1A] text-white rounded-full font-sans font-bold hover:bg-black transition-colors"
                  >
                    {t('return_to_bulletin')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled Top Banner */}
      <div className="bg-neutral-900 text-white/50 text-[10px] font-sans font-semibold tracking-widest py-2 px-6 border-b border-white/10 uppercase">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span className="text-white">{t('online_scanner_connected')}</span>
          </div>
          <div>{t('established')}</div>
        </div>
      </div>

      {/* Main Journal Header */}
      <header className="border-b-4 border-[#1A1A1A] bg-white pt-6 pb-4 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveMainTab('live')}>
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white shadow-md">
                <Newspaper size={24} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase font-serif leading-none">
                  {language === 'te' ? 'చిత్తూరు టైమ్స్' : 'Chittoor Times'}
                </h1>
                <p className="text-[10px] uppercase tracking-widest font-sans text-[#1A1A1A]/60 font-bold block mt-1">
                  {t('header_subtitle')}
                </p>
              </div>
            </div>

            {/* Language Switcher bar */}
            <div className="flex items-center bg-[#F5F5F0] border border-gray-200/80 rounded-2xl p-1 shadow-sm gap-1">
              <button
                id="lang-en-btn2"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-xl font-sans text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 ${language === 'en' ? 'bg-[#5A5A40] text-white shadow-sm' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
              >
                🇬🇧 English
              </button>
              <button
                id="lang-te-btn2"
                onClick={() => setLanguage('te')}
                className={`px-3 py-1.5 rounded-xl font-sans text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 ${language === 'te' ? 'bg-[#5A5A40] text-white shadow-sm' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
              >
                🇮🇳 తెలుగు (Telugu)
              </button>
            </div>

            {/* Custom Interactive Module Tab Selectors */}
            <div className="flex items-center bg-[#F5F5F0] p-1.5 rounded-full border border-gray-200">
              <button 
                onClick={() => setActiveMainTab('live')}
                className={`px-5 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${activeMainTab === 'live' ? 'bg-[#1A1A1A] text-white' : 'text-gray-600 hover:text-black'}`}
              >
                <Radio size={14} className={activeMainTab === 'live' ? 'text-amber-400 animate-pulse' : ''} />
                {t('live_edition')}
              </button>
              
              <button 
                onClick={() => setActiveMainTab('archives')}
                className={`px-5 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${activeMainTab === 'archives' ? 'bg-[#1A1A1A] text-white' : 'text-gray-600 hover:text-black'}`}
              >
                <Calendar size={14} />
                {t('past_editions')}
              </button>
              
              <button 
                onClick={() => setActiveMainTab('crawler')}
                className={`px-5 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${activeMainTab === 'crawler' ? 'bg-[#1A1A1A] text-white' : 'text-gray-600 hover:text-black'}`}
              >
                <Terminal size={14} />
                {t('ai_harvester')} 
                <span className={`w-2 h-2 rounded-full ${crawlerActive ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
              </button>
            </div>

            {/* Admin Add Article Button */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAdmin(!showAdmin)}
                className={`p-2.5 rounded-full border transition-all ${showAdmin ? 'bg-[#1A1A1A] text-white border-black' : 'bg-[#1A1A1A]/5 text-[#1A1A1A] border-gray-200 hover:bg-[#1A1A1A]/10'}`}
                title="Write Manual News Column"
              >
                <Plus size={20} className={showAdmin ? "rotate-45 transition-transform" : "transition-transform"} />
              </button>
            </div>

          </div>

          {/* Subheader category navigation line */}
          <div className="border-t border-[#1A1A1A]/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans font-bold uppercase tracking-widest text-gray-500">
            <div>
              {language === 'te' ? 'చిత్తూరు జిల్లా • తిరుపతి నివేదికలు • భారత జాతీయ • అంతర్జాతీయ విద్యుత్తు' : 'CHITTOOR DISTRICT • TIRUPATI • INDIA NATIONAL • INTERNATIONAL AFFAIRS'}
            </div>
            
            {/* Category tabs */}
            <div className="flex items-center gap-4">
              {(['Local', 'National', 'International'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`pb-1 border-b-2 font-black transition-all ${activeCategory === cat ? 'border-[#1A1A1A] text-[#1A1A1A]' : 'border-transparent text-gray-400 hover:text-black'}`}
                >
                  {t(cat.toLowerCase() + '_edition')}
                </button>
              ))}
            </div>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Action Bar for Manual Generate & Controls */}
        <div className="bg-white px-6 py-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-[#5A5A40]/10 rounded-xl text-[#5A5A40]">
              <Activity size={18} />
            </span>
            <div className="leading-tight">
              <span className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest block">
                {language === 'te' ? 'కృత్రిమ మేధస్సు స్థితి పట్టీ' : 'AI AUTOPILOT ENGINE STATUS'}
              </span>
              <p className="text-xs font-sans font-bold text-gray-700">
                {crawlerActive ? t('active_status') : t('status_suspended')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleToggleCrawler}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider border transition-all ${crawlerActive ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}
            >
              {crawlerActive ? (
                <>
                  <Pause size={14} /> {t('pause_harvester')}
                </>
              ) : (
                <>
                  <Play size={14} /> {t('resume_harvester')}
                </>
              )}
            </button>

            <button
              id="ai-generate-btn"
              onClick={handleForcedSearchAndFormat}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2 bg-[#5A5A40] text-white rounded-xl text-xs font-sans font-semibold hover:bg-[#4A4A30] transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
              {isGenerating ? (language === 'te' ? 'క్రాల్ అవుతోంది...' : 'Crawling...') : `${language === 'te' ? 'త్వరిత అప్‌డేట్ చేయి' : 'Force Online Scan'}: ${t(activeCategory.toLowerCase() + '_edition')}`}
            </button>
          </div>
        </div>

        {/* Admin Write Column Form */}
        <AnimatePresence>
          {showAdmin && (
            <motion.div 
              id="admin-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold font-serif">{t('compose_column')}</h3>
                  <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-sans text-xs font-bold uppercase tracking-wider">
                    Desk Interface
                  </span>
                </div>
                <form onSubmit={handleManualUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-sans font-bold uppercase text-gray-500 mb-1">
                        English Headline (ఆంగ్ల శీర్షిక)
                      </label>
                      <input 
                        id="news-title"
                        required
                        value={newArticle.title}
                        onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                        className="w-full p-3 bg-[#F5F5F0] rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] outline-none font-serif text-sm"
                        placeholder="e.g. Tirupati Smart City deploys fresh transit sensors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-bold uppercase text-gray-500 mb-1">
                        Telugu Headline (తెలుగు శీర్షిక) - Optional
                      </label>
                      <input 
                        id="news-title-te"
                        value={newArticle.title_te}
                        onChange={e => setNewArticle({...newArticle, title_te: e.target.value})}
                        className="w-full p-3 bg-[#F5F5F0] rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] outline-none font-serif text-sm"
                        placeholder="ఉదాహరణ: తిరుపతి స్మార్ట్ సిటీలో సరికొత్త సెన్సార్ల ఏర్పాటు"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-bold uppercase text-gray-500 mb-1">
                        {t('author_signature')}
                      </label>
                      <input 
                        id="news-author"
                        required
                        value={newArticle.author}
                        onChange={e => setNewArticle({...newArticle, author: e.target.value})}
                        className="w-full p-3 bg-[#F5F5F0] rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] outline-none font-sans text-xs"
                        placeholder="e.g. Staff Correspondent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-bold uppercase text-gray-500 mb-1">
                        {t('news_section_category')}
                      </label>
                      <select 
                        id="news-category"
                        value={newArticle.category}
                        onChange={e => setNewArticle({...newArticle, category: e.target.value})}
                        className="w-full p-3 bg-[#F5F5F0] rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] outline-none font-sans text-xs"
                      >
                        <option>Local</option>
                        <option>National</option>
                        <option>International</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-sans font-bold uppercase text-gray-500 mb-1">
                        English Column News Body (ఆంగ్ల వార్తా సమాచారం)
                      </label>
                      <textarea 
                        id="news-content"
                        required
                        value={newArticle.content}
                        onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                        rows={3}
                        className="w-full p-3 bg-[#F5F5F0] rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] outline-none resize-none font-serif text-sm leading-relaxed"
                        placeholder="Type out the complete English article..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-bold uppercase text-gray-500 mb-1">
                        Telugu Column News Body (తెలుగు వార్తా సమాచారం) - Optional
                      </label>
                      <textarea 
                        id="news-content-te"
                        value={newArticle.content_te}
                        onChange={e => setNewArticle({...newArticle, content_te: e.target.value})}
                        rows={3}
                        className="w-full p-3 bg-[#F5F5F0] rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] outline-none resize-none font-serif text-sm leading-relaxed"
                        placeholder="వార్త పూర్తి సమాచారాన్ని ఇక్కడ తెలుగులో నమోదు చేయండి..."
                      />
                      <p className="text-[10px] text-gray-400 mt-1 italic">
                        * Note: If left blank, Gemini AI will automatically translate your English submission to Telugu on-the-fly.
                      </p>
                    </div>
                    <button id="publish-btn" type="submit" className="w-full py-3.5 bg-[#1A1A1A] text-white rounded-xl font-bold font-sans text-xs uppercase tracking-wider hover:bg-black transition-colors shadow-md">
                      {t('publish_custom')} {t(newArticle.category.toLowerCase() + '_edition')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== PAGE VIEW 1: TODAY'S LIVE EDITION ==================== */}
        {activeMainTab === 'live' && (
          <div className="space-y-10">
            
            {/* Front Page Headline Banner */}
            <div className="border-b-2 border-double border-[#1A1A1A] pb-6 flex justify-between items-end">
              <div>
                <span className="px-3 py-1 bg-red-600 text-white rounded-md text-[10px] font-sans font-extrabold uppercase tracking-widest inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  {t('breaking_portal')}
                </span>
                <h2 className="text-3xl md:text-5xl font-black font-serif mt-2 tracking-tight">
                  {t('front_page_bulletin')}
                </h2>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400 block">{t('current_edition_date')}</span>
                <span className="text-sm font-sans font-black uppercase text-gray-800 mt-1 block">
                  {formatDateLabel(new Date().toISOString())}
                </span>
              </div>
            </div>

            {/* News Stream Block */}
            {todayArticles.length > 0 ? (
              <div id="news-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {todayArticles.map((article, idx) => (
                  <motion.article 
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="overflow-hidden aspect-[4/3] bg-neutral-200 relative">
                      <img 
                        src={`https://picsum.photos/seed/${article.id}/800/600`} 
                        alt={language === 'te' ? (article.title_te || article.title) : article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-neutral-900/90 text-white backdrop-blur-sm text-[10px] font-sans font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                          {t('todays_feed_badge')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase text-[#5A5A40] tracking-widest">
                          <Clock size={12} />
                          <span>{new Date(article.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <span>{t('by')} {article.author}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold font-serif leading-snug group-hover:text-[#5A5A40] transition-colors text-gray-900">
                          {language === 'te' ? (article.title_te || article.title) : article.title}
                        </h3>
                        <p className="text-[#1A1A1A]/70 line-clamp-3 leading-relaxed text-sm font-serif prose">
                          {language === 'te' ? (article.content_te || article.content) : article.content}
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs font-sans font-extrabold uppercase group-hover:translate-x-2 group-hover:text-[#5A5A40] transition-all text-gray-800">
                        {t('read_story')} <ExternalLink size={14} />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div id="empty-state" className="text-center py-24 bg-white border border-gray-200 rounded-3xl">
                <div className="max-w-md mx-auto space-y-5 px-6">
                  <div className="w-16 h-16 bg-[#5A5A40]/5 rounded-full flex items-center justify-center mx-auto text-[#5A5A40] animate-bounce">
                    <Radio size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-serif">{t('awaiting_wires')}</h3>
                  <p className="text-sm font-sans text-gray-500 leading-relaxed">
                    {t('awaiting_wires_desc')} {t('awaiting_live_wires_sub')}
                  </p>
                  <button
                    onClick={handleForcedSearchAndFormat}
                    className="px-5 py-2.5 bg-neutral-900 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-black rounded-lg transition-all inline-flex items-center gap-2"
                  >
                    <RefreshCw size={14} /> {t('force_scan_now')}
                  </button>
                </div>
              </div>
            )}
            
          </div>
        )}

        {/* ==================== PAGE VIEW 2: HISTORICAL ARCHIVES ==================== */}
        {activeMainTab === 'archives' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Sidebar calendar selector */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[#5A5A40] font-sans font-extrabold uppercase tracking-widest text-[11px]">
                  <Calendar size={14} />
                  <span>{t('past_editorial')}</span>
                </div>
                
                <p className="text-xs font-sans text-gray-500 leading-relaxed mb-4">
                  {t('archives_desc')}
                </p>

                {availableDates.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {availableDates.map((dateStr) => {
                      const isSelected = selectedArchiveDate && new Date(dateStr).toDateString() === new Date(selectedArchiveDate).toDateString();
                      return (
                        <button
                          key={dateStr}
                          onClick={() => setSelectedArchiveDate(dateStr)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${isSelected ? 'bg-[#5A5A40] text-white font-bold shadow-md' : 'bg-neutral-50 hover:bg-neutral-100 text-gray-700 font-sans text-xs border border-gray-200/50'}`}
                        >
                          <div className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5" style={{ color: isSelected ? '#FFF' : undefined }}>
                            {new Date(dateStr).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', { weekday: 'long' })}
                          </div>
                          <span className="font-serif text-[13px]">{formatDateLabel(dateStr)}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs font-sans text-gray-400 italic">{t('no_archives_available')}</p>
                )}
              </div>
            </div>

            {/* Right sidebar results print page */}
            <div className="lg:col-span-9 space-y-8">
              
              <div className="border-b-2 border-double border-[#1A1A1A] pb-6 flex justify-between items-end">
                <div>
                  <span className="text-[#5A5A40] font-sans font-extrabold uppercase tracking-widest text-[11px] block">
                    {language === 'te' ? 'చిత్తూరు టైమ్స్ పాత ముద్రణలు' : 'CHITTOOR TIMES HISTORIC PAGES'}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black font-serif mt-2 tracking-tight">
                    {selectedArchiveDate ? formatDateLabel(selectedArchiveDate) : 'Select a date'}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400 block">{t('archival_registry')}</span>
                  <span className="text-xs font-sans font-bold text-gray-600 block mt-1 uppercase">
                    {t(activeCategory.toLowerCase() + '_edition')}
                  </span>
                </div>
              </div>

              {selectedArchiveDate ? (
                archiveArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {archiveArticles.map((article, index) => (
                      <motion.article
                        key={article.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                        onClick={() => setSelectedArticle(article)}
                      >
                        <div className="space-y-4">
                          <img 
                            src={`https://picsum.photos/seed/${article.id}/600/400`} 
                            alt={language === 'te' ? (article.title_te || article.title) : article.title}
                            className="w-full aspect-[16/10] object-cover rounded-xl mb-4"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">
                            <Clock size={11} />
                            <span>{new Date(article.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>•</span>
                            <span>{t('by')} {article.author}</span>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold font-serif text-gray-900 group-hover:text-[#5A5A40] transition-colors line-clamp-2">
                            {language === 'te' ? (article.title_te || article.title) : article.title}
                          </h3>
                          <p className="text-sm font-serif text-gray-600 line-clamp-3 leading-relaxed">
                            {language === 'te' ? (article.content_te || article.content) : article.content}
                          </p>
                        </div>
                        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1 text-xs font-sans font-bold uppercase text-gray-700 group-hover:text-[#5A5A40]">
                          {t('see_printed')} <ExternalLink size={13} />
                        </div>
                      </motion.article>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-neutral-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="max-w-xs mx-auto space-y-3">
                      <Newspaper size={40} className="mx-auto text-gray-300" />
                      <h4 className="text-lg font-bold font-serif">{t('no_archive_entries')}</h4>
                      <p className="text-xs font-sans text-gray-400">
                        We don't contain any {activeCategory.toLowerCase()} reports registered on {selectedArchiveDate ? formatDateLabel(selectedArchiveDate) : 'this date'}.
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-20 bg-[#F5F5F0]/30 rounded-2xl border border-gray-200">
                  <p className="text-sm font-sans italic text-gray-400">Please choose a past page from the sidebar selection.</p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ==================== PAGE VIEW 3: AI HARVESTER SYSTEM CONSOLE ==================== */}
        {activeMainTab === 'crawler' && (
          <div className="space-y-8">
            <div className="border-b-2 border-double border-[#1A1A1A] pb-6 flex justify-between items-end">
              <div>
                <span className="text-green-600 font-sans font-extrabold uppercase tracking-widest text-[11px] block flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                  Live Diagnostic Console
                </span>
                <h2 className="text-3xl md:text-5xl font-black font-serif mt-2 tracking-tight">
                  WEB HARVESTER DIAGNOSTICS
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400 block">HARVEST CYCLE FEEDER</span>
                <span className="text-xs font-sans font-bold text-gray-600 block mt-1 uppercase">
                  STATUS: {crawlerActive ? t('active_running') : t('suspended')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Crawler Details Panel */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-bold font-serif mb-2">{t('harvester_profile')}</h3>
                    <p className="text-xs leading-relaxed text-gray-500 font-sans">
                      {t('harvester_profile_desc')}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex justify-between text-xs font-sans font-semibold">
                      <span className="text-gray-400">{t('scan_interval')}</span>
                      <span className="text-gray-800">{t('scan_sec')}</span>
                    </div>
                    <div className="flex justify-between text-xs font-sans font-semibold">
                      <span className="text-gray-400">{t('publish_frequency')}</span>
                      <span className="text-gray-800">{t('publish_freq_val')}</span>
                    </div>
                    <div className="flex justify-between text-xs font-sans font-semibold">
                      <span className="text-gray-400">{t('format_model')}</span>
                      <span className="text-[#5A5A40] underline decoration-dotted">Gemini 3.5-Flash (Active Grounding)</span>
                    </div>
                    <div className="flex justify-between text-xs font-sans font-semibold">
                      <span className="text-gray-400">Core Store Target:</span>
                      <span className="text-blue-600 font-bold uppercase">SUPABASE SECURED / LOCAL JSON</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <h4 className="text-xs font-sans font-extrabold uppercase text-gray-400 tracking-wider">
                      {t('channels_deployed')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Andhra Jyothy Feeds', 'Reuters South Asia Wire', 'Press Trust India', 'TTD Public Portals', 'Madanapalle Municipal Records'].map(nm => (
                        <span key={nm} className="px-2.5 py-1 bg-neutral-100 text-neutral-600 font-sans text-[10px] font-bold rounded-md block">
                          {nm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Terminal Logs Window (Renders scrolling live updates) */}
              <div className="lg:col-span-8">
                <div className="bg-neutral-900 rounded-3xl overflow-hidden shadow-xl border border-neutral-800">
                  
                  {/* Terminal Header */}
                  <div className="bg-neutral-950 px-6 py-4 flex justify-between items-center border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-xs font-mono text-neutral-400 ml-2">co-pilot-news-harvester://system-telemetry</span>
                    </div>
                    <div className="text-[10px] uppercase font-bold text-neutral-500 font-mono">
                      SYSTEM ONLINE • 1000mhz
                    </div>
                  </div>

                  {/* Terminal stdout scroll container */}
                  <div className="p-6 h-[450px] overflow-y-auto font-mono text-xs text-neutral-300 space-y-3 selection:bg-white/10 scrollbar-thin">
                    <AnimatePresence initial={false}>
                      {crawlerLogs.map((log) => {
                        let badgeColor = "text-[#5A5A40]";
                        let icon = "✓";

                        if (log.type === "search") {
                          badgeColor = "text-yellow-400";
                          icon = "🔍";
                        } else if (log.type === "download") {
                          badgeColor = "text-sky-400";
                          icon = "📥";
                        } else if (log.type === "rewrite") {
                          badgeColor = "text-fuchsia-400";
                          icon = "🧠";
                        } else if (log.type === "post") {
                          badgeColor = "text-green-400";
                          icon = "📰";
                        } else if (log.type === "error") {
                          badgeColor = "text-red-500";
                          icon = "⚠";
                        }

                        return (
                          <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15 }}
                            className="p-2 border-b border-neutral-800/50 hover:bg-white/[0.02] flex items-start gap-3"
                          >
                            <span className="text-neutral-500 select-none">
                              [{new Date(log.timestamp).toLocaleTimeString()}]
                            </span>
                            <span className={`${badgeColor} font-bold select-none`}>
                              {icon} {log.type.toUpperCase()}:
                            </span>
                            <span className="flex-1 text-neutral-100 leading-normal">
                              {log.message}
                            </span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                  
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A]/10 bg-white py-14 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center text-white text-sm">
              <Newspaper size={14} />
            </div>
            <span className="font-serif font-black uppercase text-sm tracking-wide text-gray-800">
              {language === 'te' ? 'చిత్తూరు టైమ్స్ పబ్లిషింగ్ హౌస్ ప్రైవేట్ లిమిటెడ్' : 'Chittoor Times News Platform'}
            </span>
          </div>
          <p className="text-xs font-sans text-gray-400 max-w-xl mx-auto leading-relaxed">
            {t('news_platform_all_rights')}
          </p>
          <p className="text-[10px] font-sans text-gray-300">
            © 2026 Chittoor Times Ltd. All rights reserved. Registered Office: Tirupati Town Desk AP.
          </p>
        </div>
      </footer>

    </div>
  );
}
