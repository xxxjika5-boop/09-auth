
import axios from 'axios';

import { api } from './api';

import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import type { FetchNotesResponse } from '@/types/api';

interface AuthData {
  email: string;
  password: string;
}

interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
}

// ================= NOTES =================

export async function fetchNotes({
  search = '',
  page = 1,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>('/notes', {
    params: {
      search,
      page,
      perPage: 12,
      ...(tag ? { tag } : {}),
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);

  return response.data;
}

export async function createNote(noteData: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> {
  const response = await api.post<Note>('/notes', noteData);

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);

  return response.data;
}

// ================= AUTH =================

export async function register(credentials: AuthData): Promise<User> {
  const response = await api.post<User>('/auth/register', credentials);

  return response.data;
}

export async function login(credentials: AuthData): Promise<User> {
  const response = await api.post<User>('/auth/login', credentials);

  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<User | null> {
  try {
    const response = await api.get<User | null>('/auth/session');

    return response.data ?? null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function getMe(): Promise<User | null> {
  try {
    const response = await api.get<User>('/users/me');

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function updateMe(userData: Partial<User>): Promise<User> {
  const response = await api.patch<User>('/users/me', userData);

  return response.data;
}