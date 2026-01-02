import React from 'react';

interface Tool {
  id: number;
  name: string;
  slug: string;
  description: string;
  url?: string;
  documentation_url?: string;
  icon?: string;
  color?: string;
  version?: string;
  status: 'active' | 'inactive' | 'beta';
  is_active: boolean;
  categories: { id: number; name: string; icon?: string }[];
  roles: { id: number; name: string }[];
  tags: { id: number; name: string; icon?: string; color?: string }[];
}

interface ToolViewModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
}

const ToolViewModal: React.FC<ToolViewModalProps> = ({ tool, isOpen, onClose }) => {
  if (!isOpen || !tool) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      case 'beta': return '#fbbf24';
      case 'maintenance': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusBadge = (status: string) => (
    <span style={{
      background: `${getStatusColor(status)}30`,
      color: getStatusColor(status),
      padding: '0.5rem 1rem',
      borderRadius: '1rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      boxShadow: `0 2px 4px ${getStatusColor(status)}40`,
      display: 'inline-block'
    }}>
      {status}
    </span>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1f2937, #111827)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '1.5rem',
        padding: '3rem',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            border: 'none',
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <div style={{
            fontSize: '4rem',
            marginRight: '2rem',
            background: `${tool.color || '#3B82F6'}20`,
            padding: '1rem',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {tool.icon || '🤖'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              {tool.name}
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {getStatusBadge(tool.status)}
              {tool.version && (
                <span style={{
                  color: '#9ca3af',
                  fontSize: '1.125rem',
                  background: 'rgba(156, 163, 175, 0.1)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem'
                }}>
                  v{tool.version}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            color: '#fbbf24',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Description
          </h3>
          <p style={{
            color: '#c4b5fd',
            fontSize: '1.125rem',
            lineHeight: '1.6',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(139, 92, 246, 0.1)'
          }}>
            {tool.description}
          </p>
        </div>

        {/* URL */}
        {tool.url && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#fbbf24',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              URL
            </h3>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#60a5fa',
                fontSize: '1.125rem',
                textDecoration: 'none',
                background: 'rgba(96, 165, 250, 0.1)',
                padding: '1rem 1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                display: 'inline-block',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(96, 165, 250, 0.2)';
                e.currentTarget.style.color = '#93c5fd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)';
                e.currentTarget.style.color = '#60a5fa';
              }}
            >
              🔗 {tool.url}
            </a>
          </div>
        )}

        {/* Documentation URL */}
        {tool.documentation_url && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#fbbf24',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Documentation
            </h3>
            <a
              href={tool.documentation_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#10b981',
                fontSize: '1.125rem',
                textDecoration: 'none',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '1rem 1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'inline-block',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                e.currentTarget.style.color = '#34d399';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                e.currentTarget.style.color = '#10b981';
              }}
            >
              📚 {tool.documentation_url}
            </a>
          </div>
        )}

        {/* Categories */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            color: '#fbbf24',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Categories
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {(tool.categories || []).map(category => (
              <span
                key={category.id}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #7c3aed)',
                  color: '#86efac',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(251, 191, 36, 0.2)'
                }}
              >
                {category.icon} {category.name}
              </span>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            color: '#fbbf24',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Accessible to Roles
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {(tool.roles || []).map(role => (
              <span
                key={role.id}
                style={{
                  background: 'linear-gradient(135deg, #047857, #0891b2)',
                  color: '#fbbf24',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(4, 120, 87, 0.2)'
                }}
              >
                {role.name}
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            color: '#fbbf24',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Tags
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {(tool.tags || []).map(tag => (
              <span
                key={tag.id}
                style={{
                  background: tag.color ? `${tag.color}20` : 'rgba(139, 92, 246, 0.2)',
                  color: tag.color || '#a78bfa',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  border: `1px solid ${tag.color ? `${tag.color}40` : 'rgba(139, 92, 246, 0.3)'}`,
                  boxShadow: '0 2px 4px rgba(139, 92, 246, 0.1)'
                }}
              >
                {tag.icon} {tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Tool ID:</span>
            <span style={{ color: '#fbbf24', fontSize: '1rem', fontWeight: 'bold', marginLeft: '0.5rem' }}>
              #{tool.id}
            </span>
          </div>
          <div>
            <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Slug:</span>
            <span style={{ color: '#fbbf24', fontSize: '1rem', fontWeight: 'bold', marginLeft: '0.5rem' }}>
              {tool.slug}
            </span>
          </div>
          <div>
            <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Active:</span>
            <span style={{ 
              color: tool.is_active ? '#10b981' : '#ef4444', 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              marginLeft: '0.5rem' 
            }}>
              {tool.is_active ? '✓ Yes' : '✗ No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolViewModal;
