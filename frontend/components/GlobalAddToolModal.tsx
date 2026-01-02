import React, { useState, useEffect } from 'react';
import ToolManager from './ToolManager';
import { useAuth } from '../hooks/useAuth';

interface GlobalAddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTool?: (tool: any) => Promise<void>;
}

const GlobalAddToolModal: React.FC<GlobalAddToolModalProps> = ({ isOpen, onClose, onSaveTool }) => {
  const [editingTool, setEditingTool] = useState<any>(null);
  const { user } = useAuth();

  // Close modal when isOpen becomes false
  useEffect(() => {
    if (!isOpen) {
      setEditingTool(null);
    }
  }, [isOpen]);

  const handleSave = async (tool: any) => {
    if (onSaveTool) {
      await onSaveTool(tool);
    }
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <ToolManager
          onClose={handleClose}
          onSave={handleSave}
          initialTool={editingTool}
          readOnly={false}
        />
      </div>
    </div>
  );
};

export default GlobalAddToolModal;
