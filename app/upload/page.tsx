"use client";
import { checkAuth } from "@/api";
import NoteUpload from "@/components/note-upload";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    checkAuth();
  }, []);

  return <NoteUpload />;
}
