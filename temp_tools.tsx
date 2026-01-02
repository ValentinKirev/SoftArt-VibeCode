import React, { useState, useEffect, useCallback } from 'react';
import AddToolButton from '../components/AddToolButton';
import ToolList from '../components/ToolList';
import ToolViewModal from '../components/ToolViewModal';
import ToolManager from '../components/ToolManager';
import BreezeAuth from '../components/BreezeAuth';
import Toast from '../components/Toast';
import { useAuth } from '../hooks/useAuth';
import { useGlobalAddTool } from '../contexts/GlobalAddToolContext';

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
  const [tools, setTools] = useState<Tool[]>([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [resetPagination, setResetPagination] = useState(false);
  
  // Tool Manager state
  const [showToolManager, setShowToolManager] = useState(false);
  const [editingTool, setEditingTool] = useState<any>(null);
  const [viewingTool, setViewingTool] = useState(false);
  
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
  const toolsPerPage = 6;

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

  // State for all tools (for filtering)
  const [allTools, setAllTools] = useState<Tool[]>([]);

  // Filtered pagination state
  const [filteredCurrentPage, setFilteredCurrentPage] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);
  const [filteredTotalCount, setFilteredTotalCount] = useState(0);

  // Logo error handler
  const handleLogoError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      parent.innerHTML = '<span style="color: white; font-weight: bold; font-size: 1.25rem;">AI</span>';
    }
  }, []);

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

      // Remove element after animation with staggered timing
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
        trailElements = trailElements.filter(el => el !== element);
      }, 800 + index * 50);
    };

    const createConnectingLine = (startX: number, startY: number, endX: number, endY: number, intensity: number) => {
      const element = document.createElement('div');
      element.className = 'connecting-line';

      const dx = endX - startX;
      const dy = endY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      element.style.left = `${startX}px`;
      element.style.top = `${startY - 1.5}px`;
      element.style.width = `${distance}px`;
      element.style.height = '3px';
      element.style.transformOrigin = '0 50%';
      element.style.transform = `rotate(${angle}deg)`;
      element.style.opacity = intensity.toString();
      element.style.background = `linear-gradient(90deg, rgba(244, 114, 182, ${intensity}), rgba(124, 58, 237, ${intensity * 0.5}), transparent)`;

      document.body.appendChild(element);
      trailElements.push(element);

      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
        trailElements = trailElements.filter(el => el !== element);
      }, 600);
    };

    const updateTrail = (currentTime: number) => {
      // Create continuous trail segments
      trailHistory.forEach((point, index) => {
        if (currentTime - point.timestamp < 800) {
          createTrailSegment(point.x, point.y, index, trailHistory.length);
        }
      });

      // Create connecting lines between recent points
      for (let i = 0; i < trailHistory.length - 1; i++) {
        const currentPoint = trailHistory[i];
        const nextPoint = trailHistory[i + 1];
        const age = currentTime - currentPoint.timestamp;
        if (age < 400) {
          const intensity = Math.max(0.1, 1 - age / 400);
          createConnectingLine(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y, intensity);
        }
      }

      // Clean up old trail history
      trailHistory = trailHistory.filter(point => currentTime - point.timestamp < 1000);

      // Limit DOM elements for performance
      if (trailElements.length > 50) {
        const elementsToRemove = trailElements.splice(0, trailElements.length - 50);
        elementsToRemove.forEach(element => {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      const currentTime = Date.now();

      // Add current position to trail history
      trailHistory.push({ x: currentX, y: currentY, timestamp: currentTime });

      // Keep only recent history
      if (trailHistory.length > 15) {
        trailHistory.shift();
      }

      lastMouseX = currentX;
      lastMouseY = currentY;
    };

    // Animation loop for smooth trail updates
    const animate = () => {
      updateTrail(Date.now());
      animationId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
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

  // Time update handler
  const updateTime = useCallback(() => {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setCurrentTime(timeString);
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

  useEffect(() => {
    // Set initial time and start interval
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(interval);
    };
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

  const handleViewTool = (tool: Tool) => {
    setSelectedTool(tool);
    setShowViewModal(true);
  };

  const handleEditTool = (tool: Tool) => {
    // For now, just show the view modal
    // In the future, this could open an edit modal
    handleViewTool(tool);
  };

  // Filtered pagination handlers
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

  // Update filtered pagination when filters change
  useEffect(() => {
    const totalCount = filteredTools.length;
    const totalPagesCount = Math.ceil(totalCount / toolsPerPage);
    
    setFilteredTotalCount(totalCount);
    setFilteredTotalPages(totalPagesCount);
    
    // Reset to page 1 if current page is beyond new total pages
    if (filteredCurrentPage > totalPagesCount && totalPagesCount > 0) {
      setFilteredCurrentPage(1);
    }
  }, [filteredTools, filteredCurrentPage, toolsPerPage]);

  // Reset filtered pagination when filters change
  useEffect(() => {
    setFilteredCurrentPage(1);
  }, [searchTerm, filterTag, filterCategory, filterRole]);

  // Create paginated filtered tools
  const paginatedFilteredTools = filteredTools.slice(
    (filteredCurrentPage - 1) * toolsPerPage,
    filteredCurrentPage * toolsPerPage
  );

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

  // Pagination handlers
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
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <a href="/" style={{ textDecoration: 'none' }}>
                <div className="header-logo-effect" style={{
                  width: '5rem',
                  height: '5rem',
                  background: 'linear-gradient(to bottom right, #7c3aed, #3730a3)',
                  borderRadius: '1rem',
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
                  }}
                >
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
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>SoftArt AI HUB</h1>
                <p style={{ color: '#fbbf24', fontSize: '0.875rem' }}>AI Tools Platform</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                color: '#fbbf24',
                fontSize: '0.875rem',
                background: 'rgba(0,0,0,0.3)',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.5rem'
              }}>
                {currentTime || 'Loading...'}
              </div>
              <div style={{
                color: '#fbbf24',
                fontSize: '0.875rem',
                background: 'rgba(0,0,0,0.3)',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.5rem'
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
        zIndex: 5
      }}>
        <div style={{
          textAlign: 'center',
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'all 0.8s ease-out'
        }}>
          {/* Tools Grid - dashboard style */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '2rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              AI Tools Collection
            </h2>

            {/* Tools Stats - dashboard style */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{
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

            {/* Toast Notification */}
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}

            {/* Filters */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem',
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
    </div>
  );
};

export default ToolsPage;
