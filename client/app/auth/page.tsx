import { title } from "@/components/primitives";
import { Ripple } from "@/components/ui/ripple";
import { SignIn, SignInButton, SignUp, SignUpButton } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import { LogIn, UserPlus } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <Ripple />
      </header>

      <main className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className={`${title({ color: "netiko" })} font-sf-pro-bold`}>
          نتیکو
          <span> | </span>
          <span className="font-sf-bold">Netiko</span>
        </h1>
        <div className="flex gap-0.5 mt-4 w-full">
          <p>ارتباط برقرار کنید، به نمایش بذارید، رشد کنید</p>
        </div>
        <div className="flex gap-2 round flex-col mt-4">
          <Button className="bg-blue">داستان خود را شروع کنید</Button>
          <Button className="bg-gray3" as={"a"} href="/auth/login">
            وارد شوید
          </Button>
        </div>
      </main>
    </div>
  );
}
