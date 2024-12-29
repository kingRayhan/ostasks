"use client";

import { Project } from "@/backend/persistence/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginatedResponse } from "@/lib/models/app.model";
import { appFormatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, List, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createProject, deleteProject } from "@/app/actions/projects.action";
import ProjectFormDrawer from "./ProjectFormDrawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProjectsPageProps {
  initialProjects: Project[];
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ initialProjects }) => {
  // const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [itemToBeDeleted, setItemTobeDeleted] = useState<Project | null>(null);

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<PaginatedResponse<Project>> => {
      const response = await fetch("/api/projects");
      return response.json();
    },
    initialData: {
      items: initialProjects,
      meta: {
        limit: 10,
        page: 1,
        total: 10,
      },
    },
  });

  return (
    <>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Projects</h1>

          <ProjectFormDrawer
            onProjectCreate={async (project) => {
              await createProject({
                title: project.title,
                description: project.description || "",
                status: project.status as "active" | "on-hold" | "completed",
              });
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div> */}
          {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select> */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Table view</span>
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
          </div>
        </div>

        {viewMode === "table" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Open Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectsQuery.data?.items?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <Link href={`/${project.id}`}>{project.title}</Link>
                  </TableCell>
                  <TableCell>124</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        project.status === "active"
                          ? "secondary"
                          : "destructive"
                      }
                      className="capitalize"
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{appFormatDate(project?.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View project</DropdownMenuItem>
                        <DropdownMenuItem>Edit project</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setItemTobeDeleted(project)}
                        >
                          Delete project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsQuery?.data?.items?.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>
                    <Link href={`/${project.id}`}>{project.title}</Link>
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <Badge
                      variant={
                        project.status === "active"
                          ? "secondary"
                          : "destructive"
                      }
                      className="capitalize"
                    >
                      {project.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Last updated: {appFormatDate(project?.updatedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    {/* <span>Issues: {project.issues}</span> */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View project</DropdownMenuItem>
                        <DropdownMenuItem>Edit project</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setItemTobeDeleted(project)}
                        >
                          Delete project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AlertDialog
        open={!!itemToBeDeleted}
        onOpenChange={() => setItemTobeDeleted(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this project?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={async () => {
                await deleteProject(itemToBeDeleted?.id as string);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectsPage;
