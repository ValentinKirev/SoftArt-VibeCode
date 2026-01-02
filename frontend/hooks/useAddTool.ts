import { useState, useCallback } from 'react';

interface Tool {
  id?: number;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  url?: string;
  api_endpoint?: string;
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
  examples: any[];
}

interface UseAddToolReturn {
  isAddToolModalOpen: boolean;
  openAddToolModal: () => void;
  closeAddToolModal: () => void;
  handleSaveTool: (tool: Tool) => Promise<void>;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const useAddTool = (saveToolFunction?: (tool: Tool) => Promise<void>): UseAddToolReturn => {
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openAddToolModal = useCallback(() => {
    setIsAddToolModalOpen(true);
  }, []);

  const closeAddToolModal = useCallback(() => {
    setIsAddToolModalOpen(false);
  }, []);

  const handleSaveTool = useCallback(async (tool: Tool) => {
    if (saveToolFunction) {
      await saveToolFunction(tool);
    } else {
      // Default implementation - can be overridden by pages
      console.log('Save tool (default implementation):', tool);
      // You can add a default save implementation here if needed
    }
    closeAddToolModal();
    triggerRefresh();
  }, [saveToolFunction]);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return {
    isAddToolModalOpen,
    openAddToolModal,
    closeAddToolModal,
    handleSaveTool,
    refreshTrigger,
    triggerRefresh,
  };
};
