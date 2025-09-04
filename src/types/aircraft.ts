export interface Aircraft {
  id: string;
  tailNumber: string;
  type: string;
  model: string;
  description: string;
  capacity: number;
  hourlyRate: number;
  images: string[];
  equipment?: string[];
  features?: string[];
  isHidden: boolean;
  year?: number;
}


