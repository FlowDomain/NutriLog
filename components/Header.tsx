import { getCurrentUser } from "@/lib/auth/session";
import { UserMenu } from "./UserMenu";
import Image from "next/image";


export async function DashboardHeader() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Image src="/Logo.png" width={170} height={20} alt="NutriLog"/>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <p className="text-sm font-medium">Welcome, {user.name}!</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}