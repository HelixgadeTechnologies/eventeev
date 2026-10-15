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
  _id?: string;
  name: string;
  type: 'general' | 'announcement' | 'private';
  leadParticipant?: {
    name: string;
    avatar?: string;
    id?: string;
  } | string;
}

class ChatService {
  private socket: Socket | null = null;
  private connectionStatus: 'connected' | 'connecting' | 'disconnected' = 'disconnected';
  private connectionListeners: ((status: 'connected' | 'connecting' | 'disconnected') => void)[] = [];

  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    return this.connectionStatus;
  }

  onConnectionChange(callback: (status: 'connected' | 'connecting' | 'disconnected') => void) {
    this.connectionListeners.push(callback);
    callback(this.connectionStatus);
  }

  offConnectionChange(callback?: (status: any) => void) {
    if (callback) {
      this.connectionListeners = this.connectionListeners.filter((cb) => cb !== callback);
    } else {
      this.connectionListeners = [];
    }
  }

  private notifyStatus(status: 'connected' | 'connecting' | 'disconnected') {
    this.connectionStatus = status;
    this.connectionListeners.forEach((cb) => {
      try {
        cb(status);
      } catch (err) {
        console.error('Error in connection listener:', err);
      }
    });
  }

  initSocket(token: string) {
    if (this.socket) return this.socket;

    this.notifyStatus('connecting');

    this.socket = io(SOCKET_URL, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      this.notifyStatus('connected');
    });

    this.socket.on('disconnect', () => {
      this.notifyStatus('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.notifyStatus('disconnected');
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

  offReceiveMessage(callback?: (message: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off('receive_message', callback);
      } else {
        this.socket.off('receive_message');
      }
    }
  }

  onRoomStatus(callback: (status: { activated: boolean; count: number; roomId: string }) => void) {
    if (this.socket) {
      this.socket.on('room_status', callback);
    }
  }

  offRoomStatus(callback?: (status: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off('room_status', callback);
      } else {
        this.socket.off('room_status');
      }
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.notifyStatus('disconnected');
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

  async createRoom(data: { event?: string; eventId?: string; name: string; type: string; leadParticipant?: any }) {
    try {
      const response = await axiosInstance.post('/api/chat/room', data);
      return response.data;
    } catch (error: any) {
      console.warn('Failed to create chat room on backend:', error.response?.data || error.message);
      throw error;
    }
  }

  async getOrCreateDirectRoom(
    eventId: string,
    attendee: { id: string; name: string; email?: string; avatar?: string },
    currentUserId?: string
  ) {
    try {
      const existingRooms = await this.getRooms(eventId);
      const dmRoom = existingRooms.find((r: any) => 
        (r.type === 'private' || r.type === 'dm') && (
          r.name === attendee.name ||
          r.name === `DM: ${attendee.name}` ||
          r.leadParticipant === attendee.id ||
          (typeof r.leadParticipant === 'object' && (r.leadParticipant?.id === attendee.id || r.leadParticipant?.name === attendee.name))
        )
      );

      if (dmRoom) {
        return { data: dmRoom, error: null };
      }

      // 1. Try creating room via API with both eventId & event
      try {
        const newRoom = await this.createRoom({
          eventId,
          event: eventId,
          name: attendee.name,
          type: 'private',
        });
        const roomData = newRoom?.data || newRoom;
        if (roomData && (roomData.id || roomData._id)) {
          return { data: roomData, error: null };
        }
      } catch (err: any) {
        // 2. Try with object leadParticipant in case the schema expects embedded participant
        try {
          const newRoomWithLead = await this.createRoom({
            eventId,
            event: eventId,
            name: attendee.name,
            type: 'private',
            leadParticipant: {
              name: attendee.name,
              id: attendee.id,
            }
          });
          const roomData = newRoomWithLead?.data || newRoomWithLead;
          if (roomData && (roomData.id || roomData._id)) {
            return { data: roomData, error: null };
          }
        } catch (err2) {
          // Backend room creation endpoint not available or returned error; fall back smoothly
        }
      }

      // 3. Resilient fallback: Use scoped deterministic pair key so multiple admins don't collide
      const pairKey = currentUserId ? [currentUserId, attendee.id].sort().join('_') : attendee.id;
      const fallbackRoomId = `dm_${eventId}_${pairKey}`;

      const directRoom: Room = {
        id: fallbackRoomId,
        name: attendee.name,
        type: 'private',
        leadParticipant: {
          name: attendee.name,
          id: attendee.id,
        }
      };

      return { data: directRoom, error: null };
    } catch (error: any) {
      console.warn('Direct room resolution warning:', error);
      const pairKey = currentUserId ? [currentUserId, attendee.id].sort().join('_') : attendee.id;
      const fallbackRoomId = `dm_${eventId}_${pairKey}`;

      const directRoom: Room = {
        id: fallbackRoomId,
        name: attendee.name,
        type: 'private',
        leadParticipant: {
          name: attendee.name,
          id: attendee.id,
        }
      };
      return { data: directRoom, error: null };
    }
  }
}

export const chatService = new ChatService();
export default chatService;
