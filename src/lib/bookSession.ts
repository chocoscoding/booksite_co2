/**
 * Book Session Storage Management
 * 
 * This module provides centralized management of book creation session data.
 * All book-related data is stored in sessionStorage, keyed by a unique session ID.
 * This approach avoids exposing sensitive data in URL parameters.
 */

// Session keys
const SESSION_ID_KEY = 'bookSessionId';
const SESSION_DATA_PREFIX = 'bookSession_';

// Types for book session data
export interface BookCharacter {
  name: string;
  type: 'person' | 'pet';
  gender?: 'female' | 'male' | 'non-binary' | 'prefer-not-to-say';
}

export interface BookSessionData {
  // Session metadata
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  
  // Flow state
  isGift: boolean;
  occasion?: string;
  
  // Character data
  character?: BookCharacter;
  
  // Questionnaire answers
  answers?: Record<string, string>;
  
  // Book preferences
  genre?: string;
  coverType?: 'photo' | 'illustrated';
  
  // User data
  email?: string;
  
  // Backend references (after book creation)
  bookId?: string;
  authToken?: string;
  magicLinkToken?: string;
  bookAccessToken?: string;
  
  // Title selection
  selectedTitle?: string;
  selectedSubtitle?: string;
  
  // Photo upload
  photoUrl?: string;
}

/**
 * Generate a unique session ID using crypto.randomUUID
 */
const generateSessionId = (): string => {
  return crypto.randomUUID();
};

/**
 * Get the current session ID, creating one if it doesn't exist
 */
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

/**
 * Get the storage key for session data
 */
const getStorageKey = (sessionId: string): string => {
  return `${SESSION_DATA_PREFIX}${sessionId}`;
};

/**
 * Initialize a new book session
 */
export const initBookSession = (isGift: boolean = false): BookSessionData => {
  const sessionId = generateSessionId();
  sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  
  const sessionData: BookSessionData = {
    sessionId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isGift,
  };
  
  sessionStorage.setItem(getStorageKey(sessionId), JSON.stringify(sessionData));
  return sessionData;
};

/**
 * Get the current book session data
 */
export const getBookSession = (): BookSessionData | null => {
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) return null;
  
  const data = sessionStorage.getItem(getStorageKey(sessionId));
  if (!data) return null;
  
  try {
    return JSON.parse(data) as BookSessionData;
  } catch {
    return null;
  }
};

/**
 * Update the current book session data
 */
export const updateBookSession = (updates: Partial<BookSessionData>): BookSessionData | null => {
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    // If no session exists, initialize one
    const newSession = initBookSession(updates.isGift ?? false);
    return updateBookSession(updates);
  }
  
  const currentData = getBookSession();
  if (!currentData) {
    // Session ID exists but no data, create it
    const sessionData: BookSessionData = {
      sessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isGift: false,
      ...updates,
    };
    sessionStorage.setItem(getStorageKey(sessionId), JSON.stringify(sessionData));
    return sessionData;
  }
  
  const updatedData: BookSessionData = {
    ...currentData,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  sessionStorage.setItem(getStorageKey(sessionId), JSON.stringify(updatedData));
  return updatedData;
};

/**
 * Set specific character data
 */
export const setCharacterData = (character: BookCharacter): BookSessionData | null => {
  return updateBookSession({ character });
};

/**
 * Set questionnaire answers
 */
export const setAnswers = (answers: Record<string, string>): BookSessionData | null => {
  const current = getBookSession();
  const mergedAnswers = {
    ...current?.answers,
    ...answers,
  };
  return updateBookSession({ answers: mergedAnswers });
};

/**
 * Add or update a single answer
 */
export const setAnswer = (questionId: string, answer: string): BookSessionData | null => {
  const current = getBookSession();
  const answers = {
    ...current?.answers,
    [questionId]: answer,
  };
  return updateBookSession({ answers });
};

/**
 * Set occasion
 */
export const setOccasion = (occasion: string): BookSessionData | null => {
  return updateBookSession({ occasion, isGift: true });
};

/**
 * Set genre
 */
export const setGenre = (genre: string): BookSessionData | null => {
  return updateBookSession({ genre });
};

/**
 * Set email
 */
export const setEmail = (email: string): BookSessionData | null => {
  return updateBookSession({ email });
};

/**
 * Set book ID from backend
 */
export const setBookId = (bookId: string): BookSessionData | null => {
  return updateBookSession({ bookId });
};

/**
 * Set authentication token
 */
export const setAuthToken = (authToken: string): BookSessionData | null => {
  return updateBookSession({ authToken });
  // Also store in localStorage for persistence across sessions
};

/**
 * Set cover type
 */
export const setCoverType = (coverType: 'photo' | 'illustrated'): BookSessionData | null => {
  return updateBookSession({ coverType });
};

/**
 * Set title selection
 */
export const setTitle = (title: string, subtitle?: string): BookSessionData | null => {
  return updateBookSession({ 
    selectedTitle: title, 
    selectedSubtitle: subtitle 
  });
};

/**
 * Set photo URL after upload
 */
export const setPhotoUrl = (photoUrl: string): BookSessionData | null => {
  return updateBookSession({ photoUrl });
};

/**
 * Clear the current book session
 */
export const clearBookSession = (): void => {
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (sessionId) {
    sessionStorage.removeItem(getStorageKey(sessionId));
  }
  sessionStorage.removeItem(SESSION_ID_KEY);
};

/**
 * Check if a book session exists and has required data
 */
export const hasValidSession = (): boolean => {
  const session = getBookSession();
  return session !== null;
};

/**
 * Get authentication headers from session
 */
export const getAuthHeaders = (): Record<string, string> => {
  const session = getBookSession();
  const token = 
    session?.magicLinkToken || 
    session?.bookAccessToken || 
    session?.authToken ||
    sessionStorage.getItem("magicLinkToken") ||
    sessionStorage.getItem("bookAccessToken") ||
    localStorage.getItem("authToken");
    
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

/**
 * Prepare data for backend API call
 * This extracts and formats all session data for the book creation API
 */
export const prepareBookCreationData = () => {
  const session = getBookSession();
  if (!session) return null;
  
  const { character, answers, genre, occasion, isGift } = session;
  
  // Build characters array
  const characters = character ? [{
    name: character.name,
    role: 'protagonist' as const,
    description: answers?.personality || '',
    personality: answers?.quirks ? [answers.quirks] : [],
  }] : [];
  
  // Build customization object
  const customization = {
    genre: genre || 'comedy',
    occasion: occasion || '',
    tone: genre === 'comedy' ? 'funny' : genre === 'romance' ? 'romantic' : 'adventurous',
    pageCount: 20,
    includeIllustrations: true,
    recipientName: character?.name || '',
    recipientRelationship: isGift ? 'gift recipient' : 'self',
    dedicationMessage: answers?.memorable_moment || '',
    specialMessages: [answers?.dreams, answers?.hobbies].filter(Boolean),
  };
  
  return {
    characters,
    customization,
    email: session.email,
    isGift,
    occasion,
    genre,
    answers,
  };
};

/**
 * Debug: Log current session data
 */
export const debugSession = (): void => {
  const session = getBookSession();
  console.log('[BookSession]', session);
};
