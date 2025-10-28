"use client";

import { useSession as useBetterSession, signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export function useAuth() {
    const { data: session, isPending, error } = useBetterSession();
    const router = useRouter();

    const logout = async () => {
        await signOut();
        router.push("/sign-in");
    };

    return {
        user: session?.user || null,
        session,
        isLoading: isPending,
        isAuthenticated: !!session?.user,
        error,
        logout,
    };
}