"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/auth-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Settings, LogOut, LayoutDashboard, ForkKnifeCrossed, SoupIcon, BatteryLowIcon, BarChartBigIcon } from "lucide-react";
import { toast } from "@/lib/toast";

interface UserMenuProps {
    user: {
        name: string;
        email: string;
    };
}

export function UserMenu({ user }: UserMenuProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await signOut();
            toast.success("Logged out successfully", "See you next time! 👋");
            setTimeout(() => {
                router.push("/sign-in");
                router.refresh();
            }, 1000);
        } catch (error) {
            toast.error("Logout failed", "Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="md:hidden" onClick={() => router.push("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4 " />
                    Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="md:hidden" onClick={() => router.push("/foods")}>
                    <ForkKnifeCrossed className="mr-2 h-4 w-4" />
                    Foods
                </DropdownMenuItem>
                <DropdownMenuItem className="md:hidden" onClick={() => router.push("/meals")}>
                    <SoupIcon className="mr-2 h-4 w-4" />
                    Meals
                </DropdownMenuItem>
                <DropdownMenuItem className="md:hidden" onClick={() => router.push("/analytics")}>
                    <BarChartBigIcon className="mr-2 h-4 w-4" />
                    Analytics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoading ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}