import { SignIn } from "@clerk/nextjs";

export default function SigninPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          footer: "bg-none  [&>div:last-child]:hidden",
        },
      }}
    />
  );
}
