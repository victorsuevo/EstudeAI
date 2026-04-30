import React from 'react';
import { Settings as SettingsIcon, Globe, Trash2, Info, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsProps {
  language: 'PT' | 'EN' | 'FR';
  setLanguage: (lang: 'PT' | 'EN' | 'FR') => void;
  isGlobalSearch: boolean;
  setIsGlobalSearch: (val: boolean) => void;
  onShowManual: () => void;
  onClearHistory: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  language, 
  setLanguage, 
  isGlobalSearch, 
  setIsGlobalSearch, 
  onShowManual, 
  onClearHistory 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
          <SettingsIcon size={32} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Configurações</h2>
      </div>

      <section className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Idioma de Preferência */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Globe size={24} color="var(--accent-blue)" />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Idioma de Preferência</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Escolha o idioma principal para os materiais de estudo.</p>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            background: 'var(--bg-main)', 
            padding: '0.4rem', 
            borderRadius: '12px', 
            border: '1px solid var(--border)',
            opacity: isGlobalSearch ? 0.5 : 1,
            pointerEvents: isGlobalSearch ? 'none' : 'auto',
            transition: 'var(--transition)'
          }}>
            {(['PT', 'EN', 'FR'] as const).map(lang => (
              <button 
                key={lang}
                onClick={() => !isGlobalSearch && setLanguage(lang)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: !isGlobalSearch && language === lang ? 'var(--primary)' : 'transparent',
                  color: !isGlobalSearch && language === lang ? 'white' : 'var(--text-muted)',
                  fontWeight: '700',
                  cursor: isGlobalSearch ? 'not-allowed' : 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        {isGlobalSearch && (
          <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '-1rem', fontWeight: '600' }}>
            * Desative a Busca Global para selecionar um idioma específico.
          </p>
        )}

        <div style={{ height: '1px', background: 'var(--border)' }} />

        {/* Busca Global (NOVO) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Sparkles size={24} color="var(--secondary)" />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Busca Global (Multi-idioma)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Busca conteúdos em PT, EN e FR simultaneamente para trilhas mais ricas.</p>
          </div>
          <button 
            onClick={() => setIsGlobalSearch(!isGlobalSearch)}
            style={{ 
              background: isGlobalSearch ? 'var(--primary)' : 'var(--bg-main)', 
              color: isGlobalSearch ? 'white' : 'var(--text-main)', 
              border: '1px solid var(--border)',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isGlobalSearch ? 'Ativado' : 'Desativado'}
            {isGlobalSearch && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />}
          </button>
        </div>

        <div style={{ height: '1px', background: 'var(--border)' }} />

        {/* Limpar Histórico */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Trash2 size={24} color="#ef4444" />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Limpar Histórico</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Remover todas as suas buscas recentes e trilhas não salvas.</p>
          </div>
          <button 
            onClick={onClearHistory}
            style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Limpar agora
          </button>
        </div>
      </section>

      {/* Sobre Section */}
      <section className="premium-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ background: 'var(--bg-main)', padding: '0.5rem', borderRadius: '8px' }}>
            <Info size={24} color="var(--secondary)" />
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Sobre o EstudeAI</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            O EstudeAI utiliza curadoria baseada em IA para filtrar o ruído da internet e entregar apenas os melhores materiais gratuitos em múltiplos idiomas.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ flex: 1, background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <BookOpen size={20} color="var(--primary)" />
                <p style={{ fontWeight: '800', color: 'var(--text-main)' }}>Manual do Usuário</p>
              </div>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Acesse o guia completo de funcionalidades.</p>
              <button 
                className="btn-primary"
                style={{ width: '100%', padding: '0.6rem' }}
                onClick={onShowManual}
              >
                Abrir Guia
              </button>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <p style={{ fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Versão</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>1.0.0 Stable</p>
              </div>
              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <p style={{ fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Desenvolvido por</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>SUEVO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '2rem' }}>
        <p>© 2026 EstudeAI. Todos os direitos reservados.</p>
      </div>
    </motion.div>
  );
};

export default Settings;
