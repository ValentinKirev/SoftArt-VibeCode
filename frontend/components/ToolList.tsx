import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import { useAuth } from '../hooks/useAuth';

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

interface ToolListProps {
  tools?: Tool[];
  onEditTool: (tool: Tool) => void;
  onViewTool: (tool: Tool) => void;
  refreshTrigger?: number;
  onToolDeleted?: () => void;
  onToolCreated?: () => void;
  onToolDeletedSuccess?: (message: string) => void;
  resetPagination?: boolean;
  enablePagination?: boolean;
  user?: any; // Add user prop
}

const ToolList: React.FC<ToolListProps> = ({ tools: propsTools, onEditTool, onViewTool, refreshTrigger, onToolDeleted, onToolCreated, onToolDeletedSuccess, resetPagination, enablePagination = false, user }) => {
  const { user: authUser } = useAuth(); // Get user from useAuth
  const currentUser = user || authUser; // Use passed user or fallback to authUser
  // Helper function to check if user is Owner
  const isOwner = (user: any): boolean => {
    if (!user) return false;
    
    // Check if user.role is a string and equals 'owner'
    if (typeof user.role === 'string') {
      return user.role.toLowerCase() === 'owner';
    }
    
    // Check if user.role is an object with name property
    if (typeof user.role === 'object' && user.role?.name) {
      return user.role.name.toLowerCase() === 'owner';
    }
    
    return false;
  };

  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    toolId: number | null;
    toolName: string;
  }>({ isOpen: false, toolId: null, toolName: '' });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalToolsCount, setTotalToolsCount] = useState(0);
  const toolsPerPage = 6;

  // Reset pagination to page 1 when requested by parent
  useEffect(() => {
    if (resetPagination && enablePagination) {
      setCurrentPage(1);
    }
  }, [resetPagination, enablePagination]);

  // Use props tools if provided, otherwise fetch from API
  useEffect(() => {
    if (propsTools) {
      if (enablePagination) {
        // Client-side pagination
        const startIndex = (currentPage - 1) * toolsPerPage;
        const endIndex = startIndex + toolsPerPage;
        const paginatedTools = propsTools.slice(startIndex, endIndex);
        setTools(paginatedTools);
        setTotalToolsCount(propsTools.length);
        setTotalPages(Math.ceil(propsTools.length / toolsPerPage));
      } else {
        setTools(propsTools);
      }
      setLoading(false);
    }
  }, [propsTools, currentPage, enablePagination, toolsPerPage]);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch data only if propsTools is not provided
  useEffect(() => {
    if (!propsTools) {
      fetchTools();
    }
  }, [refreshTrigger, propsTools, currentPage]);

  const fetchTools = async () => {
    try {
      setLoading(true);
      // Always fetch all tools for client-side pagination
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/tools`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const allTools = data.data || data;
        
        if (enablePagination) {
          // Client-side pagination
          const startIndex = (currentPage - 1) * toolsPerPage;
          const endIndex = startIndex + toolsPerPage;
          const paginatedTools = allTools.slice(startIndex, endIndex);
          setTools(paginatedTools);
          setTotalToolsCount(allTools.length);
          setTotalPages(Math.ceil(allTools.length / toolsPerPage));
        } else {
          setTools(allTools);
        }
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error);
      setToast({
        message: 'Failed to fetch tools',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteTool = (toolId: number, toolName: string) => {
    setConfirmDialog({
      isOpen: true,
      toolId: toolId,
      toolName: toolName
    });
  };

  const confirmDeleteTool = async () => {
    if (!confirmDialog.toolId) return;

    try {
      console.log('Deleting tool with ID:', confirmDialog.toolId); // Debug logging
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/tools/${confirmDialog.toolId}`;
      console.log('Delete URL:', url); // Debug logging
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Delete response status:', response.status); // Debug logging
      
      if (response.ok) {
        const result = await response.json();
        console.log('Delete response:', result); // Debug logging
        
        // Call the callback to notify parent component
        if (onToolDeleted) {
          console.log('Calling onToolDeleted callback'); // Debug logging
          onToolDeleted();
        }

        // Show success toast
        const successMessage = `Tool "${confirmDialog.toolName}" deleted successfully`;
        if (onToolDeletedSuccess) {
          onToolDeletedSuccess(successMessage);
        }

        // Refresh the tools list to ensure database sync
        await fetchTools();
      } else {
        const errorText = await response.text();
        console.error('Failed to delete tool:', errorText);
        
        // Show error toast
        setToast({
          message: 'Failed to delete tool: ' + errorText,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Failed to delete tool:', error);
      
      // Show error toast
      setToast({
        message: 'Error deleting tool: ' + (error instanceof Error ? error.message : 'Unknown error'),
        type: 'error'
      });
    } finally {
      // Close confirmation dialog
      setConfirmDialog({ isOpen: false, toolId: null, toolName: '' });
    }
  };

  const handleToggleStatus = async (toolId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/${toolId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        setTools(prev => prev.map(tool => 
          tool.id === toolId ? { ...tool, is_active: !currentStatus } : tool
        ));
      }
    } catch (error) {
      console.error('Failed to toggle tool status:', error);
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoading(true);
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

  const filteredTools = tools;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';      // Bright green
      case 'inactive': return '#ef4444';    // Bright red
      case 'beta': return '#fbbf24';        // Bright gold
      case 'maintenance': return '#8b5cf6'; // Bright purple
      default: return '#6b7280';
    }
  };

  const getStatusBadge = (status: string) => (
    <span style={{
      background: `${getStatusColor(status)}30`,
      color: getStatusColor(status),
      padding: '0.25rem 0.75rem',
      borderRadius: '1rem',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      boxShadow: `0 2px 4px ${getStatusColor(status)}40`,
    }}>
      {status}
    </span>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        Loading tools...
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Tools Grid */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, minmax(0, 350px))', 
            gap: '2.5rem', 
            maxWidth: '1200px', 
            margin: '0 auto',
            justifyContent: filteredTools.length < 3 ? 'flex-start' : 'center'
          }}>
            {filteredTools.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1', // Span all columns
                textAlign: 'center', 
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#ef4444' }}>
                  No tools found
                </p>
                <p style={{ fontSize: '0.875rem', color: '#ef4444' }}>
                  Try adjusting your filters or add a new tool
                </p>
              </div>
            ) : (
              filteredTools.map(tool => (
                <div
                  key={tool.id}
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => onViewTool(tool)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{
                      fontSize: '2rem',
                      marginRight: '1rem',
                      background: `${tool.color || '#3B82F6'}20`,
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                    }}>
                      {tool.icon || '🤖'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        {tool.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {getStatusBadge(tool.status)}
                        {tool.version && (
                          <span style={{
                            color: '#9ca3af',
                            fontSize: '0.75rem',
                          }}>
                            v{tool.version}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p style={{ color: '#c4b5fd', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                    {tool.description}
                  </p>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Categories:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {(tool.categories || []).map(category => (
                        <span
                          key={category.id}
                          style={{
                            background: 'linear-gradient(135deg, #fbbf24, #7c3aed)',
                            color: '#86efac',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                          }}
                        >
                          {category.icon} {category.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Accessible to:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {(tool.roles || []).map(role => (
                        <span
                          key={role.id}
                          style={{
                            background: 'linear-gradient(135deg, #047857, #0891b2)',
                            color: '#fbbf24',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {role.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    {isOwner(currentUser) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTool(tool);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #fbbf24, #7c3aed)',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {isOwner(currentUser) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTool(tool.id, tool.name);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {enablePagination && totalPages > 1 && (
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

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Tool"
        message={`Are you sure you want to delete "${confirmDialog.toolName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteTool}
        onCancel={() => setConfirmDialog({ isOpen: false, toolId: null, toolName: '' })}
        type="danger"
      />
    </>
  );
};

export default ToolList;
