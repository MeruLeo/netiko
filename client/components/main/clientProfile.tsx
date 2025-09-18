"use client";

import { MainProfileHeader } from "@/components/main/header";
import { MainProfileMain } from "@/components/main/main";
import { Button } from "@heroui/button";

interface ClientProfileProps {
  user: {
    firstName: string;
    lastName: string;
    headLine: string;
    openToWork: boolean;
    username: string;
    bio: string;
    memoji?: string;
    avatar?: string;
  };
  isOwner: boolean;
}

export default function ClientProfile({ user, isOwner }: ClientProfileProps) {
  return (
    <section className="mb-[7rem] flex flex-col justify-center items-center gap-4">
      <MainProfileHeader
        firstName={user.firstName || ""}
        lastName={user.lastName || ""}
        headLine={user.headLine}
        openToWork={user.openToWork}
        username={user.username || ""}
      />

      <MainProfileMain avatar={user.avatar} memoji={user.memoji} />
    </section>
  );
}
