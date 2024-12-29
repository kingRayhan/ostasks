"use client";

import { useDisclosure } from "@mantine/hooks";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/app/actions/projects.action";
import { Project } from "@/backend/persistence/schema";
import { queryClient } from "@/common/config/query-client";
import { PaginationWrapper } from "@/components/PaginationWrapper";
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
import { LayoutGrid, List, MoreHorizontal, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import ProjectFormDrawer from "./ProjectFormDrawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ProjectsPageProps {
  hydratedPaginatedProjects: PaginatedResponse<Project>;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({
  hydratedPaginatedProjects,
}) => {
  const searchParams = useSearchParams();

  const [page, setPage] = useState(hydratedPaginatedProjects?.meta?.page || 1);
  const [drawerOpened, drawerHandler] = useDisclosure(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [itemToBeDeleted, setItemTobeDeleted] = useState<Project | null>(null);
  const [itemTobeEdited, setItemTobeEdited] = useState<Project | null>(null);

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    setPage(page);
    params.set("page", page.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  const projectsQuery = useQuery({
    queryKey: ["projects", page, searchTerm, statusFilter],
    queryFn: async (): Promise<PaginatedResponse<Project>> => {
      const qs = new URLSearchParams();
      qs.set("limit", hydratedPaginatedProjects.meta.limit.toString());
      qs.set("page", page.toString());
      qs.set("search", searchTerm);
      qs.set("status", statusFilter);
      const response = await fetch(`/api/projects?${qs.toString()}`);
      return response.json();
    },
    placeholderData: hydratedPaginatedProjects,
  });

  return (
    <>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Projects</h2>

              <Button onClick={() => drawerHandler.open()}>
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
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
          </CardHeader>

          <CardContent>
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
                  {projectsQuery?.data?.items?.map((project) => (
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
                            <DropdownMenuItem
                              onClick={() => {
                                setItemTobeEdited(project);
                                drawerHandler.open();
                              }}
                            >
                              Edit project
                            </DropdownMenuItem>
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
          </CardContent>
        </Card>

        <div className="py-4">
          <PaginationWrapper
            totalItems={projectsQuery.data?.meta.total || 0}
            itemsPerPage={hydratedPaginatedProjects?.meta?.limit || 10}
            initialPage={hydratedPaginatedProjects?.meta?.page || 1}
            onPageChange={navigateToPage}
          />
        </div>
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
                await queryClient.invalidateQueries({
                  queryKey: ["projects"],
                });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProjectFormDrawer
        isOpen={drawerOpened}
        prePopulatedProject={itemTobeEdited}
        onClose={drawerHandler.close}
        onSave={async (project) => {
          if (itemTobeEdited) {
            updateProject({
              projectId: itemTobeEdited.id as string,
              payload: {
                title: project.title,
                description: project.description || "",
                status: project.status as "active" | "on-hold" | "completed",
              },
            });
          } else {
            await createProject({
              title: project.title,
              description: project.description || "",
              status: project.status as "active" | "on-hold" | "completed",
            });
          }

          setItemTobeEdited(null);

          await queryClient.invalidateQueries({
            queryKey: ["projects"],
          });
          drawerHandler.close();
        }}
      />
    </>
  );
};

export default ProjectsPage;
