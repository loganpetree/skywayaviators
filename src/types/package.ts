export interface Package {
  id?: string;
  images?: { original: string; large: string; medium: string; small: string }[];
  name: string;
  description: string;
  features: string[];
  price?: string; // e.g., "Starting at $1,625"
  duration?: string; // e.g., "25 Hours"
  category?: string; // e.g., "Starter", "Professional", "Elite"
}