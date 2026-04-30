import React from 'react';
import { PlayCircle, FileText, Book, GraduationCap, CheckCircle, ExternalLink, Clock, LibraryBig } from 'lucide-react';
import type { Content } from '../services/ContentService';
import { motion } from 'framer-motion';

interface ContentCardProps {
  content: Content;
  onToggleComplete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onToggleComplete, onToggleFavorite }) => {
  const getIcon = () => {
    switch (content.type) {
      case 'Video': return <PlayCircle size={24} color="var(--primary)" />;
      case 'Article': return <FileText size={24} color="#3b82f6" />;
      case 'Course': return <GraduationCap size={24} color="#ec4899" />;
      case 'Documentation': return <Book size={24} color="#10b981" />;
      case 'Academic': return <FileText size={24} color="#8b5cf6" />;
      default: return <FileText size={24} />;
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          background: 'var(--glass)', 
          padding: '0.75rem', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {getIcon()}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className={`difficulty-badge difficulty-${content.difficulty}`}>
            {content.difficulty === 'Beginner' ? 'Iniciante' : content.difficulty === 'Intermediate' ? 'Intermediário' : 'Avançado'}
          </span>
          <span style={{ 
            fontSize: '0.7rem', 
            background: 'rgba(255,255,255,0.1)', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            {content.language}
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '700', lineHeight: '1.4' }}>
          {content.title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {content.description}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ExternalLink size={14} /> {content.source}
        </span>
        {content.duration && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={14} /> {content.duration}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button 
          onClick={() => window.open(content.url, '_blank')}
          className="btn-primary" 
          style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
        >
          Acessar Conteúdo
        </button>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleFavorite?.(content.id)}
          style={{ 
            background: content.isFavorite ? 'rgba(245, 158, 11, 0.15)' : 'var(--glass)', 
            border: content.isFavorite ? '1px solid var(--secondary)' : '1px solid transparent', 
            borderRadius: '12px', 
            padding: '0.6rem', 
            cursor: 'pointer',
            color: content.isFavorite ? 'var(--secondary)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)'
          }}
        >
          <LibraryBig size={20} strokeWidth={content.isFavorite ? 3 : 2} />
        </motion.button>
        <button 
          onClick={() => onToggleComplete?.(content.id)}
          style={{ 
            background: content.completed ? 'rgba(16, 185, 129, 0.15)' : 'var(--glass)', 
            border: content.completed ? '1px solid var(--success)' : '1px solid transparent', 
            borderRadius: '12px', 
            padding: '0.6rem', 
            cursor: 'pointer',
            color: content.completed ? 'var(--success)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)'
          }}
        >
          <CheckCircle size={20} strokeWidth={content.completed ? 3 : 2} />
        </button>
      </div>
    </motion.div>
  );
};

export default ContentCard;
