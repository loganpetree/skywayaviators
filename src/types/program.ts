export interface Program {
  id?: string;
  images?: { original: string; large: string; medium: string; small: string }[];
  name: string;
  description: string;
  features: string[];
  price?: string; // e.g., "Starting at $15,000"
}
