"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Testimonial } from "@/types";

interface SimpleReviewFormData {
  rating: number;
  firstname: string;
  lastname: string;
  testimonial: string;
  avatar: File | null;
}

interface ReviewFormProps {
  onSubmit: (reviewData: Omit<Testimonial, 'id' | 'avatar' | 'created' | 'isApproved'>) => void;
  isSubmitting?: boolean;
}

export function ReviewForm({ onSubmit, isSubmitting = false }: ReviewFormProps) {
  const [formData, setFormData] = useState<SimpleReviewFormData>({
    rating: 5,
    firstname: "",
    lastname: "",
    testimonial: "",
    avatar: null,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Load saved form data on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('reviewFormDraft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch {
        console.log('Failed to load saved form data');
      }
    }
  }, []);

  // Save form data to localStorage
  const saveDraft = (data: Partial<SimpleReviewFormData>) => {
    const draft = { ...formData, ...data };
    localStorage.setItem('reviewFormDraft', JSON.stringify(draft));
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Save to localStorage
    saveDraft({ [field]: value });
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, WebP)';
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setErrors(prev => ({ ...prev, avatar: error }));
        return;
      }

      setFormData(prev => ({ ...prev, avatar: file }));
      setErrors(prev => ({ ...prev, avatar: '' }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Save to localStorage
      saveDraft({ avatar: file });
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: null }));
    setAvatarPreview(null);
    setErrors(prev => ({ ...prev, avatar: '' }));
    saveDraft({ avatar: null });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }

    if (!formData.testimonial.trim()) {
      newErrors.testimonial = "Testimonial is required";
    } else if (formData.testimonial.length < 10) {
      newErrors.testimonial = "Testimonial must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare testimonial data
    const testimonialData: Omit<Testimonial, 'id' | 'avatar' | 'created' | 'isApproved'> = {
      rating: formData.rating,
      testimonial: formData.testimonial.trim(),
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
    };

    // Clear saved draft on successful submission
    localStorage.removeItem('reviewFormDraft');

    onSubmit(testimonialData);
  };

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
    return (
      <div className="flex justify-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl ${
              star <= rating
                ? "text-yellow-400"
                : "text-gray-300"
            } hover:text-yellow-400 transition-colors`}
            onClick={() => onRatingChange(star)}
          >
            ★
          </button>
        ))}
      </div>
    );
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Rating */}
      <div className="text-center mb-4">
        <StarRating
          rating={formData.rating}
          onRatingChange={(rating) => handleInputChange('rating', rating)}
        />
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="firstname" className="text-xs font-medium mb-1 block">First Name *</Label>
          <Input
            id="firstname"
            type="text"
            placeholder="John"
            value={formData.firstname}
            onChange={(e) => handleInputChange('firstname', e.target.value)}
            className="h-8 text-sm"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastname" className="text-xs font-medium mb-1 block">Last Name *</Label>
          <Input
            id="lastname"
            type="text"
            placeholder="Doe"
            value={formData.lastname}
            onChange={(e) => handleInputChange('lastname', e.target.value)}
            className="h-8 text-sm"
            required
          />
        </div>
      </div>

      {/* Avatar Upload - Modal */}
      <div className="flex items-center gap-3">
        <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
          <DialogTrigger asChild>
            <div className="flex-shrink-0 cursor-pointer">
              <div className="w-12 h-12 rounded-full border border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden hover:border-gray-400 transition-colors">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Profile Picture</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Large preview in modal */}
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-lg border-2 border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Upload options */}
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleFileChange(e);
                    setIsAvatarModalOpen(false);
                  }}
                  className="hidden"
                  id="avatar-modal"
                />

                <div className="flex gap-2">
                  <label
                    htmlFor="avatar-modal"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-center transition-colors"
                  >
                    Choose File
                  </label>

                  {avatarPreview && (
                    <button
                      onClick={() => {
                        removeAvatar();
                        setIsAvatarModalOpen(false);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Supported formats: JPEG, PNG, WebP (max 5MB)
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex-1">
          <span className="text-xs text-gray-600">
            {avatarPreview ? 'Click to change photo' : 'Click to add photo (optional)'}
          </span>
        </div>
      </div>

      {/* Testimonial */}
      <div>
        <Label htmlFor="testimonial" className="text-xs font-medium mb-1 block">Your Review *</Label>
        <Textarea
          id="testimonial"
          placeholder="Share your experience..."
          value={formData.testimonial}
          onChange={(e) => handleInputChange('testimonial', e.target.value)}
          className="min-h-[80px] text-sm resize-none"
          maxLength={500}
          required
        />
        <div className="flex justify-between items-center mt-1">
          <span className={`text-xs ${formData.testimonial.length > 450 ? 'text-orange-600' : 'text-gray-500'}`}>
            {formData.testimonial.length}/500
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-9 text-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            "Submit Review"
          )}
        </Button>

      </div>
    </form>
  );
}
