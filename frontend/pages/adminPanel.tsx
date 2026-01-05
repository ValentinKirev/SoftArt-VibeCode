import React, { useState, useEffect, useCallback } from 'react';
import AddToolButton from '../components/AddToolButton';
import ToolList from '../components/ToolList';
import ToolViewModal from '../components/ToolViewModal';
import ToolManager from '../components/ToolManager';
import BreezeAuth from '../components/BreezeAuth';
import Toast from '../components/Toast';
import MobileMenu from '../components/MobileMenu';
import { useAuth } from '../hooks/useAuth';
import { useGlobalAddTool } from '../contexts/GlobalAddToolContext';

interface Tool {
  id: number;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
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

const ToolsPage: React.FC = () => {
  return (
    <BreezeAuth requireAuth={true}>
      <ToolsPageContent />
    </BreezeAuth>
  );
};

const ToolsPageContent: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const { refreshTrigger: globalRefreshTrigger } = useGlobalAddTool();
  
  // All hooks must be declared before any early returns
  const [tools, setTools] = useState<Tool[]>([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [resetPagination, setResetPagination] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Tool Manager state
  const [showToolManager, setShowToolManager] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [viewingTool, setViewingTool] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Fetch all tools for filtering (not paginated)
  const [allTools, setAllTools] = useState<Tool[]>([]);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [tags, setTags] = useState<{ id: number; name: string; icon?: string; color?: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string; icon?: string }[]>([]);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalToolsCount, setTotalToolsCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    active: 0,
    beta: 0,
    inactive: 0
  });
  const [pendingTools, setPendingTools] = useState<Tool[]>([]);
  const toolsPerPage = 6;

