import AppHeader from "@/components/custom/app-header";
import React, { PropsWithChildren } from "react";

const AppLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  return (
    <>
      <AppHeader />

      <main>{children}</main>
    </>
  );
};

export default AppLayout;
