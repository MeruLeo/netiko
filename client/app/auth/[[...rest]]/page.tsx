import { title } from "@/components/primitives";
import { SignIn, SignInButton, SignUp, SignUpButton } from "@clerk/nextjs";
import { Button } from "@heroui/button";

export default function AuthPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className={title()}>Auth</h1>
      <div className="flex gap-4">
        <SignInButton>
          <Button>وارد شوید</Button>
        </SignInButton>
        <SignUpButton>
          <Button>ثبت نام کنید</Button>
        </SignUpButton>
      </div>
      <SignUp />
    </div>
  );
}
