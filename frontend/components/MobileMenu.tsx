import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface MobileMenuProps {
  currentTime: string;
  user: any;
  logout: () => void;
  currentPage?: 'home' | 'login' | 'dashboard' | 'adminPanel';
}

const MobileMenu: React.FC<MobileMenuProps> = ({ currentTime, user, logout, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0.5rem',
          padding: '0.5rem',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        <div style={{
          width: '20px',
          height: '2px',
          background: 'white',
          borderRadius: '1px',
          transition: 'all 0.3s ease',
          transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
        }} />
        <div style={{
          width: '20px',
          height: '2px',
          background: 'white',
          borderRadius: '1px',
          transition: 'all 0.3s ease',
          opacity: isOpen ? 0 : 1
        }} />
        <div style={{
          width: '20px',
          height: '2px',
          background: 'white',
          borderRadius: '1px',
          transition: 'all 0.3s ease',
          transform: isOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
        }} />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          padding: '0.5rem',
          minWidth: '180px',
          maxWidth: '200px',
          zIndex: 1000,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          marginTop: '0.5rem',
          overflow: 'hidden'
        }}>
          {/* Time Display */}
          <div style={{
            color: '#fbbf24',
            fontSize: '0.75rem',
            background: 'rgba(0,0,0,0.3)',
            padding: '0.375rem',
            borderRadius: '0.375rem',
            marginBottom: '0.75rem',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            {currentTime || 'Loading...'}
          </div>

          {/* User Info */}
          {user && (
            <div style={{
              color: '#fbbf24',
              fontSize: '0.75rem',
              background: 'rgba(0,0,0,0.3)',
              padding: '0.375rem',
              borderRadius: '0.375rem',
              marginBottom: '0.75rem',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}>
              User ID: {user?.id || 'Loading...'}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {user ? (
              <>
                {/* Admin Panel Button - Only for Owner */}
                {user?.role === 'owner' && (
                  <button
                    onClick={() => window.location.href = '/adminPanel'}
                    style={{
                      color: '#fbbf24',
                      border: '1px solid rgba(4, 120, 87, 0.3)',
                      padding: '0.375rem 0.5rem',
                      borderRadius: '0.25rem',
                      background: 'linear-gradient(135deg, #047857, #0891b2)',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#fbbf24';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(4, 120, 87, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ⚙️ Admin Panel
                  </button>
                )}

                <button
                  onClick={() => window.location.href = '/dashboard'}
                  style={{
                    color: '#fbbf24',
                    border: '1px solid rgba(4, 120, 87, 0.3)',
                    padding: '0.375rem 0.5rem',
                    borderRadius: '0.25rem',
                    background: 'linear-gradient(135deg, #047857, #0891b2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.625rem',
                    fontWeight: 'bold',
                    width: '100%',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#fbbf24';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(4, 120, 87, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  📊 Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    color: 'white',
                    border: '1px solid rgba(244, 114, 182, 0.3)',
                    padding: '0.375rem 0.5rem',
                    borderRadius: '0.25rem',
                    background: 'linear-gradient(135deg, #fbbf24, #7c3aed)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.625rem',
                    fontWeight: 'bold',
                    width: '100%',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(244, 114, 182, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Show Home button on login page, Login button on other pages */}
                {currentPage === 'login' ? (
                  <a
                    href="/"
                    style={{
                      color: '#fbbf24',
                      border: '1px solid rgba(4, 120, 87, 0.3)',
                      padding: '0.375rem 0.5rem',
                      borderRadius: '0.25rem',
                      textDecoration: 'none',
                      background: 'linear-gradient(135deg, #047857, #0891b2)',
                      transition: 'all 0.3s ease',
                      fontSize: '0.625rem',
                      fontWeight: 'bold',
                      width: '100%',
                      textAlign: 'center',
                      display: 'block',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#fbbf24';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(4, 120, 87, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    🏠 Home
                  </a>
                ) : (
                  <button
                    onClick={() => window.location.href = '/login'}
                    style={{
                      color: 'white',
                      border: '1px solid rgba(244, 114, 182, 0.3)',
                      padding: '0.375rem 0.5rem',
                      borderRadius: '0.25rem',
                      background: 'linear-gradient(135deg, #fbbf24, #7c3aed)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.625rem',
                      fontWeight: 'bold',
                      width: '100%',
                      textAlign: 'center',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(244, 114, 182, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Login
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
