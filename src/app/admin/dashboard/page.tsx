"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { TrafficChart } from "@/components/TrafficChart";
import { RequestsTable } from "@/components/RequestsTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Aircraft } from "@/types/aircraft";
import { Request } from "@/types/request";

type TabType = "overview" | "aircraft" | "packages" | "requests" | "testimonials" | "flight-hours";

const tabs = [
  { id: "overview" as TabType, label: "Overview", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" },
  { id: "aircraft" as TabType, label: "Aircraft", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "packages" as TabType, label: "Packages", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { id: "requests" as TabType, label: "Requests", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id: "testimonials" as TabType, label: "Testimonials", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { id: "flight-hours" as TabType, label: "Flight Hours", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [aircraftList, setAircraftList] = useState<Aircraft[]>([]);
  const [loadingAircraft, setLoadingAircraft] = useState(true);
  const [editingAircraft, setEditingAircraft] = useState<Aircraft | null>(null);
  const [todayRequests, setTodayRequests] = useState<Request[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [loadingAllRequests, setLoadingAllRequests] = useState(false);
  const [existingImages, setExistingImages] = useState<{ original: string; large: string; medium: string; small: string }[]>([]);
  const [aircraftForm, setAircraftForm] = useState<{
    tailNumber: string;
    type: string;
    model: string;
    description: string;
    capacity: number;
    hourlyRate: number;
    images: File[];
    equipment: string[];
    features: string[];
    isHidden: boolean;
    year?: number;
  }>({
    tailNumber: "",
    type: "",
    model: "",
    description: "",
    capacity: 0,
    hourlyRate: 0,
    images: [],
    equipment: [],
    features: [],
    isHidden: false,
    year: undefined,
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchAircraft(); // Fetch aircraft when user is authenticated
        fetchTodayRequests(); // Fetch today's requests when user is authenticated
        fetchAllRequests(); // Fetch all requests when user is authenticated
      } else {
        router.push("/admin");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Clean up image previews when dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      imagePreviews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      setImagePreviews([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAircraftFormChange = (field: keyof typeof aircraftForm, value: string | number | File[] | string[] | undefined) => {
    setAircraftForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createImagePreviews = (files: File[]) => {
    // Clean up existing previews
    imagePreviews.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });

    const newPreviews: string[] = [];
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push(previewUrl);
      }
    });

    setImagePreviews(newPreviews);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }

    if (editingAircraft) {
      // Handle existing images reordering
      const newExistingImages = [...existingImages];
      const [draggedImage] = newExistingImages.splice(draggedIndex, 1);
      newExistingImages.splice(dropIndex, 0, draggedImage);

      const newPreviews = [...imagePreviews];
      const [draggedPreview] = newPreviews.splice(draggedIndex, 1);
      newPreviews.splice(dropIndex, 0, draggedPreview);

      setExistingImages(newExistingImages);
      setImagePreviews(newPreviews);
    } else {
      // Handle new images reordering
      const newFiles = [...aircraftForm.images];
      const [draggedFile] = newFiles.splice(draggedIndex, 1);
      newFiles.splice(dropIndex, 0, draggedFile);

      const newPreviews = [...imagePreviews];
      const [draggedPreview] = newPreviews.splice(draggedIndex, 1);
      newPreviews.splice(dropIndex, 0, draggedPreview);

      handleAircraftFormChange('images', newFiles);
      setImagePreviews(newPreviews);
    }

    setDraggedIndex(null);
  };

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', 0.85);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const fetchAircraft = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "aircraft"));
      const aircraft: Aircraft[] = [];
      querySnapshot.forEach((doc) => {
        aircraft.push({ id: doc.id, ...doc.data() } as Aircraft);
      });
      setAircraftList(aircraft);
    } catch (error) {
      console.error("Error fetching aircraft:", error);
    } finally {
      setLoadingAircraft(false);
    }
  };

  const fetchTodayRequests = async () => {
    try {
      setLoadingRequests(true);
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      // Get all requests and filter by date in JavaScript
      // This is simpler than dealing with Firestore date queries
      const q = query(
        collection(db, "requests"),
        orderBy("dateSubmitted", "desc")
      );

      const querySnapshot = await getDocs(q);
      const allRequests: Request[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allRequests.push({
          id: doc.id,
          ...data,
          dateSubmitted: data.dateSubmitted || new Date().toISOString(),
        } as Request);
      });

      // Filter for today's requests
      const todayRequests = allRequests.filter(request => {
        const requestDate = new Date(request.dateSubmitted);
        return requestDate >= startOfDay && requestDate < endOfDay;
      });

      setTodayRequests(todayRequests);
    } catch (error) {
      console.error("Error fetching today's requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchAllRequests = async () => {
    try {
      setLoadingAllRequests(true);
      const q = query(
        collection(db, "requests"),
        orderBy("dateSubmitted", "desc")
      );

      const querySnapshot = await getDocs(q);
      const requests: Request[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({
          id: doc.id,
          ...data,
          dateSubmitted: data.dateSubmitted || new Date().toISOString(),
        } as Request);
      });
      setAllRequests(requests);
    } catch (error) {
      console.error("Error fetching all requests:", error);
    } finally {
      setLoadingAllRequests(false);
    }
  };

  const handleUpdateRequestStatus = async (requestId: string | undefined, isResponded: boolean) => {
    if (!requestId) {
      console.error("Request ID is undefined");
      return;
    }

    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, "requests", requestId), {
        isResponded,
        status: isResponded ? 'responded' : 'pending',
        respondedAt: isResponded ? now : null,
        respondedBy: user?.email,
      });

      // Update local state
      setTodayRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? {
                ...req,
                isResponded,
                status: isResponded ? 'responded' : 'pending',
                respondedAt: isResponded ? now : undefined,
                respondedBy: user?.email || undefined
              }
            : req
        )
      );

      setAllRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? {
                ...req,
                isResponded,
                status: isResponded ? 'responded' : 'pending',
                respondedAt: isResponded ? now : undefined,
                respondedBy: user?.email || undefined
              }
            : req
        )
      );
    } catch (error) {
      console.error("Error updating request status:", error);
      alert("Error updating request status. Please try again.");
    }
  };

  const handleEditAircraft = (aircraft: Aircraft) => {
    setEditingAircraft(aircraft);

    // Initialize existing images
    if (aircraft.images && aircraft.images.length > 0) {
      setExistingImages(aircraft.images);
      const previews = aircraft.images.map(imageData => imageData.medium || imageData.small || imageData.original);
      setImagePreviews(previews);
    } else {
      setExistingImages([]);
      setImagePreviews([]);
    }

    setAircraftForm({
      tailNumber: aircraft.tailNumber,
      type: aircraft.type,
      model: aircraft.model,
      description: aircraft.description,
      capacity: aircraft.capacity,
      hourlyRate: aircraft.hourlyRate,
      images: [], // Keep as empty since we're editing existing images separately
      equipment: aircraft.equipment || [],
      features: aircraft.features || [],
      isHidden: aircraft.isHidden,
      year: aircraft.year,
    });
    setDialogOpen(true);
  };

  const handleDeleteAircraft = async (aircraftId: string) => {
    if (confirm("Are you sure you want to delete this aircraft?")) {
      try {
        await deleteDoc(doc(db, "aircraft", aircraftId));
        setAircraftList(prev => prev.filter(aircraft => aircraft.id !== aircraftId));
      } catch (error) {
        console.error("Error deleting aircraft:", error);
        alert("Error deleting aircraft. Please try again.");
      }
    }
  };

  const handleAircraftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Process and upload images to Firebase Storage with multiple sizes
      let uploadedImageData: { original: string; large: string; medium: string; small: string }[] = [];

      // Handle existing images (may have been reordered or deleted)
      if (editingAircraft && existingImages.length > 0) {
        uploadedImageData = [...existingImages];
      }

      // Add any new images uploaded
      if (aircraftForm.images.length > 0) {
        for (const imageFile of aircraftForm.images) {
          const baseName = `${Date.now()}_${imageFile.name.replace(/\.[^/.]+$/, "")}`;

          // Create different sizes
          const [originalBlob, largeBlob, mediumBlob, smallBlob] = await Promise.all([
            Promise.resolve(imageFile), // Keep original as-is
            resizeImage(imageFile, 1200, 1200), // Large
            resizeImage(imageFile, 600, 600),   // Medium
            resizeImage(imageFile, 200, 200),   // Small
          ]);

          // Upload all sizes
          const uploadPromises = [
            { size: 'original', blob: originalBlob, name: `${baseName}_original.jpg` },
            { size: 'large', blob: largeBlob, name: `${baseName}_large.jpg` },
            { size: 'medium', blob: mediumBlob, name: `${baseName}_medium.jpg` },
            { size: 'small', blob: smallBlob, name: `${baseName}_small.jpg` },
          ];

          const uploadedUrls: { [key: string]: string } = {};

          for (const { size, blob, name } of uploadPromises) {
            const storageRef = ref(storage, `aircraft/${name}`);
            const snapshot = await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(snapshot.ref);
            uploadedUrls[size] = downloadURL;
          }

          uploadedImageData.push({
            original: uploadedUrls.original,
            large: uploadedUrls.large,
            medium: uploadedUrls.medium,
            small: uploadedUrls.small,
          });
        }
      }

      // Prepare aircraft data
      const aircraftData: Partial<Aircraft> = {
        tailNumber: aircraftForm.tailNumber,
        type: aircraftForm.type,
        model: aircraftForm.model,
        description: aircraftForm.description,
        capacity: aircraftForm.capacity,
        hourlyRate: aircraftForm.hourlyRate,
        images: uploadedImageData,
        isHidden: false,
      };

      // Only add equipment and features if they have values
      if (aircraftForm.equipment.length > 0) {
        aircraftData.equipment = aircraftForm.equipment;
      }
      if (aircraftForm.features.length > 0) {
        aircraftData.features = aircraftForm.features;
      }

      // Add year if provided
      if (aircraftForm.year && aircraftForm.year > 0) {
        aircraftData.year = aircraftForm.year;
      }

      // Save to Firestore
      if (editingAircraft) {
        // Update existing aircraft
        await updateDoc(doc(db, "aircraft", editingAircraft.id), {
          ...aircraftData,
          updatedAt: serverTimestamp(),
        });
        console.log("Aircraft updated with ID:", editingAircraft.id);
      } else {
        // Create new aircraft
        const docRef = await addDoc(collection(db, "aircraft"), {
          ...aircraftData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log("Aircraft added with ID:", docRef.id);
      }

      // Close dialog and reset form
      setDialogOpen(false);
      setAircraftForm({
        tailNumber: "",
        type: "",
        model: "",
        description: "",
        capacity: 0,
        hourlyRate: 0,
        images: [],
        equipment: [],
        features: [],
        isHidden: false,
        year: undefined,
      });

      // Clear editing state
      setEditingAircraft(null);
      setExistingImages([]);

      // Clean up image previews
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews([]);

      // Refresh aircraft list
      await fetchAircraft();

      // Show success message (you could add a toast notification here)
      alert(editingAircraft ? "Aircraft updated successfully!" : "Aircraft added successfully!");

    } catch (error) {
      console.error("Error adding aircraft:", error);
      alert("Error adding aircraft. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <TrafficChart />
            <div className="space-y-4">
              {loadingRequests ? (
                <div className="flex items-center justify-center min-h-[200px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading requests...</p>
                  </div>
                </div>
              ) : (
                <RequestsTable
                  requests={todayRequests}
                  onUpdateStatus={handleUpdateRequestStatus}
                />
              )}
            </div>
          </div>
        );

      case "aircraft":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Aircraft Management</h2>
                <p className="text-sm text-gray-600">Manage your aircraft fleet and availability</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) {
                  setEditingAircraft(null);
                  setExistingImages([]);
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add New Aircraft
                  </Button>
                </DialogTrigger>
                <DialogContent className="!w-[98vw] !max-w-none max-h-[95vh] overflow-y-auto">
                  <DialogHeader className="pb-6">
                    <DialogTitle className="text-2xl">
                      {editingAircraft ? 'Edit Aircraft' : 'Add New Aircraft'}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {editingAircraft
                        ? 'Update the aircraft details. All fields marked with * are required.'
                        : 'Fill in the details for the new aircraft. All fields marked with * are required.'
                      }
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleAircraftSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Tail Number */}
                      <div className="space-y-2">
                        <Label htmlFor="tailNumber">Tail Number *</Label>
                        <Input
                          id="tailNumber"
                          placeholder="N12345"
                          value={aircraftForm.tailNumber}
                          onChange={(e) => handleAircraftFormChange('tailNumber', e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Type */}
                      <div className="space-y-2">
                        <Label htmlFor="type">Aircraft Type *</Label>
                        <Input
                          id="type"
                          placeholder="Cessna, Piper, etc."
                          value={aircraftForm.type}
                          onChange={(e) => handleAircraftFormChange('type', e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Model */}
                      <div className="space-y-2">
                        <Label htmlFor="model">Model *</Label>
                        <Input
                          id="model"
                          placeholder="172, PA-28, etc."
                          value={aircraftForm.model}
                          onChange={(e) => handleAircraftFormChange('model', e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Year */}
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          type="number"
                          placeholder="2020"
                          value={aircraftForm.year || ''}
                          onChange={(e) => handleAircraftFormChange('year', e.target.value === '' ? undefined : parseInt(e.target.value) || undefined)}
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Capacity */}
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity *</Label>
                        <Input
                          id="capacity"
                          type="number"
                          placeholder="4"
                          value={aircraftForm.capacity || ''}
                          onChange={(e) => handleAircraftFormChange('capacity', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Hourly Rate */}
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate ($) *</Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          step="0.01"
                          placeholder="150.00"
                          value={aircraftForm.hourlyRate || ''}
                          onChange={(e) => handleAircraftFormChange('hourlyRate', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the aircraft, its features, and any special notes..."
                        value={aircraftForm.description}
                        onChange={(e) => handleAircraftFormChange('description', e.target.value)}
                        rows={3}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Images */}
                    <div className="space-y-2">
                      <Label htmlFor="images">
                        Aircraft Images
                        {editingAircraft && imagePreviews.length > 0 && (
                          <span className="text-sm text-muted-foreground ml-2">
                            ({imagePreviews.length} existing)
                          </span>
                        )}
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          id="images"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            handleAircraftFormChange('images', files);
                            createImagePreviews(files);
                          }}
                          className="hidden"
                          disabled={isSubmitting}
                        />
                        <label htmlFor="images" className="cursor-pointer">
                          <div className="flex flex-col items-center space-y-2">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium text-blue-600 hover:text-blue-500">
                                {editingAircraft ? 'Add more images' : 'Click to upload'}
                              </span> or drag and drop
                            </div>
                            <div className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB each
                            </div>
                          </div>
                        </label>
                      </div>
                      {imagePreviews.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">
                            {imagePreviews.length} image{imagePreviews.length !== 1 ? 's' : ''} {editingAircraft ? 'loaded' : 'selected'}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {imagePreviews.map((previewUrl, index) => (
                              <div
                                key={index}
                                className={`relative group cursor-move ${
                                  draggedIndex === index ? 'opacity-50' : ''
                                }`}
                                draggable={!isSubmitting}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDragEnd={handleDragEnd}
                                onDrop={(e) => handleDrop(e, index)}
                              >
                                <img
                                  src={previewUrl}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (editingAircraft) {
                                      // Remove existing image
                                      const newExistingImages = existingImages.filter((_, i) => i !== index);
                                      const newPreviews = imagePreviews.filter((_, i) => i !== index);
                                      setExistingImages(newExistingImages);
                                      setImagePreviews(newPreviews);
                                    } else {
                                      // Remove new image
                                      const newFiles = aircraftForm.images.filter((_, i) => i !== index);
                                      const newPreviews = imagePreviews.filter((_, i) => i !== index);

                                      handleAircraftFormChange('images', newFiles);
                                      // Clean up the removed preview URL
                                      if (previewUrl.startsWith('blob:')) {
                                        URL.revokeObjectURL(previewUrl);
                                      }
                                      setImagePreviews(newPreviews);
                                    }
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                  disabled={isSubmitting}
                                >
                                  ×
                                </button>
                                {/* Drag handle indicator */}
                                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  Drag to reorder
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Equipment */}
                    <div className="space-y-2">
                      <Label htmlFor="equipment">Equipment</Label>
                      <Textarea
                        id="equipment"
                        placeholder="List equipment separated by commas (GPS, Autopilot, etc.)"
                        value={aircraftForm.equipment?.join(', ') || ''}
                        onChange={(e) => handleAircraftFormChange('equipment', e.target.value.split(',').map(item => item.trim()).filter(item => item))}
                        rows={2}
                      />
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <Label htmlFor="features">Features</Label>
                      <Textarea
                        id="features"
                        placeholder="List features separated by commas (IFR Certified, Leather Seats, etc.)"
                        value={aircraftForm.features?.join(', ') || ''}
                        onChange={(e) => handleAircraftFormChange('features', e.target.value.split(',').map(item => item.trim()).filter(item => item))}
                        rows={2}
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                          ? (editingAircraft ? "Saving Changes..." : "Adding Aircraft...")
                          : (editingAircraft ? "Save Changes" : "Add Aircraft")
                        }
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Aircraft List */}
            {loadingAircraft ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading aircraft...</p>
                </div>
              </div>
            ) : aircraftList.length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px] w-full">
                <div className="text-center space-y-6 px-4 max-w-md">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      No aircraft added yet
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                      Get started by adding your first aircraft to the platform
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aircraftList.map((aircraft) => (
                  <div key={aircraft.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {aircraft.type} {aircraft.model}
                        </h3>
                        <p className="text-sm text-gray-600">{aircraft.tailNumber}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditAircraft(aircraft)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteAircraft(aircraft.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    {aircraft.images && aircraft.images.length > 0 && (
                      <div className="mb-4">
                        <img
                          src={aircraft.images[0].medium}
                          alt={`${aircraft.type} ${aircraft.model}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Capacity:</span>
                        <span>{aircraft.capacity} occupants</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hourly Rate:</span>
                        <span>${aircraft.hourlyRate}/hr</span>
                      </div>
                      {aircraft.year && (
                        <div className="flex justify-between">
                          <span>Year:</span>
                          <span>{aircraft.year}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "packages":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Package Management</h2>
              <p className="text-gray-600 mb-6">Create and manage flight training packages</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button>Create New Package</Button>
                <Button variant="outline">View All Packages</Button>
              </div>
            </div>
          </div>
        );

      case "requests":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">All Flight Requests</h2>
                <Button
                  variant="outline"
                  onClick={fetchAllRequests}
                  disabled={loadingAllRequests}
                  size="sm"
                >
                  {loadingAllRequests ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
              {loadingAllRequests && allRequests.length === 0 ? (
                <div className="flex items-center justify-center min-h-[200px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading all requests...</p>
                  </div>
                </div>
              ) : (
                <RequestsTable
                  requests={allRequests}
                  onUpdateStatus={handleUpdateRequestStatus}
                />
              )}
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Testimonials</h2>
              <p className="text-gray-600 mb-6">Manage customer testimonials and reviews</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button>View All Testimonials</Button>
                <Button variant="outline">Moderate Reviews</Button>
              </div>
            </div>
          </div>
        );

      case "flight-hours":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Flight Hours Tracking</h2>
              <p className="text-gray-600 mb-6">Track and manage flight hours for students</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button>View Student Hours</Button>
                <Button variant="outline">Log Flight Time</Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 overflow-y-auto lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex-1 px-4 py-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-left mb-2
                  ${activeTab === tab.id
                    ? 'bg-gray-100 text-gray-900 font-medium rounded-md'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <svg
                  className="w-5 h-5 mr-3 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 lg:hidden">
          <div className="px-4 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 lg:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900 lg:hidden">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h1>
              <div className="w-10 lg:hidden" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
