import {
  AiTool,
  AiToolForm,
  ApiResponse,
  PaginatedResponse,
  FilterOptions
} from '../types/ai-tools';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // AI Tools API methods
  async getAiTools(params: FilterOptions = {}): Promise<PaginatedResponse<AiTool>> {
    const searchParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/ai-tools${queryString ? `?${queryString}` : ''}`;

    return this.request<PaginatedResponse<AiTool>>(endpoint);
  }

  async getAiTool(id: number): Promise<ApiResponse<AiTool>> {
    return this.request<ApiResponse<AiTool>>(`/ai-tools/${id}`);
  }

  async createAiTool(data: AiToolForm): Promise<ApiResponse<AiTool>> {
    return this.request<ApiResponse<AiTool>>('/ai-tools', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAiTool(id: number, data: Partial<AiToolForm>): Promise<ApiResponse<AiTool>> {
    return this.request<ApiResponse<AiTool>>(`/ai-tools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAiTool(id: number): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(`/ai-tools/${id}`, {
      method: 'DELETE',
    });
  }

  // Metadata API methods
  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.request<ApiResponse<string[]>>('/ai-tools-meta/categories');
  }

  async getTeams(): Promise<ApiResponse<string[]>> {
    return this.request<ApiResponse<string[]>>('/ai-tools-meta/teams');
  }

  async getTags(): Promise<ApiResponse<string[]>> {
    return this.request<ApiResponse<string[]>>('/ai-tools-meta/tags');
  }
}

export const apiClient = new ApiClient();
