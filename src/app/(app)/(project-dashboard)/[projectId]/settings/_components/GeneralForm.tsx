import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { InferType } from "yup";

import { Project } from "@/backend/persistence/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { Loader } from "lucide-react";

interface GeneralFormProps {
  project: Project;
  onSave: (project: Project) => Promise<void>;
}

const GeneralForm: React.FC<GeneralFormProps> = ({ project, onSave }) => {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: "active",
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (project) {
      form.setValue("title", project?.title || "");
      form.setValue("description", project?.description || "");
      form.setValue("status", project?.status || "active");
    }
  }, [project]);

  return (
    <div className="flex flex-col gap-4 items-start">
      {/* <div>
        <Label>Project Logo</Label>
        <div className="mt-2 flex items-center gap-4">
          <div className="relative w-24 h-24 border rounded-lg overflow-hidden">
            {logo ? (
              <>
                <img
                  src={logo}
                  alt="Project logo"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setLogo(null)}
                  className="absolute top-1 right-1 p-1 bg-background/80 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="logo-upload"
              onChange={handleLogoUpload}
            />
            <Label htmlFor="logo-upload" className="cursor-pointer">
              <Button type="button" variant="outline" asChild>
                <span>Upload Logo</span>
              </Button>
            </Label>
          </div>
        </div>
      </div> */}

      <div>
        <Label htmlFor="name">Project Name</Label>
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

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          className="mt-2"
          {...form.register("description")}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="title"
          render={({ message }) => (
            <p className="text-destructive text-sm">{message}</p>
          )}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={form.watch("status") as "active" | "on-hold" | "completed"}
          onValueChange={(value: "active" | "on-hold" | "completed") =>
            form.setValue("status", value)
          }
        >
          <SelectTrigger id="project-status">
            <SelectValue placeholder="Select project status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <Loader className="animate-spin h-4 w-4 mr-2" />
        ) : null}
        Save
      </Button>
    </div>
  );
};

export default GeneralForm;

const validationSchema = yup.object({
  title: yup.string().required().label("Project name"),
  description: yup.string().nullable().optional().label("Description"),
  status: yup.string().nullable().optional().label("Status"),
});

type TForm = InferType<typeof validationSchema>;
