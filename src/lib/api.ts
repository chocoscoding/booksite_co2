/**
 * API Client for BookSite backend
 * 
 * Automatically includes guest session ID and auth headers
 */
import { config } from './config';
import { getSessionId, getAuthHeaders } from './bookSession';

const API_BASE = `${config.apiUrl}/api`;

/**
 * Get headers for API requests
 * Includes guest session ID and auth token if available
 */
const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Guest-Session': getSessionId(),
  };
  
  // Add auth headers if available
  const authHeaders = getAuthHeaders();
  return { ...headers, ...authHeaders };
};

/**
 * Generic API response type
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API Client
 */
export const api = {
  /**
   * GET request
   */
  async get<T>(path: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  /**
   * POST request
   */
  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.json();
  },

  /**
   * PATCH request
   */
  async patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.json();
  },

  /**
   * DELETE request
   */
  async delete<T>(path: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },
};

// ═══════════════════════════════════════════════════════════════
// Guest API (public, no auth required)
// ═══════════════════════════════════════════════════════════════

export interface BookDraft {
  id: string;
  title: string;
  genre: string;
  occasion?: string;
  characters: Array<{
    name: string;
    role: string;
    description?: string;
    personality?: string[];
  }>;
  customization: Record<string, unknown>;
  status: string;
  guestSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookPreview {
  title: string;
  subtitle?: string;
  previewPages: Array<{
    pageNumber: number;
    content: string;
    illustration?: string;
  }>;
  previewCoverUrl?: string;
  previewGenerated: boolean;
}

export interface EmailCaptureResponse {
  book: BookDraft;
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
}

export const guestApi = {
  /**
   * Create a new book draft
   */
  async createBook(data: {
    genre: string;
    occasion?: string;
    characters: Array<{
      name: string;
      role: 'protagonist' | 'supporting' | 'antagonist';
      description?: string;
      personality?: string[];
    }>;
    customization: {
      tone: 'funny' | 'heartfelt' | 'adventurous' | 'educational' | 'romantic';
      pageCount?: number;
      includeIllustrations?: boolean;
      recipientName: string;
      recipientRelationship?: string;
      dedicationMessage?: string;
      specialMessages?: string[];
    };
  }): Promise<ApiResponse<BookDraft & { guestSessionId: string }>> {
    return api.post('/guest/books', data);
  },

  /**
   * Get a book by ID
   */
  async getBook(bookId: string): Promise<ApiResponse<BookDraft>> {
    return api.get(`/guest/books/${bookId}`);
  },

  /**
   * Update a book draft
   */
  async updateBook(bookId: string, data: Partial<{
    title: string;
    genre: string;
    occasion: string;
    characters: Array<{
      name: string;
      role: string;
      description?: string;
      personality?: string[];
    }>;
    customization: Record<string, unknown>;
  }>): Promise<ApiResponse<BookDraft>> {
    return api.patch(`/guest/books/${bookId}`, data);
  },

  /**
   * Generate book preview
   */
  async generatePreview(bookId: string): Promise<ApiResponse<BookDraft>> {
    return api.post(`/guest/books/${bookId}/preview`);
  },

  /**
   * Get book preview data
   */
  async getPreview(bookId: string): Promise<ApiResponse<BookPreview>> {
    return api.get(`/guest/books/${bookId}/preview`);
  },

  /**
   * Generate title variants
   */
  async generateTitles(bookId: string): Promise<ApiResponse<{ titles: Array<{ title: string; subtitle: string }> }>> {
    return api.post(`/guest/books/${bookId}/generate-titles`);
  },

  /**
   * Capture email and link book to user account
   */
  async captureEmail(bookId: string, email: string, name?: string): Promise<ApiResponse<EmailCaptureResponse>> {
    return api.post(`/guest/books/${bookId}/capture-email`, { email, name });
  },

  /**
   * Get all books for current guest session
   */
  async getSessionBooks(): Promise<ApiResponse<{ books: BookDraft[] }>> {
    return api.get('/guest/session');
  },
};

// ═══════════════════════════════════════════════════════════════
// Magic Link API
// ═══════════════════════════════════════════════════════════════

export const magicLinkApi = {
  /**
   * Request a magic link email
   */
  async sendMagicLink(email: string): Promise<ApiResponse<void>> {
    return api.post('/magic-link/send', { email });
  },

  /**
   * Verify a magic link token
   */
  async verifyToken(token: string): Promise<ApiResponse<{ userId: string; email: string; valid: boolean }>> {
    return api.get(`/magic-link/verify?token=${token}`);
  },

  /**
   * Get all books for magic link user
   */
  async getBooks(token: string): Promise<ApiResponse<{ books: BookDraft[] }>> {
    return api.get(`/magic-link/books?token=${token}`);
  },
};
