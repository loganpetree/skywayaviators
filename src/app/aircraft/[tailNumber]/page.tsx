'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, MapPin, DollarSign, Users, Plane, Shield, Check, Award, CheckCircle, Camera } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import GalleryGrid from '@/components/GalleryGrid'
import { useAircraftStore } from "@/stores/aircraftStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function AircraftDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tailNumber = params.tailNumber as string

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    selfInsured: false,
    interestType: '' as 'course' | 'rental' | 'timeBuilding' | ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    // aircraft: storeAircraft,
    loading: storeLoading,
    fetchAircraft,
    getAircraftByTailNumber,
    fetched
  } = useAircraftStore()

  // Get aircraft from store or fetch if not available
  const aircraft = getAircraftByTailNumber(tailNumber)

  console.log('🛩️ Aircraft Details Page:', {
    tailNumber,
    aircraftFound: !!aircraft,
    storeLoading,
    fetched,
    aircraft: aircraft ? { id: aircraft.id, tailNumber: aircraft.tailNumber, type: aircraft.type } : null
  })

  // If aircraft not in store and not fetched yet, fetch all aircraft
  useEffect(() => {
    if (!aircraft && !fetched && !storeLoading) {
      console.log('🔄 Aircraft Details: Fetching aircraft from store...')
      fetchAircraft()
    }
  }, [aircraft, fetched, storeLoading, fetchAircraft])

  // If aircraft not found after fetching, redirect
  useEffect(() => {
    if (fetched && !storeLoading && !aircraft) {
      console.log('❌ Aircraft Details: Aircraft not found with tailNumber:', tailNumber)
      router.push('/#fleet')
    }
  }, [fetched, storeLoading, aircraft, tailNumber, router])

  // Loading state
  const loading = storeLoading || (!aircraft && !fetched)

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!aircraft) {
      console.error('Aircraft information not available')
      return
    }

    // Validate required fields
    if (!bookingForm.firstName || !bookingForm.lastName || !bookingForm.email || !bookingForm.phone || !bookingForm.interestType) {
      console.error('Missing required fields')
      return
    }

    // Validate email format
    if (!validateEmail(bookingForm.email)) {
      console.error('Invalid email format')
      return
    }

    // Validate phone format
    if (!validatePhone(bookingForm.phone)) {
      console.error('Invalid phone format')
      return
    }

    setIsSubmitting(true)

    try {
      const requestData = {
        firstName: bookingForm.firstName,
        lastName: bookingForm.lastName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        selfInsured: bookingForm.selfInsured,
        interestType: bookingForm.interestType,
        aircraftTailNumber: aircraft.tailNumber,
        aircraftType: aircraft.type,
        aircraftModel: aircraft.model,
        dateSubmitted: new Date().toISOString(),
        status: 'pending',
        isResponded: false
      }

      await addDoc(collection(db, 'requests'), requestData)

      // Show success state instead of alert
      setShowSuccess(true)

      // Reset form after 5 seconds and close dialog
      setTimeout(() => {
        setShowBookingDialog(false)
        setShowSuccess(false)
        setBookingForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          selfInsured: false,
          interestType: ''
        })
      }, 5000)

    } catch (error) {
      console.error('Error submitting booking request:', error)
      // Could add error state here if needed
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading aircraft details...</p>
        </div>
      </div>
    )
  }

  // Render error state
  if (!aircraft) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Aircraft not found</h2>
          <p className="text-gray-500 text-sm mb-8">The aircraft you are looking for does not exist.</p>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="px-6"
          >
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Aircraft Detail Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl lg:max-w-none mx-auto">
          {/* Aircraft Gallery and Details */}
          <div className="max-w-4xl lg:max-w-[80vw] mx-auto">
            {/* Back Button - Aligned with gallery left */}
            <button
              onClick={() => router.back()}
              className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Fleet
            </button>
            {/* Gallery Section */}
            {!showAllPhotos ? (
              <GalleryGrid
                galleryImages={aircraft.images && aircraft.images.length > 0
                  ? aircraft.images.map((imageObj, index: number) => ({
                      src: imageObj.large || imageObj.medium || imageObj.original || imageObj.small,
                      alt: `${aircraft.type} ${aircraft.model} ${aircraft.tailNumber} - Photo ${index + 1}`,
                      isPlaceholder: false
                    }))
                  : []
                }
                instructor={aircraft.type || aircraft.model || 'Aircraft'}
                handleShowAllPhotos={() => setShowAllPhotos(true)}
                loading={loading}
                aircraftImages={aircraft.images || []}
              />
            ) : (
              /* Full Gallery View */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">All Photos</h2>
                  <Button
                    onClick={() => setShowAllPhotos(false)}
                    variant="outline"
                  >
                    Back to Gallery
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    // Loading placeholders for full gallery view
                    Array.from({ length: Math.min(aircraft?.images?.length || 6, 9) }, (_, index) => (
                      <div key={index} className="aspect-square relative overflow-hidden rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <Camera className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Loading...</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    aircraft.images && aircraft.images.map((imageObj, index: number) => (
                      <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                        <img
                          src={imageObj.large || imageObj.original || imageObj.medium || imageObj.small}
                          alt={`${aircraft.type} ${aircraft.model} ${aircraft.tailNumber} - Photo ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Title and Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-8 border-b border-gray-200 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              {aircraft.type} {aircraft.model}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <MapPin className="w-4 h-4" />
              <span>Lancaster, TX</span>
            </div>
            <p className="text-gray-600">
              {aircraft.tailNumber} • {aircraft.capacity} occupants
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 py-6 text-sm text-gray-600 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium text-gray-900">{aircraft.hourlyRate}</span>
            <span>per hour</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Up to {aircraft.capacity} occupants</span>
          </div>
          <div className="flex items-center gap-1">
            <Plane className="w-4 h-4" />
            <span>{aircraft.type} {aircraft.model}</span>
          </div>
          {aircraft.equipment && aircraft.equipment.length > 0 && (
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>{aircraft.equipment.join(', ')}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>FAA Certified</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 py-12">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Key Features */}
            <div className="space-y-8 pb-8 border-b border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Premium Aircraft</h4>
                  <p className="text-gray-600">
                    Well-maintained {aircraft.type} {aircraft.model} perfect for flight training and personal use.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Fully Certified</h4>
                  <p className="text-gray-600">
                    Meets all FAA standards and regularly inspected for safety.
                  </p>
            </div>
          </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              <div>
                  <h4 className="font-medium text-gray-900 mb-1">Flexible Capacity</h4>
                  <p className="text-gray-600">
                    Seats up to {aircraft.capacity} occupants comfortably for various mission requirements.
                  </p>
                </div>
              </div>
            </div>

            {/* About */}
            <div id="about" className="space-y-4 pb-8 border-b border-gray-200">
              <h3 className="text-xl font-medium text-gray-900">About this aircraft</h3>
              <p className="text-gray-700 leading-relaxed text-base">
                  {aircraft.description}
                </p>
              </div>

            {/* Specifications */}
            <div id="specifications" className="space-y-8 pb-8 border-b border-gray-200">
              <h3 className="text-xl font-medium text-gray-900">Aircraft Details</h3>

              <div className="space-y-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Aircraft Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg">
                      <Check className="w-4 h-4 flex-shrink-0 text-green-600" />
                      <div>
                        <span className="text-gray-800 font-medium">Aircraft Type</span>
                        <p className="text-gray-600 text-sm">{aircraft.type} {aircraft.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg">
                      <Check className="w-4 h-4 flex-shrink-0 text-green-600" />
                      <div>
                        <span className="text-gray-800 font-medium">Tail Number</span>
                        <p className="text-gray-600 text-sm">{aircraft.tailNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg">
                      <Check className="w-4 h-4 flex-shrink-0 text-green-600" />
                      <div>
                        <span className="text-gray-800 font-medium">Capacity</span>
                        <p className="text-gray-600 text-sm">Up to {aircraft.capacity} occupants</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg">
                      <Check className="w-4 h-4 flex-shrink-0 text-green-600" />
                      <div>
                        <span className="text-gray-800 font-medium">Hourly Rate</span>
                        <p className="text-gray-600 text-sm">${aircraft.hourlyRate}/hour</p>
                  </div>
                  </div>
                </div>
              </div>

                {aircraft.equipment && aircraft.equipment.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Equipment & Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {aircraft.equipment.map((equipment: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg">
                          <Check className="w-4 h-4 flex-shrink-0 text-green-600" />
                          <span className="text-gray-800 font-medium">{equipment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {aircraft.features && aircraft.features.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Additional Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {aircraft.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg">
                          <Check className="w-4 h-4 flex-shrink-0 text-green-600" />
                          <span className="text-gray-800 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="border-2 border-gray-200 shadow-xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to fly?</h3>
                    <p className="text-gray-600">Book this aircraft for your next flight</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Hourly Rate</span>
                      <span className="font-semibold text-lg">${aircraft.hourlyRate}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-semibold">Up to {aircraft.capacity}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Aircraft</span>
                        <span className="font-medium">{aircraft.type} {aircraft.model}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600">Tail Number</span>
                        <span className="font-medium">{aircraft.tailNumber}</span>
                      </div>
                    </div>
                  </div>

                  <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 text-base rounded-lg mb-4">
                        Book This Aircraft
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md w-[95vw] max-w-[400px] mx-4 p-4 sm:p-6">
                      <DialogHeader className="space-y-2 pb-4">
                        <DialogTitle className="text-xl font-semibold">Book This Aircraft</DialogTitle>
                      </DialogHeader>

                      {showSuccess ? (
                        <div className="text-center py-6 sm:py-8 space-y-4">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          </div>
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900">Request Submitted Successfully!</h3>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                              Thank you for your interest in {aircraft?.type} {aircraft?.model}.
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

                        {/* Self-insured checkbox */}
                        <div className="flex items-start space-x-3 py-2">
                          <input
                            type="checkbox"
                            id="selfInsured"
                            checked={bookingForm.selfInsured}
                            onChange={(e) =>
                              setBookingForm(prev => ({ ...prev, selfInsured: e.target.checked }))
                            }
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                          />
                          <Label htmlFor="selfInsured" className="text-sm font-normal cursor-pointer leading-relaxed">
                            I am self-insured
                          </Label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowBookingDialog(false)}
                            disabled={isSubmitting}
                            className="h-11 text-base font-medium"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 h-11 text-base font-medium"
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

                  <Button
                    onClick={() => router.push('/#fleet')}
                    variant="outline"
                    className="w-full font-medium py-4 text-base rounded-lg border-2 hover:bg-gray-50"
                  >
                    Back to Fleet
                </Button>

                  <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">Fully insured</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-600">Regular maintenance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                        <Award className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-600">FAA certified</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © 2022 Skyway Aviators. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

