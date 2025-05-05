import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { UserIcon } from "lucide-react";
import Link from "next/link";

export interface Tag {
  id: number;
  name: string;
}

export interface NoteUser {
  firstName: string;
  lastName: string;
}

export interface Note {
  id: number;
  title: string;
  description: string;
  text: string;
  tags: Tag[];
  user: NoteUser;
  createdAt: string;
  updatedAt: string;
  visibility: "private" | "unlisted" | "public";
}

export interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link href={`/notes/${note.id}`} className="no-underline">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <h2 className="text-xl font-bold">{note.title}</h2>
          <p className="text-muted-foreground">{note.description}</p>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <UserIcon className="h-4 w-4 mr-2" />
            <span>
              {note.user.firstName} {note.user.lastName}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
