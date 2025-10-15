'use client';

import { useState, useEffect } from 'react';
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
import { LeadSource, LeadStatus } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Phone, Building, Users, Briefcase, MapPin } from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadAdded: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  companySize: string;
  companyIndustry: string;
  jobRole: string;
  source: LeadSource;
  status: LeadStatus;
  preferences: string;
  assignedToId: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  source?: string;
  status?: string;
  assignedToId?: string;
}

export function AddLeadModal({ isOpen, onClose, onLeadAdded }: AddLeadModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    companySize: '',
    companyIndustry: '',
    jobRole: '',
    source: LeadSource.WEBSITE,
    status: LeadStatus.WARM,
    preferences: '',
    assignedToId: '',
  });

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load sales representatives",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.source) {
      newErrors.source = 'Source is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    if (!formData.assignedToId) {
      newErrors.assignedToId = 'Assigned sales representative is required';
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
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        companyName: formData.companyName.trim(),
        companySize: formData.companySize.trim(),
        companyIndustry: formData.companyIndustry.trim(),
        jobRole: formData.jobRole.trim(),
        source: formData.source,
        status: formData.status,
        assignedToId: formData.assignedToId || undefined,
      };

      // Only add preferences if provided and valid JSON
      if (formData.preferences.trim()) {
        try {
          (requestData as any).preferences = JSON.parse(formData.preferences);
        } catch (e) {
          throw new Error('Invalid JSON format in preferences field');
        }
      }

      console.log('Creating lead with data:', requestData);

      const response = await fetch('/api/leads', {
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
        throw new Error(errorData.error || `Failed to create lead (status: ${response.status})`);
      }
      
      const newLead = await response.json();
      
      toast({
        title: "Success!",
        description: `Lead "${newLead.name}" has been created successfully.`,
        variant: "default",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        companyName: '',
        companySize: '',
        companyIndustry: '',
        jobRole: '',
        source: LeadSource.WEBSITE,
        status: LeadStatus.WARM,
        preferences: '',
        assignedToId: '',
      });
      setErrors({});
      
      // Close modal and refresh data
      onClose();
      onLeadAdded();
      
    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new lead. Required fields are marked with *
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>
                    Full Name * {errors.name && <span className="text-red-500 text-sm">({errors.name})</span>}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                      placeholder="Enter full name"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>
                    Email * {errors.email && <span className="text-red-500 text-sm">({errors.email})</span>}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                      placeholder="Enter email address"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className={errors.phoneNumber ? "text-red-500" : ""}>
                    Phone Number * {errors.phoneNumber && <span className="text-red-500 text-sm">({errors.phoneNumber})</span>}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className={`pl-10 ${errors.phoneNumber ? "border-red-500" : ""}`}
                      placeholder="Enter phone number"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobRole">Job Role</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="jobRole"
                      value={formData.jobRole}
                      onChange={(e) => handleInputChange('jobRole', e.target.value)}
                      className="pl-10"
                      placeholder="Enter job role"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="pl-10"
                      placeholder="Enter company name"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="companySize"
                      value={formData.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                      className="pl-10"
                      placeholder="e.g., 50-100, 100-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="companyIndustry">Industry</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="companyIndustry"
                      value={formData.companyIndustry}
                      onChange={(e) => handleInputChange('companyIndustry', e.target.value)}
                      className="pl-10"
                      placeholder="Enter industry type"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Lead Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Lead Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source" className={errors.source ? "text-red-500" : ""}>
                    Source * {errors.source && <span className="text-red-500 text-sm">({errors.source})</span>}
                  </Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => handleInputChange('source', value as LeadSource)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="source" className={errors.source ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(LeadSource).map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className={errors.status ? "text-red-500" : ""}>
                    Status * {errors.status && <span className="text-red-500 text-sm">({errors.status})</span>}
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value as LeadStatus)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="status" className={errors.status ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(LeadStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignedToId">Assigned Sales Representative</Label>
                  <Select
                    value={formData.assignedToId || "unassigned"}
                    onValueChange={(value) => handleInputChange('assignedToId', value === "unassigned" ? "" : value)}
                    disabled={isSubmitting || isLoadingUsers}
                  >
                    <SelectTrigger id="assignedToId">
                      <SelectValue placeholder={isLoadingUsers ? "Loading..." : "Select sales representative"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">None (Unassigned)</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="preferences">Preferences (JSON format)</Label>
                  <Textarea
                    id="preferences"
                    value={formData.preferences}
                    onChange={(e) => handleInputChange('preferences', e.target.value)}
                    placeholder='{"budget": "5000000", "location": "Mumbai", "propertyType": "Apartment"}'
                    className="min-h-[80px] font-mono text-sm"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500">
                    Optional: Enter preferences in JSON format
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Lead'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}