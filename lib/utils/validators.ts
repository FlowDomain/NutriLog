import { z } from "zod";

export const foodSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    servingSize: z.number().min(1, "Serving size must be at least 1g"),
    macros: z.object({
        carbs: z.number().min(0, "Carbs cannot be negative"),
        protein: z.number().min(0, "Protein cannot be negative"),
        fats: z.number().min(0, "Fats cannot be negative"),
    }),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPublic: z.boolean().default(false),
});

export type FoodInput = z.infer<typeof foodSchema>;