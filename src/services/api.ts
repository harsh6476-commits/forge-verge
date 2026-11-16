import {
  DailyPlan,
  Milestone,
  ProgressSummary,
  AppNotification,
  CurriculumListResponse,
  CurriculumItemDetail,
} from '../types/api';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    let errMessage = 'Request failed';
    try {
      const err = await res.json();
      errMessage = err.error || errMessage;
    } catch {
      // fallback
    }
    const error = new Error(errMessage) as Error & { status: number };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export const api = {
  // Access Gate
  async checkSession(): Promise<{ authenticated: boolean; expiresAt?: string }> {
    return fetchJson('/access/session');
  },

  async unlock(pin: string): Promise<{ success: boolean; expiresAt: string }> {
    return fetchJson('/access/unlock', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
  },

  async lock(): Promise<{ success: boolean }> {
    return fetchJson('/access/lock', { method: 'POST' });
  },

  // Daily Plans
  async getTodayPlan(): Promise<DailyPlan> {
    return fetchJson('/days/today');
  },

  async getPlanByDate(date: string): Promise<DailyPlan> {
    return fetchJson(`/days?date=${date}`);
  },

  async updateItemCompletion(date: string, itemId: string, completed: boolean): Promise<{ plan: DailyPlan }> {
    return fetchJson(`/days/${date}/items/${itemId}/completion`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  },

  async updateSubtopicCompletion(date: string, itemId: string, subtopicId: string, completed: boolean): Promise<{ plan: DailyPlan }> {
    return fetchJson(`/days/${date}/items/${itemId}/subtopics/${subtopicId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  },

  async updateNotes(date: string, itemId: string, notes: string): Promise<{ success: boolean; notes: string }> {
    return fetchJson(`/days/${date}/items/${itemId}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    });
  },

  // Progress Summary
  async getProgressSummary(): Promise<ProgressSummary> {
    return fetchJson('/progress/summary');
  },

  async getProgressHistory(): Promise<DailyPlan[]> {
    return fetchJson('/progress/history');
  },

  // Milestones
  async getMilestones(): Promise<Milestone[]> {
    return fetchJson('/milestones');
  },

  async updateMilestoneNotes(id: string, notes: string): Promise<Milestone> {
    return fetchJson(`/milestones/${id}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    });
  },

  // Curriculum Catalog
  async getCurriculumList(params: {
    phase?: number;
    week?: number;
    category?: string;
    kind?: string;
    status?: string;
    q?: string;
    cursor?: number;
    limit?: number;
  } = {}): Promise<CurriculumListResponse> {
    const qs = new URLSearchParams();
    if (params.phase != null) qs.set('phase', String(params.phase));
    if (params.week != null) qs.set('week', String(params.week));
    if (params.category) qs.set('category', params.category);
    if (params.kind) qs.set('kind', params.kind);
    if (params.status) qs.set('status', params.status);
    if (params.q) qs.set('q', params.q);
    if (params.cursor != null) qs.set('cursor', String(params.cursor));
    if (params.limit != null) qs.set('limit', String(params.limit));
    const query = qs.toString();
    return fetchJson(`/curriculum${query ? `?${query}` : ''}`);
  },

  async getCurriculumItemDetails(itemId: string): Promise<CurriculumItemDetail> {
    return fetchJson(`/curriculum/${encodeURIComponent(itemId)}`);
  },

  // Attachments
  async uploadAttachment(date: string, itemId: string, file: File): Promise<{ success: boolean; attachment: any }> {
    const formData = new FormData();
    formData.append('date', date);
    formData.append('itemId', itemId);
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/attachments`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Upload failed');
    }

    return res.json();
  },

  async deleteAttachment(publicId: string, date: string, itemId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/attachments/${encodeURIComponent(publicId)}?date=${date}&itemId=${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Delete failed');
  },

  // Notifications
  async getNotifications(): Promise<AppNotification[]> {
    return fetchJson('/notifications');
  },

  async markNotificationRead(id: string): Promise<void> {
    return fetchJson(`/notifications/${id}/read`, { method: 'PATCH' });
  },
};
