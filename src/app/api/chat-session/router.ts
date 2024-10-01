export interface Message {
    id: number;
    action: string;
    content: string;
    timestamp: string;
  }
  
  export interface ChatSession {
    id: number;
    name: string;
    messages: Message[];
    message_count: number;
  }
  
  export interface ChatData {
    chat_sessions: ChatSession[];
    total: number;
    pages: number;
    current_page: number;
  }
  
  export const fetchChatSessions = async (page: number = 1, per_page: number = 20): Promise<ChatData> => {
    try {
      const response = await fetch(
        `https://admin-backend-docker-india-306034828043.asia-south2.run.app/nlp/api/chat_sessions?page=${page}&per_page=${per_page}`
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch chat sessions');
      }
  
      const data: ChatData = await response.json();
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };
  