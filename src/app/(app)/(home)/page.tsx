"use client";

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
import { LayoutGrid, List, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ProjectEmptyState from "./components/ProjectEmptyState";
import ProjectFormDrawer from "./components/ProjectFormDrawer";

type Project = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "On Hold" | "Completed";
  issues: number;
  lastUpdated: string;
};

const projects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Overhaul of company website",
    status: "Active",
    issues: 23,
    lastUpdated: "2023-11-20",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "New iOS and Android app",
    status: "Active",
    issues: 15,
    lastUpdated: "2023-11-19",
  },
  {
    id: "3",
    name: "Database Migration",
    description: "Migrate from MySQL to PostgreSQL",
    status: "On Hold",
    issues: 7,
    lastUpdated: "2023-11-18",
  },
  {
    id: "4",
    name: "API Integration",
    description: "Integrate third-party APIs",
    status: "Completed",
    issues: 0,
    lastUpdated: "2023-11-17",
  },
  {
    id: "5",
    name: "Security Audit",
    description: "Annual security review",
    status: "Active",
    issues: 3,
    lastUpdated: "2023-11-16",
  },
];

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [itemToBeDeleted, setItemTobeDeleted] = useState<Project | null>(null);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || project.status === statusFilter)
  );

  return (
    <>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Projects</h1>

          {projects.length > 0 && (
            <ProjectFormDrawer
              onProjectCreate={(project) => alert(JSON.stringify(project))}
            />
          )}
        </div>
        {projects.length > 0 ? (
          <>
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
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

            {filteredProjects.length > 0 ? (
              viewMode === "table" ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Issues</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <Link href={`/${project.id}`}>{project.name}</Link>
                        </TableCell>
                        <TableCell>{project.description}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              project.status === "Active"
                                ? "default"
                                : project.status === "On Hold"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{project.issues}</TableCell>
                        <TableCell>{project.lastUpdated}</TableCell>
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
                  {filteredProjects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-2">
                          <Badge
                            variant={
                              project.status === "Active"
                                ? "default"
                                : project.status === "On Hold"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {project.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Last updated: {project.lastUpdated}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Issues: {project.issues}</span>
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
              )
            ) : (
              <ProjectEmptyState />
            )}
          </>
        ) : (
          <ProjectEmptyState />
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
              onClick={() => {
                alert("Project deleted");
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
