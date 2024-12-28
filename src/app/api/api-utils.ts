import { auth, clerkClient } from "@clerk/nextjs/server";

export const getAuthSession = async () => {
  const clerkAuth = await auth();
  const clerk = await clerkClient();

  if (clerkAuth.userId === null) {
    return null;
  }
  const user = await clerk?.users?.getUser(clerkAuth?.userId as string);

  return {
    authUserId: clerkAuth.userId as string,
    userId: user?.publicMetadata?.dbUserId as string,
  };
};
