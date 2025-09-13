"use client";

import { MainProfileHeader } from "@/components/main/header";
import { MainProfileMain } from "@/components/main/main";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth";

export default function ClientProfile() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { user: localUser, fetchUser } = useAuthStore();

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUser();
    }
  }, [isSignedIn, user, fetchUser]);

  if (!isLoaded) return <div>در حال بررسی ورود...</div>;
  if (!isSignedIn) return <div>لطفاً وارد شوید</div>;
  if (!localUser) return <div>اطلاعات کاربر یافت نشد</div>;

  return (
    <section className="mb-[7rem] flex flex-col justify-center items-center gap-4">
      <MainProfileHeader
        firstName={localUser.firstName || ""}
        lastName={localUser.lastName || ""}
        headLine={localUser.headLine}
        openToWork={localUser.openToWork}
        username={localUser.username || ""}
      />
      <MainProfileMain avatar={user.imageUrl} />
    </section>
  );
}
