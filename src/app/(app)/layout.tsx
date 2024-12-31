import AppHeader from "@/components/custom/app-header";
import React, { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

const AppLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  return (
    <>
      <AppHeader />
      <Toaster />
      <main>{children}</main>
    </>
  );
};

export default AppLayout;
