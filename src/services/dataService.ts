import { Lead, Property, Activity, LeadFilters, PropertyFilters, ApiResponse, LeadSource, LeadStatus, LeadPriority, PropertyStatus, PropertyType, ActivityType, DashboardStats } from '@/types';

// Mock data for demonstration - will be replaced with actual API calls
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1234567890',
    source: LeadSource.WEBSITE,
    status: LeadStatus.HOT,
    lastContact: '2 hours ago',
    conversion: 85,
    property: 'Sunset Towers',
    assignedTo: 'Sarah Johnson',
    priority: LeadPriority.HIGH,
    tags: ['VIP', 'Urgent'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1234567891',
    source: LeadSource.REFERRAL,
    status: LeadStatus.WARM,
    lastContact: '1 day ago',
    conversion: 65,
    property: 'Ocean View Apartments',
    assignedTo: 'Mike Wilson',
    priority: LeadPriority.MEDIUM,
    tags: ['Follow-up'],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '+1234567892',
    source: LeadSource.PROPERTY_PORTAL,
    status: LeadStatus.COLD,
    lastContact: '3 days ago',
    conversion: 35,
    property: 'Downtown Plaza',
    assignedTo: 'Sarah Johnson',
    priority: LeadPriority.LOW,
    tags: ['Nurturing'],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-18')
  }
];

const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Sunset Towers',
    location: 'Miami Beach, FL',
    type: PropertyType.APARTMENT,
    price: '$450,000',
    status: PropertyStatus.ACTIVE,
    leads: 12,
    demoViews: 8,
    siteVisits: 5,
    tokens: 3,
    description: 'Luxury beachfront apartments with ocean views',
    amenities: ['Pool', 'Gym', 'Parking', 'Security'],
    builder: 'Premium Builders',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Ocean View Apartments',
    location: 'Santa Monica, CA',
    type: PropertyType.PENTHOUSE,
    price: '$850,000',
    status: PropertyStatus.PRE_LAUNCH,
    leads: 8,
    demoViews: 6,
    siteVisits: 4,
    tokens: 2,
    description: 'Exclusive penthouse with panoramic ocean views',
    amenities: ['Rooftop Terrace', 'Concierge', 'Private Elevator'],
    builder: 'Luxury Developments',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '3',
    name: 'Downtown Plaza',
    location: 'New York, NY',
    type: PropertyType.STUDIO,
    price: '$280,000',
    status: PropertyStatus.UNDER_CONSTRUCTION,
    leads: 15,
    demoViews: 10,
    siteVisits: 7,
    tokens: 4,
    description: 'Modern studio apartments in prime location',
    amenities: ['Fitness Center', 'Laundry', 'Storage'],
    builder: 'Urban Living Co',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  }
];

const mockActivities: Activity[] = [
  {
    id: '1',
    type: ActivityType.SITE_VISIT,
    title: 'Site Visit Scheduled',
    description: 'John Smith scheduled a site visit for Sunset Towers',
    timestamp: '2 hours ago',
    relatedEntity: {
      type: 'lead',
      id: '1',
      name: 'John Smith'
    },
    performedBy: 'Sarah Johnson'
  },
  {
    id: '2',
    type: ActivityType.FOLLOW_UP,
    title: 'Follow-up Required',
    description: 'Emily Davis needs follow-up on Ocean View Apartments',
    timestamp: '1 day ago',
    relatedEntity: {
      type: 'lead',
      id: '2',
      name: 'Emily Davis'
    },
    performedBy: 'Mike Wilson'
  }
];

// Data Service Class
export class DataService {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  // Lead-related methods
  async getLeads(filters?: LeadFilters): Promise<ApiResponse<Lead[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredLeads = [...mockLeads];
    
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        filteredLeads = filteredLeads.filter(lead => 
          filters.status!.includes(lead.status as LeadStatus)
        );
      }
      
      if (filters.source && filters.source.length > 0) {
        filteredLeads = filteredLeads.filter(lead => 
          filters.source!.includes(lead.source as LeadSource)
        );
      }
      
