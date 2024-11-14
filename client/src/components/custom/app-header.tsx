import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import React from "react";

const AppHeader = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={"/"} className="text-xl font-semibold">
          osBugs
        </Link>
        <Avatar>
          <AvatarImage src="/placeholder.svg" alt="User avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default AppHeader;
