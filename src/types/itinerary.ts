// Enhanced itinerary types with unique IDs for editing
export interface EditableTransportOption {
  id: string;
  type: string;
  method: string;
  duration: string;
  cost: string;
}

export interface EditableTransport {
  id: string;
  to: string;
  options: EditableTransportOption[];
  recommendation?: string;
}

export interface EditablePhase {
  id: string;
  number: number;
  title: string;
  dates: string;
  arrivalDay: string;
  departureDay: string;
  details: string[];
  nextTransport?: EditableTransport;
  finalTransport?: EditableTransport;
}

export interface EditableItinerary {
  id: string;
  title: string;
  totalNights: number;
  phases: EditablePhase[];
  stats: {
    totalDays: number;
    totalNights: number;
    destinations: number;
    flightLegs: number;
    islandTime: number;
    workDays: number;
    vacationDays: number;
  };
  lastModified: string;
  version: number;
}

// Utility functions for ID generation
let idCounter = 0;

export function generateId(): string {
  // Use a counter-based approach for more predictable IDs
  idCounter += 1;
  return `id_${idCounter}_${Date.now().toString(36)}`;
}

// Alternative function for deterministic IDs based on content
export function generateDeterministicId(content: string, index: number): string {
  // Create a simple hash from content
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `${Math.abs(hash)}_${index}`;
}

// Legacy itinerary interfaces for migration
interface LegacyTransportOption {
  type: string;
  method: string;
  duration: string;
  cost: string;
}

interface LegacyTransport {
  to: string;
  options: LegacyTransportOption[];
  recommendation?: string;
}

interface LegacyPhase {
  number: number;
  title: string;
  dates: string;
  arrivalDay: string;
  departureDay: string;
  details: string[];
  nextTransport?: LegacyTransport;
  finalTransport?: LegacyTransport;
}

interface LegacyItinerary {
  title: string;
  totalNights: number;
  phases: LegacyPhase[];
  stats: {
    totalDays: number;
    totalNights: number;
    destinations: number;
    flightLegs: number;
    islandTime: number;
    workDays: number;
    vacationDays: number;
  };
}

// Migration function to convert legacy itinerary to editable format
export function migrateItineraryToEditable(legacyItinerary: LegacyItinerary): EditableItinerary {
  const migrateTransport = (transport: LegacyTransport, phaseIndex: number, isNext: boolean): EditableTransport => ({
    id: generateDeterministicId(`${transport.to}_${phaseIndex}_${isNext}`, 0),
    to: transport.to,
    options: transport.options.map((option: LegacyTransportOption, optionIndex: number) => ({
      id: generateDeterministicId(`${option.type}_${option.method}_${phaseIndex}`, optionIndex),
      ...option,
    })),
    recommendation: transport.recommendation,
  });

  return {
    id: generateDeterministicId(legacyItinerary.title, 0),
    title: legacyItinerary.title,
    totalNights: legacyItinerary.totalNights,
    phases: legacyItinerary.phases.map((phase: LegacyPhase, phaseIndex: number) => ({
      id: generateDeterministicId(`${phase.title}_${phase.dates}`, phaseIndex),
      number: phase.number,
      title: phase.title,
      dates: phase.dates,
      arrivalDay: phase.arrivalDay,
      departureDay: phase.departureDay,
      details: [...phase.details],
      nextTransport: phase.nextTransport ? migrateTransport(phase.nextTransport, phaseIndex, true) : undefined,
      finalTransport: phase.finalTransport ? migrateTransport(phase.finalTransport, phaseIndex, false) : undefined,
    })),
    stats: { ...legacyItinerary.stats },
    lastModified: new Date().toISOString(),
    version: 1,
  };
}