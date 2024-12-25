import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const AppHeader = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={"/"} className="text-xl font-semibold">
          osBugs
        </Link>
        <UserButton />
      </div>
    </header>
  );
};

export default AppHeader;
