"use client";
import React, { use, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
//---
import {
  ItemStatus,
  ItemType,
  ProjectItem,
} from "@/backend/persistence/schema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@hookform/error-message";
import { Loader, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { updateItem } from "@/actions/items.action";
import useFileUpload from "@/hooks/useFileUpload";

interface Props {
  item: ProjectItem;
  projectId: string;
}

const ItemEditorForm: React.FC<Props> = ({ item }) => {
  const filePickerRef = useRef<HTMLInputElement>(null);
  const { uploadFiles, deleteFiles } = useFileUpload(
    `items/${item.id}/attachments/`
  );

  const [attachments, setAttachments] = useState<(string | File)[]>(
    item?.attachments || []
  );
  const [keysToDelete, setKeysToDelete] = useState<string[]>([]);

  const getFileUrl = (file: File | string) => {
    if (typeof file === "string") {
      return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${file}`;
    }
    return URL.createObjectURL(file);
  };

  const form = useForm({
    defaultValues: {
      title: item?.title || "",
      body: item?.body || "",
      status: item?.status || "",
      type: item?.type || "",
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    // form.setValue("title", item?.title || "");
    // form.setValue("body", item?.body || "");
    // form.setValue("status", item?.status);
    // form.setValue("type", item?.type);
  }, [item]);

  const handleSubmit = async (data: TForm) => {
    if (attachments.length) {
      const preUploadedFileKeys = attachments.filter(
        (attachment) => typeof attachment === "string"
      );

      const uploadedFiles = (
        await uploadFiles(
          attachments.filter((attachment) => attachment instanceof File)
        )
      )?.map((file) => file.key);

      data["attachments"] = [
        ...preUploadedFileKeys,
        ...(uploadedFiles || []),
      ] as string[];
    }

    if (keysToDelete.length) {
      await deleteFiles(keysToDelete);
    }

    // uploadFile()
    await toast.promise(
      updateItem(item.id, {
        ...data,
        attachments: (data?.attachments as string[]) || [],
      }),
      {
        loading: "Saving...",
        success: "Item saved successfully!",
        error: "Failed to save item",
      }
    );
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (items?.length) {
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            console.log(file);
            if (file) {
              setAttachments([...attachments, ...URL.createObjectURL(file)]);
            }
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <Card>
      <pre>{JSON.stringify(item, null, 2)}</pre>
      {/* <pre>{JSON.stringify(attachments, null, 2)}</pre> */}
      <CardContent>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 mt-4"
        >
          <div className="space-y-1">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              {...form.register("title")}
            />
            <ErrorMessage
              errors={form.formState.errors}
              name="title"
              render={({ message }) => (
                <p className="text-destructive text-sm">{message}</p>
              )}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Enter project description"
              {...form.register("body")}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="project-description">Attachments</Label>
            <div className="flex flex-col gap-2">
              {attachments.map((attachment, key) => (
                <div key={key} className="flex gap-2 items-center">
                  <p>{key + 1}</p>
                  <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={getFileUrl(attachment)}
                      alt="Attachment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      setAttachments(
                        attachments.filter((a) => a !== attachment)
                      );
                      setKeysToDelete((prev) => [
                        ...keysToDelete,
                        attachment as string,
                      ]);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2 items-center">
                <input
                  type="file"
                  ref={filePickerRef}
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setAttachments([...attachments, ...files]);
                    // setAttachments([...attachments, ...files]);
                  }}
                />
                <Button
                  className="p-0 bg-slate-100 px-4"
                  type="button"
                  onClick={() => filePickerRef.current?.click()}
                  variant={"link"}
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  Upload attachment
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="project-status">Status</Label>
            <Select
              value={form.watch("status") as "active" | "on-hold" | "completed"}
              onValueChange={(value) =>
                form.setValue("status", value, { shouldDirty: true })
              }
            >
              <SelectTrigger id="project-status">
                <SelectValue placeholder="Select item status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ItemStatus).map((status) => (
                  <SelectItem
                    key={status}
                    className="capitalize"
                    value={status}
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="project-type">Type</Label>
            <Select
              value={form.watch("type") as any}
              onValueChange={(value) =>
                form.setValue("type", value, { shouldDirty: true })
              }
            >
              <SelectTrigger id="project-type">
                <SelectValue placeholder="Select item type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ItemType).map((type) => (
                  <SelectItem key={type} className="capitalize" value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader className="animate-spin h-4 w-4 mr-2" />
            ) : null}
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ItemEditorForm;

const validationSchema = yup.object({
  title: yup.string().required().label("Item name"),
  body: yup.string().required().label("Item description"),
  status: yup.string().nullable().optional().label("Status"),
  type: yup.string().nullable().optional().label("Status"),
  attachments: yup.array().of(yup.string()).label("Attachments"),
});

type TForm = yup.InferType<typeof validationSchema>;
