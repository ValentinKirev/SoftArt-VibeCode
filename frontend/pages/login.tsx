import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';

const Login: NextPage = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Enhanced Cursor Trail Effect
  useEffect(() => {
    let trailElements: HTMLElement[] = [];
    let trailHistory: { x: number; y: number; timestamp: number }[] = [];
    let lastMouseX = 0;
    let lastMouseY = 0;
    let animationId: number;

    const createTrailSegment = (x: number, y: number, index: number, totalSegments: number) => {
      const element = document.createElement('div');
      element.className = 'trail-segment';

      // Create gradient effect based on position in trail
      const opacity = Math.max(0.1, (totalSegments - index) / totalSegments);
      const size = Math.max(6, 20 - index * 1.2);

      element.style.left = `${x - size/2}px`;
      element.style.top = `${y - size/2}px`;

      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.opacity = opacity.toString();
      element.style.background = `radial-gradient(circle, rgba(244, 114, 182, ${opacity * 0.8}) 0%, rgba(124, 58, 237, ${opacity * 0.4}) 50%, transparent 100%)`;

      document.body.appendChild(element);
      trailElements.push(element);

      // Remove element after animation with staggered timing
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
        trailElements = trailElements.filter(el => el !== element);
      }, 800 + index * 50);
    };

    const createConnectingLine = (startX: number, startY: number, endX: number, endY: number, intensity: number) => {
      const element = document.createElement('div');
      element.className = 'connecting-line';

      const dx = endX - startX;
      const dy = endY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      element.style.left = `${startX}px`;
      element.style.top = `${startY - 1.5}px`;
      element.style.width = `${distance}px`;
      element.style.height = '3px';
      element.style.transformOrigin = '0 50%';
      element.style.transform = `rotate(${angle}deg)`;
      element.style.opacity = intensity.toString();
      element.style.background = `linear-gradient(90deg, rgba(244, 114, 182, ${intensity}), rgba(124, 58, 237, ${intensity * 0.5}), transparent)`;

      document.body.appendChild(element);
      trailElements.push(element);

      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
        trailElements = trailElements.filter(el => el !== element);
      }, 600);
    };

    const updateTrail = (currentTime: number) => {
      // Create continuous trail segments
      trailHistory.forEach((point, index) => {
        if (currentTime - point.timestamp < 800) {
          createTrailSegment(point.x, point.y, index, trailHistory.length);
        }
      });

      // Create connecting lines between recent points
      for (let i = 0; i < trailHistory.length - 1; i++) {
        const currentPoint = trailHistory[i];
        const nextPoint = trailHistory[i + 1];
        const age = currentTime - currentPoint.timestamp;
        if (age < 400) {
          const intensity = Math.max(0.1, 1 - age / 400);
          createConnectingLine(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y, intensity);
        }
      }

      // Clean up old trail history
      trailHistory = trailHistory.filter(point => currentTime - point.timestamp < 1000);

      // Limit DOM elements for performance
      if (trailElements.length > 50) {
        const elementsToRemove = trailElements.splice(0, trailElements.length - 50);
        elementsToRemove.forEach(element => {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      const currentTime = Date.now();

      // Add current position to trail history
      trailHistory.push({ x: currentX, y: currentY, timestamp: currentTime });

      // Keep only recent history
      if (trailHistory.length > 15) {
        trailHistory.shift();
      }

      lastMouseX = currentX;
      lastMouseY = currentY;
    };

    // Animation loop for smooth trail updates
    const animate = () => {
      updateTrail(Date.now());
      animationId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      // Clean up any remaining trail elements
      trailElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, []);

  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
        const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.message && data.message.includes('Login successful')) {
        // Store user data and token in localStorage
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);

        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        // Login failed, show error
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <title>Login - SoftArt AI HUB</title>
        <meta name="description" content="Login to SoftArt AI HUB" />
        <link rel="icon" href="/favicon.ico" />
        <style>{`
          @keyframes hologram {
            0%, 100% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 0.3; transform: scale(1.2); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(2deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }

          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          @keyframes logoGlow {
            0%, 100% { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); }
            50% { box-shadow: 0 30px 40px -5px rgba(0, 0, 0, 0.3), 0 0 30px rgba(244, 114, 182, 0.4); }
          }

          @keyframes buttonPulse {
            0%, 100% { transform: translateY(-3px) scale(1.05); }
            50% { transform: translateY(-5px) scale(1.08); }
          }

          @keyframes laserTrail {
            0% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.2) rotate(180deg);
            }
            100% {
              opacity: 0;
              transform: scale(0) rotate(360deg);
            }
          }

          @keyframes fadeOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.5); }
          }

          .header-logo-effect {
            position: relative;
          }

          .header-logo-effect:hover {
            animation: logoGlow 1.5s ease-in-out infinite;
          }

          .login-button-effect {
            position: relative;
          }

          .login-button-effect:hover {
            animation: buttonPulse 1s ease-in-out infinite;
          }

          .login-button-effect::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(244, 114, 182, 0.2), transparent);
            transition: left 0.5s ease;
          }

          .login-button-effect:hover::before {
            left: 100%;
          }

          .trail-segment {
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            border-radius: 50%;
            transition: all 0.3s ease;
            animation: trailFade 1s ease-out forwards;
          }

          .connecting-line {
            position: fixed;
            pointer-events: none;
            z-index: 9998;
            border-radius: 1px;
            transition: opacity 0.3s ease;
            animation: lineFade 0.8s ease-out forwards;
          }

          @keyframes trailFade {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(0.3);
            }
          }

          @keyframes lineFade {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }

          @keyframes formGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(244, 114, 182, 0.3); }
            50% { box-shadow: 0 0 40px rgba(244, 114, 182, 0.6), 0 0 60px rgba(124, 58, 237, 0.4); }
          }

          .login-form {
            animation: formGlow 3s ease-in-out infinite;
          }

          form input[type="email"],
          form input[type="password"],
          form button[type="submit"] {
            box-sizing: border-box !important;
            -webkit-box-sizing: border-box !important;
            -moz-box-sizing: border-box !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          form button[type="submit"] {
            appearance: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            border: 1px solid transparent !important;
          }

          .input-focus {
            transition: all 0.3s ease;
          }

          .input-focus:focus {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(244, 114, 182, 0.4);
            border-color: #f472b6 !important;
          }

          .btn-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .btn-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(244, 114, 182, 0.6);
          }
        `}</style>
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
              <a href="/" style={{textDecoration: 'none'}}>
                <div className="header-logo-effect" style={{
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
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(2deg)';
                  e.currentTarget.style.boxShadow = '0 30px 40px -5px rgba(0, 0, 0, 0.3), 0 0 30px rgba(244, 114, 182, 0.4)';
                  e.currentTarget.style.filter = 'brightness(1.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.filter = 'brightness(1)';
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
              </a>
              <div>
                <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white'}}>SoftArt AI HUB</h1>
                <p style={{color: '#f472b6', fontSize: '0.875rem'}}>AI Tools Platform</p>
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '5rem 1rem',
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)' // Account for header and footer
      }}>
        <div style={{
          width: '100%',
          maxWidth: '28rem',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out'
        }}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem'
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: '#f472b6',
            fontSize: '1.125rem'
          }}>
            Sign in to your SoftArt AI HUB account
          </p>
        </div>

        {/* Login Form */}
        <div className="login-form" style={{
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(244, 114, 182, 0.2)',
          borderRadius: '1rem',
          padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <form onSubmit={handleSubmit} style={{width: '100%', boxSizing: 'border-box'}}>
            <div style={{marginBottom: '1.5rem', width: '100%', boxSizing: 'border-box'}}>
              <label style={{
                display: 'block',
                color: '#e5e7eb',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-focus"
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  margin: 0,
                  display: 'block',
                  WebkitBoxSizing: 'border-box',
                  MozBoxSizing: 'border-box'
                }}
                placeholder="Enter your email"
                required
              />
            </div>

            <div style={{marginBottom: '1.5rem', width: '100%', boxSizing: 'border-box'}}>
              <label style={{
                display: 'block',
                color: '#e5e7eb',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-focus"
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  margin: 0,
                  display: 'block',
                  WebkitBoxSizing: 'border-box',
                  MozBoxSizing: 'border-box'
                }}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1.5rem',
                color: '#ef4444',
                width: '100%',
                boxSizing: 'border-box',
                marginTop: '0',
                marginLeft: 0,
                marginRight: 0
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-hover"
              style={{
                width: '100%',
                padding: '14px 24px',
                background: 'linear-gradient(135deg, #f472b6, #7c3aed)',
                border: '1px solid transparent',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxSizing: 'border-box',
                margin: 0,
                display: 'block',
                WebkitBoxSizing: 'border-box',
                MozBoxSizing: 'border-box'
              }}
            >
              {isSubmitting ? (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
            <a
              href="/"
              style={{
                color: '#c4b5fd',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#f472b6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#c4b5fd';
              }}
            >
              ← Back to Home
            </a>
          </div>
        </div>
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
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#f472b6',
            margin: '0 0 1rem 0'
          }}>
            SoftArt AI HUB
          </h2>
          <p style={{
            color: '#9ca3af',
            marginBottom: '1rem',
            fontSize: '1rem'
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

export default Login;

