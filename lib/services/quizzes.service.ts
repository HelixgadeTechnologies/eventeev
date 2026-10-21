import axiosInstance from "../axios";

const isMongoObjectId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

export class QuizzesService {
  async createQuiz(data: any) {
    try {
      const response = await axiosInstance.post('/api/game/quiz/create', data);
      const created = response.data?.data || response.data;
      if (created && typeof window !== 'undefined' && data?.eventId) {
        try {
          const cacheKey = `eventeev_created_quizzes_${data.eventId}`;
          const cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
          const updated = [created, ...cached.filter((q: any) => (q._id || q.id) !== (created._id || created.id))];
          localStorage.setItem(cacheKey, JSON.stringify(updated));
        } catch (e) {
          console.warn('[QuizzesService] Failed to cache created quiz locally:', e);
        }
      }
      return created;
    } catch (error: any) {
      console.error('Failed to create quiz:', error);
      throw error;
    }
  }

  async getTemplateQuizzes(params?: { category?: string; search?: string; featured?: boolean }) {
    try {
      const response = await axiosInstance.get("/api/game/quiz/templates", { params });
      const raw = response.data?.data || response.data;
      return Array.isArray(raw) ? raw : [];
    } catch (error: any) {
      console.warn("[QuizzesService] Could not fetch template quizzes:", error?.message || error);
      return [];
    }
  }

  async cloneQuiz(quizId: string, eventId: string) {
    if (!quizId || !isMongoObjectId(quizId)) {
      throw new Error("Invalid quiz ID");
    }
    if (!eventId || !isMongoObjectId(eventId)) {
      throw new Error("Invalid event ID");
    }

    try {
      const response = await axiosInstance.post(`/api/game/quiz/${quizId}/clone`, { eventId });
      const cloned = response.data?.data || response.data;
      if (cloned && typeof window !== 'undefined') {
        try {
          const cacheKey = `eventeev_created_quizzes_${eventId}`;
          const cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
          const updated = [cloned, ...cached.filter((q: any) => (q._id || q.id) !== (cloned._id || cloned.id))];
          localStorage.setItem(cacheKey, JSON.stringify(updated));
        } catch (e) {
          console.warn('[QuizzesService] Failed to cache cloned quiz locally:', e);
        }
      }
      return cloned;
    } catch (error: any) {
      console.error(`[QuizzesService] Failed to clone quiz "${quizId}":`, error?.message || error);
      throw error;
    }
  }

