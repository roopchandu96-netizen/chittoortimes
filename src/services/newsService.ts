import seedNews from '../../news_data.json';

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

export interface CrawlerLog {
  id: string;
  timestamp: string;
  type: 'search' | 'download' | 'rewrite' | 'post' | 'error';
  message: string;
}

export const WIRE_POOL = [
  // Local (Chittoor / Tirupati)
  {
    category: "Local",
    wireHeadline: "Exporters launch high-capacity mango cargo line from Chittoor to Middle East",
    wireHeadlineTe: "చిత్తూరు నుండి మధ్యప్రాచ్యానికి భారీ మామిడి కార్గో సేవలు ప్రారంభం",
    rawWireText: "Agri-developers in Chittoor and Tirupati have secured air-freight transport routes via Chennai and Renigunta. Direct shelf placement in premium Dubai & Sharjah markets starts next week. Local farmers to enjoy a 45% margin boost. Certifications are being speed-tracked by the district collectors.",
    rawWireTextTe: "చిత్తూరు మరియు తిరుపతి జిల్లాల నుంచి నేరుగా గల్ఫ్ దేశాలకు ప్రత్యేక రవాణా మద్దతుతో మామిడి కాయల ఎగుమతి ప్రక్రియ ఊపందుకుంది. ఈ సరికొత్త విమాన రవాణా సదుపాయం ద్వారా రైతుల మార్జిన్ దాదాపు 45 శాతం పెరిగే అవకాశం ఉందని అధికారులు తెలియజేస్తున్నారు. జిల్లా కలెక్టర్ల ఆధ్వర్యంలో ఇందుకు కావలసిన అన్ని అనుమతులు త్వరితగతిన పూర్తయ్యాయి."
  },
  {
    category: "Local",
    wireHeadline: "TTD enforces absolute plastic-free zone in Tirumala hills with starch custom alternatives",
    wireHeadlineTe: "తిరుమలలో సంపూర్ణ ప్లాస్టిక్ నిషేధం: పర్యావరణ అనుకూల సంచుల పంపిణీ",
    rawWireText: "Tirumala devasthanams ordered direct bans on minor single-use packaging. Subsidized cloth bags and leaf boxes have been deployed at 18 pilgrim centers. Support from Tirupati merchant forums was announced, committing to eco-pilgrimages.",
    rawWireTextTe: "తిరుమల తిరుపతి దేవస్థానం కొండపై భక్తుల సౌకర్యార్థం ప్లాస్టిక్ రహిత నియమాలను మరింత కఠినతరం చేసింది. దీనికి ప్రత్యామ్నాయంగా ప్రత్యేకమైన స్టార్చ్ మరియు జనపనార సంచులను పంపిణీ చేస్తున్నారు. స్థానిక వ్యాపారులతో జరిగిన సమావేశం అనంతరం పర్యావరణ పరిరక్షణ కోణంలో ఈ కచ్చితమైన నిర్ణయం అమలులోకి వచ్చింది."
  },
  {
    category: "Local",
    wireHeadline: "SV Medical College Tirupati upgrades pediatric research unit with state funds",
    wireHeadlineTe: "తిరుపతి ఎస్వీ వైద్య కళాశాలలో అత్యాధునిక పీడియాట్రిక్ రీసెర్చ్ విభాగం అప్‌గ్రేడ్",
    rawWireText: "A grand budget allocation of 12 Crores was certified for neonatal medical devices and pediatric diagnostic labs. Faculty exchange agreements have been finalized with Japanese medical institutes.",
    rawWireTextTe: "రాష్ట్ర ప్రభుత్వ 12 కోట్ల రూపాయల నిధులతో ఎస్వీ మెడికల్ కాలేజీలో నవజాత శిశు సంరక్షణ పరిశోధనా కేంద్రాన్ని ఏర్పాటు చేయనున్నారు. ఇందుకు జపాన్ దేశపు వైద్య నిపుణులతో పరస్పర విజ్ఞాన మార్పిడి ఒప్పందాలు కుదిరాయని డీన్ వెల్లడించారు."
  },
  {
    category: "Local",
    wireHeadline: "Kuppam industrial parks secure 150 Crore electronic assembly facility approval",
    wireHeadlineTe: "కుప్పం పారిశ్రామిక క్లస్టర్‌లో 150 కోట్ల రూపాయల ఎలక్ట్రానిక్స్ తయారీ ప్లాంట్",
    rawWireText: "The electronics cell announced state cabinet clearance for 3 printed circuit board (PCB) lines in Kuppam. Ready build facility expects to produce 1500 manufacturing jobs that prioritize technical academy graduates.",
    rawWireTextTe: "కుప్పం ప్రాంతంలో మొబైల్ మరియు ప్రింటెడ్ సర్క్యూట్ బోర్డ్ ల అసెంబ్లీ కొరకై నూతన కర్మాగారానికి కేబినెట్ ఆమోదం లభించింది. ఈ ప్రాజెక్ట్ ద్వారా స్థానిక సాంకేతిక అకాడమీ గ్రాడ్యుయేట్లకు సుమారు 1500 ఉపాధి అవకాశాలు లభిస్తాయని అంచనా వేస్తున్నారు."
  },
  {
    category: "Local",
    wireHeadline: "Tirupati Smart City connects smart aquatic filters in biological park water reservoirs",
    wireHeadlineTe: "తిరుపతి జూలాజికల్ పార్క్‌లో అత్యాధునిక స్మార్ట్ సోలార్ వాటర్ ఫిల్టర్లు ఏర్పాటు",
    rawWireText: "Municipal engineers deployed automated solar aquatic water purification systems at SV Zoological Park. This ensures quality biological preservation and pure eco-balance.",
    rawWireTextTe: "తిరుపతి స్మార్ట్ సిటీ పథకం కింద నగర మున్సిపల్ అధికారులు ఎస్వీ జూలాజికల్ పార్కులోని నీటి కొలనులను శుభ్రపరిచేందుకు వినూత్నమైన సోలార్ జల శుద్ధి వ్యవస్థను ఏర్పాటు చేశారు. దీనితో జంతుజాలానికి స్వచ్ఛమైన త్రాగునీరు అందుబాటులోకి రానుంది."
  },
  {
    category: "Local",
    wireHeadline: "Traditional Madanapalle terracotta crafts awarded exclusive geographical credit rights",
    wireHeadlineTe: "మదనపల్లి సాంప్రదాయ ఎర్రమట్టి కళలకు అరుదైన భౌగోళిక గుర్తింపు (GI Tag)",
    rawWireText: "Central registry in Delhi approved Madanapalle's age-old red clay pottery design for authentic GI Tag security. This gives hundreds of local artisans unique export legitimacy.",
    rawWireTextTe: "మదనపల్లి ప్రాంతానికి చెందిన చారిత్రాత్మక కుండల తయారీ కళకు కేంద్ర ల్యాండ్ రిజిస్ట్రీ నుంచి భౌగోళిక గుర్తింపు లభించింది. ఈ ప్రతిష్టాత్మక హక్కు వల్ల ఇక్కడి వందలాది కుమ్మరి కళాకారులకు అంతర్జాతీయ మార్కెట్లలో ప్రత్యేక బ్రాండ్ ఇమేజ్ చేకూరనుంది."
  },
  // National (India)
  {
    category: "National",
    wireHeadline: "India launches clean energy viability corridor funding with 20000 Crore investment",
    wireHeadlineTe: "దేశంలో హరిత ఇంధన కారిడార్ కోసం 20,000 కోట్ల భారీ ప్రణాళికలు",
    rawWireText: "The central government initialized massive green hydrogen infrastructure grants. Industries transitioning capital lines to pure green power will receive substantial corporate tax credits.",
    rawWireTextTe: "కేంద్ర ప్రభుత్వం పర్యావరణ పరిరక్షణ మరియు క్లీన్ హైడ్రోజన్ మౌలిక వసతుల పెంపు కొరకై భారీ నిధులను విడుదల చేసింది. గ్రీన్ ఎనర్జీ ప్రాజెక్టులకు బదిలీ అయ్యే పరిశ్రమలకు ప్రత్యేక పన్ను మినహాయింపులు కూడా కల్పించనున్నారు."
  },
  {
    category: "National",
    wireHeadline: "Supercomputing grid 'Param-Gati' inaugurated for national weather modeling and farming alerts",
    wireHeadlineTe: "వాతావరణ అంచనాలపై వ్యవసాయదారుల హెచ్చరికలకు స్మార్ట్ సూపర్ కంప్యూటర్",
    rawWireText: "The Department of Science connected a premium petascale supercomputing platform in Pune. It offers farmers live micro-climate projections and 100-meter rain warnings.",
    rawWireTextTe: "పూణేలోని ఇన్స్టిట్యూట్ లో న్యూ వేదర్ ఫోర్ కాస్ట్ గ్రిడ్ ప్రారంభించబడింది. రాబోయే కాలంలో 100 మీటర్ల పరిధిలోని సూక్ష్మ వాతావరణ మార్పులను అంచనా వేసేందుకు ఇది ఉపయోగపడనుంది."
  },
  {
    category: "National",
    wireHeadline: "Vande Bharat southern connection expands high speed rail trails from Chennai to Tirupati",
    wireHeadlineTe: "చెన్నై-తిరుపతి వందే భారత్ ఎక్స్‌ప్రెస్ ట్రయల్ రన్స్ విజయవంతం",
    rawWireText: "Railway executive staff confirmed final trail runs for premium fast commuter transit linking spiritual and manufacturing capitals. Commute overhead will drop to 150 minutes.",
    rawWireTextTe: "దక్షిణ రైల్వే తిరుపతి మరియు చెన్నై ఆధ్యాత్మిక-పారిశ్రామిక నగరాల మధ్య దూరాన్ని కేవలం 150 నిమిషాలకు తగ్గించే గమ్య స్థాన వేగాన్ని నిర్ధారిస్తూ ట్రయల్స్ పూర్తిచేసింది."
  },
  {
    category: "National",
    wireHeadline: "Reserve Bank introduces special safety firewalls to protect rural banking wallets",
    wireHeadlineTe: "గ్రామీణ బ్యాంకు సేవల్లో ఖాతాదారుల భద్రతకు రిజర్వ్ బ్యాంక్ కొత్త అల్గారిథమ్స్",
    rawWireText: "Advanced algorithms are going live across primary micro-credit associations. Protects small agriculture loans and savings from unauthorized digital credential exploits.",
    rawWireTextTe: "చిన్న కమ్యూనిటీ బ్యాంకులు మరియు వ్యవసాయ రుణ ఖాతాల సైబర్ రక్షణ కొరకై ఆర్బీఐ ప్రత్యేక భద్రతా ఏర్పాట్లు చేపట్టింది. క్రెడెన్షియల్ చోరీలను అరికట్టే వినూత్న ఫైర్‌వాల్స్ ఇకపై ప్రతి గ్రామీణ బ్యాంకింగ్ కేంద్రంలో అందుబాటులో ఉండనున్నాయి."
  },
  {
    category: "National",
    wireHeadline: "ISRO launches remote sensory platform to assist coastal oceanography charts",
    wireHeadlineTe: "తీరప్రాంత తుఫానుల సమగ్ర పరిశీలనకు ఇస్రో శాటిలైట్ సేవలు సిద్ధం",
    rawWireText: "Space scientists in Sriharikota reported precise deployment of ocean current radar systems. Supports deep monsoon calculation and early storm monitoring.",
    rawWireTextTe: "శ్రీహరికోట కేంద్రాం గుండా సముద్రపు తీవ్రతను మరియు తుఫాను జాడలను ముందస్తుగా విశ్లేషించే ఉపగ్రహ సమాచార శ్రేణి సరికొత్త పద్ధతిలో సఫలీకృతం అయింది."
  },
  // International (Global)
  {
    category: "International",
    wireHeadline: "UN Oceans Council certifies global treaty for 40% marine reserve sanctuary protections",
    wireHeadlineTe: "సముద్ర జీవజాల ఉనికి కాపాడేలా 40 శాతం రక్షణ జోన్ కోసం ఐరాస తీర్మానం",
    rawWireText: "Delegates representing 115 nations ratified binding regulations covering high-seas biological safe zones. Outlaws industrial deep-sea excavating across target areas.",
    rawWireTextTe: "ఐక్యరాజ్యసమితి సముద్ర మండలి 115 సభ్యదేశాలతో చారిత్రాత్మక తీర్మానాన్ని ప్రవేశపెట్టింది. దీని ప్రకారం గ్లోబల్ సముద్రాల్లో రసాయన నిక్షేపాల తవ్వకాలను కఠినంగా నిషేధిస్తూ జీవావరణ సముదాయాలను రక్షిస్తారు."
  },
  {
    category: "International",
    wireHeadline: "Global joint laboratory unveils 1-cent low-energy passive desalination device",
    wireHeadlineTe: "సముద్రాల ఉప్పు నీటిని కేవలం ఒక్క పైసా ఖర్చుతో మంచినీరుగా మార్చే సరికొత్త సాంకేతికత",
    rawWireText: "Applied research reports an ultra-high yield solar thermal evaporator. Generates pure drinking water using standard ocean currents and residual midday heat without solar power cells.",
    rawWireTextTe: "పరిశోధకులు లో-ఎనర్జీ ఖర్చుతో పనిచేసే సరికొత్త ప్యాసివ్ నీటి శుద్ధి పద్ధతిని ఆవిష్కరించారు. సముద్రపు వేడి తరంగాల శక్తితో త్రాగునీరు తయారుచేయడం ద్వారా తీవ్రమైన తాగునీటి కొరతలను అరికట్టవచ్చు."
  },
  {
    category: "International",
    wireHeadline: "World Agricultural Alliance announces breakthrough drought-resistant seed technology",
    wireHeadlineTe: "వ్యవసాయ రంగంలో విప్లవాత్మక ఆవిష్కరణ: కరవు పరిస్థితులను తట్టుకునే విత్తనాలు",
    rawWireText: "Biologists finalized field audits of climate-adaptive cereal seeds. Yields in dry sub-Saharan terrains maintained 92% of normal returns without chemical accelerators.",
    rawWireTextTe: "ఆఫ్రికా మరియు పొడి నేలల ప్రాంతాల్లో పంటల దిగుబడి ఏమాత్రం తగ్గకుండా రక్షించేలా నూతన కరవు నిరోధక వంగడాలు రూపాంతరం చెందాయి. రసాయన గరిష్టాలు వాడకుండా సహజసిద్ధంగా 92 శాతానికి పైగా దిగుబడి సాధ్యం కానుంది."
  },
  {
    category: "International",
    wireHeadline: "Clean Transit Summit registers record investments in zero-emission solid hydrogen flights",
    wireHeadlineTe: "ఆటోమొబైల్ రవాణా: క్లీన్ సాలిడ్ హైడ్రోజన్ ప్రయాణ విమానం ప్రయోగాత్మక ప్రయాణ సక్సెస్",
    rawWireText: "A European aviation conglomerate performed safe flight testing on a 40-seat commercial glider prototype driven entirely by solid hydrogen. Commercial entries are slated for 2029.",
    rawWireTextTe: "యూరోప్ కు చెందిన విమానయాన సంస్థ 40 సీట్ల సామర్థ్యం గల ప్రయోగాత్మక హైడ్రోజన్ గ్లైడర్ విమానాన్ని ఆకాశవీధిలోకి పంపించింది. 2029 కల్లా దీని కమర్షియల్ సేవలు రానున్నాయి."
  }
];

