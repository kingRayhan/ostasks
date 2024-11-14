import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus } from "lucide-react";

type Project = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "On Hold" | "Completed";
  issues: number;
  lastUpdated: string;
};

type CreateProjectDrawerProps = {
  onProjectCreate: (project: Project) => void;
};

function ProjectFormDrawer({ onProjectCreate }: CreateProjectDrawerProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Active" | "On Hold" | "Completed">(
    "Active"
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      status,
      issues: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    onProjectCreate(newProject);
    setName("");
    setDescription("");
    setStatus("Active");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Project</SheetTitle>
          <SheetDescription>
            Add a new project to your bug tracker. Fill out the details below.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="project-status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: "Active" | "On Hold" | "Completed") =>
                setStatus(value)
              }
            >
              <SelectTrigger id="project-status">
                <SelectValue placeholder="Select project status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Create Project</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default ProjectFormDrawer;
