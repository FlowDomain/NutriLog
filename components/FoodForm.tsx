"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

const foodFormSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    servingSize: z.coerce.number().min(1, "Serving size must be at least 1g"),
    macros: z.object({
        carbs: z.coerce.number().min(0, "Cannot be negative"),
        protein: z.coerce.number().min(0, "Cannot be negative"),
        fats: z.coerce.number().min(0, "Cannot be negative"),
    }),
    category: z.string().optional(),
    isPublic: z.boolean().default(false),
});

type FoodFormValues = z.infer<typeof foodFormSchema>;

interface FoodFormProps {
    initialData?: Partial<FoodFormValues> & { tags?: string[] };
    onSubmit: (data: FoodFormValues & { tags: string[] }) => Promise<void>;
    onCancel?: () => void;
    isLoading?: boolean;
}

export function FoodForm({ initialData, onSubmit, onCancel, isLoading }: FoodFormProps) {
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [tagInput, setTagInput] = useState("");

    const form = useForm<FoodFormValues>({
        resolver: zodResolver(foodFormSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            servingSize: initialData?.servingSize || 100,
            macros: {
                carbs: initialData?.macros?.carbs || 0,
                protein: initialData?.macros?.protein || 0,
                fats: initialData?.macros?.fats || 0,
            },
            category: initialData?.category || "",
            isPublic: initialData?.isPublic || false,
        },
    });

    const handleSubmit = async (values: FoodFormValues) => {
        await onSubmit({ ...values, tags });
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    // Calculate estimated calories
    const macros = form.watch("macros");
    const estimatedCalories = Math.round(
        macros.carbs * 4 + macros.protein * 4 + macros.fats * 9
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Food Name *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Aloo Paratha" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Brief description of the food"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="servingSize"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Serving Size (grams/mL) *</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="100" {...field} />
                            </FormControl>
                            <FormDescription>
                                Base serving size in grams/mL
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Macros per Serving</h3>

                    <div className="grid gap-4 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="macros.carbs"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Carbs (g) *</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.1" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="macros.protein"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Protein (g) *</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.1" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="macros.fats"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fats (g) *</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.1" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm font-medium">
                            Estimated Calories: <span className="text-lg font-bold">{estimatedCalories}</span> kcal
                        </p>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Breakfast, Snack" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-2">
                    <FormLabel>Tags</FormLabel>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a tag (e.g., indian, vegetarian)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                        />
                        <Button type="button" variant="outline" onClick={addTag}>
                            Add
                        </Button>
                    </div>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-2 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Make this food public</FormLabel>
                                <FormDescription>
                                    Other users will be able to see and use this food
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button className="bg-brand hover:bg-brand-100" type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : initialData ? "Update Food" : "Create Food"}
                    </Button>
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}