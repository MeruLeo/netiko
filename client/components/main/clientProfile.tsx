"use client";

import { MainProfileHeader } from "@/components/main/header";
import { MainProfileMain } from "@/components/main/main";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@heroui/button";

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
    <>
      {localUser.bio === "" ? (
        <div className="fixed flex flex-col items-center justify-center gap-4 z-[9999] m-4 p-4 rounded-3xl bg-gray4 bottom-0 ring-0">
          <p>هنوز کلی کار مونده که نکردی، شروع کن !</p>
          <Button
            radius="full"
            fullWidth
            className="bg-link"
            size={"sm"}
            as={"a"}
          >
            بزن بریم
          </Button>
        </div>
      ) : null}

      <section className="mb-[7rem] flex flex-col justify-center items-center gap-4">
        {localUser.bio === "" ? <div></div> : null}
        <MainProfileHeader
          firstName={localUser.firstName || ""}
          lastName={localUser.lastName || ""}
          headLine={localUser.headLine}
          openToWork={localUser.openToWork}
          username={localUser.username || ""}
        />
        <MainProfileMain avatar={user.imageUrl} memoji={localUser.memoji} />
      </section>
    </>
  );
}
