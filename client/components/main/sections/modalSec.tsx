import { AddNewSectionProps } from "@/types/main/newSec/addNewSec";
import { Button } from "@heroui/button";
import Link from "next/link";

export const ModalSec = ({ title, color, icon, href }: AddNewSectionProps) => {
  return (
    <Button
      radius="full"
      as={"a"}
      size="lg"
      className={`w-[10rem] flex justify-start border-2 border-gray3 bg-gray4`}
      href={href}
    >
      <div className={color}>{icon}</div>
      <p>{title}</p>
    </Button>
  );
};
