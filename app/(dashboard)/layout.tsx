import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { DashboardHeader } from "@/components/Header";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    console.log("[DASHBOARD LAYOUT] User:", user ? "Logged in" : "Not logged in"); // DEBUG

    // if (!user) {
    //     console.log("[DASHBOARD LAYOUT] No user - redirecting to sign-in"); // DEBUG
    //     redirect("/sign-in");
    // }

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <main className="container mx-auto py-6">
                {children}
            </main>
        </div>
    );
}