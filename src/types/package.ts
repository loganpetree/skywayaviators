export interface Package {
  id?: string;
  images?: { original: string; large: string; medium: string; small: string }[];
  name: string;
  hoursMin: number;
  hoursMax: number;
  /** @deprecated Use hoursMin instead */
  hours?: number;
  pricePerHour: number;
  totalPrice: number;
  // Legacy fields kept for backward compatibility with existing Firestore docs
  description?: string;
  features?: string[];
  price?: string;
  duration?: string;
  category?: string;
}
