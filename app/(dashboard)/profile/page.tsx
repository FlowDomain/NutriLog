"use client";

import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Edit, Calendar, TrendingUp, Target, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { calculateBMI, getBMICategory } from "@/lib/utils/calorieCalculator";
import { format } from "date-fns";
import { ProfilePageSkeleton } from "@/components/skeletons/PageSkeletons";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <ProfilePageSkeleton />
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6 pr-5 pl-5">
        <h2 className="text-3xl font-bold tracking-tight text-blue">Profile</h2>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Failed to load profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bmi = profile.weight && profile.height
    ? calculateBMI(profile.weight, profile.height)
    : null;

  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  const isProfileComplete =
    profile.age &&
    profile.gender &&
    profile.height &&
    profile.weight &&
    profile.activityLevel &&
    profile.goal;

  return (
    <div className="space-y-6 pr-5 pl-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-blue ">Profile</h2>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
        <Button onClick={() => router.push("/profile/edit")} className="bg-blue">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {!isProfileComplete && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-orange-100 p-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">Complete Your Profile</h3>
                <p className="text-sm text-orange-700 mt-1">
                  Add your personal information to get personalized calorie recommendations and better insights.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => router.push("/profile/edit")}
                >
                  Complete Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-medium">{profile.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="text-lg font-medium">
                {format(new Date(profile.createdAt), "MMMM yyyy")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Physical Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Physical Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="text-lg font-medium">
                  {profile.age ? `${profile.age} years` : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="text-lg font-medium capitalize">
                  {profile.gender || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="text-lg font-medium">
                  {profile.height ? `${profile.height} cm` : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-lg font-medium">
                  {profile.weight ? `${profile.weight} kg` : "Not set"}
                </p>
              </div>
            </div>
            {bmi && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">BMI</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold">{bmi}</p>
                  <Badge variant={
                    bmiCategory === "Normal weight" ? "default" :
                      bmiCategory === "Overweight" ? "secondary" : "destructive"
                  }>
                    {bmiCategory}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity & Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Activity & Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Activity Level</p>
              <p className="text-lg font-medium capitalize">
                {profile.activityLevel?.replace('_', ' ') || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Goal</p>
              <p className="text-lg font-medium capitalize">
                {profile.goal?.replace('_', ' ') || "Not set"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Targets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Nutrition Targets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Daily Calorie Target</p>
              <p className="text-2xl font-bold">
                {profile.dailyCalorieTarget || "Not set"}
                {profile.dailyCalorieTarget && " kcal"}
              </p>
            </div>
            {profile.macroTargets && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Macro Targets</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <p className="text-sm text-muted-foreground">Carbs</p>
                    <p className="text-lg font-bold text-blue-600">
                      {profile.macroTargets.carbs}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-100 p-3">
                    <p className="text-sm text-muted-foreground">Protein</p>
                    <p className="text-lg font-bold text-green-600">
                      {profile.macroTargets.protein}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-yellow-100 p-3">
                    <p className="text-sm text-muted-foreground">Fats</p>
                    <p className="text-lg font-bold text-yellow-600">
                      {profile.macroTargets.fats}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}