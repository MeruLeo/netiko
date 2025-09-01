"use client";

import { useUser } from "@clerk/nextjs";
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
    <div>
      <h1>
        سلام، {localUser.firstName} {localUser.lastName}
      </h1>
      <p>ایمیل: {localUser.email}</p>
      <p>یوزرنیم: {localUser.username}</p>
      <p>{localUser.bio}</p>
      <p>نقش: {localUser.role ?? "ثبت نشده"}</p>
      <p>شماره تماس: {localUser.phone ?? "ثبت نشده"}</p>
    </div>
  );
}
