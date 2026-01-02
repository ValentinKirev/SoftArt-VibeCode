import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('AuthGuard: checking auth', { user, loading, pathname: router.pathname });
    
    if (!loading) {
      // Public routes that don't require authentication
      const publicRoutes = ['/login', '/'];
      
      if (!user && !publicRoutes.includes(router.pathname)) {
        // User is not authenticated and trying to access a protected route
        console.log('AuthGuard: redirecting to login (no user)');
        router.push('/login');
      } else if (user && router.pathname === '/login') {
        // User is authenticated and trying to access login page
        // Add small delay to allow login redirect to complete first
        console.log('AuthGuard: redirecting to dashboard (user on login page)');
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        console.log('AuthGuard: allowing access', { user, pathname: router.pathname });
      }
    }
  }, [user, loading, router]);

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

  return <>{children}</>;
};

export default AuthGuard;
