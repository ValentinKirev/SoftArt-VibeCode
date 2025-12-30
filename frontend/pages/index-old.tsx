import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';

const Home: NextPage = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  const updateTime = useCallback(() => {
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
  }, []);

  useEffect(() => {
    // Set initial time
    updateTime();

    // Update time every second
    const interval = setInterval(updateTime, 1000);

    // Trigger page load animation
    const timeout = setTimeout(() => setIsLoaded(true), 200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [updateTime]);

  // Memoize error handlers to prevent re-renders
  const handleLogoError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget as HTMLImageElement;
    img.style.display = 'none';
    img.parentElement!.innerHTML = '<span style="color: white; font-weight: bold; font-size: 1.25rem;">AI</span>';
  }, []);

  const handleSmallLogoError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget as HTMLImageElement;
    img.style.display = 'none';
    img.parentElement!.innerHTML = '<span style="color: white; font-weight: bold; font-size: 0.875rem;">AI</span>';
  }, []);


  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #111827, #7c3aed, #3730a3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(55, 48, 163, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite reverse'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '70%',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 12s ease-in-out infinite'
        }}></div>
      </div>

      <Head>
        <title>SoftArt AI HUB - AI Tools Platform</title>
        <meta name="description" content="Internal AI tools sharing platform for SoftArt AI HUB" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header style={{
        background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        padding: '1rem',
        position: 'relative',
        zIndex: 10,
        transition: 'all 0.3s ease',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)'
      }}>
        <div style={{maxWidth: '80rem', margin: '0 auto', padding: '0 1rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{
                width: '5rem',
                height: '5rem',
                background: 'linear-gradient(to bottom right, #7c3aed, #3730a3)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}>
                <img
                  src="/images/logo.png"
                  alt="SoftArt AI HUB Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    display: 'block'
                  }}
                  onError={handleLogoError}
                />
              </div>
              <div>
                <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white'}}>SoftArt AI HUB</h1>
                <p style={{color: '#c4b5fd', fontSize: '0.875rem'}}>AI Tools Platform</p>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{
                color: '#f472b6',
                fontSize: '0.875rem',
                background: 'rgba(0,0,0,0.3)',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.5rem'
              }}>
                {currentTime || 'Loading...'}
              </div>
              <nav style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                <a
                  href="http://localhost:8000/login"
                  style={{
                    color: '#c4b5fd',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#a78bfa';
                    e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{position: 'relative', zIndex: 1}}>Login</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '5rem 1rem',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{
          textAlign: 'center',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out'
        }}>
          <div style={{marginBottom: '2rem'}}>
            <div style={{
              width: '5rem',
              height: '5rem',
              background: 'linear-gradient(to bottom right, #7c3aed, #3730a3)',
              borderRadius: '50%',
              marginBottom: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.5s ease',
              animation: 'pulse 3s ease-in-out infinite',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img
                src="/images/logo.png"
                alt="SoftArt AI HUB Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  display: 'block'
                }}
                onError={handleSmallLogoError}
              />
            </div>
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            Discover & Share
            <span style={{
              display: 'block',
              background: 'linear-gradient(45deg, #a78bfa, #f472b6, #3730a3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient 4s ease infinite'
            }}>
              AI Tools
            </span>
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#c4b5fd',
            marginBottom: '3rem',
            maxWidth: '48rem',
            margin: '0 auto 3rem',
            lineHeight: 1.6,
            opacity: 0.9
          }}>
            Your internal platform for discovering, sharing, and collaborating on AI tools,
            libraries, and applications across the SoftArt AI HUB team.
          </p>

        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: 'white',
        marginTop: '5rem',
        padding: '3rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Footer background elements */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(124, 58, 237, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(55, 48, 163, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>

        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease-out 0.5s'
        }}>
          <div style={{textAlign: 'center', marginBottom: '1rem'}}>
            <span style={{fontSize: '1.25rem', fontWeight: 'bold'}}>SoftArt AI HUB</span>
          </div>
          <p style={{
            color: '#9ca3af',
            marginBottom: '1rem',
            fontSize: '1rem',
            transition: 'color 0.3s ease'
          }}>
            Empowering teams with AI tools and collaboration
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            fontWeight: '300'
          }}>
            © 2025 SoftArt AI HUB. Internal AI Tools Platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
