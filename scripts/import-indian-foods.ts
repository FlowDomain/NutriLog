// scripts/import-indian-foods.ts
// Run this script once to import the JSON data: npx tsx scripts/import-indian-foods.ts

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { SystemFood } from '@/database/models/SystemFood';

// Your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://flowdomain85:lYj0ul5HONbcqHmk@cluster0.uraigtc.mongodb.net/?appName=Cluster0';

interface FoodData {
    name: string;
    description: string;
    serving_size_g: number;
    calories: number;
    carbs_g: number;
    protein_g: number;
    fats_g: number;
    category?: string;
    tags?: string[];
    isActive?: boolean;
    usageCount?: number;
}

// Helper function to detect category from food name
function detectCategory(name: string): string {
    const nameLower = name.toLowerCase();

    if (nameLower.includes('paratha') || nameLower.includes('roti') ||
        nameLower.includes('naan') || nameLower.includes('chapati') ||
        nameLower.includes('puri') || nameLower.includes('kulcha')) {
        return 'bread';
    }
    if (nameLower.includes('rice') || nameLower.includes('biryani') ||
        nameLower.includes('pulao') || nameLower.includes('khichdi')) {
        return 'rice';
    }
    if (nameLower.includes('dal') || nameLower.includes('lentil')) {
        return 'dal';
    }
    if (nameLower.includes('curry') || nameLower.includes('masala') ||
        nameLower.includes('paneer') || nameLower.includes('sabzi')) {
        return 'curry';
    }
    if (nameLower.includes('dosa') || nameLower.includes('idli') ||
        nameLower.includes('vada') || nameLower.includes('upma') ||
        nameLower.includes('uttapam')) {
        return 'south-indian';
    }
    if (nameLower.includes('samosa') || nameLower.includes('pakora') ||
        nameLower.includes('bhaji') || nameLower.includes('kachori')) {
        return 'snack';
    }
    if (nameLower.includes('sweet') || nameLower.includes('kheer') ||
        nameLower.includes('halwa') || nameLower.includes('ladoo') ||
        nameLower.includes('barfi') || nameLower.includes('gulab')) {
        return 'dessert';
    }
    if (nameLower.includes('raita') || nameLower.includes('chutney') ||
        nameLower.includes('pickle') || nameLower.includes('papad')) {
        return 'accompaniment';
    }
    if (nameLower.includes('breakfast')) {
        return 'breakfast';
    }

    return 'other';
}

// Helper function to generate tags
function generateTags(name: string, description: string): string[] {
    const tags: string[] = ['indian', 'traditional'];
    const combined = `${name} ${description}`.toLowerCase();

    // Style tags
    if (combined.includes('classic')) {
        tags.push('classic');
    }
    if (combined.includes('home style')) {
        tags.push('homemade');
    }
    if (combined.includes('restaurant')) {
        tags.push('restaurant-style');
    }
    if (combined.includes('low oil')) {
        tags.push('low-fat', 'healthy');
    }
    if (combined.includes('high protein')) {
        tags.push('high-protein', 'fitness');
    }

    return [...new Set(tags)]; // Remove duplicates
}

async function importJSON() {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Read JSON file
        const jsonFilePath = path.join(process.cwd(), 'data', 'indian-foods.json');
        console.log('📂 Reading JSON file from:', jsonFilePath);

        const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
        const foodsData: FoodData[] = JSON.parse(jsonData);

        console.log(`📊 Found ${foodsData.length} foods in JSON`);

        // Clear existing system foods (optional - comment out if you want to keep existing)
        console.log('🗑️  Clearing existing system foods...');
        const deleteResult = await SystemFood.deleteMany({});
        console.log(`✅ Deleted ${deleteResult.deletedCount} existing foods`);

         // Transform and prepare data
        const foods = foodsData.map((food) => {
            // ✅ Use category from JSON if provided, otherwise detect
            const category = food.category || detectCategory(food.name);
            
            // ✅ Use tags from JSON if provided, otherwise generate
            const tags = food.tags && food.tags.length > 0 
                ? food.tags 
                : generateTags(food.name, food.description);
            
            return {
                name: food.name.trim(),
                description: food.description?.trim() || '',
                servingSize: food.serving_size_g,
                calories: Math.round(food.calories), // Round to whole number
                macros: {
                    carbs: Math.round(food.carbs_g * 10) / 10, // Round to 1 decimal
                    protein: Math.round(food.protein_g * 10) / 10,
                    fats: Math.round(food.fats_g * 10) / 10,
                },
                category,
                tags,
                isActive: food.isActive !== undefined ? food.isActive : true,
                usageCount: food.usageCount || 0,
            };
        });

        console.log('✨ Sample food item:', JSON.stringify(foods[0], null, 2));

        // Insert into MongoDB in batches (for better performance)
        const batchSize = 100;
        let imported = 0;

        console.log('\n📥 Starting import...');
        for (let i = 0; i < foods.length; i += batchSize) {
            const batch = foods.slice(i, i + batchSize);
            await SystemFood.insertMany(batch, { ordered: false });
            imported += batch.length;
            console.log(`   ✅ Imported ${imported}/${foods.length} foods`);
        }

        console.log('\n🎉 Import completed successfully!');
        console.log(`📊 Total foods imported: ${imported}`);

        // Show statistics
        console.log('\n📈 Generating statistics...');

        const totalCount = await SystemFood.countDocuments();
        console.log(`   Total in database: ${totalCount}`);

        const stats = await SystemFood.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        console.log('\n📊 Foods by category:');
        stats.forEach(stat => {
            console.log(`   ${stat._id.padEnd(20)} : ${stat.count}`);
        });

        // Show some sample foods
        console.log('\n🍽️  Sample foods:');
        const samples = await SystemFood.find().limit(5).lean();
        samples.forEach(food => {
            console.log(`   ${food.name} - ${food.calories} cal (${food.category})`);
        });

        // Check indexes
        console.log('\n🔍 Checking indexes...');
        const indexes = await SystemFood.collection.getIndexes();
        console.log('   Indexes created:', Object.keys(indexes).join(', '));

    } catch (error) {
        console.error('❌ Import failed:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Stack trace:', error.stack);
        }
        throw error;
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

// Run the import
console.log('🚀 Starting Indian Food Database Import');
console.log('='.repeat(50));

importJSON()
    .then(() => {
        console.log('\n' + '='.repeat(50));
        console.log('✨ Import completed successfully!');
        console.log('🎉 Your Indian food database is ready!');
        console.log('='.repeat(50));
        process.exit(0);
    })
    .catch((error) => {
        console.log('\n' + '='.repeat(50));
        console.error('💥 Import failed with error:');
        console.error(error);
        console.log('='.repeat(50));
        process.exit(1);
    });