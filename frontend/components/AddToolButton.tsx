import React, { CSSProperties } from 'react';
import { useGlobalAddTool } from '../contexts/GlobalAddToolContext';

interface AddToolButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const AddToolButton: React.FC<AddToolButtonProps> = ({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  children,
  style = {}
}) => {
  const { openAddToolModal } = useGlobalAddTool();

  const handleClick = () => {
    openAddToolModal();
  };

  // Dashboard button styling
  const dashboardStyle: CSSProperties = {
    color: '#fbbf24',
    border: '1px solid rgba(4, 120, 87, 0.3)',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.5rem',
    background: 'linear-gradient(135deg, #047857, #0891b2)',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    ...style
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.borderColor = '#fbbf24';
    target.style.transform = 'translateY(-3px) scale(1.05)';
    target.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.4), 0 0 30px rgba(251, 191, 36, 0.2)';
    target.style.textShadow = '0 0 10px rgba(251, 191, 36, 0.5)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.borderColor = 'rgba(4, 120, 87, 0.3)';
    target.style.transform = 'translateY(0) scale(1)';
    target.style.boxShadow = 'none';
    target.style.textShadow = 'none';
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={dashboardStyle}
      className={`add-tool-button-effect ${className}`}
      title="Add New Tool"
    >
      {children || (
        <>
          <span className="mr-2">🛠️</span>
          Add Tool
        </>
      )}
    </button>
  );
};

export default AddToolButton;
