"use client";

import { useEffect, useRef, useState } from "react";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import AvatarEditor from "react-avatar-editor";
import { Dialog } from "@headlessui/react";
import { Button } from "@heroui/button";
import Image from "next/image";
import { Input } from "@heroui/input";

export default function AvatarUploader() {
  const { fetchUser } = useAuthStore();
  const { user, uploadAvatar, deleteAvatar } = useProfileStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const editorRef = useRef<AvatarEditor>(null);
  const [scale, setScale] = useState(1.2);

  useEffect(() => {
    fetchUser();
    console.log(user);
  }, [fetchUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setIsOpen(true);
    }
  };

  const handleSave = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
      const response = await fetch(canvas);
      const blob = await response.blob();
      const file = new File([blob], "avatar.png", { type: "image/png" });
      await uploadAvatar(file);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <label className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer border-2 border-gray-600 hover:border-blue-500 transition">
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {user?.avatar ? (
          <Image
            src={`http://localhost:5000/${user.avatar}`}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            انتخاب آواتار
          </div>
        )}
      </label>

      {user?.avatar && (
        <Button variant="faded" onPress={deleteAvatar}>
          حذف آواتار
        </Button>
      )}

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] flex flex-col space-y-4">
            <AvatarEditor
              ref={editorRef}
              image={selectedImage as File}
              width={250}
              height={250}
              border={50}
              borderRadius={125}
              color={[255, 255, 255, 0.8]}
              scale={scale}
              rotate={0}
            />

            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="bordered" onPress={() => setIsOpen(false)}>
                لغو
              </Button>
              <Button onPress={handleSave}>تایید</Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
