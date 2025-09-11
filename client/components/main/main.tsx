import { Input } from "@heroui/input";
import Image from "next/image";
import { SearchIcon } from "../icons";
import { ArrowLeft, ArrowUpIcon } from "lucide-react";
import { Button } from "@heroui/button";
import Link from "next/link";
import { AddSection } from "./sections/add";

interface MainProfileMainProps {
  avatar?: string;
  memoji?: string;
}

export const MainProfileMain = ({ memoji, avatar }: MainProfileMainProps) => {
  return (
    <main className="flex flex-col items-center">
      <section>
        {avatar ? (
          <Image
            alt="avatar"
            className="rounded-full my-10 object-cover object-center"
            src={avatar}
            width={100}
            height={100}
          />
        ) : (
          <Image
            alt="memoji"
            src={`/imgs/memojis/male/6.png`}
            width={200}
            height={200}
          />
        )}
      </section>
      <section className="">
        <AddSection />
      </section>
    </main>
  );
};
