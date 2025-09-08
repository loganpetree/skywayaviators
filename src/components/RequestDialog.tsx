"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Request } from "@/types/request";

interface RequestDialogProps {
  children: React.ReactNode;
  programName?: string;
  interestType?: 'course' | 'rental' | 'timeBuilding';
}

export function RequestDialog({ children, programName, interestType = 'course' }: RequestDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selfInsured, setSelfInsured] = useState(false);
  const [selectedInterestType, setSelectedInterestType] = useState<'course' | 'rental' | 'timeBuilding'>(interestType);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const requestData: Omit<Request, 'id'> = {
        firstName,
        lastName,
        email,
        phone,
        selfInsured,
        interestType: selectedInterestType,
        aircraftTailNumber: "N/A",
        aircraftType: "N/A",
        aircraftModel: "N/A",
        dateSubmitted: new Date().toISOString(),
        status: 'pending',
        isResponded: false,
      };

      await addDoc(collection(db, "requests"), requestData);

      setSubmitMessage("Thank you! Your request has been submitted. We'll contact you soon.");

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setSelfInsured(false);
      setSelectedInterestType(interestType);

      // Close dialog after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSubmitMessage("");
      }, 2000);

    } catch (error) {
      console.error("Error submitting request:", error);
      setSubmitMessage("Sorry, there was an error submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact for Details</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll get back to you with detailed information about {programName || "our programs"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {submitMessage && (
            <div className={`p-3 rounded-md ${submitMessage.includes('error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
              <p className="text-sm">{submitMessage}</p>
            </div>
          )}

          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Interest Type */}
          <div className="space-y-2">
            <Label>I'm interested in:</Label>
            <RadioGroup value={selectedInterestType} onValueChange={(value) => setSelectedInterestType(value as 'course' | 'rental' | 'timeBuilding')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="course" id="course" />
                <Label htmlFor="course">Flight Training Course</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rental" id="rental" />
                <Label htmlFor="rental">Aircraft Rental</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="timeBuilding" id="timeBuilding" />
                <Label htmlFor="timeBuilding">Time Building</Label>
              </div>
            </RadioGroup>
          </div>


          {/* Self Insured Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="selfInsured"
              checked={selfInsured}
              onChange={(e) => setSelfInsured(e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="selfInsured" className="text-sm">
              I am self-insured (have my own insurance)
            </Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
