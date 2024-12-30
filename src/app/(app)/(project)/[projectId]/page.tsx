import React from "react";
import ProjectDashboardPage from "./_components/ProjectDashboardPage";
import { NextPage } from "next";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const page: NextPage<Props> = async ({ params }) => {
  const _params = await params;

  return <ProjectDashboardPage projectId={_params.projectId} />;
};

export default page;
