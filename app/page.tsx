"use client";

import { Note, NoteCard } from "@/components/note-card";
import { Filters } from "@/components/filters";
import { useEffect, useState } from "react";
import api from "@/api";

export interface NoteFilters {
  search?: string | null;
  matchAllTags: boolean;
  selectedTags: number[];
}

export default function Home() {
  const [filters, setFilters] = useState<NoteFilters>({
    search: null,
    matchAllTags: false,
    selectedTags: [],
  });

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotes = async (appliedFilters = filters) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      matchAll: appliedFilters.matchAllTags,
    };

    if (appliedFilters.search && appliedFilters.search.length > 0) {
      params.search = appliedFilters.search;
    }

    if (appliedFilters.selectedTags && appliedFilters.selectedTags.length > 0) {
      params.tagIds = appliedFilters.selectedTags;
    }

    const res = await api.get("/notes", { params });

    if (res.status === 200 || res.status === 201) {
      setNotes(res.data.data);
    }
  };

  const handleApplyFilters = (updatedFilters: NoteFilters) => {
    setFilters(updatedFilters);
    fetchNotes(updatedFilters);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Notes</h1>
        <p className="text-muted-foreground">
          Browse through our collection of helpful notes and resources
        </p>
      </header>

      <Filters filters={filters} onApply={handleApplyFilters} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
