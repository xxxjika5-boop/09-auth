"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import Link from "next/link";

import NoteList from "@/components/NoteList/NoteList";
import SearchBox, {
  SearchBoxRef,
} from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";


import css from "./Notes.module.css";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({
  tag,
}: NotesClientProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const searchRef = useRef<SearchBoxRef>(null);
  const [debouncedSearch] = useDebounce(search, 300);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        search: debouncedSearch,
        page,
        tag,
      }),
    placeholderData: (prev) => prev,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError) {
    return <p>Something went wrong.</p>;
  }

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.actions}>
          <SearchBox
            ref={searchRef}
            onChange={handleSearchChange}
          />
          {(data?.totalPages ?? 1) > 1 && (
            <Pagination
              page={page}
              totalPages={data?.totalPages ?? 1}
              onPageChange={setPage}
            />
          )}
          <Link
            href="/notes/action/create"
            className={css.createButton}
          >
            Create note +
          </Link>
        </div>
        <NoteList notes={data?.notes ?? []} />
      </div>
    </main>
  );
}