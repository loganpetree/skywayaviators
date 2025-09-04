export interface Testimonial {
  id: string;
  rating: number; // 1-5 stars
  testimonial: string; // The main review content
  firstname: string;
  lastname: string;
  avatar?: string; // Optional avatar URL
  created: Date;
  isApproved: boolean;
}
