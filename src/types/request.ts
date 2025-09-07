export interface Request {
  id?: string; // Firebase auto-generates this
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  selfInsured: boolean;
  interestType: 'course' | 'rental' | 'timeBuilding';
  aircraftTailNumber: string;
  aircraftType: string;
  aircraftModel: string;
  dateSubmitted: string; // ISO string
  status: 'pending' | 'responded' | 'cancelled';
  isResponded: boolean;
  // Optional fields for admin use
  respondedAt?: string;
  respondedBy?: string;
  notes?: string;
}

export type InterestType = 'course' | 'rental' | 'timeBuilding';
export type RequestStatus = 'pending' | 'responded' | 'cancelled';
