"use client";

import { MainProfileHeader } from "@/components/main/header";
import { MainProfileMain } from "@/components/main/main";
import { sfBold } from "@/config/fonts";
import { useUser } from "@clerk/nextjs";
import { Divide } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { isSignedIn } = useUser();
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    if (isSignedIn) {
      fetch("http://localhost:5000/v1/auth/me", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) setLocalUser(data.user);
        });
    }
  }, [isSignedIn]);

  if (!isSignedIn) return <div>لطفاً وارد شوید</div>;
  if (!localUser) return <div>در حال بارگذاری...</div>;

  return (
    <section className="mb-[7rem] flex flex-col justify-center items-center gap-4">
      <MainProfileHeader
        firstName={localUser.firstName}
        lastName={localUser.lastName}
        headLine={localUser.headLine}
        openToWork={localUser.openToWork}
        username={localUser.username}
      />
      <MainProfileMain avatar={localUser.avatar} />
    </section>
  );
}
