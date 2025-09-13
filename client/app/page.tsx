import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClientProfile from "../components/main/clientProfile";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth");
  }

  return <ClientProfile />;
}
