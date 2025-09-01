import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { EditableItinerary, migrateItineraryToEditable } from '@/types/itinerary';

// Paths for itinerary data storage
const ITINERARY_DATA_PATH = path.join(process.cwd(), 'data', 'itinerary-editable.json');
const ITINERARY_BACKUP_PATH = path.join(process.cwd(), 'data', 'itinerary-backup.json');
const LEGACY_ITINERARY_PATH = path.join(process.cwd(), 'data', 'itinerary_new.json');

// Ensure the data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(ITINERARY_DATA_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load itinerary data (with migration support)
function loadItineraryData(): EditableItinerary {
  ensureDataDirectory();
  
  try {
    // First try to load the editable version
    if (fs.existsSync(ITINERARY_DATA_PATH)) {
      const fileContent = fs.readFileSync(ITINERARY_DATA_PATH, 'utf-8');
      const data = JSON.parse(fileContent);
      return data;
    }
    
    // If editable version doesn't exist, migrate from legacy
    if (fs.existsSync(LEGACY_ITINERARY_PATH)) {
      const legacyContent = fs.readFileSync(LEGACY_ITINERARY_PATH, 'utf-8');
      const legacyData = JSON.parse(legacyContent);
      const migratedData = migrateItineraryToEditable(legacyData);
      
      // Save the migrated data
      saveItineraryData(migratedData);
      
      return migratedData;
    }
  } catch (error) {
    console.error('Error loading itinerary data:', error);
  }
  
  throw new Error('No itinerary data found');
}

// Save itinerary data with backup
function saveItineraryData(data: EditableItinerary): void {
  ensureDataDirectory();
  
  try {
    // Create backup if file exists
    if (fs.existsSync(ITINERARY_DATA_PATH)) {
      const currentContent = fs.readFileSync(ITINERARY_DATA_PATH, 'utf-8');
      fs.writeFileSync(ITINERARY_BACKUP_PATH, currentContent);
    }
    
    // Update version and timestamp
    const updatedData = {
      ...data,
      lastModified: new Date().toISOString(),
      version: (data.version || 0) + 1,
    };
    
    // Save the new data
    fs.writeFileSync(ITINERARY_DATA_PATH, JSON.stringify(updatedData, null, 2));
  } catch (error) {
    console.error('Error saving itinerary data:', error);
    throw error;
  }
}

// GET endpoint - retrieve itinerary data
export async function GET() {
  try {
    const data = loadItineraryData();
    
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('GET /api/itinerary error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load itinerary data' },
      { status: 500 }
    );
  }
}

// POST endpoint - save complete itinerary data
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
    
    // Validate required fields
    if (!data.title || !data.phases || !Array.isArray(data.phases)) {
      return NextResponse.json(
        { success: false, error: 'Invalid itinerary data structure' },
        { status: 400 }
      );
    }
    
    saveItineraryData(data);
    
    return NextResponse.json({
      success: true,
      message: 'Itinerary saved successfully',
      data: loadItineraryData(), // Return updated data with new version
    });
  } catch (error) {
    console.error('POST /api/itinerary error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save itinerary data' },
      { status: 500 }
    );
  }
}

// PATCH endpoint - update specific parts of itinerary
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, ...payload } = body;
    
    const currentData = loadItineraryData();
    const updatedData = { ...currentData };
    
    switch (operation) {
      case 'updatePhase': {
        const { phaseId, updates } = payload;
        const phaseIndex = updatedData.phases.findIndex(p => p.id === phaseId);
        if (phaseIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Phase not found' },
            { status: 404 }
          );
        }
        updatedData.phases[phaseIndex] = { ...updatedData.phases[phaseIndex], ...updates };
        break;
      }
      
      case 'addPhase': {
        const { phase } = payload;
        updatedData.phases.push(phase);
        // Renumber phases
        updatedData.phases.forEach((p, index) => {
          p.number = index + 1;
        });
        break;
      }
      
      case 'deletePhase': {
        const { phaseId } = payload;
        updatedData.phases = updatedData.phases.filter(p => p.id !== phaseId);
        // Renumber phases
        updatedData.phases.forEach((p, index) => {
          p.number = index + 1;
        });
        break;
      }
      
      case 'reorderPhases': {
        const { phaseIds } = payload;
        const reorderedPhases = phaseIds.map((id: string) => 
          updatedData.phases.find(p => p.id === id)
        ).filter(Boolean);
        if (reorderedPhases.length !== updatedData.phases.length) {
          return NextResponse.json(
            { success: false, error: 'Invalid phase order' },
            { status: 400 }
          );
        }
        updatedData.phases = reorderedPhases;
        // Renumber phases
        updatedData.phases.forEach((p, index) => {
          p.number = index + 1;
        });
        break;
      }
      
      case 'updateDetails': {
        const { phaseId, details } = payload;
        const phaseIndex = updatedData.phases.findIndex(p => p.id === phaseId);
        if (phaseIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Phase not found' },
            { status: 404 }
          );
        }
        updatedData.phases[phaseIndex].details = details;
        break;
      }
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown operation' },
          { status: 400 }
        );
    }
    
    saveItineraryData(updatedData);
    
    return NextResponse.json({
      success: true,
      message: 'Itinerary updated successfully',
      data: loadItineraryData(), // Return updated data
    });
  } catch (error) {
    console.error('PATCH /api/itinerary error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update itinerary data' },
      { status: 500 }
    );
  }
}