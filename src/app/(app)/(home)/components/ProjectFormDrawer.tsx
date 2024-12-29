import { Loader, Plus } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import * as yup from "yup";
import { InferType } from "yup";
// ---
import { yupResolver } from "@hookform/resolvers/yup";
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/backend/persistence/schema";
import { useFormStatus } from "react-dom";

type CreateProjectDrawerProps = {
  onSave: (project: TForm) => void;
  prePopulatedProject?: Project | null;
  isOpen?: boolean;
  isLoading?: boolean;
  onClose?: () => void;
};

function ProjectFormDrawer({
  onSave,
  isOpen,
  isLoading,
  onClose,
  prePopulatedProject,
}: CreateProjectDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { pending } = useFormStatus();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: "active",
    },
    resolver: yupResolver(validationSchema),
  });

  const handleSubmit: SubmitHandler<TForm> = (data) => {
    onSave(data);
    // closeRef.current?.click();
    // form.reset();
  };

  useEffect(() => {
    if (prePopulatedProject) {
      form.setValue("title", prePopulatedProject?.title || "");
      form.setValue("description", prePopulatedProject?.description || "");
      form.setValue("status", prePopulatedProject?.status || "active");
    }
  }, [prePopulatedProject]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </SheetTrigger> */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {prePopulatedProject ? "Edit Project" : "Create New"}
          </SheetTitle>
          <SheetDescription>
            Add a new project to your bug tracker. Fill out the details below.
          </SheetDescription>
        </SheetHeader>
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
              {...form.register("description")}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="project-status">Status</Label>
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
          <SheetFooter>
            <SheetClose ref={closeRef} />
            <Button type="submit">
              {/* {pending ? <Loader className="animate-spin h-2" /> : null} */}
              Save
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default ProjectFormDrawer;

const validationSchema = yup.object({
  title: yup.string().required().label("Project name"),
  description: yup.string().nullable().optional().label("Description"),
  status: yup.string().nullable().optional().label("Status"),
});

type TForm = InferType<typeof validationSchema>;
