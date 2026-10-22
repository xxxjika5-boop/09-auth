import axios from "axios";
import type { Note } from "@/types/note";
import type { FetchNotesResponse } from "@/types/api";

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

// Получить список заметок
export async function fetchNotes({
  search = "",
  page = 1,
  tag,
}: {
  search?: string;
  page?: number;
  tag?: string;
}): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      search,
      page,
      ...(tag ? { tag } : {}),
    },
  });

  return response.data;
}

// Получить одну заметку
export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

// Создать заметку
export async function createNote(
  noteData: { title: string; content: string; tag: string }
): Promise<Note> {
  const response = await api.post<Note>("/notes", noteData);
  return response.data;
}

// Удалить заметку
export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}