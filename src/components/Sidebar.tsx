import React from 'react';
import { Home, Compass, BookOpen, History, Settings, X, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'discover', icon: Compass, label: 'Descobrir' },
    { id: 'paths', icon: BookOpen, label: 'Minhas Trilhas' },
    { id: 'history', icon: History, label: 'Histórico' },
  ];

  const handleTabClick = (id: string) => {
    onTabChange(id);
    if (window.innerWidth <= 1024) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src="/logo.png" 
            alt="EstudeAI Logo" 
            style={{ width: '40px', height: '40px', borderRadius: '10px' }} 
          />
          <div>
            <h1 className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: 1 }}>
              EstudeAI
            </h1>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
              BY SUEVO
            </p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          style={{ 
            display: window.innerWidth <= 1024 ? 'flex' : 'none', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.8rem 1rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === item.id ? 'var(--primary)' : 'transparent',
              color: activeTab === item.id ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              width: '100%',
              textAlign: 'left',
              fontWeight: activeTab === item.id ? '700' : '500'
            }}
          >
            <item.icon size={18} />
            <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
            {activeTab === item.id && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <button 
          onClick={() => handleTabClick('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.8rem 1rem',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: activeTab === 'settings' ? 'var(--primary)' : 'white',
            color: activeTab === 'settings' ? 'white' : 'var(--text-main)',
            cursor: 'pointer',
            width: '100%',
            fontWeight: '600',
            transition: 'var(--transition)'
          }}
        >
          <Settings size={18} />
          Configurações
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
