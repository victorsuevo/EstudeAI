export interface Content {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'Video' | 'Article' | 'Course' | 'Academic' | 'Documentation';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  source: string;
  language: 'PT' | 'EN' | 'FR';
  durationHours: number;
  completed?: boolean;
  isFavorite?: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  contents: Content[];
  progress: number;
}

const translateQuery = (query: string, targetLang: 'PT' | 'EN' | 'FR'): string => {
  const q = query.toLowerCase().trim();
  const translations: Record<string, Record<'PT' | 'EN' | 'FR', string>> = {
    'python': { PT: 'programação python', EN: 'python programming', FR: 'programmation python' },
    'francês': { PT: 'francês para viagem', EN: 'french for travel', FR: 'français' },
    'anatomia': { PT: 'anatomia humana', EN: 'human anatomy', FR: 'anatomie humaine' },
    'ux': { PT: 'design de experiência do usuário', EN: 'ux design course', FR: 'conception ux' }
  };
  const key = Object.keys(translations).find(k => q.includes(k));
  if (key) return translations[key][targetLang];
  
  if (targetLang === 'EN') return `${query} (english results)`;
  if (targetLang === 'FR') return `${query} (résultats français)`;
  return query;
};

const getTranslation = (key: string, lang: 'PT' | 'EN' | 'FR') => {
  const dict = {
    'PT': { intro: 'Introdução a', whatIs: 'O que é', guide: 'Guia Prático:', projects: 'Projetos de', docs: 'Documentação Oficial de', academic: 'Artigos Acadêmicos:', research: 'Pesquisa e Futuro de', pathTitle: 'Trilha Especializada:', curDesc: 'Curadoria profunda realizada por IA sobre' },
    'EN': { intro: 'Introduction to', whatIs: 'What is', guide: 'Practical Guide:', projects: 'Projects of', docs: 'Official Documentation of', academic: 'Academic Papers:', research: 'Research and Future of', pathTitle: 'Specialized Path:', curDesc: 'Deep AI curation for' },
    'FR': { intro: 'Introduction à', whatIs: 'Qu\'est-ce que', guide: 'Guide Pratique :', projects: 'Projets de', docs: 'Documentation Officielle de', academic: 'Articles Académiques :', research: 'Recherche et Futuro de', pathTitle: 'Parcours Spécialisé :', curDesc: 'Curation profonde par IA sur' }
  };
  return dict[lang][key as keyof typeof dict['PT']] || key;
};

const generateSmartUrl = (title: string, source: string, type: string, topic: string, language: string): string => {
  const langCode = language.toLowerCase();
  const query = encodeURIComponent(`${title} ${source} ${language}`);
  if (source.toLowerCase() === 'wikipedia') {
    const wikiLang = langCode === 'en' ? 'en' : langCode === 'fr' ? 'fr' : 'pt';
    return `https://${wikiLang}.wikipedia.org/wiki/${encodeURIComponent(topic)}`;
  }
  if (source === 'Google Scholar') {
    return `https://scholar.google.com/scholar?q=${encodeURIComponent(topic)}&hl=${langCode}`;
  }
  if (type === 'Video') return `https://www.youtube.com/results?search_query=${query}`;
  return `https://www.google.com/search?q=${query}&hl=${langCode}`;
};

export const searchContent = async (query: string, language: 'PT' | 'EN' | 'FR' = 'PT', isGlobal: boolean = false): Promise<LearningPath[]> => {
  console.log(`Searching for: ${query}, Global: ${isGlobal}, Pref: ${language}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Garantimos que se for global, ele sempre usará as três línguas
  const languagesToIterate: ('PT' | 'EN' | 'FR')[] = isGlobal ? ['PT', 'EN', 'FR'] : [language];
  const results: Content[] = [];

  for (const currentLang of languagesToIterate) {
    const topic = translateQuery(query, currentLang);
    const t = (key: string) => getTranslation(key, currentLang);
    
    // Adicionamos a sigla do idioma ao título para o usuário ter certeza absoluta
    const langFlag = currentLang === 'PT' ? '🇧🇷' : currentLang === 'EN' ? '🇺🇸' : '🇫🇷';

    const items = [
      { title: `${langFlag} ${t('intro')} ${topic}`, type: 'Video', diff: 'Beginner', src: 'YouTube' },
      { title: `${langFlag} ${t('whatIs')} ${topic}?`, type: 'Article', diff: 'Beginner', src: 'Wikipedia' },
      { title: `${langFlag} ${t('guide')} ${topic}`, type: 'Course', diff: 'Intermediate', src: 'GitHub' },
      { title: `${langFlag} ${t('docs')} ${topic}`, type: 'Article', diff: 'Advanced', src: 'Official' },
      { title: `${langFlag} ${t('academic')} ${topic}`, type: 'Academic', diff: 'Advanced', src: 'Google Scholar' }
    ];

    items.forEach((item, idx) => {
      results.push({
        id: `global-${currentLang}-${idx}-${Date.now()}`,
        title: item.title,
        description: `${t('curDesc')} ${topic}.`,
        url: generateSmartUrl(item.title, item.src, item.type, topic, currentLang),
        type: item.type as any,
        difficulty: item.diff as any,
        source: item.src,
        language: currentLang,
        durationHours: (idx + 1) * 2
      });
    });
  }

  return [{
    id: `path-global-${Date.now()}`,
    title: isGlobal ? `Resultados Globais para: ${query}` : `${getTranslation('pathTitle', language)} ${query}`,
    description: isGlobal 
      ? `Curadoria multi-idioma (Português, Inglês e Francês) para uma visão 360º.` 
      : `${getTranslation('curDesc', language)} ${query}.`,
    topic: query,
    difficulty: isGlobal ? 'Global' : 'Specialized',
    contents: results,
    progress: 0
  }];
};
