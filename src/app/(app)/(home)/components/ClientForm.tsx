"use client";

import { createProject } from "@/app/actions/projects.action";
import { queryClient } from "@/common/config/query-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

interface Props {
  onCreate?: (data: { title: string; description: string }) => void;
}

const ClientForm: React.FC<Props> = ({ onCreate }) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleOnSubmit = async (data: React.FormEvent<HTMLFormElement>) => {
    data.preventDefault();
    // emit
    await createProject({
      title,
      description,
      status: "active",
    });

    // client task
    await queryClient.invalidateQueries({
      queryKey: ["projects"],
    });
  };

  return (
    <>
      <h1>Client Form</h1>
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-2">
        <Input
          name="title"
          placeholder="Project Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          name="description"
          placeholder="Project Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit">Create Project</Button>
      </form>
    </>
  );
};

export default ClientForm;
