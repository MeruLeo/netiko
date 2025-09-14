import { Chip } from "@heroui/chip";
import { IUser } from "@/types/user";

type MainProfileHeaderProps = Pick<
  IUser,
  "openToWork" | "headLine" | "firstName" | "lastName" | "username"
>;

export const MainProfileHeader = ({
  openToWork,
  headLine,
  firstName,
  lastName,
  username,
}: MainProfileHeaderProps) => {
  return (
    <header className="flex gap-2 flex-col items-center">
      <Chip variant="faded" color={openToWork ? "success" : "warning"}>
        {openToWork ? "آزاد برای کار" : "درحال کار"}
      </Chip>
      <p>{headLine}</p>
      <h1 className="sm:text-6xl text-3xl font-bold">
        {firstName} {lastName}
      </h1>
      <Chip className="mt-4 bg-gradient-to-r from-indigo via-blue to-green border border-gray3">
        {username} @
      </Chip>
    </header>
  );
};
