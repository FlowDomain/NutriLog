"use client";

import { useState, useEffect } from "react";

export interface UserProfile {
    _id: string;
    email: string;
    name: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    height?: number;
    weight?: number;
    activityLevel?: string;
    goal?: string;
    dailyCalorieTarget?: number;
    macroTargets?: {
        carbs: number;
        protein: number;
        fats: number;
    };
    createdAt: string;
    updatedAt: string;
}

export function useProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        console.log('[useProfile] Fetching profile...');
        setIsLoading(true);
        setError(null);

        try {
            // Add cache-busting timestamp to prevent stale data
            const timestamp = new Date().getTime();
            const response = await fetch(`/api/profile?t=${timestamp}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                }
            });
            
            console.log('[useProfile] Response status:', response.status);
            
            const result = await response.json();
            console.log('[useProfile] Response data:', result);

            if (!result.success) {
                throw new Error(result.error);
            }

            console.log('[useProfile] Setting profile:', result.data);
            setProfile(result.data);
            
        } catch (err: any) {
            console.error('[useProfile] Fetch error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (data: Partial<UserProfile>) => {
        console.log('[useProfile] Updating profile with data:', data);
        
        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            console.log('[useProfile] Update response status:', response.status);
            
            const result = await response.json();
            console.log('[useProfile] Update response data:', result);

            if (!result.success) {
                throw new Error(result.error);
            }

            // Immediately update local state with the new data
            console.log('[useProfile] Setting updated profile:', result.data);
            setProfile(result.data);
            
            return result.data;
            
        } catch (err: any) {
            console.error('[useProfile] Update error:', err);
            throw new Error(err.message);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        profile,
        isLoading,
        error,
        updateProfile,
        refetch: fetchProfile,
    };
}