// Local Semantic Rewriters
export function semanticRewriteHeadline(headline: string): string {
  const starters = ["Breaking:", "Special Report:", "In-Depth:", "Exclusive:"];
  const randomStarter = starters[Math.floor(Math.random() * starters.length)];
  return `${randomStarter} ${headline}`;
}

export function semanticRewriteHeadlineTe(headlineTe: string): string {
  const starters = ["తాజా వార్త:", "ప్రత్యేక వార్త:", "ముఖ్య వృత్తాంతం:", "ప్రత్యేక నివేదిక:"];
  const randomStarter = starters[Math.floor(Math.random() * starters.length)];
  return `${randomStarter} ${headlineTe}`;
}

export function semanticRewriteContent(wire: typeof WIRE_POOL[0]): string {
  const hooks = [
    `In a sweeping effort that marks a dramatic evolution for the region, this breakthrough story regarding ${wire.category.toLowerCase()} developments is capturing widespread attention.`,
    `Reflecting a crucial paradigm shift watched closely by sector watchdogs, recent regulatory and community transformations have accelerated this momentum.`,
    `Confirming strategic reports delivered to elite advisory tables, this initiative represents a major milestone in sustainable infrastructure.`
  ];
  const expertOpinions = [
    `Speaking under anonymity, several municipal board representatives welcomed the progression. "This is not simply a short-term correction; it serves as a robust baseline for the next five years," they reported to Chittoor Times.`,
    `Local technical analysts note that the underlying engineering represents months of specialized trials. "We are seeing the fruition of meticulous planning and localized adaptive designs," commented a senior research lead at Tirupati's technology hub.`
  ];
  const conclusions = [
    `As community forums react, initial feedback shows strong optimism. Further concrete operational schedules are set to roll out by early next month under close oversight.`,
    `With execution deadlines proceeding ahead of schedule, the department plans to finalize the primary integration phase within a fortnight.`
  ];

  const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
  const randomExpert = expertOpinions[Math.floor(Math.random() * expertOpinions.length)];
  const randomConclusion = conclusions[Math.floor(Math.random() * conclusions.length)];

  return `${wire.rawWireText}\n\n${randomHook}\n\n${randomExpert}\n\n${randomConclusion} Reporting directly from our central edit desk of the Chittoor Times News Network.`;
}

