"use client";

import {
  createProject,
  deleteProject,
  updateProject,
} from "@/actions/projects.action";
import { Project } from "@/backend/persistence/schema";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { PaginationWrapper } from "@/components/PaginationWrapper";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryClient } from "@/lib/config/query-client";
import { PaginatedResponse } from "@/lib/models/app.model";
import { appFormatDate, getFileUrl } from "@/lib/utils";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import {
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  SquareKanban,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ProjectFormDrawer from "./ProjectFormDrawer";

const statusBadgeColorMap = {
  active: "bg-green-500",
  onHold: "bg-yellow-500",
  completed: "bg-red-500",
};

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
                    <TableRow key={project.id} data-project-id={project.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {project?.logoPath ? (
                            <div className="border-2 border-gray-200 rounded-md h-6 w-6 object-cover overflow-hidden">
                              <Image
                                src={getFileUrl(project?.logoPath)}
                                alt={project?.title + " logo"}
                                width={24}
                                height={24}
                              />
                            </div>
                          ) : (
                            <SquareKanban className="h-6 w-6" />
                          )}
                          <Link href={`/${project.id}`}>{project.title}</Link>
                        </div>
                      </TableCell>
                      <TableCell>124</TableCell>
                      <TableCell>
                        <label
                          className={clsx(
                            "px-2 py-0.5 text-xs text-white font-semibold rounded-sm",
                            {
                              "bg-green-500": project.status === "active",
                              "bg-yellow-500": project.status === "on-hold",
                              "bg-red-500": project.status === "completed",
                            }
                          )}
                        >
                          {project.status}
                        </label>
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
                  <Card key={project.id} data-project-id={project.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {project?.logoPath ? (
                            <div className="border-2 border-gray-200 rounded-md h-[26px] w-[26px] object-cover overflow-hidden">
                              <Image
                                src={getFileUrl(project?.logoPath)}
                                alt={project?.title + " logo"}
                                width={26}
                                height={26}
                              />
                            </div>
                          ) : (
                            <SquareKanban className="h-6 w-6" />
                          )}
                          <Link href={`/${project.id}`}>{project.title}</Link>
                        </div>
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
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-start gap-2">
                        <label
                          className={clsx(
                            "px-2 py-0.5 text-xs text-white font-semibold rounded-sm",
                            {
                              "bg-green-500": project.status === "active",
                              "bg-yellow-500": project.status === "on-hold",
                              "bg-red-500": project.status === "completed",
                            }
                          )}
                        >
                          {project.status}
                        </label>
                        <span className="text-sm text-muted-foreground">
                          Last updated: {appFormatDate(project?.updatedAt)}
                        </span>
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
      <ConfirmationDialog
        isOpen={!!itemToBeDeleted}
        onOpenChange={() => setItemTobeDeleted(null)}
        onConfirm={async () => {
          await deleteProject(itemToBeDeleted?.id as string);
          await queryClient.invalidateQueries({
            queryKey: ["projects"],
          });
          setItemTobeDeleted(null);
        }}
      />

      <ProjectFormDrawer
        isOpen={drawerOpened}
        prePopulatedProject={itemTobeEdited}
        onClose={drawerHandler.close}
        onSave={async (project) => {
          if (itemTobeEdited) {
            await updateProject({
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
