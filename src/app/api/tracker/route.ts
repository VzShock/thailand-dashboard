import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Type definition for tracker data
type TrackerData = {
  food: Record<string, boolean>;
  activities: Record<string, boolean>;
  shopping: Record<string, boolean>;
  health: Record<string, boolean>;
  vaccinations: Record<string, boolean>;
};

// Path to store shared tracking data
const TRACKER_DATA_PATH = path.join(process.cwd(), 'data', 'shared-tracker.json');

// Ensure the data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(TRACKER_DATA_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load shared tracking data from file
function loadTrackerData(): TrackerData {
  ensureDataDirectory();
  
  try {
    if (fs.existsSync(TRACKER_DATA_PATH)) {
      const fileContent = fs.readFileSync(TRACKER_DATA_PATH, 'utf-8');
      const data = JSON.parse(fileContent);
      return { ...getDefaultTrackerData(), ...data };
    }
  } catch (error) {
    console.error('Error loading tracker data:', error);
  }
  
  return getDefaultTrackerData();
}

// Save shared tracking data to file
function saveTrackerData(data: TrackerData): void {
  ensureDataDirectory();
  
  try {
    fs.writeFileSync(TRACKER_DATA_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving tracker data:', error);
    throw error;
  }
}

// Default empty tracker data
function getDefaultTrackerData(): TrackerData {
  return {
    food: {},
    activities: {},
    shopping: {},
    health: {},
    vaccinations: {},
  };
}

// GET endpoint - retrieve shared tracking data
export async function GET() {
  try {
    const data = loadTrackerData();
    
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('GET /api/tracker error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load tracker data' },
      { status: 500 }
    );
  }
}

// POST endpoint - save shared tracking data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Data is required' },
        { status: 400 }
      );
    }
    
    saveTrackerData(data);
    
    return NextResponse.json({
      success: true,
      message: 'Tracker data saved successfully',
    });
  } catch (error) {
    console.error('POST /api/tracker error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save tracker data' },
      { status: 500 }
    );
  }
}

// PATCH endpoint - update specific item in shared data
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, itemId, checked } = body;
    
    if (!section || !itemId || typeof checked !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Section, itemId, and checked status are required' },
        { status: 400 }
      );
    }
    
    // Load current shared data
    const currentData = loadTrackerData();
    
    // Update specific item
    if (!currentData[section as keyof TrackerData]) {
      currentData[section as keyof TrackerData] = {};
    }
    currentData[section as keyof TrackerData][itemId] = checked;
    
    // Save updated shared data
    saveTrackerData(currentData);
    
    return NextResponse.json({
      success: true,
      message: 'Item updated successfully',
      data: currentData,
    });
  } catch (error) {
    console.error('PATCH /api/tracker error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tracker data' },
      { status: 500 }
    );
  }
}