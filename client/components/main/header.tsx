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
      <h2 className="sm:text-6xl text-3xl font-bold">
        {firstName} {lastName}
      </h2>
      <Chip className="mt-4">{username} @</Chip>
    </header>
  );
};
