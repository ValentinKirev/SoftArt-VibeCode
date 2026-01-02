import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const getDialogStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '2rem'
    };

    return baseStyles;
  };

  const getModalStyles = () => {
    const baseStyles = {
      background: 'linear-gradient(135deg, #1f2937, #111827)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '1.5rem',
      padding: '3rem',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      position: 'relative' as const
    };

    return baseStyles;
  };

  const getButtonStyles = (buttonType: 'confirm' | 'cancel') => {
    const baseStyles = {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    };

    if (buttonType === 'confirm') {
      return {
        ...baseStyles,
        background: type === 'danger' 
          ? 'linear-gradient(135deg, #ef4444, #dc2626)'
          : type === 'warning'
          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
          : 'linear-gradient(135deg, #3b82f6, #2563eb)',
        color: 'white',
      };
    } else {
      return {
        ...baseStyles,
        background: 'linear-gradient(135deg, #fbbf24, #7c3aed)',
        color: 'white',
      };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '⚠️';
    }
  };

  return (
    <div style={getDialogStyles()}>
      <div style={getModalStyles()}>
        {/* Close Button */}
        <button
          onClick={onCancel}
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

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
            {getIcon()}
          </div>
          <h2 style={{ 
            color: 'white', 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem' 
          }}>
            {title}
          </h2>
          <p style={{ 
            color: '#9ca3af', 
            fontSize: '1.125rem', 
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            {message}
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center' 
        }}>
          <button
            onClick={onCancel}
            style={getButtonStyles('cancel')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed, #fbbf24)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24, #7c3aed)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={getButtonStyles('confirm')}
            onMouseEnter={(e) => {
              if (type === 'danger') {
                e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.3)';
              } else if (type === 'warning') {
                e.currentTarget.style.background = 'linear-gradient(135deg, #d97706, #b45309)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.3)';
              } else {
                e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (type === 'danger') {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              } else if (type === 'warning') {
                e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              } else {
                e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
