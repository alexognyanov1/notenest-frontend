"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Tag {
  id: string;
  name: string;
}

export default function UploadPage() {
  const [step, setStep] = useState<1 | 2>(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");

  const [predefinedTags, setPredefinedTags] = useState<Tag[]>([]);
  const [visibility, setVisibility] = useState<
    "private" | "unlisted" | "public"
  >("private");

  useEffect(() => {
    async function fetchPredefinedTags() {
      const res = await apiClient.get("/note-tags");

      if (res.status === 200 || res.status === 201) {
        setPredefinedTags(res.data as Tag[]);
      } else {
        console.error("Failed to fetch predefined tags");
      }

      console.log("Predefined tags:", predefinedTags);
    }

    fetchPredefinedTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTag = () => {
    if (!selectedTagId) return;

    const tagToAdd = predefinedTags.find((tag) => tag.id === selectedTagId);

    if (!tagToAdd) return;

    if (tags.some((tag) => tag.id === tagToAdd.id)) return;

    setTags([...tags, tagToAdd]);
    setSelectedTagId("");
  };

  const removeTag = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  const goToNextStep = () => {
    setStep(2);
  };

  const goToPreviousStep = () => {
    setStep(1);
  };

  const handleUpload = () => {
    const noteData = {
      title,
      description,
      tagIds: tags.map((tag) => tag.id),
      text: markdownContent,
      visibility,
    };

    apiClient.post("/notes", noteData).then((res) => {
      if (res.status === 200 || res.status === 201) {
        console.log("Note uploaded successfully:", res.data);
        window.location.href = "/notes/" + res.data.id;
      } else {
        console.error("Failed to upload note:", res.data);
      }
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Upload a New Note</h1>

      <div className="flex items-center mb-8">
        <div
          className={`rounded-full h-10 w-10 flex items-center justify-center ${
            step === 1
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          1
        </div>
        <div className="h-1 w-10 bg-muted mx-2"></div>
        <div
          className={`rounded-full h-10 w-10 flex items-center justify-center ${
            step === 2
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          2
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description of your note"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags
            </label>
            <div className="flex">
              <Select value={selectedTagId} onValueChange={setSelectedTagId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedTags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={addTag}
                className="ml-2"
                variant="outline"
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag.name}
                  <button
                    onClick={() => removeTag(tag.id)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-sm font-medium">Visibility</label>
            <RadioGroup
              value={visibility}
              onValueChange={(value) =>
                setVisibility(value as "private" | "unlisted" | "public")
              }
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <label
                    htmlFor="private"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Private - Only visible to you
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unlisted" id="unlisted" />
                  <label
                    htmlFor="unlisted"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Unlisted - Accessible via link only
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <label
                    htmlFor="public"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Public - Visible to everyone
                  </label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="pt-4">
            <Button onClick={goToNextStep} disabled={!title}>
              Next Step
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Button variant="outline" onClick={goToPreviousStep} className="mb-4">
            Back
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted px-4 py-2 border-b">
                <h3 className="text-sm font-medium">Markdown Editor</h3>
              </div>
              <Textarea
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                placeholder="Write your note content in markdown..."
                className="h-full rounded-none border-none resize-none p-4"
              />
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted px-4 py-2 border-b">
                <h3 className="text-sm font-medium">Preview</h3>
              </div>
              <div className="p-4 h-[calc(100%-41px)] overflow-auto prose dark:prose-invert">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {markdownContent || "Start typing to see the preview..."}
                </Markdown>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleUpload}>Upload Note</Button>
          </div>
        </div>
      )}
    </div>
  );
}
