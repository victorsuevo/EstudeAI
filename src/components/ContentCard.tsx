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
      case 'Video': return <PlayCircle size={20} color="var(--primary)" />;
      case 'Article': return <FileText size={20} color="var(--accent)" />;
      case 'Course': return <GraduationCap size={20} color="var(--secondary)" />;
      case 'Documentation': return <Book size={20} color="var(--beginner)" />;
      case 'Academic': return <LibraryBig size={20} color="#8b5cf6" />;
      default: return <FileText size={20} />;
    }
  };

  const difficultyLabels: Record<string, string> = {
    'Beginner': 'Iniciante',
    'Intermediate': 'Intermediário',
    'Advanced': 'Avançado'
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="premium-card"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem', 
        height: '100%'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ 
          background: '#f8fafc', 
          padding: '0.6rem', 
          borderRadius: '10px',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {getIcon()}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <span className={`badge badge-${content.difficulty.toLowerCase()}`}>
            {difficultyLabels[content.difficulty] || content.difficulty}
          </span>
          <span style={{ 
            fontSize: '0.6rem', 
            background: '#f1f5f9', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '6px',
            fontWeight: '700',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)'
          }}>
            {content.language}
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', fontWeight: '800', lineHeight: '1.4', fontFamily: 'Outfit, sans-serif' }}>
          {content.title}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {content.description}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <ExternalLink size={12} color="var(--primary)" /> {content.source}
        </span>
        {content.durationHours && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={12} color="var(--primary)" /> {content.durationHours}h
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button 
          onClick={() => window.open(content.url, '_blank')}
          className="btn-primary" 
          style={{ flex: 1, padding: '0.7rem', fontSize: '0.8rem' }}
        >
          Ver Aula
        </button>
        <button 
          onClick={() => onToggleFavorite?.(content.id)}
          style={{ 
            background: content.isFavorite ? 'rgba(236, 72, 153, 0.1)' : '#f8fafc', 
            border: content.isFavorite ? '1px solid var(--secondary)' : '1px solid var(--border)', 
            borderRadius: '12px', 
            padding: '0.7rem', 
            cursor: 'pointer',
            color: content.isFavorite ? 'var(--secondary)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)'
          }}
        >
          <LibraryBig size={18} strokeWidth={content.isFavorite ? 3 : 2} />
        </button>
        <button 
          onClick={() => onToggleComplete?.(content.id)}
          style={{ 
            background: content.completed ? 'rgba(16, 185, 129, 0.1)' : '#f8fafc', 
            border: content.completed ? '1px solid var(--beginner)' : '1px solid var(--border)', 
            borderRadius: '12px', 
            padding: '0.7rem', 
            cursor: 'pointer',
            color: content.completed ? 'var(--beginner)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)'
          }}
        >
          <CheckCircle size={18} strokeWidth={content.completed ? 3 : 2} />
        </button>
      </div>
    </motion.div>
  );
};

export default ContentCard;
