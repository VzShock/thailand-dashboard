import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const WORK_SCHEDULE_PATH = path.join(process.cwd(), 'data', 'work-schedule.json');

interface WorkDay {
  morning: boolean;
  afternoon: boolean;
  location?: string;
  isTravelDay?: boolean;
}

interface WorkScheduleData {
  title: string;
  description: string;
  schedule: Record<string, WorkDay>;
}

async function loadWorkScheduleData(): Promise<WorkScheduleData> {
  try {
    const data = await fs.readFile(WORK_SCHEDULE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading work schedule data:', error);
    throw new Error('Failed to load work schedule data');
  }
}

async function saveWorkScheduleData(data: WorkScheduleData): Promise<void> {
  try {
    await fs.writeFile(WORK_SCHEDULE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving work schedule data:', error);
    throw new Error('Failed to save work schedule data');
  }
}

export async function GET() {
  try {
    const data = await loadWorkScheduleData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load work schedule' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, period, value, location, isTravelDay } = body;

    if (!date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const data = await loadWorkScheduleData();
    
    if (!data.schedule[date]) {
      data.schedule[date] = { morning: false, afternoon: false };
    }
    
    if (period && value !== undefined) {
      data.schedule[date][period as 'morning' | 'afternoon'] = value;
    }
    
    if (location !== undefined) {
      data.schedule[date].location = location;
    }
    
    if (isTravelDay !== undefined) {
      data.schedule[date].isTravelDay = isTravelDay;
    }
    
    await saveWorkScheduleData(data);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update work schedule' },
      { status: 500 }
    );
  }
}