import { NextPage } from 'next';

interface ErrorProps {
  statusCode?: number;
  title?: string;
}

const Error: NextPage<ErrorProps> = ({ statusCode, title }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #111827, #7c3aed, #3730a3)',
      color: 'white',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem'
        }}>
          😵
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: 'white'
        }}>
          {statusCode ? `Error ${statusCode}` : 'An error occurred'}
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#c4b5fd',
          marginBottom: '2rem',
          maxWidth: '500px',
          margin: '0 auto 2rem'
        }}>
          {title || 'Something went wrong. Please try refreshing the page or contact support if the problem persists.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'linear-gradient(to right, #7c3aed, #3730a3)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px 0 rgba(124, 58, 237, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(124, 58, 237, 0.3)';
          }}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;



















