import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';
import MobileMenu from './MobileMenu';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonUrl?: string;
  currentPage?: 'home' | 'login' | 'dashboard' | 'adminPanel';
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'SoftArt AI HUB', 
  subtitle = 'Your AI Tools Platform',
  showBackButton = false,
  backButtonText = '← Back',
  backButtonUrl = '/dashboard',
  currentPage
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Check screen width and update mobile state
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    // Initial check
    checkScreenWidth();

    // Add resize listener
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

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
      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Left side - Logo and Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(1rem, 3vw, 2rem)',
          flex: '1',
          minWidth: 'fit-content'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.5rem, 2vw, 1rem)',
            flex: '1',
            minWidth: 'fit-content'
          }}>
            <Logo />
            <div>
              <h1 style={{
                color: 'white',
                fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
                fontWeight: 'bold',
                margin: 0,
                lineHeight: 1.2
              }}>
                {title}
              </h1>
              {subtitle && (
                <p style={{
                  color: '#e0e7ff',
                  fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                  margin: 'clamp(0.125rem, 0.5vw, 0.25rem) 0 0 0'
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
                padding: 'clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.75rem, 2.5vw, 1rem)',
                borderRadius: '0.5rem',
                fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
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
        <div style={{display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1rem)', flexWrap: 'wrap', justifyContent: 'flex-end', flex: '1', minWidth: 'fit-content'}}>
          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1rem)', flexWrap: 'wrap', justifyContent: 'flex-end'}}>
            <nav style={{display: 'flex', gap: 'clamp(0.5rem, 2vw, 1rem)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end'}}>
              <div style={{
                color: '#fbbf24',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                background: 'rgba(0,0,0,0.3)',
                padding: 'clamp(0.25rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 0.75rem)',
                borderRadius: '0.5rem',
                whiteSpace: 'nowrap'
              }}>
                {currentTime || 'Loading...'}
              </div>
              
              <button
                onClick={() => window.location.href = '/dashboard'}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: 'clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.75rem, 2.5vw, 1rem)',
                  borderRadius: '0.5rem',
                  fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                📊 Dashboard
              </button>

              {/* Admin Panel Button - Only for Owner */}
              {user?.role === 'owner' && (
                <button
                  onClick={() => router.push('/adminPanel')}
                  style={{
                    color: '#fbbf24',
                    border: '1px solid rgba(4, 120, 87, 0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(135deg, #047857, #0891b2)',
                    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  ⚙️ Admin Panel
                </button>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: 'clamp(0.25rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 0.75rem)',
                borderRadius: '0.5rem',
                flexWrap: 'wrap',
                minWidth: 'fit-content'
              }}>
                <span style={{
                  color: '#fbbf24',
                  fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                  whiteSpace: 'nowrap'
                }}>
                  👤 {user?.name || 'User'}
                </span>
                <span style={{
                  color: '#e0e7ff',
                  fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
                  whiteSpace: 'nowrap'
                }}>
                  ({typeof user?.role === 'string' ? user.role : user?.role?.name || 'user'})
                </span>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(244, 114, 182, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  padding: 'clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.75rem, 2.5vw, 1rem)',
                  borderRadius: '0.5rem',
                  fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
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

          {/* Mobile Menu */}
          <div className="mobile-menu" style={{display: isMobile ? 'block' : 'none'}}>
            <MobileMenu currentTime={currentTime} user={user} logout={handleLogout} currentPage={currentPage} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
