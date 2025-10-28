export interface Macros {
    carbs: number;
    protein: number;
    fats: number;
}

export interface Food {
    id: string;
    userId: string;
    name: string;
    description?: string;
    servingSize: number;
    calories: number;
    macros: Macros;
    isPublic: boolean;
    category?: string;  
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateFoodData {
    name: string;
    description?: string;
    servingSize: number;
    calories: number;
    macros: Macros;
    isPublic?: boolean;
    category?: string;
    tags?: string[];
}

export interface UpdateFoodData extends Partial<CreateFoodData> { }