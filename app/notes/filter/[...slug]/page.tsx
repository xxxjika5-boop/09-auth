import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const currentTag = slug?.[0] ?? "all";

  return {
    title: `${currentTag} Notes | NoteHub`,
    description: `Browse notes filtered by ${currentTag}.`,
    openGraph: {
      title: `${currentTag} Notes | NoteHub`,
      description: `Browse notes filtered by ${currentTag}.`,
      url: `https://notehub.com/notes/filter/${currentTag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub application",
        },
      ],
    },
  };
}


interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function NotesPage({
  params,
}: NotesPageProps) {
  const { slug } = await params;

  const tag =
    slug?.[0] && slug[0] !== "all"
      ? slug[0]
      : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}