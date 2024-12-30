import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Bug, Calendar, MoreHorizontal, Rocket, User } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { ItemStatus, ItemType } from "@/backend/persistence/schema";
import { appFormatDate } from "@/lib/utils";

interface AppItemCardProps {
  id: string;
  title: string;
  status: ItemStatus;
  type: ItemType;
  createdAt: Date;
  creatorName: string;
}

const AppItemCard: React.FC<AppItemCardProps> = ({
  title,
  createdAt,
  creatorName,
}) => {
  return (
    <div className="flex flex-col bg-card sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {/* <div className="w-4 h-4 bg-red-500 rounded" /> */}
          {/* <Bug className="w-5 h-5 text-red-500" /> */}
          <Bug className="w-5 h-5 text-red-500" />
          {/* <Rocket className="w-5 h-5 text-green-500" /> */}
          {/* <Rocket className="w-5 h-5 text-green-500" /> */}

          <span className="font-medium">123 - {title}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{appFormatDate(createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{creatorName}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-start gap-4 mt-2 sm:mt-0">
        <span className="text-blue-500 font-medium">In Progress</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Copy project ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View project</DropdownMenuItem>
            <DropdownMenuItem>Edit project</DropdownMenuItem>
            <DropdownMenuItem>Delete project</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AppItemCard;
