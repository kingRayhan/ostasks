"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoveLeft, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { updateProject } from "@/actions/projects.action";
import { Project } from "@/backend/persistence/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import GeneralForm from "./GeneralForm";
import Link from "next/link";

interface ProjectSettingPageProps {
  project: Project;
}

const ProjectSettingsPage: React.FC<ProjectSettingPageProps> = ({
  project,
}) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link href={`/${project.id}`}>
              <MoveLeft />
            </Link>
            <h2 className="text-2xl font-bold">
              {project.title} project settings
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="epics">Epics</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <GeneralForm
                project={project}
                onSave={async (_project) => {
                  await toast.promise(
                    updateProject({
                      projectId: project.id,
                      payload: { ..._project, logoPath: _project.logoPath },
                    }),
                    {
                      loading: "Updating...",
                      success: "Updated successfully",
                      error: "Failed to update",
                    }
                  );
                }}
              />
            </TabsContent>

            <TabsContent value="epics" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Project Epics</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Epic
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issues</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Frontend Development</TableCell>
                    <TableCell>
                      <Badge>In Progress</Badge>
                    </TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>2023-11-15</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Backend API</TableCell>
                    <TableCell>
                      <Badge variant="outline">Planning</Badge>
                    </TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>2023-11-14</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>User Authentication</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Completed</Badge>
                    </TableCell>
                    <TableCell>12</TableCell>
                    <TableCell>2023-11-10</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Project Members</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Assigned Issues</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">John Doe</div>
                          <div className="text-sm text-muted-foreground">
                            john@example.com
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Admin</Badge>
                    </TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>2 hours ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Jane Smith</div>
                          <div className="text-sm text-muted-foreground">
                            jane@example.com
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Developer</Badge>
                    </TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>1 day ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>RJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Robert Johnson</div>
                          <div className="text-sm text-muted-foreground">
                            robert@example.com
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Designer</Badge>
                    </TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>3 days ago</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
};

export default ProjectSettingsPage;
