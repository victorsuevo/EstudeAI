import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, BookOpen, Clock, Award, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { searchContent } from '../services/ContentService';
import type { LearningPath, Content } from '../services/ContentService';
import ContentCard from './ContentCard';

interface DashboardProps {
  results: LearningPath[];
  setResults: (results: LearningPath[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSavePath: (path: LearningPath) => void;
  savedPaths: LearningPath[];
  onToggleFavorite: (item: Content) => void;
  savedItems: Content[];
  onToggleComplete: (id: string) => void;
  completedItems: string[];
  prefLanguage: 'PT' | 'EN' | 'FR';
  onSearchSuccess?: (query: string) => void;
  isGlobalSearch: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  results, 
  setResults, 
  searchQuery, 
  setSearchQuery,
  onSavePath,
  savedPaths,
  onToggleFavorite,
  savedItems,
  onToggleComplete,
  completedItems,
  prefLanguage,
  onSearchSuccess,
  isGlobalSearch
}) => {
  const [isSearching, setIsSearching] = useState(false);

  const stats = useMemo(() => {
    const allKnownContents = [
      ...results.flatMap(p => p.contents),
      ...savedPaths.flatMap(p => p.contents),
      ...savedItems
    ];
    const uniqueCompletedIds = Array.from(new Set(completedItems));
    const totalHours = uniqueCompletedIds.reduce((acc, id) => {
      const item = allKnownContents.find(c => c.id === id);
      return acc + (item?.durationHours || 0);
    }, 0);
    const completedPathsCount = savedPaths.filter(path => 
      path.contents.every(content => completedItems.includes(content.id))
    ).length;
    const activePathsCount = savedPaths.length - completedPathsCount;
    const streak = completedItems.length > 0 ? Math.ceil(completedItems.length / 2) : 0;
    return { totalHours, completedPaths: completedPathsCount, activePaths: activePathsCount, streak };
  }, [results, savedPaths, savedItems, completedItems]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const data = await searchContent(searchQuery, prefLanguage, isGlobalSearch);
      setResults(data);
      onSearchSuccess?.(searchQuery);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

  const isPathSaved = (id: string) => savedPaths.some(p => p.id === id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            O que você quer <span className="gradient-text">aprender</span> hoje?
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
            Explore o melhor conteúdo gratuito da internet em uma jornada estruturada pela IA.
          </p>
        </motion.div>

        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 0.5rem 0.5rem 1.25rem',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            background: 'white',
            boxShadow: 'var(--shadow-md)',
            transition: 'var(--transition)'
          }}>
            <Search size={20} color="var(--primary)" />
            <input
              type="text"
              placeholder="Ex: Python, Design UI/UX, Anatomia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                padding: '0.8rem 1rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={clearSearch}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
              >
                <X size={18} />
              </button>
            )}
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSearching}
              style={{ padding: '0.8rem 1.5rem' }}
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>
      </section>

      {!results.length && (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
          <StatCard icon={<TrendingUp size={20} color="var(--primary)" />} label="Duração" value={`${stats.totalHours}h`} />
          <StatCard icon={<BookOpen size={20} color="var(--accent)" />} label="Ativas" value={stats.activePaths} />
          <StatCard icon={<Award size={20} color="var(--secondary)" />} label="Concluídas" value={stats.completedPaths} />
          <StatCard icon={<Clock size={20} color="var(--beginner)" />} label="Ofensiva" value={stats.streak} />
        </section>
      )}

      {results.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
        >
          {results.map((path) => (
            <div key={path.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{path.title}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>{path.description}</p>
                </div>
                <button 
                  onClick={() => onSavePath(path)}
                  disabled={isPathSaved(path.id)}
                  className="btn-primary" 
                  style={{ background: isPathSaved(path.id) ? '#f1f5f9' : undefined, color: isPathSaved(path.id) ? 'var(--text-muted)' : 'white' }}
                >
                  {isPathSaved(path.id) ? <>Salvo <Check size={16} /></> : 'Salvar Trilha'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
                  const filteredContent = path.contents.filter(c => c.difficulty === level);
                  if (filteredContent.length === 0) return null;

                  return (
                    <div key={level}>
                      <h4 style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: '800', 
                        color: `var(--${level.toLowerCase()})`, 
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}>
                        Nível {level === 'Beginner' ? 'Iniciante' : level === 'Intermediate' ? 'Intermediário' : 'Avançado'}
                      </h4>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '1.5rem' 
                      }}>
                        {filteredContent.map((content) => (
                          <ContentCard 
                            key={content.id} 
                            content={{
                              ...content,
                              isFavorite: savedItems.some(i => i.id === content.id),
                              completed: completedItems.includes(content.id)
                            }} 
                            onToggleFavorite={() => onToggleFavorite(content)}
                            onToggleComplete={() => onToggleComplete(content.id)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.section>
      )}

      {!results.length && (
        <section>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Sugestões em alta</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {['React Native', 'IA Generativa', 'UX Design', 'Francês', 'Data Science'].map(topic => (
              <button 
                key={topic}
                onClick={async () => { 
                  setSearchQuery(topic);
                  setIsSearching(true);
                  try {
                    const data = await searchContent(topic, prefLanguage, isGlobalSearch);
                    setResults(data);
                    onSearchSuccess?.(topic);
                  } finally {
                    setIsSearching(false);
                  }
                }}
                className="btn-secondary"
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
              >
                {topic}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px' }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: '1.25rem', fontWeight: '800' }}>{value}</p>
    </div>
  </div>
);

export default Dashboard;
