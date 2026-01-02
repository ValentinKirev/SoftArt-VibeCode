import React from 'react';
import { useGlobalAddTool } from '../contexts/GlobalAddToolContext';
import GlobalAddToolModal from './GlobalAddToolModal';

const GlobalAddToolModalWrapper: React.FC = () => {
  const { isAddToolModalOpen, closeAddToolModal, handleSaveTool } = useGlobalAddTool();
  
  return (
    <GlobalAddToolModal 
      isOpen={isAddToolModalOpen}
      onClose={closeAddToolModal}
      onSaveTool={handleSaveTool}
    />
  );
};

export default GlobalAddToolModalWrapper;