      if (filters.priority && filters.priority.length > 0) {
        filteredLeads = filteredLeads.filter(lead => 
          lead.priority && filters.priority!.includes(lead.priority as LeadPriority)
        );
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredLeads = filteredLeads.filter(lead =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.phone.includes(searchLower) ||
          lead.property.toLowerCase().includes(searchLower)
        );
      }
    }
    
    return {
      success: true,
      data: filteredLeads,
      message: 'Leads retrieved successfully'
    };
  }

  async getLeadById(id: string): Promise<ApiResponse<Lead>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lead = mockLeads.find(l => l.id === id);
    
    if (!lead) {
      return {
        success: false,
        data: {} as Lead,
        error: 'Lead not found'
      };
    }
    
    return {
      success: true,
      data: lead,
      message: 'Lead retrieved successfully'
    };
  }

  async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Lead>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newLead: Lead = {
      ...leadData,
      id: String(Date.now()),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockLeads.push(newLead);
    
    return {
      success: true,
      data: newLead,
      message: 'Lead created successfully'
    };
  }

  async updateLead(id: string, leadData: Partial<Lead>): Promise<ApiResponse<Lead>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const leadIndex = mockLeads.findIndex(l => l.id === id);
    
    if (leadIndex === -1) {
      return {
        success: false,
        data: {} as Lead,
        error: 'Lead not found'
      };
    }
    
    mockLeads[leadIndex] = {
      ...mockLeads[leadIndex],
      ...leadData,
      updatedAt: new Date()
    };
    
    return {
      success: true,
      data: mockLeads[leadIndex],
      message: 'Lead updated successfully'
    };
  }

  // Property-related methods
  async getProperties(filters?: PropertyFilters): Promise<ApiResponse<Property[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredProperties = [...mockProperties];
    
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        filteredProperties = filteredProperties.filter(property => 
          filters.status!.includes(property.status as PropertyStatus)
        );
      }
      
      if (filters.type && filters.type.length > 0) {
        filteredProperties = filteredProperties.filter(property => 
          filters.type!.includes(property.type as PropertyType)
        );
      }
      
      if (filters.location && filters.location.length > 0) {
        filteredProperties = filteredProperties.filter(property => 
          filters.location!.some(location => 
            property.location.toLowerCase().includes(location.toLowerCase())
          )
        );
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProperties = filteredProperties.filter(property =>
          property.name.toLowerCase().includes(searchLower) ||
          property.location.toLowerCase().includes(searchLower) ||
          property.builder?.toLowerCase().includes(searchLower)
        );
      }
    }
    
    return {
      success: true,
      data: filteredProperties,
      message: 'Properties retrieved successfully'
    };
  }

  async getPropertyById(id: string): Promise<ApiResponse<Property>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const property = mockProperties.find(p => p.id === id);
    
    if (!property) {
      return {
        success: false,
        data: {} as Property,
        error: 'Property not found'
      };
    }
    
    return {
      success: true,
      data: property,
      message: 'Property retrieved successfully'
    };
  }

  async createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Property>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newProperty: Property = {
      ...propertyData,
      id: String(Date.now()),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockProperties.push(newProperty);
    
    return {
      success: true,
      data: newProperty,
      message: 'Property created successfully'
    };
  }

  async updateProperty(id: string, propertyData: Partial<Property>): Promise<ApiResponse<Property>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const propertyIndex = mockProperties.findIndex(p => p.id === id);
    
    if (propertyIndex === -1) {
      return {
        success: false,
        data: {} as Property,
        error: 'Property not found'
      };
    }
    
    mockProperties[propertyIndex] = {
      ...mockProperties[propertyIndex],
      ...propertyData,
      updatedAt: new Date()
    };
    
    return {
      success: true,
      data: mockProperties[propertyIndex],
      message: 'Property updated successfully'
    };
  }

  // Activity-related methods
  async getActivities(limit?: number): Promise<ApiResponse<Activity[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const activities = limit ? mockActivities.slice(0, limit) : mockActivities;
    
    return {
      success: true,
      data: activities,
      message: 'Activities retrieved successfully'
    };
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const stats = {
      totalLeads: mockLeads.length,
      hotLeads: mockLeads.filter(l => l.status === 'Hot').length,
      totalProperties: mockProperties.length,
      activeProperties: mockProperties.filter(p => p.status === 'Active').length,
      conversionRate: Math.round((mockLeads.filter(l => l.status === 'Converted').length / mockLeads.length) * 100),
      totalRevenue: 1250000,
      monthlyGrowth: 12.5
    };
    
    return {
      success: true,
      data: stats,
      message: 'Dashboard statistics retrieved successfully'
    };
  }
}

// Export singleton instance
export const dataService = new DataService();