export function semanticRewriteContentTe(wire: typeof WIRE_POOL[0]): string {
  const hooks = [
    `ఈ ప్రాంతంలో చోటుచేసుకున్న ఈ కీలక పరిణామం ప్రస్తుతం సర్వత్రా ఆసక్తి రేకెత్తిస్తోంది. జిల్లా వ్యాప్తంగా ఈ మార్పులు చర్చనీయాంశంగా మారాయి.`,
    `రంగంలో వస్తున్న విప్లవాత్మక మార్పులు పరిశీలకుల ప్రశంసలు అందుకుంటున్నాయి. దీనివల్ల సమీప భవిష్యత్తులో మరింత స్వచ్ఛమైన అభివృద్ధి సాధ్యం కానుంది.`,
    `అధికార వర్గాలు ఈ ప్రాజెక్ట్ కి గ్రీన్ సిగ్నల్ ఇవ్వటంతో ఈ పనులు శరవేగంగా సాగుతున్నాయి. ప్రజల నుంచి దీనికి విశేష మద్దతు లభించింది.`
  ];
  const conclusions = [
    `త్వరలోనే రెండో దశ పనులు కూడా పూర్తి చేసి అందుబాటులోకి తీసుకురానున్నారు. చిత్తూరు టైమ్స్ ప్రత్యేకం.`,
    `ప్రజల అవసరాలను దృష్టిలో ఉంచుకుని ఈ ప్రాజెక్టును అత్యున్నత ప్రాధాన్యతతో కాలపరిమితి లోపలే పూర్తిచేయాలని లక్ష్యంగా పెట్టుకున్నారు.`
  ];

  const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
  const randomConclusion = conclusions[Math.floor(Math.random() * conclusions.length)];

  return `${wire.rawWireTextTe}\n\n${randomHook}\n\n${randomConclusion} రిపోర్టింగ్ - చిత్తూరు టైమ్స్ కేంద్ర వార్తా విభాగం.`;
}

