import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  path: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export function useFileUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = useCallback((accept = ".pdf,.docx,.doc,.txt") => {
    if (!inputRef.current) {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;
      input.style.display = "none";
      document.body.appendChild(input);
      inputRef.current = input;
    }
    inputRef.current.accept = accept;
    inputRef.current.value = "";
    inputRef.current.click();

    return new Promise<File[]>((resolve) => {
      inputRef.current!.onchange = () => {
        const files = Array.from(inputRef.current!.files || []);
        resolve(files);
      };
    });
  }, []);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!user) {
        toast({ title: "Not authenticated", description: "Please sign in to upload files.", variant: "destructive" });
        return [];
      }

      setUploading(true);
      const results: UploadedFile[] = [];

      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          toast({ title: "File too large", description: `${file.name} exceeds 10MB limit.`, variant: "destructive" });
          continue;
        }

        const filePath = `${user.id}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from("documents").upload(filePath, file);

        if (error) {
          toast({ title: "Upload failed", description: `${file.name}: ${error.message}`, variant: "destructive" });
          continue;
        }

        const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath);

        results.push({
          name: file.name,
          path: filePath,
          size: file.size,
          type: file.type,
          url: urlData.publicUrl,
          uploadedAt: new Date().toISOString(),
        });
      }

      setUploadedFiles((prev) => [...prev, ...results]);
      setUploading(false);

      if (results.length > 0) {
        toast({ title: "Upload complete", description: `${results.length} file(s) uploaded successfully.` });
      }

      return results;
    },
    [user, toast]
  );

  const pickAndUpload = useCallback(
    async (accept?: string) => {
      const files = await openFilePicker(accept);
      if (files.length === 0) return [];
      return uploadFiles(files);
    },
    [openFilePicker, uploadFiles]
  );

  const removeFile = useCallback(
    async (path: string) => {
      const { error } = await supabase.storage.from("documents").remove([path]);
      if (error) {
        toast({ title: "Delete failed", description: error.message, variant: "destructive" });
        return;
      }
      setUploadedFiles((prev) => prev.filter((f) => f.path !== path));
    },
    [toast]
  );

  return { uploading, uploadedFiles, pickAndUpload, uploadFiles, removeFile, setUploadedFiles };
}