  // Filtered pagination state
  const [filteredCurrentPage, setFilteredCurrentPage] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);
  const [filteredTotalCount, setFilteredTotalCount] = useState(0);

  // Check if user has Owner role (after all hooks are declared)
  const isOwner = user?.role === 'owner';

  // Filter tools based on search and filter criteria (applies to ALL tools)
  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === 'all' || 
                       (tool.tags && tool.tags.some(tag => tag.id.toString() === filterTag));
    const matchesCategory = filterCategory === 'all' || 
                           (tool.categories && tool.categories.some(cat => cat.id.toString() === filterCategory));
    
    // Debug role filtering
    let matchesRole = filterRole === 'all';
    if (filterRole !== 'all') {
      console.log('Filtering by role:', filterRole);
      console.log('Tool roles:', tool.roles);
      console.log('Tool roles type:', typeof tool.roles);
      console.log('Tool roles length:', tool.roles?.length);
      
      if (tool.roles && Array.isArray(tool.roles)) {
        matchesRole = tool.roles.some(role => {
          const roleId = role.id?.toString() || role.toString();
          console.log('Comparing role ID:', roleId, 'with filter:', filterRole);
          return roleId === filterRole;
        });
      } else {
        console.log('No roles array or invalid roles for tool:', tool.name);
        matchesRole = false;
      }
    }
    
    const result = matchesSearch && matchesTag && matchesCategory && matchesRole;
    
    // Special debugging for backend role
    if (filterRole !== 'all') {
      const selectedRole = roles.find((r: any) => r.id.toString() === filterRole);
      if (selectedRole?.name?.toLowerCase().includes('backend')) {
        console.log('=== BACKEND ROLE FILTERING ===');
        console.log('Selected role:', selectedRole);
        console.log('Tool:', tool.name, 'matches role:', matchesRole, 'final result:', result);
        
        // Show all tools that should have backend role
        const backendTools = allTools.filter(t => 
          t.roles && Array.isArray(t.roles) && 
          t.roles.some(r => r.id?.toString() === filterRole)
        );
        console.log('All tools with backend role:', backendTools.map(t => t.name));
      }
    }
    
    return result;
  });

  // Enhanced Cursor Trail Effect
  useEffect(() => {
    let trailElements: HTMLElement[] = [];
    let trailHistory: { x: number; y: number; timestamp: number }[] = [];
    let lastMouseX = 0;
    let lastMouseY = 0;
    let animationId: number;

    const createTrailSegment = (x: number, y: number, index: number, totalSegments: number) => {
      const element = document.createElement('div');
      element.className = 'trail-segment';

      // Create gradient effect based on position in trail
      const opacity = Math.max(0.1, (totalSegments - index) / totalSegments);
      const size = Math.max(6, 20 - index * 1.2);

      element.style.left = `${x - size/2}px`;
      element.style.top = `${y - size/2}px`;

      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.opacity = opacity.toString();
      element.style.background = `radial-gradient(circle, rgba(244, 114, 182, ${opacity * 0.8}) 0%, rgba(124, 58, 237, ${opacity * 0.4}) 50%, transparent 100%)`;

      document.body.appendChild(element);
      trailElements.push(element);

      // Auto-remove after animation
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
        const index = trailElements.indexOf(element);
        if (index > -1) {
          trailElements.splice(index, 1);
        }
      }, 1000);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      
      // Add current position to history
      trailHistory.push({ x: e.clientX, y: e.clientY, timestamp: currentTime });
      
      // Keep only recent positions (last 100ms)
      trailHistory = trailHistory.filter(pos => currentTime - pos.timestamp < 100);
      
      // Create trail segments for recent positions
      if (trailHistory.length > 1) {
        const totalSegments = Math.min(trailHistory.length, 8);
        
        for (let i = 0; i < totalSegments; i++) {
          const pos = trailHistory[trailHistory.length - 1 - i];
          createTrailSegment(pos.x, pos.y, i, totalSegments);
        }
      }
    };

    const animate = () => {
      // Throttle mouse move events
      document.addEventListener('mousemove', handleMouseMove);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      // Clean up any remaining trail elements
      trailElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, []);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Update current time
  const updateTime = useCallback(() => {
    const now = new Date();
    setCurrentTime(now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }));
  }, []);

  useEffect(() => {
    // Set initial time and start interval
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [updateTime]);

  useEffect(() => {
    if (user) {
      refreshAllData();
    }
  }, [user]);

  // Refresh data when global refreshTrigger changes (from GlobalAddToolContext)
  useEffect(() => {
    if (user) {
      console.log('=== TOOLS PAGE GLOBAL REFRESH TRIGGER ===');
      console.log('globalRefreshTrigger value:', globalRefreshTrigger);
      refreshAllData();
    }
  }, [globalRefreshTrigger, user]);

  // Fetch filter data
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [tagsResponse, categoriesResponse, rolesResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles`)
        ]);

        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          setTags(tagsData);
        }

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }

        if (rolesResponse.ok) {
          const rolesData = await rolesResponse.json();
          console.log('All roles from API:', rolesData);
          const backendRole = rolesData.find((r: any) => r.name?.toLowerCase().includes('backend'));
          console.log('Backend role:', backendRole);
          setRoles(rolesData);
        }
      } catch (error) {
        console.error('Failed to fetch filter data:', error);
      }
    };

    fetchFilterData();
  }, []);

  // Fetch all tools for filtering
  useEffect(() => {
    const fetchAllTools = async () => {
      const allToolsData = await fetchAllToolsForFiltering();
      setAllTools(allToolsData);
    };
    fetchAllTools();
  }, []);

  // Update filtered pagination when filters change
  useEffect(() => {
    const totalCount = filteredTools.length;
    const totalPagesCount = Math.ceil(totalCount / toolsPerPage);
    
    setFilteredTotalCount(totalCount);
    setFilteredTotalPages(totalPagesCount);
    
    // Reset to page 1 if current page is beyond the new total pages
    if (filteredCurrentPage > totalPagesCount && totalPagesCount > 0) {
      setFilteredCurrentPage(1);
    }
  }, [filteredTools, filteredCurrentPage, toolsPerPage]);

  // Reset filtered pagination when filters change
  useEffect(() => {
    setFilteredCurrentPage(1);
  }, [searchTerm, filterTag, filterCategory, filterRole]);

  // Convert admin panel Tool to ToolManager Tool format
  const convertToToolManagerFormat = (tool: Tool | null): any => {
    if (!tool) return undefined;
    
    return {
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      description: tool.description,
      long_description: tool.long_description, // Added missing field
      url: tool.url,
      documentation_url: tool.documentation_url,
      icon: tool.icon,
      color: tool.color,
      version: tool.version,
      status: tool.status,
      is_featured: false, // Default value
      is_active: tool.is_active,
      requires_auth: false, // Default value
      api_key_required: false, // Default value
      usage_limit: undefined,
      sort_order: 0, // Default value
      metadata: undefined,
      categories: tool.categories?.map(cat => cat.id) || [],
      roles: tool.roles?.map(role => role.id) || [],
      tags: tool.tags?.map(tag => tag.id) || [],
      examples: [] // Default empty array
    };
  };

  // Approve tool function
  const handleApproveTool = async (toolId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };
      
      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/${toolId}`, {
        method: 'PUT',
        headers,
        credentials: 'omit',
        body: JSON.stringify({
          is_approved: true
        })
      });

      if (response.ok) {
        setToast({ message: 'Tool approved successfully', type: 'success' });
        // Refresh data to update pending tools list
        await refreshAllData();
      } else {
        const errorData = await response.json();
        setToast({ message: errorData.error || 'Failed to approve tool', type: 'error' });
      }
    } catch (error) {
      console.error('Error approving tool:', error);
      setToast({ message: 'Error approving tool', type: 'error' });
    }
  };

  // Decline tool function
  const handleDeclineTool = async (toolId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };
      
      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/${toolId}`, {
        method: 'DELETE',
        headers,
        credentials: 'omit'
      });

      if (response.ok) {
        setToast({ message: 'Tool declined and deleted', type: 'warning' });
        // Refresh data to update pending tools list
        await refreshAllData();
      } else {
        const errorData = await response.json();
        setToast({ message: errorData.error || 'Failed to decline tool', type: 'error' });
      }
    } catch (error) {
      console.error('Error declining tool:', error);
      setToast({ message: 'Error declining tool', type: 'error' });
    }
  };

  // Fetch all tools for filtering (not paginated)
  const fetchAllToolsForFiltering = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools`);
      if (response.ok) {
        const data = await response.json();
        const allTools = data.data || data;
        console.log('Fetched all tools for filtering:', allTools.length);
        return allTools;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch all tools for filtering:', error);
      return [];
    }
  };

  // Logo error handler
  const handleLogoError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      parent.innerHTML = '<span style="color: white; font-weight: bold; font-size: 1.25rem;">AI</span>';
    }
  }, []);

  // Comprehensive data refresh function
  const refreshAllData = async () => {
    console.log('refreshAllData: Starting refresh...');
    setLoadingTools(true);
    try {
      // Fetch fresh tools data from database
      console.log('refreshAllData: Fetching tools from API...');
      const apiURL = `${process.env.NEXT_PUBLIC_API_URL}/api/tools`;
      console.log('refreshAllData: API URL:', apiURL);
      const toolsResponse = await fetch(apiURL);
      console.log('refreshAllData: API response status:', toolsResponse.status);
      
      if (!toolsResponse.ok) {
        console.error('refreshAllData: API response not OK:', toolsResponse.statusText);
        throw new Error(`Failed to fetch tools: ${toolsResponse.status} ${toolsResponse.statusText}`);
      }
      const toolsData = await toolsResponse.json();
      console.log('refreshAllData: Received tools data:', toolsData);
      
      // Get all tools from database
      const allToolsData = toolsData.data || toolsData;
      console.log('refreshAllData: Total tools received:', allToolsData.length);
      
      if (allToolsData.length === 0) {
        console.warn('refreshAllData: No tools received from API!');
      } else {
        console.log('refreshAllData: First few tools:', allToolsData.slice(0, 3));
      }
      
      // Update all tools state
      setAllTools(allToolsData);
      setTotalToolsCount(allToolsData.length);
      
      // Calculate status counts from all tools
      const counts = {
        active: allToolsData.filter((tool: any) => tool.status === 'active').length,
        beta: allToolsData.filter((tool: any) => tool.status === 'beta').length,
        inactive: allToolsData.filter((tool: any) => tool.status === 'inactive').length
      };
      console.log('refreshAllData: Calculated status counts:', counts);
      setStatusCounts(counts);
      
      // Calculate pending tools (is_approved = false or 0)
      const pending = allToolsData.filter((tool: any) => {
        const isApproved = tool.is_approved === true || tool.is_approved === 1;
        return !isApproved;
      });
      console.log('refreshAllData: Found pending tools:', pending.length);
      setPendingTools(pending);
      
      // Update pagination for all tools
      const newTotalPages = Math.ceil(allToolsData.length / toolsPerPage);
      setTotalPages(newTotalPages);
      console.log('refreshAllData: Total pages calculated:', newTotalPages);
      
      // Reset to first page to show the new tool
      setCurrentPage(1);
      setFilteredCurrentPage(1);
      
      // Get tools for the first page
      const startIndex = 0;
      const endIndex = toolsPerPage;
      const paginatedTools = allToolsData.slice(startIndex, endIndex);
      setTools(paginatedTools);
      
      console.log('refreshAllData: Updated states - Total:', allToolsData.length, 'Page 1 tools:', paginatedTools.length, 'Tools per page:', toolsPerPage);
      console.log('refreshAllData: Page 1 tool names:', paginatedTools.map((t: any) => t.name));
      
    } catch (err) {
      console.error('refreshAllData: Error during refresh:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while refreshing data');
    } finally {
      setLoadingTools(false);
      console.log('refreshAllData: Refresh completed, loading set to false');
    }
  };

  // Tool management functions
  const handleViewTool = (tool: Tool) => {
    setSelectedTool(tool);
    setShowViewModal(true);
  };

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setShowToolManager(true);
  };

  const handleSaveTool = async (tool: any) => {
    let shouldCloseModal = false;
    
    try {
      const url = tool.id 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/tools/${tool.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/tools`;
      
      const method = tool.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'omit',
        body: JSON.stringify(tool),
      });

      if (!response.ok) {
        const responseText = await response.text();
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          responseData = { rawResponse: responseText };
        }
        
        console.log('Response status:', response.status);
        console.log('Response text:', responseText);
        console.log('Response data:', responseData);
        
        // Handle validation errors specifically
        if (response.status === 400) {
          let errorMessage = 'Validation errors occurred';
          
          if (responseData.errors) {
            // Laravel validation errors come as an object with field names as keys
            const validationErrors = [];
            for (const [field, messages] of Object.entries(responseData.errors)) {
              if (Array.isArray(messages)) {
                validationErrors.push(...messages);
              } else {
                validationErrors.push(messages);
              }
            }
            errorMessage = validationErrors.join('\n\n');
          } else if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          } else if (responseText) {
            errorMessage = responseText;
          }
          
          console.log('Final error message to display:', errorMessage);
          
          // Show error toast but don't close modal
          setToast({
            message: errorMessage,
            type: 'error'
          });
          
          // Don't set shouldCloseModal = true for validation errors
          return;
        }
        
        // For other errors, show error and close modal
        throw new Error(`Failed to ${tool.id ? 'update' : 'create'} tool: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      
      // Only close modal on success
      shouldCloseModal = true;
      
      // Show success message
      const action = tool.id ? 'updated' : 'created';
      const message = `Tool "${tool.name}" ${action} successfully`;
      
      setToast({
        message: message,
        type: 'success'
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Show error toast
      setToast({
        message: `Failed to ${tool.id ? 'update' : 'create'} tool: ${errorMessage}`,
        type: 'error'
      });
    }
    
    // Only close modal if successful
    if (shouldCloseModal) {
      setShowToolManager(false);
      setEditingTool(null);
      
      // Reset pagination to page 1 for new tools
      if (!tool.id) {
        setResetPagination(true);
        setTimeout(() => setResetPagination(false), 100);
      }
      
      // Trigger refresh of tool list
      refreshAllData();
    }
  };

  // Pagination handlers
  const handleFilteredPageChange = (page: number) => {
    setFilteredCurrentPage(page);
  };

  const handleFilteredPreviousPage = () => {
    if (filteredCurrentPage > 1) {
      handleFilteredPageChange(filteredCurrentPage - 1);
    }
  };

  const handleFilteredNextPage = () => {
    if (filteredCurrentPage < filteredTotalPages) {
      handleFilteredPageChange(filteredCurrentPage + 1);
    }
  };

  const handleToolDeletedSuccess = (message: string) => {
    // Show success toast for tool deletion
    setToast({
      message: message,
      type: 'success'
    });
  };

  const handleToolDeleted = async () => {
    // Use the same comprehensive refresh logic for consistency
    await refreshAllData();
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    setLoadingTools(true);
    
    try {
      // Fetch fresh tools data from database
      const toolsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools`);
      if (!toolsResponse.ok) {
        throw new Error('Failed to fetch tools');
      }
      const toolsData = await toolsResponse.json();
      
      // Get all tools from database
      const allToolsData = toolsData.data || toolsData;
      
      // Update all tools state
      setAllTools(allToolsData);
      setTotalToolsCount(allToolsData.length);
      
      // Calculate status counts from all tools
      const counts = {
        active: allToolsData.filter((tool: any) => tool.status === 'active').length,
        beta: allToolsData.filter((tool: any) => tool.status === 'beta').length,
        inactive: allToolsData.filter((tool: any) => tool.status === 'inactive').length
      };
      setStatusCounts(counts);
      
      // Calculate pending tools (is_approved = false or 0)
      const pending = allToolsData.filter((tool: any) => {
        const isApproved = tool.is_approved === true || tool.is_approved === 1;
        return !isApproved;
      });
      setPendingTools(pending);
      
      // Update pagination for all tools
      const newTotalPages = Math.ceil(allToolsData.length / toolsPerPage);
      setTotalPages(newTotalPages);
      
      // Get tools for the selected page
      const startIndex = (page - 1) * toolsPerPage;
      const endIndex = startIndex + toolsPerPage;
      const paginatedTools = allToolsData.slice(startIndex, endIndex);
      setTools(paginatedTools);
      
    } catch (err) {
      console.error('Error changing page:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while changing page');
    } finally {
      setLoadingTools(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Create paginated filtered tools
  const paginatedFilteredTools = filteredTools.slice(
    (filteredCurrentPage - 1) * toolsPerPage,
    filteredCurrentPage * toolsPerPage
  );

  // Show restriction message if not Owner
  if (!loading && !isOwner) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right bottom, #111827, #7c3aed, #3730a3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '1rem',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            opacity: 0.8
          }}>
            🔒
          </div>
          <h2 style={{
            color: '#ef4444',
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Access Restricted
          </h2>
          <p style={{
            color: '#e5e7eb',
            fontSize: '1.1rem',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            This area is restricted to users with Owner role only.
          </p>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <p style={{
              color: '#fbbf24',
              fontSize: '0.9rem',
              margin: '0'
            }}>
              Your current role: <strong>{typeof user?.role === 'string' ? user.role : 'Unknown'}</strong>
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #3730a3)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(124, 58, 237, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  };

  if (loading || loadingTools) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #111827, #7c3aed, #3730a3)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #111827, #7c3aed, #3730a3)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: 'white',
        padding: '2rem'
      }}>
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
        <h2 style={{ marginBottom: '1rem' }}>Error</h2>
        <p style={{ marginBottom: '2rem' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#fbbf24',
            color: '#1f2937',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #111827, #7c3aed, #3730a3)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .dashboard-button-effect {
          position: relative;
        }

        .dashboard-button-effect:hover {
          animation: buttonPulse 1s ease-in-out infinite;
        }

        .dashboard-button-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(4, 120, 87, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .dashboard-button-effect:hover::before {
          left: 100%;
        }

        .add-tool-button-effect {
          position: relative;
        }

        .add-tool-button-effect:hover {
          animation: buttonPulse 1s ease-in-out infinite;
        }

        .add-tool-button-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(4, 120, 87, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .add-tool-button-effect:hover::before {
          left: 100%;
        }

        .logout-button-effect {
          position: relative;
        }

        .logout-button-effect:hover {
          animation: buttonPulse 1s ease-in-out infinite;
        }

        .logout-button-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(244, 114, 182, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .logout-button-effect:hover::before {
          left: 100%;
        }

        @keyframes buttonPulse {
          0%, 100% { transform: translateY(-3px) scale(1.05); }
          50% { transform: translateY(-5px) scale(1.08); }
        }
        
        /* Responsive statistics grid */
        @media (min-width: 1200px) {
          .statistics-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 1.5rem !important;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1199px) {
          .statistics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.25rem !important;
          }
        }
        
        @media (max-width: 767px) {
          .statistics-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
        
        /* Responsive navigation */
        @media (max-width: 1200px) {
          .desktop-nav {
            gap: clamp(0.25rem, 1.5vw, 0.75rem) !important;
          }
          .desktop-nav nav {
            gap: clamp(0.25rem, 1.5vw, 0.75rem) !important;
          }
        }
        
        @media (max-width: 900px) {
          .desktop-nav {
            gap: clamp(0.25rem, 1vw, 0.5rem) !important;
          }
          .desktop-nav nav {
            gap: clamp(0.25rem, 1vw, 0.5rem) !important;
          }
        }
        
        @media (max-width: 768px) {
          .desktop-nav {
            gap: 0.25rem !important;
          }
          .desktop-nav nav {
            gap: 0.25rem !important;
          }
        }
      `}</style>
      
      {/* Animated background elements - same as dashboard */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(55, 48, 163, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite reverse'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '70%',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 12s ease-in-out infinite'
        }}></div>
      </div>

      {/* Dashboard-style Header */}
      <header style={{
        background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        padding: '1rem',
        position: 'relative',
        zIndex: 10,
        transition: 'all 0.3s ease'
      }}>
        <div style={{maxWidth: '80rem', margin: '0 auto', padding: '0 clamp(0.5rem, 2vw, 1rem)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1rem)', flex: '1', minWidth: 'fit-content'}}>
              <a href="/" style={{textDecoration: 'none'}}>
                <div className="header-logo-effect" style={{
                  width: 'clamp(3rem, 8vw, 5rem)',
                  height: 'clamp(3rem, 8vw, 5rem)',
                  background: 'linear-gradient(to bottom right, #7c3aed, #3730a3)',
                  borderRadius: 'clamp(0.5rem, 2vw, 1rem)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(2deg)';
                  e.currentTarget.style.boxShadow = '0 30px 40px -5px rgba(0, 0, 0, 0.3), 0 0 30px rgba(244, 114, 182, 0.4)';
                  e.currentTarget.style.filter = 'brightness(1.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}>
                  <img
                    src="/images/logo.png"
                    alt="SoftArt AI HUB Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'fill',
                      display: 'block'
                    }}
                    onError={handleLogoError}
                  />
                </div>
              </a>
              <div style={{flex: '1', minWidth: 'fit-content'}}>
                <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 'bold', color: 'white', lineHeight: 1.2}}>SoftArt AI HUB</h1>
                <p style={{color: '#fbbf24', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'}}>AI Tools Platform</p>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1rem)', flexWrap: 'wrap', justifyContent: 'flex-end', flex: '1', minWidth: 'fit-content'}}>
              {/* Desktop Navigation */}
              <div className="desktop-nav" style={{display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1rem)', flexWrap: 'wrap', justifyContent: 'flex-end'}}>
                <nav style={{display: 'flex', gap: 'clamp(0.5rem, 2vw, 1rem)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end'}}>
                  <div style={{
                    color: '#fbbf24',
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    background: 'rgba(0,0,0,0.3)',
                    padding: 'clamp(0.25rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 0.75rem)',
                    borderRadius: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}>
                    {currentTime || 'Loading...'}
                  </div>
                  <div style={{
                    color: '#fbbf24',
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    background: 'rgba(0,0,0,0.3)',
                    padding: 'clamp(0.25rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 0.75rem)',
                    borderRadius: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}>
                    User ID: {user?.id || 'Loading...'}
                  </div>
                <AddToolButton 
                  variant="primary" 
                  size="md"
                  className="dashboard-button-effect"
                />
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="dashboard-button-effect"
                  style={{
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
                    fontWeight: 'bold'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#fbbf24';
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.4), 0 0 30px rgba(251, 191, 36, 0.2)';
                    e.currentTarget.style.textShadow = '0 0 10px rgba(251, 191, 36, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(4, 120, 87, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={async () => {
                    try {
                      await logout();
                      window.location.href = '/login';
                    } catch (error) {
                      console.error('Logout failed:', error);
                      window.location.href = '/login';
                    }
                  }}
                  className="logout-button-effect"
                  style={{
                    color: 'white',
                    border: '1px solid rgba(244, 114, 182, 0.3)',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(135deg, #fbbf24, #7c3aed)',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.4), 0 0 30px rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(244, 114, 182, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  Logout
                </button>
              </nav>
              </div>

              {/* Mobile Menu */}
              <div className="mobile-menu" style={{display: isMobile ? 'block' : 'none'}}>
                <MobileMenu currentTime={currentTime} user={user} logout={async () => {
                  try {
                    await logout();
                    window.location.href = '/login';
                  } catch (error) {
                    console.error('Logout failed:', error);
                    window.location.href = '/login';
                  }
                }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={{
        flex: 1,
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '2rem 1rem',
        position: 'relative',
        zIndex: 5,
        minHeight: '1000px' // Add minimum height to prevent shrinking
      }}>
        <div style={{
          textAlign: 'center',
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'all 0.8s ease-out',
          minHeight: '800px', // Add minimum height to prevent shrinking
          width: '100%', // Ensure full width
          maxWidth: '1200px', // Match the inner container max width
          margin: '0 auto' // Center the container
        }}>
          {/* Tools Grid - dashboard style */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            minHeight: '600px', // Add minimum height to prevent shrinking
            width: '100%', // Ensure full width
            maxWidth: '1200px', // Match the grid max width
            margin: '0 auto' // Center the container
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '2rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              AI Tools Collection
            </h2>

            {/* Pending Approval Tools */}
            {pendingTools.length > 0 && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '1rem',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{
                    color: '#ef4444',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    margin: 0
                  }}>
                    ⚠️ Pending Approval ({pendingTools.length})
                  </h3>
                  <div style={{
                    color: '#fbbf24',
                    fontSize: '0.875rem',
                    fontStyle: 'italic'
                  }}>
                    Tools awaiting admin approval
                  </div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1rem',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {pendingTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => handleViewTool(tool)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        backdropFilter: 'blur(10px)',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(239, 68, 68, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{
                          fontSize: '1.5rem',
                          marginRight: '0.75rem'
                        }}>
                          {tool.icon || '🤖'}
                        </div>
                        <div style={{
                          flex: 1,
                          color: '#fbbf24',
                          fontWeight: 'bold',
                          fontSize: '1rem'
                        }}>
                          {tool.name}
                        </div>
                      </div>
                      
                      <div style={{
                        color: '#e5e7eb',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                        lineHeight: '1.4'
                      }}>
                        {tool.description.length > 80 
                          ? tool.description.substring(0, 80) + '...' 
                          : tool.description}
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        marginTop: '1rem',
                        gap: '0.5rem'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleApproveTool(tool.id);
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleDeclineTool(tool.id);
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          ❌ Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics Container */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div className="statistics-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#24fbfbff',
                    marginBottom: '0.5rem'
                  }}>
                    {totalToolsCount}
                  </div>
                  <div style={{
                    color: '#e0e7ff',
                    fontSize: '0.875rem'
                  }}>
                    Total Tools
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#10b981',
                    marginBottom: '0.5rem'
                  }}>
                    {statusCounts.active}
                  </div>
                  <div style={{
                    color: '#e0e7ff',
                    fontSize: '0.875rem'
                  }}>
                    Active Tools
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#f59e0b',
                    marginBottom: '0.5rem'
                  }}>
                    {statusCounts.beta}
                  </div>
                  <div style={{
                    color: '#e0e7ff',
                    fontSize: '0.875rem'
                  }}>
                    Beta Tools
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#ef4444',
                    marginBottom: '0.5rem'
                  }}>
                    {statusCounts.inactive}
                  </div>
                  <div style={{
                    color: '#e0e7ff',
                    fontSize: '0.875rem'
                  }}>
                    Inactive
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              minHeight: '200px' // Add minimum height to prevent shrinking
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
                    Search Tools
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or description..."
                    style={{
                      width: '70%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(244, 114, 182, 0.3)',
                      borderRadius: '0.5rem',
                      color: '#fbbf24',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      Tag
                    </label>
                    <select
                      value={filterTag}
                      onChange={(e) => setFilterTag(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(244, 114, 182, 0.3)',
                        borderRadius: '0.5rem',
                        color: '#fbbf24',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                      }}
                    >
                      <option value="all" style={{ color: '#ec4899', fontWeight: 'bold' }}>All Tags</option>
                      {tags.map(tag => (
                        <option key={tag.id} value={tag.id} style={{ color: '#ec4899', fontWeight: 'bold' }}>
                          {tag.icon} {tag.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(244, 114, 182, 0.3)',
                        borderRadius: '0.5rem',
                        color: '#fbbf24',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                      }}
                    >
                      <option value="all" style={{ color: '#ec4899', fontWeight: 'bold' }}>All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id} style={{ color: '#ec4899', fontWeight: 'bold' }}>
                          {category.icon && `${category.icon} `}{category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      Role
                    </label>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(244, 114, 182, 0.3)',
                        borderRadius: '0.5rem',
                        color: '#fbbf24',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                      }}
                    >
                      <option value="all" style={{ color: '#ec4899', fontWeight: 'bold' }}>All Roles</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id} style={{ color: '#ec4899', fontWeight: 'bold' }}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <ToolList 
              tools={searchTerm || filterTag !== 'all' || filterCategory !== 'all' || filterRole !== 'all' ? paginatedFilteredTools : tools}
              onEditTool={handleEditTool}
              onViewTool={handleViewTool}
              onToolDeleted={handleToolDeleted}
              onToolDeletedSuccess={handleToolDeletedSuccess}
              user={user}
              resetPagination={resetPagination}
              enablePagination={false}
            />
          </div>

          {/* Filtered Pagination Controls */}
          {(searchTerm || filterTag !== 'all' || filterCategory !== 'all' || filterRole !== 'all') && filteredTotalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '2rem',
              padding: '1rem',
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <button
                onClick={handleFilteredPreviousPage}
                disabled={filteredCurrentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  background: filteredCurrentPage === 1 
                    ? 'rgba(107, 114, 128, 0.5)' 
                    : 'linear-gradient(135deg, #7c3aed, #3730a3)',
                  color: filteredCurrentPage === 1 ? '#9ca3af' : '#fbbf24',
                  cursor: filteredCurrentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (filteredCurrentPage > 1) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Previous
              </button>

              <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                {Array.from({ length: filteredTotalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handleFilteredPageChange(page)}
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '0.375rem',
                      border: filteredCurrentPage === page 
                        ? '2px solid #fbbf24' 
                        : '1px solid rgba(139, 92, 246, 0.3)',
                      background: filteredCurrentPage === page
                        ? 'linear-gradient(135deg, #fbbf24, #7c3aed)'
                        : 'rgba(0, 0, 0, 0.3)',
                      color: filteredCurrentPage === page ? 'white' : '#e0e7ff',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: filteredCurrentPage === page ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (filteredCurrentPage !== page) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.borderColor = '#fbbf24';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      if (filteredCurrentPage !== page) {
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                      }
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={handleFilteredNextPage}
                disabled={filteredCurrentPage === filteredTotalPages}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  background: filteredCurrentPage === filteredTotalPages 
                    ? 'rgba(107, 114, 128, 0.5)' 
                    : 'linear-gradient(135deg, #7c3aed, #3730a3)',
                  color: filteredCurrentPage === filteredTotalPages ? '#9ca3af' : '#fbbf24',
                  cursor: filteredCurrentPage === filteredTotalPages ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (filteredCurrentPage < filteredTotalPages) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Next
              </button>
            </div>
          )}

          {/* Original Pagination Controls (for non-filtered view) */}
          {!searchTerm && filterTag === 'all' && filterCategory === 'all' && filterRole === 'all' && totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '2rem',
              padding: '1rem',
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  background: currentPage === 1 
                    ? 'rgba(107, 114, 128, 0.5)' 
                    : 'linear-gradient(135deg, #7c3aed, #3730a3)',
                  color: currentPage === 1 ? '#9ca3af' : '#fbbf24',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage > 1) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Previous
              </button>

              <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '0.375rem',
                      border: currentPage === page 
                        ? '2px solid #fbbf24' 
                        : '1px solid rgba(139, 92, 246, 0.3)',
                      background: currentPage === page
                        ? 'linear-gradient(135deg, #fbbf24, #7c3aed)'
                        : 'rgba(0, 0, 0, 0.3)',
                      color: currentPage === page ? 'white' : '#e0e7ff',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: currentPage === page ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== page) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.borderColor = '#fbbf24';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      if (currentPage !== page) {
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                      }
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  background: currentPage === totalPages 
                    ? 'rgba(107, 114, 128, 0.5)' 
                    : 'linear-gradient(135deg, #7c3aed, #3730a3)',
                  color: currentPage === totalPages ? '#9ca3af' : '#fbbf24',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage < totalPages) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: 'white',
        marginTop: '5rem',
        padding: '3rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Footer background elements */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(124, 58, 237, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(55, 48, 163, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>

        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'all 0.8s ease-out 0.5s'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#fbbf24',
            margin: '0 0 1rem 0'
          }}>
            SoftArt AI HUB
          </h2>
          <p style={{
            color: '#9ca3af',
            marginBottom: '1rem',
            fontSize: '1rem'
          }}>
            Empowering teams with AI tools and collaboration
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            fontWeight: '300'
          }}>
            2025 SoftArt AI HUB. Internal AI Tools Platform.
          </p>
        </div>
      </footer>

      {/* CSS for Trail Effect */}
      <style dangerouslySetInnerHTML={{ __html: `
        .trail-segment {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          border-radius: 50%;
          transition: all 0.3s ease;
          animation: trailFade 1s ease-out forwards;
        }

        .connecting-line {
          position: fixed;
          pointer-events: none;
          z-index: 9998;
          border-radius: 1px;
          transition: opacity 0.3s ease;
          animation: lineFade 0.8s ease-out forwards;
        }

        @keyframes trailFade {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.5);
          }
        }

        @keyframes lineFade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}} />

      {/* Tool Manager Modal */}
      {showToolManager && (
        <ToolManager
          initialTool={convertToToolManagerFormat(editingTool)}
          onSave={handleSaveTool}
          onClose={() => {
            setShowToolManager(false);
            setViewingTool(false);
          }}
          readOnly={viewingTool}
        />
      )}

      {/* Tool View Modal */}
      {showViewModal && selectedTool && (
        <ToolViewModal
          tool={selectedTool}
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedTool(null);
          }}
        />
      )}

      {/* Toast Notification - At the same level as modals */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ToolsPage;
