import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="space-y-6 pr-5 pl-5">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Track your meals and monitor your progress
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Dashboard cards will go here */}
                <div className="rounded-lg border p-4">
                    <h3 className="font-semibold">Today's Calories</h3>
                    <p className="text-2xl font-bold">0 / 2000</p>
                </div>
                <div className="rounded-lg border p-4">
                    <h3 className="font-semibold">Meals Logged</h3>
                    <p className="text-2xl font-bold">0</p>
                </div>
                <div className="rounded-lg border p-4">
                    <h3 className="font-semibold">Average Grade</h3>
                    <p className="text-2xl font-bold">-</p>
                </div>
                <div className="rounded-lg border p-4">
                    <h3 className="font-semibold">Streak</h3>
                    <p className="text-2xl font-bold">0 days</p>
                </div>
            </div>
        </div>
    );
}
