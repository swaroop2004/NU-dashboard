// Base interfaces for common data structures
export interface BaseEntity {
  id: string | number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Lead-related interfaces
export interface Lead extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  lastContact: string;
  conversion: number;
  property: string;
  properties: string[]; // Added properties array
  assignedTo?: string;
  notes?: string;
  priority?: LeadPriority;
  tags?: string[];
}

export enum LeadSource {
  WEBSITE = "Website",
  REFERRAL = "Referral",
  PROPERTY_PORTAL = "Property Portal",
  SOCIAL_MEDIA = "Social Media",
  WALK_IN = "Walk-in",
  CALL = "Call",
  EMAIL = "Email",
  OTHER = "Other"
}

export enum LeadStatus {
  HOT = "Hot",
  WARM = "Warm",
  COLD = "Cold",
  NEW = "New",
  FOLLOW_UP = "Follow-up",
  CONVERTED = "Converted",
  LOST = "Lost",
  NURTURING = "Nurturing"
}

export enum LeadPriority {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low"
}

// Property-related interfaces
export interface Property extends BaseEntity {
  name: string;
  location: string;
  type: PropertyType;
  price: string;
  priceRange?: PriceRange;
  status: PropertyStatus;
  leads: number;
  demoViews: number;
  siteVisits: number;
  tokens: number;
  description?: string;
  amenities?: string[];
  images?: string[];
  builder?: string;
  possessionDate?: string;
  reraNumber?: string;
}

export enum PropertyType {
  APARTMENT = "APARTMENT",
  PENTHOUSE = "PENTHOUSE",
  STUDIO = "STUDIO"
}

export enum PropertyStatus {
  ACTIVE = "ACTIVE",
  PRELAUNCH = "PRELAUNCH",
  UNDER_CONSTRUCTION = "UNDER_CONSTRUCTION",
  SOLD_OUT = "SOLD_OUT"
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
  unit: string;
}

// Activity and interaction interfaces
export interface Activity extends BaseEntity {
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  relatedEntity: {
    type: 'lead' | 'property';
    id: string | number;
    name: string;
  };
  performedBy?: string;
  metadata?: Record<string, unknown>;
}

export enum ActivityType {
  LEAD_ASSIGNED = "Lead Assigned",
  SITE_VISIT = "Site Visit",
  FOLLOW_UP = "Follow-up",
  TOKEN_ISSUED = "Token Issued",
  CALL_MADE = "Call Made",
  EMAIL_SENT = "Email Sent",
  MEETING_SCHEDULED = "Meeting Scheduled",
  PROPERTY_VIEWED = "Property Viewed",
  STATUS_CHANGED = "Status Changed"
}

// Dashboard and analytics interfaces
export interface DashboardStats {
  totalLeads: number;
  hotLeads: number;
  totalProperties: number;
  activeProperties: number;
  conversionRate: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface LeadConversionData {
  month: string;
  leads: number;
  conversions: number;
  conversionRate: number;
}

export interface PropertyPerformanceData {
  propertyId: string | number;
  propertyName: string;
  leads: number;
  demoViews: number;
  siteVisits: number;
  tokens: number;
  conversionRate: number;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Filter and search interfaces
export interface LeadFilters {
  status?: LeadStatus[];
  source?: LeadSource[];
  priority?: LeadPriority[];
  assignedTo?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface PropertyFilters {
  status?: PropertyStatus[];
  type?: PropertyType[];
  priceRange?: PriceRange;
  location?: string[];
  builder?: string[];
  search?: string;
}

// Form and validation interfaces
export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  property: string;
  notes?: string;
  priority: LeadPriority;
}

export interface PropertyFormData {
  name: string;
  location: string;
  type: PropertyType;
  price: string;
  status: PropertyStatus;
  description?: string;
  amenities?: string[];
  builder?: string;
  possessionDate?: string;
  reraNumber?: string;
}