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
  type: 'general' | 'announcement' | 'private' | 'public';
  isGroup?: boolean;
  participantIds?: string[];
  participants?: Array<{
    id?: string;
    name?: string;
    avatar?: string;
    role?: string;
  }>;
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
    if (!roomId) return { messages: [], pagination: null };

    // MongoDB ObjectIds are strictly 24 hexadecimal characters.
    // If roomId is a client-side synthetic DM (e.g. "dm_...", "organizer", or non-hex string),
    // skip the backend request to avoid MongoDB CastError -> 500.
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(roomId);
    if (!isValidObjectId) {
      return { messages: [], pagination: null };
    }

    try {
      const response = await axiosInstance.get(`/api/chat/messages/${roomId}?page=${page}&limit=${limit}`);
      const rawData = response.data;
      if (Array.isArray(rawData)) {
        return { messages: rawData, pagination: null };
      }
      if (rawData?.pagination) {
        return { messages: rawData.data || [], pagination: rawData.pagination };
      }
      return { messages: rawData?.messages || rawData?.data || [], pagination: null };
    } catch (error: any) {
      // Gracefully return empty messages on 404 or backend 500 so UI falls back cleanly to local/socket messages
      const status = error.response?.status;
      if (status !== 404 && status !== 500) {
        console.warn('[ChatService] getMessages notice:', error.message);
      }
      return { messages: [], pagination: null };
    }
  }

  async createRoom(data: {
    event?: string;
    eventId?: string;
    name: string;
    type?: string;
    isGroup?: boolean;
    participantIds?: string[];
    participants?: any[];
    leadParticipant?: any;
  }) {
    try {
      const response = await axiosInstance.post('/api/chat/room', data);
      return response.data;
    } catch (error: any) {
      try {
        const response2 = await axiosInstance.post('/api/chat/rooms', data);
        return response2.data;
      } catch {
        console.warn('Failed to create chat room on backend:', error.response?.data || error.message);
        throw error;
      }
    }
  }

  async getOrCreateDirectRoom(
    eventId: string,
    attendee: { id: string; name: string; email?: string; avatar?: string },
    currentUserId?: string
  ) {
    try {
      const existingRooms = await this.getRooms(eventId);
      const dmRoom = existingRooms.find((r: any) => {
        const isDm = r.type === 'private' || r.type === 'dm' || r.isGroup === false;
        if (!isDm) return false;
        if (Array.isArray(r.participantIds) && r.participantIds.includes(attendee.id)) {
          return true;
        }
        return (
          r.name === attendee.name ||
          r.name === `DM: ${attendee.name}` ||
          r.leadParticipant === attendee.id ||
          (typeof r.leadParticipant === 'object' && (r.leadParticipant?.id === attendee.id || r.leadParticipant?.name === attendee.name))
        );
      });

      if (dmRoom) {
        return { data: dmRoom, error: null };
      }

      const pIds = [currentUserId, attendee.id].filter(Boolean) as string[];

      // 1. Try creating room via API with isGroup: false and participantIds
      try {
        const newRoom = await this.createRoom({
          eventId,
          event: eventId,
          name: attendee.name,
          type: 'private',
          isGroup: false,
          participantIds: pIds,
          leadParticipant: attendee.id,
          participants: [
            ...(currentUserId ? [{ id: currentUserId, role: 'admin' }] : []),
            { id: attendee.id, name: attendee.name, role: 'attendee' }
          ]
        });
        const roomData = newRoom?.data || newRoom;
        if (roomData && (roomData.id || roomData._id)) {
          return { data: roomData, error: null };
        }
      } catch (err: any) {
        // 2. Try with object leadParticipant fallback
        try {
          const newRoomWithLead = await this.createRoom({
            eventId,
            event: eventId,
            name: attendee.name,
            type: 'private',
            isGroup: false,
            participantIds: pIds,
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
        isGroup: false,
        participantIds: pIds,
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
        isGroup: false,
        participantIds: currentUserId ? [currentUserId, attendee.id] : [attendee.id],
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
