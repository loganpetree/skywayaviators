'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, GraduationCap, Clock, X } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const interestOptions = [
  {
    value: 'course' as const,
    label: 'Flight School',
    desc: 'Start your pilot training',
    icon: GraduationCap,
  },
  {
    value: 'timeBuilding' as const,
    label: 'Time Building',
    desc: 'Build hours toward ATP',
    icon: Clock,
  },
];

export default function BookingDialog({ open, onOpenChange }: BookingDialogProps) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interestType: '' as 'course' | 'rental' | 'timeBuilding' | '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Required';
    else if (!/^[\+]?[1-9][\d]{0,15}$/.test(form.phone.replace(/[\s\-\(\)]/g, '')))
      errs.phone = 'Invalid phone';
    if (!form.interestType) errs.interestType = 'Select one';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'requests'), {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        interestType: form.interestType,
        dateSubmitted: new Date().toISOString(),
        status: 'pending',
        isResponded: false,
        source: 'homepage',
      });

      setShowSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setShowSuccess(false);
        setForm({ firstName: '', lastName: '', email: '', phone: '', interestType: '' });
        setErrors({});
      }, 4000);
    } catch (error) {
      console.error('Error submitting booking request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] w-[95vw] p-0 gap-0 overflow-hidden border-0 shadow-2xl" showCloseButton={false}>
        <VisuallyHidden.Root>
          <DialogTitle>Book Your Discovery Flight</DialogTitle>
        </VisuallyHidden.Root>
        {showSuccess ? (
          <div className="px-8 py-14 text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re all set!</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
              We&apos;ll reach out to <span className="font-medium text-gray-700">{form.email}</span> within 24 hours to get you started.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="relative bg-gray-50 border-b border-gray-100 px-7 py-6">
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="text-xs font-semibold tracking-widest uppercase text-sky-500 mb-1.5">
                Get Started
              </p>
              <h2 className="text-xl font-bold text-gray-900">
                Book Your Discovery Flight
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill out the form and we&apos;ll be in touch within 24 hours.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
              {/* Interest Type */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2.5">
                  I&apos;m interested in
                  {errors.interestType && (
                    <span className="text-red-500 text-xs ml-2">{errors.interestType}</span>
                  )}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((opt) => {
                    const selected = form.interestType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update('interestType', opt.value)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-all duration-150 cursor-pointer border ${
                          selected
                            ? 'border-sky-500 bg-sky-50 text-sky-700'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <opt.icon className={`w-5 h-5 ${selected ? 'text-sky-500' : 'text-gray-400'}`} />
                        <span className="text-xs font-medium leading-tight">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    First name
                    {errors.firstName && <span className="text-red-500 text-xs ml-1">*</span>}
                  </label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    placeholder="John"
                    className={`h-10 ${errors.firstName ? 'border-red-300' : ''}`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Last name
                    {errors.lastName && <span className="text-red-500 text-xs ml-1">*</span>}
                  </label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    placeholder="Doe"
                    className={`h-10 ${errors.lastName ? 'border-red-300' : ''}`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email
                  {errors.email && <span className="text-red-500 text-xs ml-2">{errors.email}</span>}
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="john@example.com"
                  className={`h-10 ${errors.email ? 'border-red-300' : ''}`}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Phone
                  {errors.phone && <span className="text-red-500 text-xs ml-2">{errors.phone}</span>}
                </label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="(469) 555-1234"
                  className={`h-10 ${errors.phone ? 'border-red-300' : ''}`}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold h-11 rounded-xl shadow-md shadow-sky-500/20 transition-all duration-200 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </Button>

              <p className="text-[11px] text-gray-400 text-center">
                By submitting, you agree to be contacted about flight training.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
