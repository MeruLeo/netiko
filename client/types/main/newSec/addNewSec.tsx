import {
  Award,
  BookOpenText,
  BriefcaseBusiness,
  Phone,
  PhoneCall,
  ScrollText,
  UserRound,
} from "lucide-react";
import React from "react";

export interface AddNewSectionProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

export const addNewSectionList: AddNewSectionProps[] = [
  {
    title: "درباره من",
    color: "text-red",
    icon: <UserRound />,
    href: "/about",
  },
  {
    title: "پروژه ها",
    color: "text-blue",
    icon: <BriefcaseBusiness />,
    href: "/about",
  },
  {
    title: "ارتباط",
    color: "text-green",
    icon: <PhoneCall />,
    href: "/about",
  },
  {
    title: "تحصیلات",
    color: "text-indigo",
    icon: <BookOpenText />,
    href: "/about",
  },
  {
    title: "تجربیات",
    color: "text-teal",
    icon: <ScrollText />,
    href: "/about",
  },
  {
    title: "افتخارات",
    color: "text-yellow",
    icon: <Award />,
    href: "/about",
  },
];