  async getQuiz(id: string) {
    if (!id || !isMongoObjectId(id)) {
      return null;
    }

    try {
      const response = await axiosInstance.get(`/api/game/quiz/${id}`);
      const quiz = response.data?.data || response.data || null;
      if (quiz) return quiz;
    } catch (error: any) {
      console.warn(`[QuizzesService] Could not fetch quiz "${id}":`, error?.message || error);
    }

    if (typeof window !== 'undefined') {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('eventeev_created_quizzes_')) {
            const items = JSON.parse(localStorage.getItem(key) || '[]');
            const match = items.find((q: any) => (q._id || q.id) === id);
            if (match) return match;
          }
        }
      } catch (_) {}
    }

    return null;
  }

  async hostQuiz(id: string) {
    if (!id || !isMongoObjectId(id)) {
      const fallbackPin = Math.floor(100000 + Math.random() * 900000).toString();
      return { pin: fallbackPin, quizId: id };
    }

    try {
      const response = await axiosInstance.post(`/api/game/quiz/${id}/session`);
      const data = response.data?.data || response.data;
      if (data && data.pin) {
        return data;
      }
      const fallbackPin = Math.floor(100000 + Math.random() * 900000).toString();
      return { ...data, pin: fallbackPin, quizId: id };
    } catch (error: any) {
      console.warn(`[QuizzesService] Failed to start host session on server for "${id}", using fallback 6-digit PIN:`, error?.message || error);
      const fallbackPin = Math.floor(100000 + Math.random() * 900000).toString();
      return { pin: fallbackPin, quizId: id };
    }
  }

  async joinSession(pin: string, nickname: string, userId?: string) {
    const cleanPin = pin ? pin.toString().replace(/\s+/g, '').trim() : '';
    if (!cleanPin) {
      throw new Error("A 6-digit Game PIN is required.");
    }
    if (!nickname || !nickname.trim()) {
      throw new Error("Please enter a nickname to join.");
    }

    try {
      const response = await axiosInstance.post('/api/game/quiz/session/join', { 
        pin: cleanPin, 
        nickname: nickname.trim(), 
        userId 
      });
      return response.data?.data || response.data;
    } catch (error: any) {
      console.warn(`[QuizzesService] Failed to join session ${cleanPin}:`, error?.message || error);
      // If server session is not yet synchronized, return local session object so player can enter waiting room
      return {
        pin: cleanPin,
        nickname: nickname.trim(),
        userId,
        status: 'waiting'
      };
    }
  }

  async submitAnswer(pin: string, data: { userId: string; questionIndex: number; answerIndex: number; timeTaken: number }) {
    try {
      const response = await axiosInstance.patch(`/api/game/quiz/session/${pin}/submit`, data);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error(`[QuizzesService] Failed to submit answer for ${pin}:`, error?.message || error);
      throw error;
    }
  }

  async getLeaderboard(pin: string) {
    if (!pin) return [];

    try {
      const response = await axiosInstance.get(`/api/game/quiz/session/${pin}/leaderboard`);
      const raw = response.data?.data || response.data;
      return Array.isArray(raw) ? raw : [];
    } catch (error: any) {
      console.warn(`[QuizzesService] Could not fetch leaderboard for pin "${pin}":`, error?.message || error);
      return [];
    }
  }

  async getQuizzesByEvent(eventId: string) {
    if (!eventId || !isMongoObjectId(eventId)) {
      return [];
    }

    let localQuizzes: any[] = [];
    if (typeof window !== 'undefined') {
      try {
        const cacheKey = `eventeev_created_quizzes_${eventId}`;
        localQuizzes = JSON.parse(localStorage.getItem(cacheKey) || '[]');
      } catch (e) {
        localQuizzes = [];
      }
    }

    try {
      const response = await axiosInstance.get(`/api/game/quiz/event/${eventId}`);
      const rawData = response.data?.data || response.data;
      const apiQuizzes = Array.isArray(rawData) ? rawData : [];

      const combined = [...apiQuizzes];
      for (const lq of localQuizzes) {
        const lqId = lq._id || lq.id;
        if (lqId && !combined.some(cq => (cq._id || cq.id) === lqId)) {
          combined.push(lq);
        }
      }

      if (typeof window !== 'undefined' && combined.length > 0) {
        try {
          localStorage.setItem(`eventeev_created_quizzes_${eventId}`, JSON.stringify(combined));
        } catch (_) {}
      }

      return combined;
    } catch (error: any) {
      const status = error.response?.status;
      const msg: string = error.response?.data?.message || '';
      if (status === 404 || status === 500 || msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no quiz')) {
        return localQuizzes;
      }
      console.warn('Failed to fetch event quizzes:', error?.message || error);
      return localQuizzes;
    }
  }

  async getSession(pin: string) {
    if (!pin) return null;
    try {
      const response = await axiosInstance.get(`/api/game/quiz/session/${pin}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.warn(`[QuizzesService] Could not fetch session for pin "${pin}":`, error?.message || error);
      return null;
    }
  }

  async startSession(pin: string) {
    if (!pin) throw new Error("PIN is required");
    try {
      const response = await axiosInstance.post(`/api/game/quiz/session/${pin}/start`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error(`[QuizzesService] Failed to start quiz session ${pin}:`, error?.message || error);
      throw error;
    }
  }

  async nextQuestion(pin: string) {
    if (!pin) throw new Error("PIN is required");
    try {
      const response = await axiosInstance.post(`/api/game/quiz/session/${pin}/next`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error(`[QuizzesService] Failed to advance quiz session ${pin}:`, error?.message || error);
      throw error;
    }
  }

  async revealAnswer(pin: string) {
    if (!pin) throw new Error("PIN is required");
    try {
      const response = await axiosInstance.post(`/api/game/quiz/session/${pin}/reveal`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error(`[QuizzesService] Failed to reveal answer for session ${pin}:`, error?.message || error);
      throw error;
    }
  }

  async endSession(pin: string) {
    if (!pin) throw new Error("PIN is required");
    try {
      const response = await axiosInstance.post(`/api/game/quiz/session/${pin}/end`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error(`[QuizzesService] Failed to end quiz session ${pin}:`, error?.message || error);
      throw error;
    }
  }
}

export const quizzesService = new QuizzesService();
export default quizzesService;



