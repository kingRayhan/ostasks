import { SignIn } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <div className=" h-screen grid place-content-center">
      <SignIn />
    </div>
  );
};

export default page;
