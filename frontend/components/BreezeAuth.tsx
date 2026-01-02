import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

interface BreezeAuthProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If true, user must be logged in
}

const BreezeAuth: React.FC<BreezeAuthProps> = ({ children, requireAuth = false }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Page requires authentication but user is not logged in
        // Don't redirect, just show blocked message
        console.log('Access blocked: authentication required');
      }
    }
  }, [user, loading, router, requireAuth]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        color: '#fbbf24',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  // Show blocked message if authentication is required but user is not logged in
  if (requireAuth && !user) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        color: '#fbbf24',
        fontSize: '1.5rem',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          marginBottom: '2rem',
          fontSize: '3rem'
        }}>
          🔒
        </div>
        <div style={{
          marginBottom: '1rem'
        }}>
          Access Restricted
        </div>
        <div style={{
          fontSize: '1rem',
          opacity: 0.8,
          marginBottom: '2rem'
        }}>
          You must be logged in to view this page
        </div>
        <button
          onClick={() => router.push('/login')}
          style={{
            padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #fbbf24, #7c3aed)',
            border: 'none',
            borderRadius: '0.5rem',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(251, 191, 36, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default BreezeAuth;