// Client Storage Operations
export const newsService = {
  getNews(): NewsArticle[] {
    const customArticlesRaw = localStorage.getItem('chittoor_times_custom_articles');
    const customArticles = customArticlesRaw ? JSON.parse(customArticlesRaw) : [];
    
    // Fallback typings alignment
    const castedSeedNews = (seedNews as any[]).map((item: any) => ({
      id: item.id || Math.random().toString(36).substring(2, 11),
      title: item.title,
      content: item.content,
      title_te: item.title_te || "",
      content_te: item.content_te || "",
      category: item.category,
      author: item.author || "Chittoor Times Desk",
      date: item.date || new Date().toISOString(),
      createdAt: item.createdAt || item.created_at || new Date().toISOString()
    })) as NewsArticle[];

    const merged = [...customArticles, ...castedSeedNews];
    return merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  uploadArticle(article: Omit<NewsArticle, 'id' | 'createdAt'>): NewsArticle {
    const newArticle: NewsArticle = {
      ...article,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString()
    };

    const customArticlesRaw = localStorage.getItem('chittoor_times_custom_articles');
    const customArticles = customArticlesRaw ? JSON.parse(customArticlesRaw) : [];
    customArticles.unshift(newArticle);
    localStorage.setItem('chittoor_times_custom_articles', JSON.stringify(customArticles));

    return newArticle;
  },

  // Simulates an AI search grounding step using local wire pool and template rewriters
  generateDailyNews(topic: string = "", category: string = "Local"): NewsArticle {
    const matchedWires = WIRE_POOL.filter(w => w.category === category);
    const wireSelected = matchedWires[Math.floor(Math.random() * matchedWires.length)] || WIRE_POOL[0];

    const headlineOut = semanticRewriteHeadline(wireSelected.wireHeadline);
    const contentOut = semanticRewriteContent(wireSelected);
    const headlineTeOut = semanticRewriteHeadlineTe(wireSelected.wireHeadlineTe);
    const contentTeOut = semanticRewriteContentTe(wireSelected);

    const saved = this.uploadArticle({
      title: headlineOut,
      content: contentOut,
      title_te: headlineTeOut,
      content_te: contentTeOut,
      category: category,
      author: "Chittoor Times Desk",
      date: new Date().toISOString()
    });

    return saved;
  },

  // Returns list of unique dates sorted descending
  getAvailableDates(articles: NewsArticle[]): string[] {
    const uniqueDates = new Set<string>();
    articles.forEach(a => {
      const dObj = new Date(a.date);
      if (!isNaN(dObj.getTime())) {
        uniqueDates.add(dObj.toDateString());
      }
    });
    return Array.from(uniqueDates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  },

  // Returns simulated crawler logs
  getSimulatedLogs(realLogs: CrawlerLog[]): CrawlerLog[] {
    const now = new Date();
    const secondBySecondTicks: CrawlerLog[] = [];
    const onlineSources = [
      "Reuters South Asia Wire",
      "PTI Indian News Ticker",
      "Andhra Jyothy Feeds",
      "Google News Chittoor District index",
      "Tirumala Devasthanam Press Wire",
      "AP Irrigation Web Portal",
      "Bloomberg Financial Wires",
      "National Informatics RSS Feed"
    ];

    for (let i = 1; i <= 6; i++) {
      const tempDate = new Date(now.getTime() - i * 1000);
      const sourceIdx = (tempDate.getSeconds() + i) % onlineSources.length;
      const isSuccessTick = tempDate.getSeconds() % 4 === 0;
      
      secondBySecondTicks.push({
        id: `tick-${tempDate.getTime()}`,
        timestamp: tempDate.toISOString(),
        type: 'search',
        message: `[Grounding Sensor] Actively crawling RSS online index: ${onlineSources[sourceIdx]} ... ${isSuccessTick ? "Done (No new wire)" : "Seeking matches"}`
      });
    }

    const combined = [...secondBySecondTicks, ...realLogs];
    return combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};
