import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { onBoard } from "@/features/auth/action/onboard";

export default async function Home() {
  await onBoard();

  return (
    <div>
      <h1>Hello, Next.js!</h1>
      <ModeToggle />
      <UserButton/>
    </div>
  );
}
