import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClientProfile from "../components/main/clientProfile";

export default async function UserPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth");
  }

  return <ClientProfile />;
}
