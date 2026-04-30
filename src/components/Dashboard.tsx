import React, { useState, useMemo } from 'react';
import { Search, Sparkles, TrendingUp, BookOpen, Clock, Award, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { searchContent } from '../services/ContentService';
import type { LearningPath, Content } from '../services/ContentService';
import ContentCard from './ContentCard';

export interface UserStats {
  completedPaths: number;
  totalHours: number;
  activePaths: number;
  streak: number;
}

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

  // Computação Real das Estatísticas
  const stats = useMemo(() => {
    // ... logic remains same
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
      {/* Header & Search */}
      <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {isGlobalSearch && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'rgba(16, 185, 129, 0.1)', 
              color: 'var(--success)', 
              padding: '0.5rem 1rem', 
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: '800',
              marginBottom: '1rem',
              border: '1px solid var(--success)'
            }}
          >
            <Sparkles size={16} />
            MODO BUSCA GLOBAL ATIVADO (PT + EN + FR)
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            O que você quer <span className="gradient-text">aprender</span> hoje?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2.5rem' }}>
            Encontre o caminho perfeito com IA, explorando o melhor conteúdo gratuito da internet.
          </p>
        </motion.div>

        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <div className="glass-effect" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 0.5rem 0.5rem 1.5rem',
            borderRadius: '20px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
            transition: 'var(--transition)',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)'
          }}>
            <Search size={24} color="var(--primary)" />
            <input
              type="text"
              placeholder="Ex: Python, Anatomia, Design UI/UX..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                padding: '1rem',
                fontSize: '1.1rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={clearSearch}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '0.5rem'
                }}
              >
                <X size={20} />
              </button>
            )}
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSearching}
              style={{ padding: '1rem 2rem' }}
            >
              {isSearching ? 'Curando...' : 'Buscar'}
              {!isSearching && <Sparkles size={18} />}
            </button>
          </div>
        </form>
      </section>

      {/* Stats Quick View */}
      {!results.length && (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <StatCard icon={<TrendingUp color="var(--primary)" />} label="Duração Total" value={`${stats.totalHours}h`} />
          <StatCard icon={<BookOpen color="#3b82f6" />} label="Trilhas Ativas" value={stats.activePaths} />
          <StatCard icon={<Award color="#ec4899" />} label="Trilhas Concluídas" value={stats.completedPaths} />
          <StatCard icon={<Clock color="#10b981" />} label="Ofensiva (Dias)" value={stats.streak} />
        </section>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          {results.map((path) => (
            <div key={path.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{path.title}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>{path.description}</p>
                </div>
                <button 
                  onClick={() => onSavePath(path)}
                  disabled={isPathSaved(path.id)}
                  className="btn-primary" 
                  style={{ 
                    background: isPathSaved(path.id) ? 'var(--bg-main)' : 'var(--primary)', 
                    color: isPathSaved(path.id) ? 'var(--text-muted)' : 'white', 
                    border: '1px solid var(--border)' 
                  }}
                >
                  {isPathSaved(path.id) ? (
                    <>Salvo <Check size={16} /></>
                  ) : 'Salvar Trilha Completa'}
                </button>
              </div>

              {/* Learning Levels Sections */}
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
                const filteredContent = path.contents.filter(c => c.difficulty === level);
                if (filteredContent.length === 0) return null;

                return (
                  <div key={level} style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '800', 
                      color: `var(--${level.toLowerCase()})`, 
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: `var(--${level.toLowerCase()})` }} />
                      Nível {level === 'Beginner' ? 'Iniciante' : level === 'Intermediate' ? 'Intermediário' : 'Avançado'}
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
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
          ))}
        </motion.section>
      )}

      {/* Recommended Topics */}
      {!results.length && (
        <section>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Sugestões para você</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {['React Native', 'Machine Learning', 'UX Design', 'Francês para Viagem', 'Cálculo I', 'Gestão de Projetos'].map(topic => (
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
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  boxShadow: 'var(--shadow)'
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
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
    <div style={{ background: 'rgba(39, 174, 96, 0.05)', padding: '0.75rem', borderRadius: '12px' }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: '1.25rem', fontWeight: '800' }}>{value}</p>
    </div>
  </div>
);

export default Dashboard;
