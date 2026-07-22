import { io, Socket } from 'socket.io-client';
import axiosInstance from "../axios";

const SOCKET_URL = 'https://eventeevapi.onrender.com';

export interface Message {
  id?: string;
  room: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  type: 'text' | 'image' | 'file';
  createdAt?: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'general' | 'announcement' | 'private';
  leadParticipant?: {
    name: string;
    avatar?: string;
  };
}

class ChatService {
  private socket: Socket | null = null;

  initSocket(token: string) {
    if (this.socket) return this.socket;

    this.socket = io(SOCKET_URL, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join_room', roomId);
    }
  }

  sendMessage(data: { room: string; sender: string; content: string; type: string }) {
    if (this.socket) {
      this.socket.emit('send_message', data);
    }
  }

  onReceiveMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  onRoomStatus(callback: (status: { activated: boolean; count: number; roomId: string }) => void) {
    if (this.socket) {
      this.socket.on('room_status', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  async getRooms(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/chat/rooms/${eventId}`);
      const rawData = response.data?.data || response.data;
      return Array.isArray(rawData) ? rawData : [];
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 404) return [];
      console.error('Failed to fetch chat rooms:', error);
      throw error;
    }
  }

  async getMessages(roomId: string, page = 1, limit = 50) {
    try {
      const response = await axiosInstance.get(`/api/chat/messages/${roomId}?page=${page}&limit=${limit}`);
      return response.data?.pagination
        ? { messages: response.data.data, pagination: response.data.pagination }
        : response.data;
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 404) return { messages: [], pagination: null };
      console.error('Failed to fetch messages:', error);
      throw error;
    }
  }

  async createRoom(data: { event: string; name: string; type: string; leadParticipant?: string }) {
    try {
      const response = await axiosInstance.post('/api/chat/room', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create chat room:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
export default chatService;
