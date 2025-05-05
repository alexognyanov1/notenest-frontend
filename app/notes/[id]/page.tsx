"use client";

import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Markdown from "react-markdown";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/api";
import { Note } from "@/components/note-card";
import NotFound from "@/app/not-found";

export default function NotePage() {
  const params = useParams();
  const { id } = params;

  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await api.get(`/notes/${id}`);

        if (res.status === 200 || res.status === 201) {
          setNote(res.data);
        } else {
          console.error("Failed to fetch note");
        }
      } catch {
        return null;
      }
    }

    if (id) {
      fetchNote();
    }
  }, [id]);

  if (note === null) {
    return <NotFound />;
  }

  const createdAtFormatted = formatDistanceToNow(new Date(note.createdAt), {
    addSuffix: true,
  });
  const updatedAtFormatted = formatDistanceToNow(new Date(note.updatedAt), {
    addSuffix: true,
  });

  const userInitials = `${note.user.firstName.charAt(
    0
  )}${note.user.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{note.title}</h1>
            <Badge variant="outline" className="capitalize">
              {note.visibility}
            </Badge>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <Avatar>
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {note.user.firstName} {note.user.lastName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            <span>Created {createdAtFormatted}</span>
            {note.createdAt !== note.updatedAt && (
              <span> · Updated {updatedAtFormatted}</span>
            )}
          </div>
        </div>

        {note.description && (
          <Card className="p-4 mb-6 border border-border/40 shadow-sm">
            <p className="text-muted-foreground">{note.description}</p>
          </Card>
        )}

        <div className="prose prose-stone max-w-none mt-8 p-6 bg-card rounded-lg border">
          <Markdown>{note.text}</Markdown>
        </div>
      </div>
    </div>
  );
}
