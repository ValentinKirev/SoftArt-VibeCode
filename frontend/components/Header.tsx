import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'SoftArt AI HUB', 
  subtitle = 'Your AI Tools Platform',
  showBackButton = false,
  backButtonText = '← Back',
  backButtonUrl = '/dashboard'
}) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left side - Logo and Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Logo />
            <div>
              <h1 style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                {title}
              </h1>
              {subtitle && (
                <p style={{
                  color: '#e0e7ff',
                  fontSize: '0.875rem',
                  margin: '0.25rem 0 0 0'
                }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {showBackButton && (
            <button
              onClick={() => window.location.href = backButtonUrl}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              {backButtonText}
            </button>
          )}
        </div>

        {/* Right side - Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            🏠 Dashboard
          </button>
          
          <button
            onClick={() => window.location.href = '/tools'}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              color: 'white',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
            }}
          >
            🧰 All Tools
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '0.5rem'
          }}>
            <span style={{
              color: '#fbbf24',
              fontSize: '0.875rem'
            }}>
              👤 {user?.name || 'User'}
            </span>
            <span style={{
              color: '#e0e7ff',
              fontSize: '0.75rem'
            }}>
              ({user?.role || 'user'})
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(244, 114, 182, 0.2)',
              color: 'white',
              border: '1px solid rgba(244, 114, 182, 0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(244, 114, 182, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(244, 114, 182, 0.2)';
            }}
          >
            🚪 Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
