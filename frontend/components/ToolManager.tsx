import React, { useState, useEffect } from 'react';

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
  status: 'active' | 'inactive' | 'beta';
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

interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  sort_order: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  sort_order: number;
}

interface Role {
  id: number;
  name: string;
  slug: string;
  description?: string;
  permissions: string[];
  is_active: boolean;
  sort_order: number;
}

interface ToolManagerProps {
  onClose: () => void;
  onSave: (tool: Tool) => void;
  initialTool?: Tool;
  readOnly?: boolean;
}

const ToolManager: React.FC<ToolManagerProps> = ({ onClose, onSave, initialTool, readOnly = false }) => {
  // Transform API tool data to the expected Tool interface format
  const transformInitialTool = (apiTool: any): Tool => {
    if (!apiTool) {
      return {
        name: '',
        slug: '',
        description: '',
        long_description: '',
        url: '',
        documentation_url: '',
        icon: '🤖',
        color: '#3B82F6',
        version: '1.0.0',
        status: 'active',
        is_featured: false,
        is_active: true,
        requires_auth: false,
        api_key_required: false,
        sort_order: 0,
        categories: [],
        roles: [],
        tags: [],
        examples: [],
      };
    }

    // Extract IDs from object arrays
    const categories = apiTool.categories?.map((cat: any) => {
      const id = typeof cat === 'object' ? cat.id : cat;
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      return numericId;
    }) || [];
    
    const roles = apiTool.roles?.map((role: any) => {
      const id = typeof role === 'object' ? role.id : role;
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      return numericId;
    }) || [];
    
    const tags = apiTool.tags?.map((tag: any) => {
      const id = typeof tag === 'object' ? tag.id : tag;
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      return numericId;
    }) || [];

    return {
      id: apiTool.id,
      name: apiTool.name || '',
      slug: apiTool.slug || '',
      description: apiTool.description || '',
      long_description: apiTool.long_description || '',
      url: apiTool.url || '',
      documentation_url: apiTool.documentation_url || '',
      icon: apiTool.icon || '🤖',
      color: apiTool.color || '#3B82F6',
      version: apiTool.version || '1.0.0',
      status: apiTool.status || 'active',
      is_featured: Boolean(apiTool.is_featured),
      is_active: Boolean(apiTool.is_active),
      requires_auth: Boolean(apiTool.requires_auth),
      api_key_required: Boolean(apiTool.api_key_required),
      usage_limit: apiTool.usage_limit,
      sort_order: Number(apiTool.sort_order) || 0,
      metadata: apiTool.metadata,
      categories,
      roles,
      tags,
      examples: apiTool.examples || [],
    };
  };

  const [tool, setTool] = useState<Tool>(() => transformInitialTool(initialTool));

  // Determine if we're in edit mode
  const isEditMode = !!initialTool?.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '', icon: '📁', color: '#6B7280' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Update tool state when initialTool changes (for switching between tools)
  useEffect(() => {
    if (initialTool) {
      const transformedTool = transformInitialTool(initialTool);
      setTool(transformedTool);
    }
  }, [initialTool]);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
    fetchRoles();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles`);
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const handleInputChange = (field: keyof Tool, value: any) => {
    setTool(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (categoryId: number) => {
    setTool(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleRoleToggle = (roleId: number) => {
    setTool(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(id => id !== roleId)
        : [...prev.roles, roleId]
    }));
  };

  const handleTagToggle = (tagId: number) => {
    setTool(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleAddExample = () => {
    setTool(prev => ({
      ...prev,
      examples: [...prev.examples, { type: 'link', title: '', url: '', description: '' }]
    }));
  };

  const handleRemoveExample = (index: number) => {
    setTool(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const handleExampleChange = (index: number, field: keyof Example, value: any) => {
    setTool(prev => ({
      ...prev,
      examples: prev.examples.map((example, i) => 
        i === index ? { ...example, [field]: value } : example
      )
    }));
  };

  const handleAddCategory = async () => {
    // Validate all required fields
    if (!newCategory.name || !newCategory.slug || !newCategory.description || !newCategory.icon || !newCategory.color) {
      setToast({
        message: 'All fields are required to create a category',
        type: 'warning'
      });
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        const createdCategory = await response.json();
        setCategories(prev => [...prev, createdCategory]);
        setNewCategory({ name: '', slug: '', description: '', icon: '📁', color: '#6B7280' });
        setShowNewCategoryModal(false);
        // Auto-select the new category
        handleCategoryToggle(createdCategory.id);
        
        // Show success message with fallback to input name if API response doesn't have name
        const categoryName = createdCategory.name || newCategory.name || 'New Category';
        setToast({
          message: `Category "${categoryName}" created successfully`,
          type: 'success'
        });
      } else {
        const errorData = await response.json();
        setToast({
          message: 'Failed to create category: ' + (errorData.message || 'Unknown error'),
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Failed to create category:', error);
      setToast({
        message: 'Error creating category: ' + (error instanceof Error ? error.message : 'Unknown error'),
        type: 'error'
      });
    }
  };

  // URL validation helper function
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation - only require essential fields
    const errors = [];
    
    if (!tool.name) {
      errors.push('Tool Name is required');
    }
    
    if (!tool.description) {
      errors.push('Description is required');
    }
    
    if (!tool.long_description) {
      errors.push('How to use instructions are required');
    }
    
    // URL and Documentation URL are now required
    if (!tool.url) {
      errors.push('URL is required');
    }
    
    if (!tool.documentation_url) {
      errors.push('Documentation URL is required');
    }
    
    if (tool.url && !isValidUrl(tool.url)) {
      errors.push('URL must be a valid URL');
    }
    
    if (tool.documentation_url && !isValidUrl(tool.documentation_url)) {
      errors.push('Documentation URL must be a valid URL');
    }
    
    // Check if at least one category is selected
    if (!tool.categories || tool.categories.length === 0) {
      errors.push('At least one category must be selected');
    }
    
    // Check if at least one role is selected
    if (!tool.roles || tool.roles.length === 0) {
      errors.push('At least one role must be selected');
    }
    
    // Check if at least one tag is selected
    if (!tool.tags || tool.tags.length === 0) {
      errors.push('At least one tag must be selected');
    }
    // Check examples validation - only required if examples are added
    if (tool.examples && tool.examples.length > 0) {
      // Validate each example
      tool.examples.forEach((example, index) => {
        if (!example.title) {
          errors.push(`Example ${index + 1}: Title is required`);
        }
        if (!example.description) {
          errors.push(`Example ${index + 1}: Description is required`);
        }
        if (example.type === 'link' && !example.url) {
          errors.push(`Example ${index + 1}: URL is required for link type`);
        }
        if (example.type === 'screenshot' && !example.image) {
          errors.push(`Example ${index + 1}: Image URL is required for screenshot type`);
        }
      });
    }
    
    if (errors.length > 0) {
      setToast({
        message: 'Please fix the following errors:\n\n' + errors.join('\n'),
        type: 'error'
      });
      return;
    }
    
    // Generate slug from name if not provided
    if (!tool.slug && tool.name) {
      tool.slug = tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    // Clean the tool data before submission
    const cleanedTool = {
      ...tool,
      // Ensure examples is always an array
      examples: tool.examples || [],
      // Ensure boolean fields are properly set
      is_featured: Boolean(tool.is_featured),
      is_active: Boolean(tool.is_active),
      requires_auth: Boolean(tool.requires_auth),
      api_key_required: Boolean(tool.api_key_required),
      sort_order: Number(tool.sort_order) || 0,
    };

    onSave(cleanedTool);
  };

  return (
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
      zIndex: 1000,
    }}>
      <style jsx>{`
        /* Custom scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #fbbf24, #7c3aed);
          border-radius: 4px;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #7c3aed, #fbbf24);
          border: 1px solid rgba(124, 58, 237, 0.3);
        }
        ::-webkit-scrollbar-thumb:active {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <div style={{
        background: 'linear-gradient(135deg, #1f2937, #111827)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '1rem',
        padding: '2rem',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {readOnly ? 'View AI Tool' : (initialTool ? 'Edit AI Tool' : 'Add New AI Tool')}
          </h2>
          <button
            onClick={onClose}
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

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Tool Name *
              </label>
              <input
                type="text"
                value={tool.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                disabled={readOnly}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                }}
                placeholder="Enter tool name"
              />
            </div>

            <div>
              <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Slug *
              </label>
              <input
                type="text"
                value={tool.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                required
                disabled={readOnly}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                }}
                placeholder="tool-slug"
              />
            </div>

            <div>
              <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Description *
              </label>
              <textarea
                value={tool.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                disabled={readOnly}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                  resize: 'vertical',
                }}
                placeholder="Brief description of the tool"
              />
            </div>

            <div>
              <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                How to use *
              </label>
              <textarea
                value={tool.long_description}
                onChange={(e) => handleInputChange('long_description', e.target.value)}
                required
                rows={4}
                disabled={readOnly}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                  resize: 'vertical',
                }}
                placeholder="Step-by-step instructions on how to use this tool"
              />
            </div>

            <div>
              <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                URL *
              </label>
              <input
                type="url"
                value={tool.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                required
                disabled={readOnly}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                }}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Documentation URL *
              </label>
              <input
                type="url"
                value={tool.documentation_url}
                onChange={(e) => handleInputChange('documentation_url', e.target.value)}
                required
                disabled={readOnly}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                }}
                placeholder="https://docs.example.com"
              />
            </div>

            <div>
              <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Icon
              </label>
              <select
                value={tool.icon}
                onChange={(e) => handleInputChange('icon', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: '0.5rem',
                  color: '#fbbf24', // Gold color
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                <option value="🤖" style={{ color: '#ec4899', fontWeight: 'bold' }}>🤖 Robot</option>
                <option value="🚀" style={{ color: '#ec4899', fontWeight: 'bold' }}>🚀 Rocket</option>
                <option value="💡" style={{ color: '#ec4899', fontWeight: 'bold' }}>💡 Light Bulb</option>
                <option value="🔍" style={{ color: '#ec4899', fontWeight: 'bold' }}>🔍 Search</option>
                <option value="📝" style={{ color: '#ec4899', fontWeight: 'bold' }}>📝 Note</option>
                <option value="🎵" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎵 Music</option>
                <option value="📱" style={{ color: '#ec4899', fontWeight: 'bold' }}>📱 Phone</option>
                <option value="🌐" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌐 Globe</option>
                <option value="⭐" style={{ color: '#ec4899', fontWeight: 'bold' }}>⭐ Star</option>
                <option value="🔥" style={{ color: '#ec4899', fontWeight: 'bold' }}>🔥 Fire</option>
                <option value="💎" style={{ color: '#ec4899', fontWeight: 'bold' }}>💎 Diamond</option>
                <option value="🏷️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🏷️ Tag</option>
                <option value="📈" style={{ color: '#ec4899', fontWeight: 'bold' }}>📈 Growth</option>
                <option value="🔐" style={{ color: '#ec4899', fontWeight: 'bold' }}>🔐 Security</option>
                <option value="🎪" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎪 Circus</option>
                <option value="🌟" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌟 Sparkle</option>
                <option value="🎨" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎨 Palette</option>
                <option value="🔬" style={{ color: '#ec4899', fontWeight: 'bold' }}>🔬 Microscope</option>
                <option value="🧪" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧪 Test Tube</option>
                <option value="⚙️" style={{ color: '#ec4899', fontWeight: 'bold' }}>⚙️ Settings</option>
                <option value="📊" style={{ color: '#ec4899', fontWeight: 'bold' }}>📊 Chart</option>
                <option value="🎯" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎯 Target</option>
                <option value="🛡️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🛡️ Shield</option>
                <option value="🔑" style={{ color: '#ec4899', fontWeight: 'bold' }}>🔑 Key</option>
                <option value="📚" style={{ color: '#ec4899', fontWeight: 'bold' }}>📚 Books</option>
                <option value="🎭" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎭 Masks</option>
                <option value="🎬" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎬 Film</option>
                <option value="📷" style={{ color: '#ec4899', fontWeight: 'bold' }}>📷 Camera</option>
                <option value="⚡" style={{ color: '#ec4899', fontWeight: 'bold' }}>⚡ Lightning</option>
                <option value="🌈" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌈 Rainbow</option>
                <option value="💬" style={{ color: '#ec4899', fontWeight: 'bold' }}>💬 Chat</option>
                <option value="📧" style={{ color: '#ec4899', fontWeight: 'bold' }}>📧 Email</option>
                <option value="🧠" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧠 Brain</option>
                <option value="💻" style={{ color: '#ec4899', fontWeight: 'bold' }}>💻 Computer</option>
                <option value="🖥️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🖥️ Desktop</option>
                <option value="📱" style={{ color: '#ec4899', fontWeight: 'bold' }}>📱 Mobile</option>
                <option value="⌨️" style={{ color: '#ec4899', fontWeight: 'bold' }}>⌨️ Keyboard</option>
                <option value="🖱️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🖱️ Mouse</option>
                <option value="📁" style={{ color: '#ec4899', fontWeight: 'bold' }}>📁 Folder</option>
                <option value="📎" style={{ color: '#ec4899', fontWeight: 'bold' }}>📎 Clipboard</option>
                <option value="🗂️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🗂️ Archive</option>
                <option value="📋" style={{ color: '#ec4899', fontWeight: 'bold' }}>📋 List</option>
                <option value="📌" style={{ color: '#ec4899', fontWeight: 'bold' }}>📌 Pin</option>
                <option value="🔗" style={{ color: '#ec4899', fontWeight: 'bold' }}>🔗 Link</option>
                <option value="✅" style={{ color: '#ec4899', fontWeight: 'bold' }}>✅ Check</option>
                <option value="❌" style={{ color: '#ec4899', fontWeight: 'bold' }}>❌ Close</option>
                <option value="⚠️" style={{ color: '#ec4899', fontWeight: 'bold' }}>⚠️ Warning</option>
                <option value="ℹ️" style={{ color: '#ec4899', fontWeight: 'bold' }}>ℹ️ Info</option>
                <option value="🎉" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎉 Party</option>
                <option value="💝" style={{ color: '#ec4899', fontWeight: 'bold' }}>💝 Gift</option>
                <option value="❤️" style={{ color: '#ec4899', fontWeight: 'bold' }}>❤️ Heart</option>
                <option value="🌹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌹 Rose</option>
                <option value="🌺" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌺 Tulip</option>
                <option value="🌸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌸 Sunflower</option>
                <option value="🌿" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌿 Herb</option>
                <option value="🏔️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🏔️ Castle</option>
                <option value="🏖️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🏖️ Office</option>
                <option value="🏥️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🏥️ Hospital</option>
                <option value="🎓" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎓 School</option>
                <option value="🏛️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🏛️ Bank</option>
                <option value="🛒️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🛒️ Shop</option>
                <option value="🍕️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍕️ Restaurant</option>
                <option value="☕" style={{ color: '#ec4899', fontWeight: 'bold' }}>☕ Coffee</option>
                <option value="🍺" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍺 Beer</option>
                <option value="🍷" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍷 Cocktail</option>
                <option value="🥘" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥘 Pizza</option>
                <option value="🍰" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍰 Cake</option>
                <option value="🍎" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍎 Candy</option>
                <option value="🍓" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍓 Strawberry</option>
                <option value="🍒" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍒 Cherry</option>
                <option value="🍊" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍊 Orange</option>
                <option value="🍋" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍋 Lemon</option>
                <option value="🍌" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍌 Banana</option>
                <option value="🥝" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥝 Coconut</option>
                <option value="🥑" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥑 Peanut</option>
                <option value="🥜" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥜 Watermelon</option>
                <option value="🍇" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍇 Melon</option>
                <option value="🍈" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍈 Grapes</option>
                <option value="🫐" style={{ color: '#ec4899', fontWeight: 'bold' }}>🫐 Berries</option>
                <option value="🍄" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍄 Mushroom</option>
                <option value="🥕" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥕 Bread</option>
                <option value="🥖" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥖 Croissant</option>
                <option value="🧁" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧁 Donut</option>
                <option value="🍪" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍪 Cookie</option>
                <option value="🎂" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎂 Birthday Cake</option>
                <option value="🧈" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧈 Ice Cream</option>
                <option value="🍦" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍦 Ice Cream Cone</option>
                <option value="🥤" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥤 Popsicle</option>
                <option value="🍩" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍩 Sandwich</option>
                <option value="🌮" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌮 Taco</option>
                <option value="🍝" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍝 Hamburger</option>
                <option value="🍟" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍟 Hot Dog</option>
                <option value="🦪" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦪 Shrimp</option>
                <option value="🦀" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦀 Crab</option>
                <option value="🦞" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦞 Lobster</option>
                <option value="🐟" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐟 Fish</option>
                <option value="🦈" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦈 Octopus</option>
                <option value="🦑" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦑 Squid</option>
                <option value="🦐" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦐 Whale</option>
                <option value="🐘" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐘 Butterfly</option>
                <option value="🦋" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦋 Bird</option>
                <option value="🦅" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦅 Eagle</option>
                <option value="🦆" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦆 Parrot</option>
                <option value="🦚" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦚 Peacock</option>
                <option value="🦜" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦜 Penguin</option>
                <option value="🐧" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐧 Duck</option>
                <option value="🐄" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐄 Pig</option>
                <option value="🐷" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐷 Cow</option>
                <option value="🐮" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐮 Goat</option>
                <option value="🐑" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐑 Horse</option>
                <option value="🐴" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐴 Zebra</option>
                <option value="🦒" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦒 Giraffe</option>
                <option value="🐘" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐘 Koala</option>
                <option value="🦘" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦘 Kangaroo</option>
                <option value="🐇" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐇 Panda</option>
                <option value="🦁" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦁 Lion</option>
                <option value="🐯" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐯 Tiger</option>
                <option value="🐅" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐅 Bear</option>
                <option value="🐻" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐻 Cat</option>
                <option value="🐕" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐕 Dog</option>
                <option value="🐩" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐩 Wolf</option>
                <option value="🦊" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦊 Fox</option>
                <option value="🦝" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦝 Raccoon</option>
                <option value="🦔" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦔 Skunk</option>
                <option value="🦙" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦙 Owl</option>
                <option value="🦉" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦉 Eagle</option>
                <option value="🦚" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦚 Dove</option>
                <option value="🦜" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦜 Penguin</option>
                <option value="🐢" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐢 Snake</option>
                <option value="🐍" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐍 Lizard</option>
                <option value="🦎" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦎 Turtle</option>
                <option value="🐢" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐢 Crocodile</option>
                <option value="🦕" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦕 Alligator</option>
                <option value="🦎" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦎 Dinosaur</option>
                <option value="🦕" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦕 Dragon</option>
                <option value="👾" style={{ color: '#ec4899', fontWeight: 'bold' }}>👾 Alien</option>
                <option value="👽" style={{ color: '#ec4899', fontWeight: 'bold' }}>👽 Ghost</option>
                <option value="🧛" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧛 Witch</option>
                <option value="🧚" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧚 Wizard</option>
                <option value="🧙" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧙 Fairy</option>
                <option value="🧝" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧝 Genie</option>
                <option value="🧞" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧞 Mermaid</option>
                <option value="🧜" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧜 Superhero</option>
                <option value="🦸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦸 Superwoman</option>
                <option value="🦹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦹 Batman</option>
                <option value="🦸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦸 Spider-Man</option>
                <option value="🦺" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦺 Iron Man</option>
                <option value="🦾" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦾 Captain America</option>
                <option value="🦿" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦿 Thor</option>
                <option value="🪐" style={{ color: '#ec4899', fontWeight: 'bold' }}>🪐 Storm</option>
                <option value="🪄" style={{ color: '#ec4899', fontWeight: 'bold' }}>🪄 Black Widow</option>
                <option value="🪚" style={{ color: '#ec4899', fontWeight: 'bold' }}>🪚 Hulk</option>
                <option value="🦹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦹 Flash</option>
                <option value="🦸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦸 Green Lantern</option>
                <option value="🦹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦹 Aquaman</option>
                <option value="🦸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦸 Wonder Woman</option>
                <option value="🦸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦸 Cyborg</option>
                <option value="🦹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦹 Robin</option>
                <option value="🦹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦹 Nightwing</option>
                <option value="🦸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦸 Martian Manhunter</option>
                <option value="🦹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦹 Hawkgirl</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Color
              </label>
              <input
                type="color"
                value={tool.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Version
                </label>
                <input
                  type="text"
                  value={tool.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  disabled={readOnly}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(244, 114, 182, 0.3)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                  placeholder="1.0.0"
                />
              </div>

              <div>
                <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Status
                </label>
                <select
                  value={tool.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={readOnly}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(244, 114, 182, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#fbbf24', // Gold color
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }}
                >
                  <option value="active" style={{ color: '#ec4899', fontWeight: 'bold' }}>Active</option>
                  <option value="inactive" style={{ color: '#ec4899', fontWeight: 'bold' }}>Inactive</option>
                  <option value="maintenance" style={{ color: '#ec4899', fontWeight: 'bold' }}>Maintenance</option>
                  <option value="beta" style={{ color: '#ec4899', fontWeight: 'bold' }}>Beta</option>
                </select>
              </div>
            </div>

          </div>

          <div style={{ marginBottom: '2rem' }}>
            {/* Checkbox fields removed - Featured Tool, Active, Requires Auth */}
          </div>

          {/* Categories Section */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
                Categories *
              </h3>
              <button
                type="button"
                onClick={() => setShowNewCategoryModal(true)}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                + Add Category
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {categories.map(category => (
                <label
                  key={category.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    background: tool.categories.includes(category.id)
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${tool.categories.includes(category.id)
                      ? 'rgba(59, 130, 246, 0.5)'
                      : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={tool.categories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ color: 'white', fontSize: '0.875rem' }}>
                    {category.icon} {category.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Roles Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Accessible Roles *
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {roles.map(role => (
                <label
                  key={role.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    background: tool.roles.includes(role.id)
                      ? 'rgba(139, 92, 246, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${tool.roles.includes(role.id)
                      ? 'rgba(139, 92, 246, 0.5)'
                      : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={tool.roles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ color: 'white', fontSize: '0.875rem' }}>
                    {role.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Tags *
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {tags.map(tag => (
                <label
                  key={tag.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    background: tool.tags.includes(tag.id)
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${tool.tags.includes(tag.id)
                      ? 'rgba(16, 185, 129, 0.5)'
                      : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={tool.tags.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ color: 'white', fontSize: '0.875rem' }}>
                    {tag.icon} {tag.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Examples Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Examples
            </h3>
            
            {tool.examples && tool.examples.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                {tool.examples.map((example, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(244, 114, 182, 0.3)',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>
                        Example {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveExample(index)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                          Type *
                        </label>
                        <select
                          value={example.type}
                          onChange={(e) => handleExampleChange(index, 'type', e.target.value)}
                          disabled={readOnly}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(244, 114, 182, 0.3)',
                            borderRadius: '0.5rem',
                            color: '#fbbf24', // Gold color
                            fontSize: '1rem',
                            fontWeight: 'bold',
                          }}
                        >
                          <option value="link" style={{ color: '#ec4899', fontWeight: 'bold' }}>Link</option>
                          <option value="screenshot" style={{ color: '#ec4899', fontWeight: 'bold' }}>Screenshot</option>
                        </select>
                      </div>
                      
                      <div>
                        <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                          Title *
                        </label>
                        <input
                          type="text"
                          value={example.title}
                          onChange={(e) => handleExampleChange(index, 'title', e.target.value)}
                          required
                          disabled={readOnly}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(244, 114, 182, 0.3)',
                            borderRadius: '0.5rem',
                            color: 'white',
                            fontSize: '1rem',
                          }}
                          placeholder="Example title"
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        {example.type === 'link' ? 'URL *' : 'Image URL *'}
                      </label>
                      <input
                        type="url"
                        value={example.type === 'link' ? example.url : example.image}
                        onChange={(e) => handleExampleChange(index, example.type === 'link' ? 'url' : 'image', e.target.value)}
                        required
                        disabled={readOnly}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(244, 114, 182, 0.3)',
                          borderRadius: '0.5rem',
                          color: 'white',
                          fontSize: '1rem',
                        }}
                        placeholder={example.type === 'link' ? 'https://example.com' : 'https://example.com/image.jpg'}
                      />
                    </div>
                    
                    <div>
                      <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Description *
                      </label>
                      <textarea
                        value={example.description}
                        onChange={(e) => handleExampleChange(index, 'description', e.target.value)}
                        required
                        rows={2}
                        disabled={readOnly}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(244, 114, 182, 0.3)',
                          borderRadius: '0.5rem',
                          color: 'white',
                          fontSize: '1rem',
                          resize: 'vertical'
                        }}
                        placeholder="Brief description of this example"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button
              type="button"
              onClick={tool.examples && tool.examples.length > 0 ? () => setTool(prev => ({ ...prev, examples: [] })) : handleAddExample}
              style={{
                background: tool.examples && tool.examples.length > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: tool.examples && tool.examples.length > 0 ? '#ef4444' : '#10b981',
                border: `1px solid ${tool.examples && tool.examples.length > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
              }}
            >
              {tool.examples && tool.examples.length > 0 ? '- Remove All Examples' : '+ Add Example'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            {!readOnly && (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }}
                >
                  {initialTool ? 'Update Tool' : 'Add Tool'}
                </button>
              </>
            )}
            {readOnly && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                Close
              </button>
            )}
          </div>
        </form>
      </div>

      {/* New Category Modal */}
      {showNewCategoryModal && (
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
          zIndex: 1001,
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1f2937, #111827)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '1rem',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px',
          }}>
            <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Add New Category
            </h3>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem' }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(244, 114, 182, 0.3)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                  placeholder="Category name"
                />
              </div>
              <div>
                <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem' }}>
                  Slug *
                </label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(244, 114, 182, 0.3)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                  placeholder="category-slug"
                />
              </div>
              <div>
                <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem' }}>
                  Description *
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(244, 114, 182, 0.3)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem',
                    resize: 'vertical',
                  }}
                  placeholder="Category description"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem' }}>
                    Icon *
                  </label>
                  <select
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(244, 114, 182, 0.3)',
                      borderRadius: '0.5rem',
                      color: '#fbbf24', // Gold color
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    <option value="🤖" style={{ color: '#ec4899', fontWeight: 'bold' }}>🤖 Robot</option>
                    <option value="🚀" style={{ color: '#ec4899', fontWeight: 'bold' }}>🚀 Rocket</option>
                    <option value="💡" style={{ color: '#ec4899', fontWeight: 'bold' }}>💡 Light Bulb</option>
                    <option value="🔍" style={{ color: '#ec4899', fontWeight: 'bold' }}>🔍 Search</option>
                    <option value="📝" style={{ color: '#ec4899', fontWeight: 'bold' }}>📝 Note</option>
                    <option value="🎵" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎵 Music</option>
                    <option value="📱" style={{ color: '#ec4899', fontWeight: 'bold' }}>📱 Phone</option>
                    <option value="🌐" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌐 Globe</option>
                    <option value="⭐" style={{ color: '#ec4899', fontWeight: 'bold' }}>⭐ Star</option>
                    <option value="🔥" style={{ color: '#ec4899', fontWeight: 'bold' }}>🔥 Fire</option>
                    <option value="💎" style={{ color: '#ec4899', fontWeight: 'bold' }}>💎 Diamond</option>
                    <option value="🏷️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🏷️ Tag</option>
                    <option value="📈" style={{ color: '#ec4899', fontWeight: 'bold' }}>📈 Growth</option>
                    <option value="🔐" style={{ color: '#ec4899', fontWeight: 'bold' }}>🔐 Security</option>
                    <option value="🎪" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎪 Circus</option>
                    <option value="🌟" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌟 Sparkle</option>
                    <option value="🎨" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎨 Palette</option>
                    <option value="🔬" style={{ color: '#ec4899', fontWeight: 'bold' }}>🔬 Microscope</option>
                    <option value="🧪" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧪 Test Tube</option>
                    <option value="⚙️" style={{ color: '#ec4899', fontWeight: 'bold' }}>⚙️ Settings</option>
                    <option value="📊" style={{ color: '#ec4899', fontWeight: 'bold' }}>📊 Chart</option>
                    <option value="🎯" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎯 Target</option>
                    <option value="🛡️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🛡️ Shield</option>
                    <option value="🔑" style={{ color: '#ec4899', fontWeight: 'bold' }}>🔑 Key</option>
                    <option value="📚" style={{ color: '#ec4899', fontWeight: 'bold' }}>📚 Books</option>
                    <option value="🎭" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎭 Masks</option>
                    <option value="🎬" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎬 Film</option>
                    <option value="📷" style={{ color: '#ec4899', fontWeight: 'bold' }}>📷 Camera</option>
                    <option value="⚡" style={{ color: '#ec4899', fontWeight: 'bold' }}>⚡ Lightning</option>
                    <option value="🌈" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌈 Rainbow</option>
                    <option value="💬" style={{ color: '#ec4899', fontWeight: 'bold' }}>💬 Chat</option>
                    <option value="📧" style={{ color: '#ec4899', fontWeight: 'bold' }}>📧 Email</option>
                    <option value="🧠" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧠 Brain</option>
                    <option value="💻" style={{ color: '#ec4899', fontWeight: 'bold' }}>💻 Computer</option>
                    <option value="🖥️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🖥️ Desktop</option>
                    <option value="📱" style={{ color: '#ec4899', fontWeight: 'bold' }}>📱 Mobile</option>
                    <option value="⌨️" style={{ color: '#ec4899', fontWeight: 'bold' }}>⌨️ Keyboard</option>
                    <option value="🖱️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🖱️ Mouse</option>
                    <option value="📁" style={{ color: '#ec4899', fontWeight: 'bold' }}>📁 Folder</option>
                    <option value="📎" style={{ color: '#ec4899', fontWeight: 'bold' }}>📎 Clipboard</option>
                    <option value="🗂️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🗂️ Archive</option>
                    <option value="📋" style={{ color: '#ec4899', fontWeight: 'bold' }}>📋 List</option>
                    <option value="📌" style={{ color: '#ec4899', fontWeight: 'bold' }}>📌 Pin</option>
                    <option value="🔗" style={{ color: '#ec4899', fontWeight: 'bold' }}>🔗 Link</option>
                    <option value="✅" style={{ color: '#ec4899', fontWeight: 'bold' }}>✅ Check</option>
                    <option value="❌" style={{ color: '#ec4899', fontWeight: 'bold' }}>❌ Close</option>
                    <option value="⚠️" style={{ color: '#ec4899', fontWeight: 'bold' }}>⚠️ Warning</option>
                    <option value="ℹ️" style={{ color: '#ec4899', fontWeight: 'bold' }}>ℹ️ Info</option>
                    <option value="🎉" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎉 Party</option>
                    <option value="💝" style={{ color: '#ec4899', fontWeight: 'bold' }}>💝 Gift</option>
                    <option value="❤️" style={{ color: '#ec4899', fontWeight: 'bold' }}>❤️ Heart</option>
                    <option value="🌹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌹 Rose</option>
                    <option value="🌺" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌺 Tulip</option>
                    <option value="🌸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌸 Sunflower</option>
                    <option value="🌿" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌿 Herb</option>
                    <option value="🏔️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🏔️ Castle</option>
                    <option value="🏖️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🏖️ Office</option>
                    <option value="🏥️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🏥️ Hospital</option>
                    <option value="🎓" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎓 School</option>
                    <option value="🏛️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🏛️ Bank</option>
                    <option value="🛒️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🛒️ Shop</option>
                    <option value="🍕️" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍕️ Restaurant</option>
                    <option value="☕" style={{ color: '#ec4899', fontWeight: 'bold' }}>☕ Coffee</option>
                    <option value="🍺" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍺 Beer</option>
                    <option value="🍷" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍷 Cocktail</option>
                    <option value="🥘" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥘 Pizza</option>
                    <option value="🍰" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍰 Cake</option>
                    <option value="🍎" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍎 Candy</option>
                    <option value="🍓" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍓 Strawberry</option>
                    <option value="🍒" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍒 Cherry</option>
                    <option value="🍊" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍊 Orange</option>
                    <option value="🍋" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍋 Lemon</option>
                    <option value="🍌" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍌 Banana</option>
                    <option value="🥝" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥝 Coconut</option>
                    <option value="🥑" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥑 Peanut</option>
                    <option value="🥜" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥜 Watermelon</option>
                    <option value="🍇" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍇 Melon</option>
                    <option value="🍈" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍈 Grapes</option>
                    <option value="🫐" style={{ color: '#ec4899', fontWeight: 'bold' }}>🫐 Berries</option>
                    <option value="🍄" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍄 Mushroom</option>
                    <option value="🥕" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥕 Bread</option>
                    <option value="🥖" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥖 Croissant</option>
                    <option value="🧁" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧁 Donut</option>
                    <option value="🍪" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍪 Cookie</option>
                    <option value="🎂" style={{ color: '#ec4899', fontWeight: 'bold' }}>🎂 Birthday Cake</option>
                    <option value="🧈" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧈 Ice Cream</option>
                    <option value="🍦" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍦 Ice Cream Cone</option>
                    <option value="🥤" style={{ color: '#ec4899', fontWeight: 'bold' }}>🥤 Popsicle</option>
                    <option value="🍩" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍩 Sandwich</option>
                    <option value="🌮" style={{ color: '#ec4899', fontWeight: 'bold' }}>🌮 Taco</option>
                    <option value="🍝" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍝 Hamburger</option>
                    <option value="🍟" style={{ color: '#ec4899', fontWeight: 'bold' }}>🍟 Hot Dog</option>
                    <option value="🦪" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦪 Shrimp</option>
                    <option value="🦀" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦀 Crab</option>
                    <option value="🦞" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦞 Lobster</option>
                    <option value="🐟" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐟 Fish</option>
                    <option value="🦈" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦈 Octopus</option>
                    <option value="🦑" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦑 Squid</option>
                    <option value="🦐" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦐 Whale</option>
                    <option value="🐘" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐘 Butterfly</option>
                    <option value="🦋" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦋 Bird</option>
                    <option value="🦅" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦅 Eagle</option>
                    <option value="🦆" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦆 Parrot</option>
                    <option value="🦚" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦚 Peacock</option>
                    <option value="🦜" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦜 Penguin</option>
                    <option value="🐧" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐧 Duck</option>
                    <option value="🐄" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐄 Pig</option>
                    <option value="🐷" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐷 Cow</option>
                    <option value="🐮" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐮 Goat</option>
                    <option value="🐑" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐑 Horse</option>
                    <option value="🐴" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐴 Zebra</option>
                    <option value="🦒" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦒 Giraffe</option>
                    <option value="🐘" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐘 Koala</option>
                    <option value="🦘" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦘 Kangaroo</option>
                    <option value="🐇" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐇 Panda</option>
                    <option value="🦁" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦁 Lion</option>
                    <option value="🐯" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐯 Tiger</option>
                    <option value="🐅" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐅 Bear</option>
                    <option value="🐻" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐻 Cat</option>
                    <option value="🐕" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐕 Dog</option>
                    <option value="🐩" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐩 Wolf</option>
                    <option value="🦊" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦊 Fox</option>
                    <option value="🦝" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦝 Raccoon</option>
                    <option value="🦔" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦔 Skunk</option>
                    <option value="🦙" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦙 Owl</option>
                    <option value="🦉" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦉 Eagle</option>
                    <option value="🦚" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦚 Dove</option>
                    <option value="🦜" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦜 Penguin</option>
                    <option value="🐢" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐢 Snake</option>
                    <option value="🐍" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐍 Lizard</option>
                    <option value="🦎" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦎 Turtle</option>
                    <option value="🐢" style={{ color: '#ec4899', fontWeight: 'bold' }}>🐢 Crocodile</option>
                    <option value="🦕" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦕 Alligator</option>
                    <option value="🦎" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦎 Dinosaur</option>
                    <option value="🦕" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦕 Dragon</option>
                    <option value="👾" style={{ color: '#ec4899', fontWeight: 'bold' }}>👾 Alien</option>
                    <option value="👽" style={{ color: '#ec4899', fontWeight: 'bold' }}>👽 Ghost</option>
                    <option value="🧛" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧛 Witch</option>
                    <option value="🧚" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧚 Wizard</option>
                    <option value="🧙" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧙 Fairy</option>
                    <option value="🧝" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧝 Genie</option>
                    <option value="🧞" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧞 Mermaid</option>
                    <option value="🧜" style={{ color: '#ec4899', fontWeight: 'bold' }}>🧜 Superhero</option>
                    <option value="🦸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦸 Superwoman</option>
                    <option value="🦹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦹 Batman</option>
                    <option value="🦸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦸 Spider-Man</option>
                    <option value="🦺" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦺 Iron Man</option>
                    <option value="🦾" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦾 Captain America</option>
                    <option value="🦿" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦿 Thor</option>
                    <option value="🪐" style={{ color: '#ec4899', fontWeight: 'bold' }}>🪐 Storm</option>
                    <option value="🪄" style={{ color: '#ec4899', fontWeight: 'bold' }}>🪄 Black Widow</option>
                    <option value="🪚" style={{ color: '#ec4899', fontWeight: 'bold' }}>🪚 Hulk</option>
                    <option value="🦹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦹 Flash</option>
                    <option value="🦸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦸 Green Lantern</option>
                    <option value="🦹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦹 Aquaman</option>
                    <option value="🦸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦸 Wonder Woman</option>
                    <option value="🦸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦸 Cyborg</option>
                    <option value="🦹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦹 Robin</option>
                    <option value="🦹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦹 Nightwing</option>
                    <option value="🦸" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦸 Martian Manhunter</option>
                    <option value="🦹" style={{ color: '#ec4899', fontWeight: 'bold' }}>🦹 Hawkgirl</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: '#e5e7eb', display: 'block', marginBottom: '0.5rem' }}>
                    Color *
                  </label>
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      height: '42px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(244, 114, 182, 0.3)',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowNewCategoryModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #374151, #1f2937)',
                  color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.4), 0 0 30px rgba(251, 191, 36, 0.2)';
                  e.currentTarget.style.borderColor = '#fbbf24';
                  e.currentTarget.style.textShadow = '0 0 10px rgba(251, 191, 36, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)';
                  e.currentTarget.style.textShadow = 'none';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>
                  ✕ Cancel
                </span>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent, rgba(251, 191, 36, 0.1), transparent)',
                  borderRadius: '0.5rem',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }} />
              </button>
              <button
                onClick={handleAddCategory}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669, #064e3b)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.3)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #064e3b, #10b981)';
                  e.currentTarget.style.textShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #10b981, #059669, #064e3b)';
                  e.currentTarget.style.textShadow = 'none';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>
                  ✨ Add Category
                </span>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent, rgba(16, 185, 129, 0.1), transparent)',
                  borderRadius: '0.5rem',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '1rem 1.5rem',
          borderRadius: '0.5rem',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          maxWidth: '400px',
          zIndex: 10000,
          background: toast.type === 'error' 
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : toast.type === 'warning'
            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
            : 'linear-gradient(135deg, #10b981, #059669)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          animation: 'slideIn 0.3s ease-out',
          whiteSpace: 'pre-line',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              {toast.type === 'error' && '⚠️ '}
              {toast.type === 'warning' && '⚡ '}
              {toast.type === 'success' && '✅ '}
              {toast.message}
            </div>
            <button
              onClick={() => setToast(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer',
                marginLeft: '1rem',
                padding: '0',
                lineHeight: '1',
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '1rem',
          padding: '2rem 3rem',
          zIndex: 2000,
          boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.5)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
            }}>
              🎉
            </div>
            <h3 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}>
              Tool Created Successfully!
            </h3>
            <p style={{
              color: '#d1fae5',
              fontSize: '1rem',
              margin: 0,
            }}>
              "{tool.name}" has been Created to your AI tools collection
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolManager;
