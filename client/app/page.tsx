import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClientProfile from "../components/main/clientProfile";
import { Button } from "@heroui/button";
import { UserRound } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  console.log(userId);

  return <h1>Netiko</h1>;
}
