import { io, Socket } from 'socket.io-client';
import axiosInstance from "../axios";

const SOCKET_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : 'https://eventeevapi.onrender.com';

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
    const response = await axiosInstance.get(`/api/chat/rooms/${eventId}`);
    return response.data;
  }

  async getMessages(roomId: string) {
    const response = await axiosInstance.get(`/api/chat/messages/${roomId}`);
    return response.data;
  }

  async createRoom(data: { event: string; name: string; type: string; leadParticipant?: string }) {
    const response = await axiosInstance.post('/api/chat/room', data);
    return response.data;
  }
}

export const chatService = new ChatService();
export default chatService;
