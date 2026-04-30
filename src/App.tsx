import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import ContentCard from './components/ContentCard';
import { Trash2, ChevronDown, ChevronUp, X, Clock } from 'lucide-react';

import { searchContent } from './services/ContentService';
import type { LearningPath, Content } from './services/ContentService';
import { motion } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchResults, setSearchResults] = useState<LearningPath[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [prefLanguage, setPrefLanguage] = useState<'PT' | 'EN' | 'FR'>('PT');
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);
  const [savedPaths, setSavedPaths] = useState<LearningPath[]>(() => {
    const saved = localStorage.getItem('estude_saved_paths');
    return saved ? JSON.parse(saved) : [];
  });
  const [expandedPathId, setExpandedPathId] = useState<string | null>(null);
  const [pathToDelete, setPathToDelete] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<Content[]>([]);
  const [completedItems, setCompletedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('estude_completed');
    return saved ? JSON.parse(saved) : [];
  });
  const [showManual, setShowManual] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('estude_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [notification, setNotification] = useState<{ show: boolean, message: string } | null>(null);
  const [discoverTopics, setDiscoverTopics] = useState([
    { title: 'IA Generativa', desc: 'O futuro da tecnologia e como ela está mudando o mundo.', color: '#10b981' },
    { title: 'Neurociência do Aprendizado', desc: 'Como o cérebro retém informações e como estudar melhor.', color: '#3b82f6' },
    { title: 'Economia Circular', desc: 'Novos modelos de negócios sustentáveis e regenerativos.', color: '#ef4444' }
  ]);

  // Persistência Automática
  useEffect(() => {
    localStorage.setItem('estude_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('estude_saved_paths', JSON.stringify(savedPaths));
  }, [savedPaths]);

  useEffect(() => {
    localStorage.setItem('estude_completed', JSON.stringify(completedItems));
  }, [completedItems]);

  const showToast = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToHistory = (query: string) => {
    if (!searchHistory.includes(query)) {
      setSearchHistory([query, ...searchHistory.slice(0, 9)]); // Mantém os 10 últimos
    }
  };

  const handleToggleFavorite = (item: Content) => {
    if (savedItems.find(i => i.id === item.id)) {
      setSavedItems(savedItems.filter(i => i.id !== item.id));
    } else {
      setSavedItems([...savedItems, item]);
    }
  };

  const handleToggleComplete = (id: string) => {
    if (completedItems.includes(id)) {
      setCompletedItems(completedItems.filter(i => i !== id));
    } else {
      setCompletedItems([...completedItems, id]);
    }
  };

  const handleSavePath = (path: LearningPath) => {
    if (!savedPaths.find(p => p.id === path.id)) {
      setSavedPaths([...savedPaths, path]);
    }
  };

  const handleDeletePath = (id: string) => {
    setSavedPaths(savedPaths.filter(p => p.id !== id));
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            results={searchResults} 
            setResults={setSearchResults} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onSavePath={handleSavePath}
            savedPaths={savedPaths}
            onToggleFavorite={handleToggleFavorite}
            savedItems={savedItems}
            onToggleComplete={handleToggleComplete}
            completedItems={completedItems}
            prefLanguage={prefLanguage}
            isGlobalSearch={isGlobalSearch}
            onSearchSuccess={addToHistory}
          />
        )}
        
        {activeTab === 'discover' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Descobrir</h2>
                <p style={{ color: 'var(--text-muted)' }}>Exploração inteligente baseada nas tendências globais de aprendizado.</p>
              </div>
              <button 
                onClick={() => {
                  const pools = [
                    { title: 'Web3 e Blockchain', desc: 'A descentralização da web e contratos inteligentes.', color: '#8b5cf6' },
                    { title: 'Psicologia Cognitiva', desc: 'Como processamos informações e formamos memórias.', color: '#f59e0b' },
                    { title: 'Energias Renováveis', desc: 'Tecnologias solares, eólicas e o futuro do planeta.', color: '#10b981' },
                    { title: 'Data Science', desc: 'Análise de grandes volumes de dados para tomada de decisão.', color: '#3b82f6' },
                    { title: 'Marketing Digital', desc: 'Estratégias de crescimento e engajamento em redes.', color: '#ec4899' },
                    { title: 'Biohacking', desc: 'Otimização do corpo e mente através de ciência e tech.', color: '#ef4444' }
                  ];
                  setDiscoverTopics([...pools].sort(() => 0.5 - Math.random()).slice(0, 3));
                }}
                className="btn-primary"
                style={{ padding: '0.6rem 1.2rem', background: 'var(--bg-card)', color: 'var(--primary)', border: '1px solid var(--primary)', boxShadow: 'none' }}
              >
                Novas Sugestões
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {discoverTopics.map(topic => (
                <div key={topic.title} className="premium-card" style={{ borderLeft: `4px solid ${topic.color}`, padding: '2rem' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>{topic.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{topic.desc}</p>
                  <button 
                    onClick={async () => {
                      setSearchQuery(topic.title);
                      setActiveTab('dashboard');
                      const results = await searchContent(topic.title, prefLanguage, isGlobalSearch);
                      setSearchResults(results);
                      addToHistory(topic.title);
                    }}
                    className="btn-primary" 
                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                  >
                    Gerar Trilha de Especialista
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'paths' && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Minhas Trilhas</h2>
            {savedPaths.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', border: '2px dashed var(--border)', borderRadius: '20px' }}>
                <p style={{ color: 'var(--text-muted)' }}>Você ainda não salvou nenhuma trilha. Comece buscando um tópico!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {savedPaths.map(path => (
                  <div key={path.id} className="premium-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{path.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{path.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ 
                          background: 'linear-gradient(90deg, #10b981, #3b82f6, #ef4444)',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          color: 'white'
                        }}>
                          TRILHA COMPLETA
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => setExpandedPathId(expandedPathId === path.id ? null : path.id)}
                            className="btn-primary" 
                            style={{ 
                              padding: '0.6rem 1.2rem', 
                              fontSize: '0.9rem',
                              background: 'var(--primary)',
                              border: 'none',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            {expandedPathId === path.id ? <><ChevronUp size={18} /> Recolher</> : <><ChevronDown size={18} /> Ver Conteúdo</>}
                          </button>
                          <button 
                            onClick={() => setPathToDelete(path.id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '0.6rem',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedPathId === path.id && (
                      <div style={{ 
                        marginTop: '2rem', 
                        paddingTop: '2rem', 
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2.5rem'
                      }}>
                        {['Beginner', 'Intermediate', 'Advanced'].map(level => {
                          const levelContent = path.contents.filter(c => c.difficulty === level);
                          if (levelContent.length === 0) return null;
                          return (
                            <div key={level}>
                              <h4 style={{ 
                                fontSize: '0.9rem', 
                                fontWeight: '800', 
                                color: `var(--${level.toLowerCase()})`,
                                marginBottom: '1.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                              }}>
                                Nível {level === 'Beginner' ? 'Iniciante' : level === 'Intermediate' ? 'Intermediário' : 'Avançado'}
                              </h4>
                              <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                                gap: '1.5rem' 
                              }}>
                                {levelContent.map(content => (
                                  <ContentCard 
                                    key={content.id} 
                                    content={{
                                      ...content,
                                      isFavorite: savedItems.some(i => i.id === content.id),
                                      completed: completedItems.includes(content.id)
                                    }} 
                                    onToggleFavorite={() => handleToggleFavorite(content)}
                                    onToggleComplete={() => handleToggleComplete(content.id)}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'library' && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Minha Biblioteca</h2>
            {savedItems.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', border: '2px dashed var(--border)', borderRadius: '20px' }}>
                <p style={{ color: 'var(--text-muted)' }}>Você ainda não favoritou nenhum conteúdo individual.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {savedItems.map(item => (
                  <ContentCard 
                    key={item.id} 
                    content={{ 
                      ...item, 
                      isFavorite: true,
                      completed: completedItems.includes(item.id)
                    }} 
                    onToggleFavorite={() => handleToggleFavorite(item)}
                    onToggleComplete={() => handleToggleComplete(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Histórico de Busca</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Recupere rapidamente os tópicos que você pesquisou recentemente.</p>
            
            {searchHistory.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', border: '2px dashed var(--border)', borderRadius: '20px' }}>
                <p style={{ color: 'var(--text-muted)' }}>Seu histórico de buscas ainda está vazio.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={async () => {
                      setSearchQuery(query);
                      setActiveTab('dashboard');
                      const results = await searchContent(query, prefLanguage, isGlobalSearch);
                      setSearchResults(results);
                    }}
                    className="premium-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.25rem 2rem',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-card)'
                    }}
                  >
                    <Clock size={20} color="var(--primary)" />
                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{query}</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pesquisar novamente</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <Settings 
            language={prefLanguage} 
            setLanguage={setPrefLanguage} 
            isGlobalSearch={isGlobalSearch}
            setIsGlobalSearch={setIsGlobalSearch}
            onShowManual={() => setShowManual(true)} 
            onClearHistory={() => {
              setSearchHistory([]);
              showToast('Histórico de buscas limpo com sucesso!');
            }}
          />
        )}
      </main>

      {/* User Manual Modal */}
      {showManual && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '2rem'
        }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card" 
            style={{ 
              maxWidth: '800px', 
              width: '100%', 
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '3rem',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setShowManual(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'var(--bg-main)',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                padding: '0.5rem',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center' }}>
              📖 Guia do <span className="gradient-text">EstudeAI</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.6' }}>
              <section>
                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>🚀 Começando</h3>
                <p>No Dashboard, digite o que quer aprender. A IA criará uma <strong>Trilha Completa</strong> dividida em níveis: Iniciante, Intermediário e Avançado.</p>
              </section>

              <section>
                <h3 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>📚 Organização</h3>
                <p>Use o ícone de <strong>Livros</strong> para salvar itens individuais na sua <strong>Biblioteca</strong>. O ícone de <strong>Check</strong> marca o que você já concluiu.</p>
              </section>

              <section>
                <h3 style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>🧭 Descobrir</h3>
                <p>Use esta aba para explorar novos temas sugeridos pela IA. É ideal para quando você quer aprender algo novo mas não sabe por onde começar.</p>
              </section>

              <section>
                <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>🛡️ Segurança</h3>
                <p>Todas as trilhas salvas ficam em <strong>Minhas Trilhas</strong>. Ao excluir, você verá uma confirmação para evitar perdas acidentais.</p>
              </section>
            </div>

            <button 
              onClick={() => setShowManual(false)}
              className="btn-primary"
              style={{ width: '100%', marginTop: '3rem', padding: '1rem' }}
            >
              Entendi, vamos estudar!
            </button>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal */}
      {pathToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '2rem'
        }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="premium-card" 
            style={{ 
              maxWidth: '450px', 
              width: '100%', 
              textAlign: 'center',
              padding: '3rem',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              width: '80px', 
              height: '80px', 
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 2rem auto',
              transform: 'rotate(-10deg)'
            }}>
              <Trash2 size={40} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }}>Excluir Trilha?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6', fontSize: '1.1rem' }}>
              Tem certeza que deseja remover esta trilha? Todo o seu progresso salvo para este tópico será perdido.
            </p>
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <button 
                onClick={() => setPathToDelete(null)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '14px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  handleDeletePath(pathToDelete);
                  setPathToDelete(null);
                }}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '14px',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)'
                }}
              >
                Confirmar Exclusão
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mobile Navigation Indicator (Bottom bar for small screens) */}
      <div className="glass-effect" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4rem',
        display: 'none', // Shown via CSS media query if needed
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1001,
        borderTop: '1px solid var(--border)'
      }}>
        {/* We can implement mobile nav here if required, but for now focusing on the desktop layout which is primary */}
      </div>
      {/* Custom Notification Toast */}
      {notification?.show && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            background: 'var(--text-main)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            zIndex: 5000,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontWeight: '600'
          }}
        >
          <div style={{ background: 'var(--primary)', width: '8px', height: '8px', borderRadius: '50%' }} />
          {notification.message}
        </motion.div>
      )}
    </div>
  );
}

export default App;
