import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="">
      <UserButton
        appearance={{
          elements: {
            userButtonPopoverCard: "w-72",
            userButtonPopoverFooter: "hidden",
          },
        }}
      />
    </div>
  );
}
