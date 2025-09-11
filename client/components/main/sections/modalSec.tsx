import { AddNewSectionProps } from "@/types/main/newSec/addNewSec";
import Link from "next/link";

export const ModalSec = ({ title, color, icon, href }: AddNewSectionProps) => {
  return (
    <Link
      className={`bg-gray4 transition-all duration-200 hover:bg-gray3 justify-center items-center gap-2 flex flex-col w-[10rem] h-[8rem] text-2xl rounded-4xl`}
      href={href}
    >
      <div className={color}>{icon}</div>
      <p>{title}</p>
    </Link>
  );
};
