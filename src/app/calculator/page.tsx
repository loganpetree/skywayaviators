'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface RatingRequirements {
  name: string;
  totalHours: number;
  additionalHours: number; // hours needed beyond current
  description: string;
}

export default function CalculatorPage() {
  const [currentHours, setCurrentHours] = useState<number>(0);
  const [aircraftPrice, setAircraftPrice] = useState<number>(0);
  const [instructorPrice, setInstructorPrice] = useState<number>(0);

  // FAA minimum hours for each rating (approximate - student should verify)
  const ratings: RatingRequirements[] = [
    {
      name: 'Private Pilot Certificate',
      totalHours: 40,
      additionalHours: 0, // will be calculated
      description: 'Minimum 40 hours total time, 20 hours dual instruction, 10 hours solo flight'
    },
    {
      name: 'Instrument Rating',
      totalHours: 50,
      additionalHours: 0, // will be calculated
      description: 'Minimum 50 hours cross-country PIC, 40 hours actual/simulated instrument, 15 hours instrument flight training'
    },
    {
      name: 'Commercial Pilot Certificate',
      totalHours: 250,
      additionalHours: 0, // will be calculated
      description: 'Minimum 250 hours total time, 100 hours PIC, 50 hours cross-country PIC'
    },
    {
      name: 'ATP Certificate',
      totalHours: 1500,
      additionalHours: 0, // will be calculated
      description: 'Minimum 1,500 hours total time, 500 hours cross-country, 75 hours night, 100 hours night PIC'
    }
  ];

  const calculateCosts = () => {
    const updatedRatings = ratings.map(rating => {
      const additionalHours = Math.max(0, rating.totalHours - currentHours);
      const aircraftCost = additionalHours * aircraftPrice;
      const instructorCost = additionalHours * instructorPrice; // Assuming dual instruction for simplicity
      const totalCost = aircraftCost + instructorCost;

      return {
        ...rating,
        additionalHours,
        aircraftCost,
        instructorCost,
        totalCost
      };
    });

    return updatedRatings;
  };

  const costs = calculateCosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Flight Training Cost Calculator</h1>
          <p className="text-lg text-gray-600">
            Estimate the cost to complete your pilot certifications based on FAA minimum requirements
          </p>
        </div>

        {/* Input Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Current Training Details</CardTitle>
            <CardDescription>
              Enter your current flight hours and hourly rates to calculate costs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-hours">Current Flight Hours</Label>
                <Input
                  id="current-hours"
                  type="number"
                  placeholder="0"
                  value={currentHours || ''}
                  onChange={(e) => setCurrentHours(Number(e.target.value) || 0)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aircraft-price">Aircraft Rental Rate ($/hour)</Label>
                <Input
                  id="aircraft-price"
                  type="number"
                  placeholder="0"
                  value={aircraftPrice || ''}
                  onChange={(e) => setAircraftPrice(Number(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor-price">Flight Instructor Rate ($/hour)</Label>
                <Input
                  id="instructor-price"
                  type="number"
                  placeholder="0"
                  value={instructorPrice || ''}
                  onChange={(e) => setInstructorPrice(Number(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {costs.map((rating, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <CardTitle className="text-lg">{rating.name}</CardTitle>
                <CardDescription className="text-sm">
                  {rating.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Required Total Hours:</span>
                    <p className="text-gray-600">{rating.totalHours}</p>
                  </div>
                  <div>
                    <span className="font-medium">Additional Hours Needed:</span>
                    <p className="text-gray-600">{rating.additionalHours}</p>
                  </div>
                </div>

                {rating.additionalHours > 0 ? (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Aircraft Rental:</span>
                      <span className="font-medium">${rating.aircraftCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Flight Instruction:</span>
                      <span className="font-medium">${rating.instructorCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="font-semibold">Total Estimated Cost:</span>
                      <span className="font-bold text-lg text-blue-600">
                        ${rating.totalCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-green-600 font-medium">✓ You already meet the minimum requirements!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-600 text-xl">⚠️</div>
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
                <p className="text-sm text-yellow-700">
                  These calculations are based on FAA minimum requirements and are for estimation purposes only.
                  Actual costs may vary based on your specific training program, weather, aircraft availability,
                  and individual learning progress. Always consult with your flight instructor and check the
                  latest FAA regulations for your specific certification path.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

