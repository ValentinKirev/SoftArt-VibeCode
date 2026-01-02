import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface GlobalAddToolContextType {
  isAddToolModalOpen: boolean;
  openAddToolModal: () => void;
  closeAddToolModal: () => void;
  handleSaveTool: (tool: Tool) => Promise<void>;
  refreshTrigger: number;
  triggerRefresh: () => void;
  toast: ToastMessage | null;
  setToast: (toast: ToastMessage | null) => void;
}

const GlobalAddToolContext = createContext<GlobalAddToolContextType | undefined>(undefined);

export const useGlobalAddTool = () => {
  const context = useContext(GlobalAddToolContext);
  if (!context) {
    throw new Error('useGlobalAddTool must be used within GlobalAddToolProvider');
  }
  return context;
};

interface GlobalAddToolProviderProps {
  children: ReactNode;
}

export const GlobalAddToolProvider: React.FC<GlobalAddToolProviderProps> = ({ children }) => {
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const openAddToolModal = () => {
    setIsAddToolModalOpen(true);
  };

  const closeAddToolModal = () => {
    setIsAddToolModalOpen(false);
  };

  const handleSaveTool = async (tool: Tool) => {
    try {
      // Validation: ensure at least one tag is selected
      if (!tool.tags || tool.tags.length === 0) {
        setToast({
          message: 'Please select at least one tag for the tool',
          type: 'warning'
        });
        return;
      }
      
      const url = tool.id 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/tools/${tool.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/tools`;
      
      const method = tool.id ? 'PATCH' : 'POST';
      
      console.log('Saving tool:', tool); // Debug logging
      console.log('Request URL:', url); // Debug URL
      console.log('Request method:', method); // Debug method
      
      const requestBody = JSON.stringify(tool);
      console.log('Request body:', requestBody); // Debug request body
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
        credentials: 'omit',
        body: requestBody,
      });

      console.log('Response status:', response.status); // Debug logging
      
      const responseText = await response.text();
      console.log('Response text:', responseText); // Debug raw response
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        responseData = { rawResponse: responseText };
      }
      
      console.log('Response data:', responseData); // Debug logging

      if (response.ok) {
        // Close the modal
        closeAddToolModal();
        
        // Trigger refresh of tool list
        setRefreshTrigger(prev => prev + 1);
        
        // Show success message based on whether it's a new tool or update
        const action = tool.id ? 'updated' : 'created';
        const message = `Tool "${tool.name}" ${action} successfully`;
        
        // Show success toast notification (same as dashboard)
        setToast({
          message: message,
          type: 'success'
        });
        
        console.log(`Tool ${action} successfully`);
      } else {
        console.error('Save failed:', responseData);
        // Show error toast (same as dashboard)
        setToast({
          message: 'Failed to save tool: ' + (responseData.error || responseData.rawResponse || 'Unknown error'),
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error saving tool:', error);
      // Show error toast (same as dashboard)
      setToast({
        message: 'Error saving tool: ' + (error instanceof Error ? error.message : 'Unknown error'),
        type: 'error'
      });
    }
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const value: GlobalAddToolContextType = {
    isAddToolModalOpen,
    openAddToolModal,
    closeAddToolModal,
    handleSaveTool,
    refreshTrigger,
    triggerRefresh,
    toast,
    setToast,
  };

  return (
    <GlobalAddToolContext.Provider value={value}>
      {children}
    </GlobalAddToolContext.Provider>
  );
};
