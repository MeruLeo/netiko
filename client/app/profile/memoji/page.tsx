"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { title } from "@/components/primitives";
import { Button } from "@heroui/button";
import { useProfileStore } from "@/stores/profile";
import { useUser } from "@clerk/nextjs"; // Clerk hook برای گرفتن یوزر
import { IUser } from "@/types/user";
import { redirect } from "next/navigation";

const memojis = [
  "/imgs/memojis/male/1.png",
  "/imgs/memojis/male/2.png",
  "/imgs/memojis/male/3.png",
  "/imgs/memojis/male/4.png",
  "/imgs/memojis/male/5.png",
  "/imgs/memojis/male/6.png",
  "/imgs/memojis/female/1.png",
  "/imgs/memojis/female/2.png",
  "/imgs/memojis/female/3.png",
  "/imgs/memojis/female/4.png",
  "/imgs/memojis/female/5.png",
  "/imgs/memojis/female/6.png",
];

export default function ProfilePage() {
  const [selected, setSelected] = useState<string | null>(null);

  const { user: clerkUser, isLoaded, isSignedIn } = useUser();

  const { user, setUser, setMemoji } = useProfileStore();

  const handleConfirm = async () => {
    if (!selected) return;
    await setMemoji(selected);
    console.log("✅ میموجی جدید ذخیره شد:", selected);
    redirect("/");
  };

  if (!isLoaded) return <div>در حال بارگذاری...</div>;
  if (!isSignedIn) return <div>لطفاً وارد حساب شوید.</div>;

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className={title()}>یک میموجی انتخاب کنید</h1>

      {/* نمایش انتخاب شده */}
      <div className="w-32 h-32 relative">
        {selected ? (
          <Image
            src={selected}
            alt="Selected Memoji"
            fill
            className="object-contain rounded-full bg-gray4 border-2 border-gray2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 border-2 border-dashed rounded-full">
            انتخاب نشده
          </div>
        )}
      </div>

      {/* لیست میموجی‌ها */}
      <div className="grid grid-cols-4 gap-4">
        {memojis.map((memoji, idx) => (
          <Button
            key={idx}
            isIconOnly
            variant="flat"
            onPress={() => setSelected(memoji)}
            className={`w-16 h-16 relative rounded-full overflow-hidden border-2 ${
              selected === memoji ? "border-blue-500" : "border-transparent"
            }`}
          >
            <Image
              src={memoji}
              alt={`memoji-${idx}`}
              fill
              className="object-contain"
            />
          </Button>
        ))}
      </div>

      {/* دکمه تایید */}
      <Button
        fullWidth
        color="primary"
        onPress={handleConfirm}
        isDisabled={!selected}
        className="mt-4 mb-8"
      >
        تایید
      </Button>
    </div>
  );
}
