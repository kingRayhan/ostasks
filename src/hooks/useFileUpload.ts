import { useState } from "react";
import toast from "react-hot-toast";

interface UploadResponse {
  url: string;
  key: string;
}

const useFileUpload = (directory = "") => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (
    files: File[]
  ): Promise<UploadResponse[] | null> => {
    setIsUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const signedUrlResponse = await fetch("/api/storage/signed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: `${directory}${file.name}`,
            contentType: file.type,
          }),
        });
        if (!signedUrlResponse.ok) {
          const error = await signedUrlResponse.json();
          toast.error(error.error || "Failed to get upload URL");
          throw new Error(error.error || "Failed to get upload URL");
        }

        const { uploadUrl, key } = await signedUrlResponse.json();
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        if (!uploadResponse.ok) {
          toast.error("Failed to upload file");
          throw new Error("Failed to upload file");
        }

        const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
        uploaded.push({
          url: publicUrl,
          key: key,
        });
      }

      return uploaded;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
      return null;
    } finally {
      setIsUploading(false);
    }

    return null;
  };

  const deleteFiles = async (keys: string[]) => {
    setIsUploading(true);
    try {
      // Get signed URL
      await fetch("/api/storage/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keys: keys,
        }),
      });
    } catch (error) {
      return null;
    } finally {
      setIsUploading(false);
    }

    return null;
  };

  return { uploadFiles, isUploading, deleteFiles };
};
export default useFileUpload;
