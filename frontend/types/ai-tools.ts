export interface AiTool {
  id: number;
  name: string;
  description: string;
  category?: string;
  tool_type: 'library' | 'application' | 'framework' | 'api' | 'service';
  url?: string;
  documentation_url?: string;
  github_url?: string;
  author_name: string;
  author_email?: string;
  team?: string;
  tags?: string[];
  use_case?: string;
  pros?: string;
  cons?: string;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AiToolForm {
  name: string;
  description: string;
  category?: string;
  tool_type: AiTool['tool_type'];
  url?: string;
  documentation_url?: string;
  github_url?: string;
  author_name: string;
  author_email?: string;
  team?: string;
  tags?: string[];
  use_case?: string;
  pros?: string;
  cons?: string;
  rating?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  message: string;
}

export interface FilterOptions {
  category?: string;
  type?: string;
  team?: string;
  tag?: string;
  search?: string;
  sort_by?: 'name' | 'category' | 'rating' | 'created_at';
  sort_order?: 'asc' | 'desc';
  include_inactive?: boolean;
  per_page?: number;
}
