import { getCurrentUser } from "@/lib/auth/session";
import { UserMenu } from "./UserMenu";
import Image from "next/image";
import Link from "next/link";


export async function DashboardHeader() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-4">

        <div className="flex items-center space-x-4">
          <Image src="/Logo.png" width={170} height={20} alt="NutriLog" />
        </div>
        <div className="flex items-center space-x-4">

          <nav className="hidden md:flex justify-around gap-5 text-md font-semibold">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/foods">Foods</Link>
            <Link href="/meals">Meals</Link>
            <Link href="/analytics">Analytics</Link>
          </nav>

          <div className="hidden md:block">
            <p className="text-md font-semibold text-[#896ffd]">
              Welcome, {user.name}!
            </p>
          </div>
          <UserMenu user={user} />
        </div>
      </div>
    </header>

  );
}