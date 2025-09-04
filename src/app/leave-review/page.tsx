"use client";

import { useState } from "react";
import { ReviewForm } from "@/components/ReviewForm";
import { Testimonial } from "@/types";

export default function LeaveReviewPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReviewSubmit = async (reviewData: Omit<Testimonial, 'id' | 'avatar' | 'created' | 'isApproved'>) => {
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      console.log("Submitting review:", reviewData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      setIsSubmitted(true);

    } catch (error) {
      console.error("Error submitting review:", error);
      alert("There was an error submitting your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-4 flex items-center justify-center">
        <div className="max-w-sm w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Skyway Aviators</h1>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 mt-4">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 text-sm mb-4">Your review has been submitted successfully.</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            Submit Another Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-2 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Simple Header */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-gray-900">Skyway Aviators</h1>
        </div>

        {/* Review Form */}
        <ReviewForm
          onSubmit={handleReviewSubmit}
          isSubmitting={isSubmitting}
        />


      </div>
    </div>
  );
}
