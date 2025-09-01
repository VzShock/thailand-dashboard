import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generateFoodId, generateActivityId, generateShoppingId, generateVaccinationId } from '@/utils/itemId';

// Path to tracker data
const TRACKER_DATA_PATH = path.join(process.cwd(), 'data', 'shared-tracker.json');

export async function POST() {
  try {
    // Load JSON data dynamically
    const dataPath = path.join(process.cwd(), 'data');
    const food = JSON.parse(fs.readFileSync(path.join(dataPath, 'food.json'), 'utf-8'));
    const activities = JSON.parse(fs.readFileSync(path.join(dataPath, 'activities.json'), 'utf-8'));
    const shopping = JSON.parse(fs.readFileSync(path.join(dataPath, 'shopping.json'), 'utf-8'));
    const health = JSON.parse(fs.readFileSync(path.join(dataPath, 'health.json'), 'utf-8'));

    // Load current tracking data
    if (!fs.existsSync(TRACKER_DATA_PATH)) {
      return NextResponse.json({ success: true, message: 'No tracking data to migrate' });
    }

    const fileContent = fs.readFileSync(TRACKER_DATA_PATH, 'utf-8');
    const oldData = JSON.parse(fileContent);

    // Create migration mapping
    const newData = {
      food: {} as Record<string, boolean>,
      activities: {} as Record<string, boolean>,
      shopping: {} as Record<string, boolean>,
      health: {} as Record<string, boolean>,
      vaccinations: {} as Record<string, boolean>,
    };

    // Migrate food items
    Object.entries(oldData.food || {}).forEach(([oldId, value]) => {
      const match = oldId.match(/food-(\d+)/);
      if (match && value) {
        const index = parseInt(match[1]);
        if (food.foods[index]) {
          const newId = generateFoodId(food.foods[index]);
          newData.food[newId] = value as boolean;
        }
      }
    });

    // Migrate activities
    Object.entries(oldData.activities || {}).forEach(([oldId, value]) => {
      if (value) {
        // Handle old format like "bangkok-0", "bangkok-1"
        const match = oldId.match(/([^-]+)-(\d+)/);
        if (match) {
          const categoryKey = match[1];
          const index = parseInt(match[2]);
          
          const category = activities.categories[categoryKey as keyof typeof activities.categories];
          if (category && category.activities[index]) {
            const newId = generateActivityId(category.activities[index], categoryKey);
            newData.activities[newId] = value as boolean;
          }
        }
      }
    });

    // Migrate shopping (if any old data exists)
    Object.entries(oldData.shopping || {}).forEach(([oldId, value]) => {
      const match = oldId.match(/location-(\d+)/);
      if (match && value) {
        const index = parseInt(match[1]);
        if (shopping.locations[index]) {
          const newId = generateShoppingId(shopping.locations[index]);
          newData.shopping[newId] = value as boolean;
        }
      }
    });

    // Migrate vaccinations (if any old data exists)
    Object.entries(oldData.vaccinations || {}).forEach(([oldId, value]) => {
      const match = oldId.match(/vaccine-(\d+)/);
      if (match && value) {
        const index = parseInt(match[1]);
        if (health.vaccinations.vaccines[index]) {
          const newId = generateVaccinationId(health.vaccinations.vaccines[index]);
          newData.vaccinations[newId] = value as boolean;
        }
      }
    });

    // Backup old data
    const backupPath = path.join(process.cwd(), 'data', 'shared-tracker-backup.json');
    fs.writeFileSync(backupPath, fileContent);

    // Save migrated data
    fs.writeFileSync(TRACKER_DATA_PATH, JSON.stringify(newData, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      migrated: {
        food: Object.keys(newData.food).length,
        activities: Object.keys(newData.activities).length,
        shopping: Object.keys(newData.shopping).length,
        vaccinations: Object.keys(newData.vaccinations).length,
      }
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: 'Migration failed' },
      { status: 500 }
    );
  }
}