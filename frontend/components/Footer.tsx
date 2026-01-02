import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        {/* Company Info */}
        <div>
          <h3 style={{
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🎨 SoftArt AI HUB
          </h3>
          <p style={{
            color: '#e0e7ff',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            margin: 0
          }}>
            Your comprehensive platform for AI tools and services. 
            Discover, manage, and optimize your AI workflow.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Quick Links
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <li>
              <a
                href="/dashboard"
                style={{
                  color: '#e0e7ff',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fbbf24';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#e0e7ff';
                }}
              >
                🏠 Dashboard
              </a>
            </li>
            <li>
              <a
                href="/tools"
                style={{
                  color: '#e0e7ff',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fbbf24';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#e0e7ff';
                }}
              >
                🧰 All Tools
              </a>
            </li>
            <li>
              <a
                href="/login"
                style={{
                  color: '#e0e7ff',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fbbf24';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#e0e7ff';
                }}
              >
                🚪 Login
              </a>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 style={{
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Tool Categories
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <li style={{
              color: '#e0e7ff',
              fontSize: '0.875rem'
            }}>
              📝 Text Generation
            </li>
            <li style={{
              color: '#e0e7ff',
              fontSize: '0.875rem'
            }}>
              🎨 Image Generation
            </li>
            <li style={{
              color: '#e0e7ff',
              fontSize: '0.875rem'
            }}>
              💻 Code Generation
            </li>
            <li style={{
              color: '#e0e7ff',
              fontSize: '0.875rem'
            }}>
              🎵 Audio Processing
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 style={{
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Support
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{
              color: '#e0e7ff',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📧 support@softart.com
            </div>
            <div style={{
              color: '#e0e7ff',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📚 Documentation
            </div>
            <div style={{
              color: '#e0e7ff',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🐛 Report Issue
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto 0',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{
          color: '#e0e7ff',
          fontSize: '0.875rem'
        }}>
          © {currentYear} SoftArt AI HUB. All rights reserved.
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem'
        }}>
          <span style={{
            color: '#e0e7ff',
            fontSize: '0.75rem'
          }}>
            Version 1.0.0
          </span>
          <span style={{
            color: '#10b981',
            fontSize: '0.75rem'
          }}>
            ● System Online
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
