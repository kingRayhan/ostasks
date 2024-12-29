"use client";

import { Project } from "@/backend/persistence/schema";
import { PaginatedResponse } from "@/lib/models/app.model";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

interface Props {
  paginatedProjects: PaginatedResponse<Project>;
}
const MinimalProjectList: React.FC<Props> = ({ paginatedProjects }) => {
  const [page, setPage] = useState(1);

  const projectsQuery = useQuery({
    queryKey: ["projects", page],
    queryFn: async (): Promise<PaginatedResponse<Project>> => {
      const response = await fetch(`/api/projects?limit=2&page=${page}`);
      return response.json();
    },
    placeholderData: paginatedProjects,
  });

  return (
    <div>
      <h1 className=" underline">Client render PROPS</h1>
      <div>
        {paginatedProjects?.items?.map((project) => (
          <p key={project.id}>{project.title}</p>
        ))}
      </div>

      <h1 className=" underline">Client render RQ</h1>
      {projectsQuery?.data?.items?.map((project) => (
        <div key={project.id}>
          <p>{project.title}</p>
        </div>
      ))}

      {/* {projects?.map((project) => (
        <div key={project.id}>
          <p>{project.title}</p>
        </div>
      ))} */}

      <button onClick={() => setPage(page - 1)}>Prev</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
};

export default MinimalProjectList;
