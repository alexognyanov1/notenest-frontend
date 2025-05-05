"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Tag } from "./note-card";
import api from "@/api";
import { NoteFilters } from "@/app/page";

export function Filters({
  filters,
  onApply,
}: {
  filters: NoteFilters;
  onApply: (filters: NoteFilters) => void;
}) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [localFilters, setLocalFilters] = useState<NoteFilters>(filters);

  useEffect(() => {
    async function fetchTags() {
      const res = await api.get("/note-tags");
      if (res.status === 200 || res.status === 201) {
        setTags(res.data);
      }
    }

    fetchTags();
  }, []);

  const handleTagToggle = (tagId: number) => {
    const updatedTags = localFilters.selectedTags.includes(tagId)
      ? localFilters.selectedTags.filter((id) => id !== tagId)
      : [...localFilters.selectedTags, tagId];

    setLocalFilters({
      ...localFilters,
      selectedTags: updatedTags,
    });
  };

  const handleApplyFilters = () => {
    onApply(localFilters);
  };

  return (
    <div className="bg-muted/40 rounded-lg p-4 mb-6">
      <h2 className="text-lg font-medium mb-4">Filters</h2>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search notes..."
            className="pl-9"
            value={localFilters.search ?? ""}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, search: e.target.value })
            }
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="match-all-tags"
            checked={localFilters.matchAllTags}
            onCheckedChange={(checked) =>
              setLocalFilters({
                ...localFilters,
                matchAllTags: checked === true,
              })
            }
          />
          <label
            htmlFor="match-all-tags"
            className="text-sm font-medium leading-none"
          >
            Match all tags
          </label>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={
                  localFilters.selectedTags.includes(tag.id)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={handleApplyFilters} className="w-full sm:w-auto">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
