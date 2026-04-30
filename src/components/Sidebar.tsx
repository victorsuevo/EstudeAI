import React from 'react';
import { Home, Library, Compass, History, BookOpen, Settings, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'discover', icon: Compass, label: 'Descobrir' },
    { id: 'paths', icon: BookOpen, label: 'Minhas Trilhas' },
    { id: 'library', icon: Library, label: 'Biblioteca' },
    { id: 'history', icon: History, label: 'Histórico' },
  ];

  return (
    <aside style={{
      width: '280px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      <div style={{ marginBottom: '4rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.025em' }}>
          EstudeAI
        </h1>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
          BY SUEVO
        </p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === item.id ? 'var(--primary)' : 'transparent',
              color: activeTab === item.id ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              width: '100%',
              textAlign: 'left',
              fontWeight: activeTab === item.id ? '600' : '500'
            }}
          >
            <item.icon size={20} />
            {item.label}
            {activeTab === item.id && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <button 
          onClick={() => setActiveTab('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.875rem 1rem',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'settings' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'settings' ? 'white' : 'var(--text-muted)',
            cursor: 'pointer',
            width: '100%',
            fontWeight: '500',
            transition: 'var(--transition)'
          }}
        >
          <Settings size={20} />
          Configurações
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
