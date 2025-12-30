import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';

const Login: NextPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate login process
    setTimeout(() => {
      setIsSubmitting(false);
      // Here you would typically handle the login logic
      console.log('Login attempt:', { email, password });
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #111827, #7c3aed, #3730a3)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
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
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(2deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
          }

          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          @keyframes formGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(244, 114, 182, 0.3); }
            50% { box-shadow: 0 0 40px rgba(244, 114, 182, 0.6), 0 0 60px rgba(124, 58, 237, 0.4); }
          }

          .login-form {
            animation: formGlow 3s ease-in-out infinite;
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

      <div style={{
        width: '100%',
        maxWidth: '28rem',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease-out'
      }}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <div style={{
            width: '6rem',
            height: '6rem',
            background: 'linear-gradient(to bottom right, #7c3aed, #3730a3)',
            borderRadius: '50%',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'pulse 3s ease-in-out infinite'
          }}>
            <img
              src="/images/logo.png"
              alt="SoftArt AI HUB Logo"
              style={{
                width: '70%',
                height: '70%',
                objectFit: 'fill',
                display: 'block'
              }}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.style.display = 'none';
                img.parentElement!.innerHTML = '<span style="color: white; font-weight: bold; font-size: 2rem;">AI</span>';
              }}
            />
          </div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem'
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: '#c4b5fd',
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
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '1.5rem'}}>
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
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                placeholder="Enter your email"
                required
              />
            </div>

            <div style={{marginBottom: '2rem'}}>
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
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-hover"
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                background: 'linear-gradient(135deg, #f472b6, #7c3aed)',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
    </div>
  );
};

export default Login;
