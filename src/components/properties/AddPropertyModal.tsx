'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PropertyType, PropertyStatus } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Home, MapPin, DollarSign, Building, Calendar, FileText } from 'lucide-react';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyAdded: () => void;
}

interface FormData {
  name: string;
  location: string;
  type: PropertyType;
  price: string;
  status: PropertyStatus;
  description: string;
  amenities: string;
  builder: string;
  possessionDate: string;
  reraNumber: string;
}

interface FormErrors {
  name?: string;
  location?: string;
  type?: string;
  price?: string;
  status?: string;
}

export function AddPropertyModal({ isOpen, onClose, onPropertyAdded }: AddPropertyModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    location: '',
    type: PropertyType.APARTMENT,
    price: '',
    status: PropertyStatus.ACTIVE,
    description: '',
    amenities: '',
    builder: '',
    possessionDate: '',
    reraNumber: '',
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Property name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Property type is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.price)) {
      newErrors.price = 'Please enter a valid price (numbers only)';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the request data
      const requestData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        type: formData.type,
        price: formData.price.trim(),
        status: formData.status,
        description: formData.description.trim(),
        builder: formData.builder.trim(),
        reraNumber: formData.reraNumber.trim(),
      };

      // Parse amenities if provided
      if (formData.amenities.trim()) {
        (requestData as any).amenities = formData.amenities.split(',').map(a => a.trim()).filter(a => a);
      }

      // Add possession date if provided
      if (formData.possessionDate) {
        (requestData as any).possessionDate = formData.possessionDate;
      }

      console.log('Creating property with data:', requestData);

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.error || `Failed to create property (status: ${response.status})`);
      }
      
      const result = await response.json();
      console.log('Property created successfully:', result);
      
      toast({
        title: "Success",
        description: "Property created successfully!",
      });
      
      // Reset form and close modal
      setFormData({
        name: '',
        location: '',
        type: PropertyType.APARTMENT,
        price: '',
        status: PropertyStatus.ACTIVE,
        description: '',
        amenities: '',
        builder: '',
        possessionDate: '',
        reraNumber: '',
      });
      setErrors({});
      onClose();
      
      // Notify parent component to refresh the list
      onPropertyAdded();
      
    } catch (error) {
      console.error('Error creating property:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (field in errors && errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Add New Property
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new property to your portfolio.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Property Name *</Label>
            <div className="relative">
              <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? "border-red-500 pl-10" : "pl-10"}
                placeholder="Enter property name"
                disabled={isSubmitting}
              />
            </div>
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={errors.location ? "border-red-500 pl-10" : "pl-10"}
                placeholder="Enter property location"
                disabled={isSubmitting}
              />
            </div>
            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
          </div>

          {/* Type and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Property Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PropertyType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PropertyStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={errors.price ? "border-red-500 pl-10" : "pl-10"}
                placeholder="Enter price"
                disabled={isSubmitting}
              />
            </div>
            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
          </div>

          {/* Builder and RERA Number Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="builder">Builder</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="builder"
                  value={formData.builder}
                  onChange={(e) => handleInputChange('builder', e.target.value)}
                  className="pl-10"
                  placeholder="Enter builder name"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reraNumber">RERA Number</Label>
              <Input
                id="reraNumber"
                value={formData.reraNumber}
                onChange={(e) => handleInputChange('reraNumber', e.target.value)}
                placeholder="Enter RERA number"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Possession Date */}
          <div className="space-y-2">
            <Label htmlFor="possessionDate">Possession Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="possessionDate"
                type="date"
                value={formData.possessionDate}
                onChange={(e) => handleInputChange('possessionDate', e.target.value)}
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <Label htmlFor="amenities">Amenities</Label>
            <Textarea
              id="amenities"
              value={formData.amenities}
              onChange={(e) => handleInputChange('amenities', e.target.value)}
              placeholder="Enter amenities separated by commas (e.g., Swimming Pool, Gym, Parking)"
              className="min-h-[80px]"
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter property description"
                className="min-h-[100px] pl-10"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Property'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}