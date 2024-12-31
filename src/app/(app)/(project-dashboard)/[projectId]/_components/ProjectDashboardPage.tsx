"use client";

import { bootstrapItem } from "@/app/actions/items.action";
import { ProjectItem } from "@/backend/persistence/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PaginatedResponse } from "@/lib/models/app.model";
import { useQuery } from "@tanstack/react-query";
import { Loader, Plus, Search, Settings, X } from "lucide-react";
import { redirect, usePathname } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import AppItemCard from "./AppItemCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

enum ItemStatus {
  Todo,
  InProgress,
  InReview,
  Closed,
}

const items = [
  { id: 1, name: "Item 1", status: ItemStatus.Todo, createdAt: new Date() },
  {
    id: 2,
    name: "Item 2",
    status: ItemStatus.InProgress,
    createdAt: new Date(),
  },
  { id: 3, name: "Item 3", status: ItemStatus.InReview, createdAt: new Date() },
  { id: 4, name: "Item 4", status: ItemStatus.Closed, createdAt: new Date() },
];

interface ProjectItemMatrix {
  allCount: number;
  todoCount: number;
  inProgressCount: number;
  inReviewCount: number;
  closedCount: number;
}
interface Props {
  projectId: string;
  matrix: ProjectItemMatrix;
  hydratedItems: PaginatedResponse<ProjectItem>;
}

const ProjectDashboardPage: React.FC<Props> = ({
  projectId,
  matrix,
  hydratedItems,
}) => {
  const pathName = usePathname();
  const [_, bootstrapItemAction, bootstrapItemActionPending] = useActionState(
    async (pre: any, fd: FormData) => {
      const result = await bootstrapItem(projectId);
      redirect(`/${projectId}/${result.itemId}/edit`);
    },
    {}
  );

  const [open, setOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    epic: "",
    status: "",
  });

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearAllFilters = () => {
    setFilters({ search: "", epic: "", status: "" });
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const itemQuery = useQuery({
    queryKey: ["items", projectId, filters],
    queryFn: async (): Promise<PaginatedResponse<ProjectItem>> => {
      const qs = new URLSearchParams();
      qs.set("limit", hydratedItems.meta.limit.toString());
      qs.set("projectId", projectId);
      // qs.set("page", page.toString());
      // qs.set("search", searchTerm);
      // qs.set("status", statusFilter);
      const response = await fetch(`/api/items?${qs.toString()}`);
      return response.json();
    },
    placeholderData: hydratedItems,
  });

  return (
    <>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 mb-8">
          {/* Search and filter */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Dinebd&apos;s issues</h2>
            <div className="flex gap-2">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search and filter</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side={isMobile ? "bottom" : "right"}
                  className={isMobile ? "h-[80%]" : ""}
                >
                  <SheetHeader>
                    <SheetTitle>Search and Filter</SheetTitle>
                    <SheetDescription>
                      Adjust your search criteria and filters here.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="search" className="text-sm font-medium">
                        Search
                      </label>
                      <Input
                        id="search"
                        placeholder="Search issues..."
                        className="w-full"
                        type="search"
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="epic" className="text-sm font-medium">
                        Epic
                      </label>
                      <Select
                        value={filters.epic}
                        onValueChange={(value) =>
                          handleFilterChange("epic", value)
                        }
                      >
                        <SelectTrigger id="epic">
                          <SelectValue placeholder="Select Epic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="bug">Bug</SelectItem>
                          <SelectItem value="improvement">
                            Improvement
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="status" className="text-sm font-medium">
                        Status
                      </label>
                      <Select
                        value={filters.status}
                        onValueChange={(value) =>
                          handleFilterChange("status", value)
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="in-review">In Review</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-4">
                    <Button onClick={() => setOpen(false)}>
                      Apply Filters
                    </Button>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <form action={bootstrapItemAction}>
                <Button disabled={bootstrapItemActionPending}>
                  {bootstrapItemActionPending ? (
                    <Loader className="animate-spin h-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Add New
                </Button>
              </form>

              <Button variant="outline" asChild size={"icon"}>
                <Link href={`${pathName}/settings`}>
                  <Settings className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm font-medium">Active filters:</span>
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {filters.search}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => clearFilter("search")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Clear search filter</span>
                  </Button>
                </Badge>
              )}
              {filters.epic && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Epic: {filters.epic}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => clearFilter("epic")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Clear epic filter</span>
                  </Button>
                </Badge>
              )}
              {filters.status && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {filters.status}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => clearFilter("status")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Clear status filter</span>
                  </Button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Dashbard matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Total Issues
            </div>
            <div className="text-3xl font-bold">{matrix.allCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              In Progress
            </div>
            <div className="text-3xl font-bold">{matrix.inProgressCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              In Review
            </div>
            <div className="text-3xl font-bold">{matrix.inReviewCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Closed
            </div>
            <div className="text-3xl font-bold">{matrix.closedCount}</div>
          </Card>
        </div>

        <div className="space-y-2">
          {itemQuery.data?.items?.map((item) => (
            <AppItemCard
              key={item.id}
              id={item.id as string}
              title={item?.title || ""}
              status={item?.status as any}
              createdAt={item?.createdAt as Date}
              creatorName={(item as any)["creator"].username}
              type={item.type as any}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default ProjectDashboardPage;
