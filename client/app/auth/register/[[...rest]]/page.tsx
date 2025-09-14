import { SignUp } from "@clerk/nextjs";

export default function AuthRegisterPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          card: "bg-gray4 rounded-none",
          headerTitle: "text-foreground text-2xl",
          headerSubtitle: "text-gray",
          socialButtons: "",
          socialButtonsBlockButton__google: "bg-gray3 text-foreground",
          socialButtonsBlockButton__github: "bg-gray3 text-foreground",
          dividerLine: "bg-gray",
          dividerText: "text-gray",
          formFieldLabel: "text-gray",
          formFieldInput: "bg-gray3 text-foreground placeholder-gray",
          formButtonPrimary: "bg-blue",
          footer: "",
          footerAction: "bg-gray4 w-full flex justify-center items-center",
          footerActionText: "text-foreground",
          footerActionLink: "text-link",
          formFieldSuccessText: "text-green",
          otpCodeFieldInput: "text-foreground focus:outline-foreground",
          otpCodeFieldInputs: "ltr-input",
          formResendCodeLink: "text-link",
          identityPreviewText: "text-gray",
          identityPreviewEditButton: "text-gray",
        },
      }}
    />
  );
}
