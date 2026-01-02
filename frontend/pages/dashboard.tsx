import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import ToolManager from '../components/ToolManager';
import ToolList from '../components/ToolList';
import ToolViewModal from '../components/ToolViewModal';
import Toast from '../components/Toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BreezeAuth from '../components/BreezeAuth';
import { useAuth } from '../hooks/useAuth';
import { checkAddToolParam, clearAddToolParam } from '../utils/addTool';

const Dashboard: NextPage = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewingTool, setViewingTool] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [toast, setToast] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showToolManager, setShowToolManager] = useState(false);
  const [editingTool, setEditingTool] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [resetPagination, setResetPagination] = useState(false);
  const [allTools, setAllTools] = useState<any[]>([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const router = useRouter();
  const { user, loading, logout, getRoleName } = useAuth();

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Authentication is handled by BreezeAuth wrapper

  // Simple role detection
  const getUserRoleName = (user: any): string => {
    // Direct string mapping (current format from backend)
    if (typeof user?.role === 'string') {
      const mapping: {[key: string]: string} = {
        'frontend': 'Frontend Developer',
        'backend': 'Backend Developer', 
        'pm': 'Project Manager',
        'designer': 'Designer',
        'qa': 'QA Engineer',
        'owner': 'Owner'
      };
      return mapping[user.role] || user.role;
    }
    
    // Object format (future format)
    if (typeof user?.role === 'object' && user.role?.name) {
      return user.role.name;
    }
    
    return 'user';
  };

  // Fetch and filter tools based on user role
  const fetchAndFilterTools = useCallback(async () => {
    if (!user) {
      return;
    }
    
    try {
      setLoadingTools(true);
      
      // Use our simple function
      const userRoleName = getUserRoleName(user);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      
      const data = await response.json();
      const tools = data.data || data;
      
      // Filter tools based on user role
      let filteredTools = tools;
      
      if (user.role && userRoleName !== 'user') {
        const userRoleNameLower = userRoleName.toLowerCase().trim();
        
        // Owner and Project Manager see all tools
        if (userRoleNameLower !== 'owner' && userRoleNameLower !== 'project manager') {
          // Other users see only tools that match their role
          filteredTools = tools.filter((tool: any) => {
            if (!tool.roles || !Array.isArray(tool.roles)) {
              return false;
            }
            
            const matches = tool.roles.some((toolRole: any) => {
              const toolRoleName = toolRole.name?.toLowerCase().trim();
              return toolRoleName === userRoleNameLower;
            });
            
            return matches;
          });
        }
      }
      
      setAllTools(filteredTools);
    } catch (error) {
      setError('Failed to load tools');
    } finally {
      setLoadingTools(false);
    }
  }, [user]);

  // Fetch tools when user changes or refreshTrigger changes
  useEffect(() => {
    if (user) {
      fetchAndFilterTools();
    }
  }, [user, refreshTrigger, fetchAndFilterTools]);

  const updateTime = useCallback(() => {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
    setCurrentTime(timeString);
  }, []);


  const handleLogoError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget as HTMLImageElement;
    img.style.display = 'none';
    img.parentElement!.innerHTML = '<span style="color: white; font-weight: bold; font-size: 1.25rem;">AI</span>';
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    }
  };

  const handleSaveTool = async (tool: any) => {
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
        const errorText = await response.text();
        throw new Error(`Failed to ${tool.id ? 'update' : 'create'} tool: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();

      // Close the tool manager
      setShowToolManager(false);
      setEditingTool(null);
      
      // Reset pagination to page 1 for new tools
      if (!tool.id) {
        setResetPagination(true);
        setTimeout(() => setResetPagination(false), 100);
      }
      
      // Trigger refresh of tool list
      setRefreshTrigger(prev => prev + 1);
      
      // Show success message based on whether it's a new tool or update
      const action = tool.id ? 'updated' : 'created';
      const message = `Tool "${tool.name}" ${action} successfully`;
      
      // Show toast notification
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
  };

  const handleEditTool = (tool: any) => {
    setEditingTool(tool);
    setViewingTool(false);
    setShowToolManager(true);
  };

  const handleViewTool = (tool: any) => {
    setSelectedTool(tool);
    setShowViewModal(true);
  };

  const handleAddNewTool = () => {
    setEditingTool(null);
    setViewingTool(false);
    setShowToolManager(true);
  };

  const handleManageTools = () => {
    setEditingTool(null);
    setShowToolManager(true);
  };

  const handleToolDeleted = () => {
    // Reset pagination to page 1 after deletion
    setResetPagination(true);
    setTimeout(() => setResetPagination(false), 100);
    
    // Trigger refresh of tool list
    setRefreshTrigger(prev => prev + 1);
    // Optionally show a notification or update UI state
    console.log('Tool deleted, refreshing dashboard');
  };

  const handleToolDeletedSuccess = (message: string) => {
    // Show success toast for tool deletion
    setToast({
      message: message,
      type: 'success'
    });
  };

  useEffect(() => {
    // Set initial time
    updateTime();

    // Update time every second
    const interval = setInterval(updateTime, 1000);

    // Trigger page load animation
    const timeout = setTimeout(() => setIsLoaded(true), 200);

    // Check for addTool URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('addTool') === 'true') {
      // Clear the URL parameter
      window.history.replaceState({}, '', window.location.pathname);
      // Trigger add tool functionality
      setTimeout(() => {
        handleAddNewTool();
      }, 500);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [updateTime, handleAddNewTool]);

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

  return (
    <BreezeAuth requireAuth={true}>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #111827, #7c3aed, #3730a3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
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

      <Head>
        <title>Dashboard - SoftArt AI HUB</title>
        <meta name="description" content="User dashboard for SoftArt AI HUB" />
        <link rel="icon" href="/favicon.ico" />
        <style>{`
          @keyframes hologram {
            0%, 100% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 0.3; transform: scale(1.2); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(2deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }

          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          @keyframes logoGlow {
            0%, 100% { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); }
            50% { box-shadow: 0 30px 40px -5px rgba(0, 0, 0, 0.3), 0 0 30px rgba(244, 114, 182, 0.4); }
          }

          @keyframes buttonPulse {
            0%, 100% { transform: translateY(-3px) scale(1.05); }
            50% { transform: translateY(-5px) scale(1.08); }
          }

          @keyframes laserTrail {
            0% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.2) rotate(180deg);
            }
            100% {
              opacity: 0;
              transform: scale(0) rotate(360deg);
            }
          }

          @keyframes fadeOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.5); }
          }

          .header-logo-effect {
            position: relative;
          }

          .header-logo-effect:hover {
            animation: logoGlow 1.5s ease-in-out infinite;
          }

          .logout-button-effect {
            position: relative;
          }

          .logout-button-effect:hover {
            animation: buttonPulse 1s ease-in-out infinite;
          }

          .tools-button-effect {
            position: relative;
          }

          .tools-button-effect:hover {
            animation: buttonPulse 1s ease-in-out infinite;
          }

          .tools-button-effect::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(4, 120, 87, 0.2), transparent);
            transition: left 0.5s ease;
          }

          .tools-button-effect:hover::before {
            left: 100%;
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
              transform: scale(0.3);
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

          @keyframes slideIn {
            0% {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>
      </Head>

      {/* Header */}
      <header style={{
        background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        padding: '1rem',
        position: 'relative',
        zIndex: 10,
        transition: 'all 0.3s ease',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)'
      }}>
        <div style={{maxWidth: '80rem', margin: '0 auto', padding: '0 1rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <a href="/" style={{textDecoration: 'none'}}>
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
              <div>
                <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white'}}>SoftArt AI HUB</h1>
                <p style={{color: '#fbbf24', fontSize: '0.875rem'}}>AI Tools Platform</p>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
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
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                  onClick={() => window.location.href = '/tools'}
                  className="tools-button-effect"
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
                  🧰 AI Tools
                </button>
                <button
                  onClick={handleAddNewTool}
                  className="add-tool-button-effect"
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
                  🛠️ Add Tool
                </button>
                <button
                  onClick={handleLogout}
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
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '5rem 1rem',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{
          textAlign: 'center',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out'
        }}>
          {/* User Greeting Card */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(244, 114, 182, 0.2)',
            borderRadius: '1rem',
            padding: '3rem',
            marginBottom: '3rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'formGlow 3s ease-in-out infinite'
          }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem'
            }}>
              Welcome, {user?.name || 'Guest'}!
            </h1>
            <p style={{
              color: '#fbbf24',
              fontSize: '1.5rem',
              marginBottom: '2rem'
            }}>
              Your role is {getUserRoleName(user)}!
            </p>
            <div style={{
              width: '6rem',
              height: '6rem',
              background: 'linear-gradient(135deg, #fbbf24, #7c3aed)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem auto',
              boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)'
            }}>
              <span style={{
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                                {user?.name?.charAt(0)?.toUpperCase() || 'G'}
              </span>
            </div>
          </div>

          {/* AI Tools Display */}
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
              marginBottom: '2rem'
            }}>
              AI Tools for you
            </h2>

            {loadingTools ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: '#9ca3af' 
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                Loading tools...
              </div>
            ) : (
              <ToolList 
                tools={allTools}
                onEditTool={handleEditTool} 
                onViewTool={handleViewTool}
                onToolDeleted={handleToolDeleted}
                onToolDeletedSuccess={handleToolDeletedSuccess}
                user={user}
                onToolCreated={() => console.log('Tool created')}
                refreshTrigger={refreshTrigger}
                resetPagination={resetPagination}
                enablePagination={true}
              />
            )}
          </div>
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
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
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
            © 2025 SoftArt AI HUB. Internal AI Tools Platform.
          </p>
        </div>
      </footer>

      {/* Tool Management Modal */}
      {showToolManager && (
        <ToolManager
          onClose={() => {
            setShowToolManager(false);
            setViewingTool(false);
          }}
          onSave={handleSaveTool}
          initialTool={editingTool}
          readOnly={viewingTool}
        />
      )}

      {/* Tool List Modal */}
      {showToolManager && !editingTool && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1f2937, #111827)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '1rem',
            padding: '2rem',
            width: '90%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                Manage AI Tools
              </h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                  onClick={() => setEditingTool({})}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                  }}
                >
                  + Add New Tool
                </button>
                <button
                  onClick={() => setShowToolManager(false)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            {loadingTools ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: '#9ca3af' 
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                Loading tools...
              </div>
            ) : (
              <ToolList 
                tools={allTools}
                onEditTool={handleEditTool} 
                onViewTool={handleViewTool}
                onToolDeleted={handleToolDeleted}
                onToolDeletedSuccess={handleToolDeletedSuccess}
                user={user}
                onToolCreated={() => console.log('Tool created')}
                refreshTrigger={refreshTrigger}
                resetPagination={resetPagination}
                enablePagination={true}
              />
            )}
          </div>
        </div>
      )}

      {/* Tool View Modal */}
      <ToolViewModal
        tool={selectedTool}
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
    </BreezeAuth>
  );
};

export default Dashboard;
