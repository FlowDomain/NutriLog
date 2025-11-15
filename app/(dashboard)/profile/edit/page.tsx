"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { useProfile } from "@/hooks/useProfile"
import { calculateBMI, calculateRecommendedCalories, getBMICategory, getRecommendedMacros } from "@/lib/utils/calorieCalculator"
import { zodResolver } from "@hookform/resolvers/zod"
import { TabsList } from "@radix-ui/react-tabs"
import { Calculator, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import z, { TypeOf } from "zod"

const profileSchema = z.object({
    age: z.coerce.number().min(13, "Must be atleast 13").max(120, "Invalid age"),
    gender: z.enum(['male', 'female', 'other']),
    height: z.coerce.number().min(50, "Too Short").max(300, "Too Tall"),
    weight: z.coerce.number().min(20, "Too Light").max(500, "Too Heavy"),
    activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
    goal: z.enum(['lose_weight', 'maintain', 'gain_weight', 'gain_muscle']),
    dailyCalorieTarget: z.coerce.number().min(800).max(10000),
    macroTargets: z.object({
        carbs: z.coerce.number().min(0).max(100),
        protein: z.coerce.number().min(0).max(100),
        fats: z.coerce.number().min(0).max(100),
    }),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function EditProfilePage() {
    const router = useRouter()
    const { profile, updateProfile, refetch } = useProfile() // Added refetch
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            age: profile?.age || 25,
            gender: profile?.gender || 'male',
            height: profile?.height || 170,
            weight: profile?.weight || 70,
            activityLevel: (profile?.activityLevel as ProfileFormValues['activityLevel']) || "moderate",
            goal: (profile?.goal as ProfileFormValues['goal']) || "maintain",
            dailyCalorieTarget: profile?.dailyCalorieTarget || 2000,
            macroTargets: profile?.macroTargets || { carbs: 40, protein: 30, fats: 30 },
        }
    })

    // UPDATE FROM WHEN PROFILE LOADS
    useEffect(() => {
        if (profile) {
            form.reset({
                age: profile.age || 25,
                gender: profile.gender || "male",
                height: profile.height || 170,
                weight: profile.weight || 70,
                activityLevel: (profile.activityLevel as ProfileFormValues['activityLevel']) || "moderate",
                goal: (profile.goal as ProfileFormValues['goal']) || "maintain",
                dailyCalorieTarget: profile.dailyCalorieTarget || 2000,
                macroTargets: profile.macroTargets || { carbs: 40, protein: 30, fats: 30 },
            });
        }
    }, [profile, form])

    const watchedValues = form.watch()

    // CALCULATE RECOMMENDATIONS
    const recommendedCalories = calculateRecommendedCalories(
        watchedValues.weight,
        watchedValues.height,
        watchedValues.age,
        watchedValues.gender,
        watchedValues.activityLevel,
        watchedValues.goal,
    )

    const recommendedMacros = getRecommendedMacros(watchedValues.goal)

    const bmi = calculateBMI(watchedValues.weight, watchedValues.height)
    const bmiCategory = getBMICategory(bmi)

    const applyRecommendations = () => {
        form.setValue("dailyCalorieTarget", recommendedCalories)
        form.setValue("macroTargets", recommendedMacros)
    }

    const handleSubmit = async (values: ProfileFormValues) => {
        // VALIDATE MACRO SUM
        const macroSum = values.macroTargets.carbs + values.macroTargets.protein + values.macroTargets.fats
        if (Math.abs(macroSum - 100) > 0.1) {
            setError("Macro percentages must sum to 100%")
            return
        }

        setIsLoading(true)
        setError(null)
        setSuccess(false) // Reset success state

        try {
            console.log('[EDIT PAGE] Submitting values:', values)
            
            const result = await updateProfile(values)
            
            console.log('[EDIT PAGE] Update result:', result)
            
            setSuccess(true)
            
            // Force a refetch to ensure we have the latest data
            await refetch()
            
            console.log('[EDIT PAGE] Profile refetched, redirecting...')
            
            // Redirect after a short delay
            setTimeout(() => {
                router.push("/profile")
                router.refresh() // Force a refresh of the profile page
            }, 1500)
            
        } catch (error: any) {
            console.error('[EDIT PAGE] Update error:', error)
            setError(error.message || 'Failed to update profile')
            setSuccess(false)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 ">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Edit Profile</h2>
                <p className="text-muted-foreground">Update your personal information and nutrition targets</p>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                        Profile updated successfully! Redirecting...
                    </AlertDescription>
                </Alert>
            )}


            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid grid-cols-2 w-full">
                            <TabsTrigger value="personal">Personal Info</TabsTrigger>
                            <TabsTrigger value="nutrition">Nutrition Targets</TabsTrigger>
                        </TabsList>

                        {/* PEROSNAL INFO TAB */}
                        <TabsContent value="personal" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Physical Information</CardTitle>
                                    <CardDescription>This information helps us calculate your recomended calorie intake</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField control={form.control} name="age"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Age *</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="25"{...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField control={form.control} name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Gender *</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select gender" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="male">Male</SelectItem>
                                                            <SelectItem value="female">Female</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField control={form.control} name="height"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Height (cm) *</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="170"{...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField control={form.control} name="weight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Weight (kg) *</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="70"{...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* BMI DISPLAY */}
                                    <div className="rounded-lg bg-muted p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium">Your BMI</p>
                                                <p className="text-2xl font-bold">{bmi}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">Category</p>
                                                <p className="text-lg font-semibold">{bmiCategory}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Activity & Goals</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField control={form.control} name="activityLevel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Activity Level *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select activity level" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="sedentary" >Sedentary (Little or no exercise)</SelectItem>
                                                        <SelectItem value="light" >Light (Exercise 1-3 days/week)</SelectItem>
                                                        <SelectItem value="moderate" >Moderate (Exercise 3-5 days/week)</SelectItem>
                                                        <SelectItem value="active" >Active (Exercise 6-7 days/week)</SelectItem>
                                                        <SelectItem value="very_active" >Very Active (Physical job + exercise)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField control={form.control} name="goal"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Goal  *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select goal" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="lose_weight" >Lose Weight</SelectItem>
                                                        <SelectItem value="maintain" >Maintain Weight</SelectItem>
                                                        <SelectItem value="gain_weight" >Gain Weight</SelectItem>
                                                        <SelectItem value="gain_muscle" >Gain Muscle</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>


                        {/* NUTRITION TARGETS TAB */}
                        <TabsContent value="nutrition" className="space-y-6">
                            {/* RECOMMENDATIONS CARD */}
                            <Card className="border-blue-200 bg-blue-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-blue-900">
                                        <Calculator className="h-5 w-5" />
                                        Recommended for you
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-blue-800 mb-2">Based on your stats, activity level, & goal:</p>
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <div className="rounded-lg bg-white p-3">
                                                <p className="text-sm text-muted-foreground">Calories</p>
                                                <p className="text-2xl font-bold text-blue-600">{recommendedCalories} kcal/day</p>
                                            </div>
                                            <div className="rounded-lg bg-white p-3">
                                                <p className="text-sm text-muted-foreground">Macros</p>
                                                <p className="text-sm font-semibold">{recommendedMacros.carbs}% carbs | {recommendedMacros.protein}% protein | {recommendedMacros.fats}% fats</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="button" variant="default" className="w-full" onClick={applyRecommendations}>
                                        <Lightbulb className="mr-2 h-4 w-4" />
                                        Apply Recommendations
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Daily Calorie Target</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormField control={form.control} name="dailyCalorieTarget"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Target Calories *</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="2000" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This will be used to track your daily progress
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Macro Targets</CardTitle>
                                    <CardDescription>
                                        Percentages must sum to 100%. This affects your meal grading
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <FormField control={form.control} name="macroTargets.carbs"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Carbs % *</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="40" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField control={form.control} name="macroTargets.protein"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Protein % *</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="30" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField control={form.control} name="macroTargets.fats"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Fats % *</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="30" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* MACRO SUM VALIDATION */}
                                    <div className="rounded-lg bg-muted p-3">
                                        <p className="text-sm">
                                            Total: <span className="font-bold">
                                                {watchedValues.macroTargets.carbs + watchedValues.macroTargets.protein + watchedValues.macroTargets.fats}%
                                            </span>
                                            {Math.abs((watchedValues.macroTargets.carbs + watchedValues.macroTargets.protein + watchedValues.macroTargets.fats) - 100) > 0.1 && (
                                                <span className="text-red-600 ml-2">(Must equal 100%)</span>
                                            )}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}