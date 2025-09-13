import { SignIn } from "@clerk/nextjs";

export default function AuthLoginPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          card: "bg-gray4",
          headerTitle: "text-foreground text-2xl",
          headerSubtitle: "text-gray",
          socialButtons: "",
          socialButtonsBlockButton__google: "bg-gray3 text-foreground",
          socialButtonsBlockButton__github: "bg-gray3 text-foreground",
          dividerLine: "bg-gray",
          dividerText: "text-gray",
          formFieldLabel: "text-gray",
          formFieldInput: "bg-gray3 text-foreground placeholder-gray",

          //   formFieldPlacehol
          formButtonPrimary: "bg-blue",
        },
      }}
    />
  );
}
