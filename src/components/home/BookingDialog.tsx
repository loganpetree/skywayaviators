'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookingDialog({ open, onOpenChange }: BookingDialogProps) {
  const [bookingForm, setBookingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interestType: '' as 'course' | 'rental' | 'timeBuilding' | ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!bookingForm.firstName || !bookingForm.lastName || !bookingForm.email || !bookingForm.phone || !bookingForm.interestType) {
      console.error('Missing required fields');
      return;
    }

    // Validate email format
    if (!validateEmail(bookingForm.email)) {
      console.error('Invalid email format');
      return;
    }

    // Validate phone format
    if (!validatePhone(bookingForm.phone)) {
      console.error('Invalid phone format');
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        firstName: bookingForm.firstName,
        lastName: bookingForm.lastName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        interestType: bookingForm.interestType,
        dateSubmitted: new Date().toISOString(),
        status: 'pending',
        isResponded: false,
        source: 'homepage'
      };

      await addDoc(collection(db, 'requests'), requestData);

      // Show success state
      setShowSuccess(true);

      // Reset form after 5 seconds and close dialog
      setTimeout(() => {
        onOpenChange(false);
        setShowSuccess(false);
        setBookingForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          interestType: ''
        });
      }, 5000);

    } catch (error) {
      console.error('Error submitting booking request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[400px] mx-4 p-4 sm:p-6">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="text-xl font-semibold">Book Your Flight Training</DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-6 sm:py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Request Submitted Successfully!</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Thank you for your interest in Skyway Aviators flight training.
                We will contact you at <strong className="text-gray-900">{bookingForm.email}</strong> within 24 hours to discuss your request.
              </p>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-4">
              This dialog will close automatically in a few seconds...
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4 sm:space-y-5">
            {/* Name Fields - Stack on mobile, side-by-side on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={bookingForm.firstName}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                  className="h-11 text-base"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={bookingForm.lastName}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                  className="h-11 text-base"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={bookingForm.email}
                onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className="h-11 text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={bookingForm.phone}
                onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
                className="h-11 text-base"
                required
              />
            </div>

            {/* Interest Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Interest Type *</Label>
              <RadioGroup
                value={bookingForm.interestType}
                onValueChange={(value: 'course' | 'rental' | 'timeBuilding') =>
                  setBookingForm(prev => ({ ...prev, interestType: value }))
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="course" id="course" className="h-5 w-5" />
                  <Label htmlFor="course" className="text-sm font-normal cursor-pointer flex-1">Course Program</Label>
                </div>
                <div className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="rental" id="rental" className="h-5 w-5" />
                  <Label htmlFor="rental" className="text-sm font-normal cursor-pointer flex-1">Aircraft Rental</Label>
                </div>
                <div className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="timeBuilding" id="timeBuilding" className="h-5 w-5" />
                  <Label htmlFor="timeBuilding" className="text-sm font-normal cursor-pointer flex-1">Time Building</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="h-11 text-base font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 h-11 text-base font-medium"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
