import { createProject } from "@/app/actions/projects.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const ServerForm = () => {
  const handleAction = async (data: FormData) => {
    "use server";
    await createProject({
      title: data.get("title") as string,
      description: data.get("description") as string,
      status: "active",
    });
  };

  return (
    <>
      <h1>Server Form</h1>
      <form action={handleAction}>
        <Input type="text" name="title" placeholder="Project Title" />
        <Textarea name="description" placeholder="Project Description" />
        <Button type="submit">Create Project</Button>
      </form>
    </>
  );
};

export default ServerForm;
