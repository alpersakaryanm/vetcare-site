import { prisma } from "@/lib/prisma";
import UserManagementClient from "./UserManagementClient";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <UserManagementClient initialUsers={users} />
  );
}
