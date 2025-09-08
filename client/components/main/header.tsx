import { Chip } from "@heroui/chip";

interface MainProfileHeaderProps {
  openToWork: boolean;
  headLine: string;
  firstName: string;
  lastName: string;
  username: string;
}

export const MainProfileHeader = ({
  openToWork,
  headLine,
  firstName,
  lastName,
  username,
}: MainProfileHeaderProps) => {
  return (
    <header className=" flex gap-2 flex-col items-center">
      <Chip variant="faded" color={openToWork ? "success" : "warning"}>
        {openToWork ? "آزاد برای کار" : "درحال کار"}
      </Chip>
      <p>{headLine}</p>
      <h2 className="sm:text-6xl text-3xl font-bold">
        {firstName} {lastName}
      </h2>
      <span>{username}@</span>
    </header>
  );
};
