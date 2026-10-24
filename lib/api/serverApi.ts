import { cookies } from 'next/headers';
import { api } from './api';

import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import type { FetchNotesResponse } from '@/types/api';

interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
}

async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore.toString();
}

export async function fetchNotes({
  search = '',
  page = 1,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const cookieHeader = await getCookieHeader();

  const response = await api.get('/notes', {
    headers: {
      Cookie: cookieHeader,
    },
    params: {
      search,
      page,
      perPage: 12,
      ...(tag ? { tag } : {}),
    },
  });

  return response.data;
}

export async function fetchNoteById(
  id: string
): Promise<Note> {
  const cookieHeader = await getCookieHeader();

  const response = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
}

export async function checkSession(
  cookieHeader?: string
) {
  const cookie = cookieHeader ?? (await getCookieHeader());

  const response = await api.get('/auth/session', {
    headers: {
      Cookie: cookie,
    },
  });

  return response;
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
}