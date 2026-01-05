import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Tool {
  id?: number;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  url?: string;
  documentation_url?: string;
  icon?: string;
  color?: string;
  version?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'beta';
  is_featured: boolean;
  is_active: boolean;
  requires_auth: boolean;
  api_key_required: boolean;
  usage_limit?: number;
  sort_order: number;
  metadata?: any;
  categories: number[];
  roles: number[];
  tags: number[];
  examples: Example[];
}

interface Example {
  id?: number;
  type: 'screenshot' | 'link';
  title: string;
  url?: string;
  image?: string;
  description?: string;
}

interface AddToolContextType {
  isAddToolModalOpen: boolean;
  openAddToolModal: () => void;
  closeAddToolModal: () => void;
  handleSaveTool: (tool: Tool) => Promise<void>;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const AddToolContext = createContext<AddToolContextType | undefined>(undefined);

export const useAddTool = () => {
  const context = useContext(AddToolContext);
  if (!context) {
    throw new Error('useAddTool must be used within AddToolProvider');
  }
  return context;
};

interface AddToolProviderProps {
  children: ReactNode;
  onSaveTool: (tool: Tool) => Promise<void>;
}

export const AddToolProvider: React.FC<AddToolProviderProps> = ({ children, onSaveTool }) => {
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openAddToolModal = () => {
    setIsAddToolModalOpen(true);
  };

  const closeAddToolModal = () => {
    setIsAddToolModalOpen(false);
  };

  const handleSaveTool = async (tool: Tool) => {
    await onSaveTool(tool);
    closeAddToolModal();
    triggerRefresh();
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const value: AddToolContextType = {
    isAddToolModalOpen,
    openAddToolModal,
    closeAddToolModal,
    handleSaveTool,
    refreshTrigger,
    triggerRefresh,
  };

  return (
    <AddToolContext.Provider value={value}>
      {children}
    </AddToolContext.Provider>
  );
};
