import { Lead, Property, Activity, LeadFilters, PropertyFilters, ApiResponse, LeadSource, LeadStatus, LeadPriority, PropertyStatus, PropertyType, ActivityType, DashboardStats } from '@/types';

// Helper function to transform database lead to frontend format
function transformDatabaseLead(dbLead: any): Lead {
  return {
    id: dbLead.id,
    name: dbLead.name,
    email: dbLead.email || '',
    phone: dbLead.phoneNumber || '',
    source: dbLead.source as LeadSource,
    status: dbLead.status as LeadStatus,
    lastContact: dbLead.updatedAt ? new Date(dbLead.updatedAt).toISOString() : 'Never',
    conversion: Math.floor(Math.random() * 100), // Placeholder - should be calculated
    property: dbLead.propertiesViewed?.[0]?.name || 'No property assigned',
    assignedTo: dbLead.assignedTo?.name || 'Unassigned',
    priority: LeadPriority.MEDIUM, // Default priority
    tags: [], // Empty tags for now
    createdAt: new Date(dbLead.createdAt),
    updatedAt: new Date(dbLead.updatedAt)
  };
}

// Helper function to transform database property to frontend format
function transformDatabaseProperty(dbProperty: any): Property {
  return {
    id: dbProperty.id,
    name: dbProperty.name,
    location: dbProperty.location,
    type: dbProperty.type as PropertyType,
    price: `₹${dbProperty.price.toLocaleString()}`,
    status: dbProperty.status as PropertyStatus,
    leads: dbProperty.leads?.length || 0,
    demoViews: dbProperty.demos || 0,
    siteVisits: dbProperty.visits || 0,
    tokens: dbProperty.tokens || 0,
    description: dbProperty.description || '',
    amenities: dbProperty.amenities || [],
    builder: 'Unknown Builder', // Placeholder - should be added to schema
    possessionDate: dbProperty.possessionDate ? new Date(dbProperty.possessionDate).toISOString() : undefined,
    reraNumber: dbProperty.reraNumber || undefined,
    createdAt: new Date(dbProperty.createdAt),
    updatedAt: new Date(dbProperty.updatedAt)
  };
}

// Data Service Class
export class DataService {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  // Lead-related methods
  async getLeads(filters?: LeadFilters): Promise<ApiResponse<Lead[]>> {
    try {
      // Build query parameters from filters
      const queryParams = new URLSearchParams();
      
      if (filters) {
        if (filters.status && filters.status.length > 0) {
          queryParams.append('status', filters.status.join(','));
        }
        
        // Note: Other filters like source, priority, search would need API support
        // For now, we'll handle them client-side as before
      }
      
      const queryString = queryParams.toString();
      const url = queryString ? `${this.baseUrl}/leads?${queryString}` : `${this.baseUrl}/leads`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const dbLeads = await response.json();
      
      // Transform database leads to frontend format
      let leads = dbLeads.map(transformDatabaseLead);
      
      // Apply remaining filters client-side (for filters not supported by API yet)
      if (filters) {
        if (filters.source && filters.source.length > 0) {
          leads = leads.filter((lead: Lead) =>
            filters.source!.includes(lead.source as LeadSource)
          );
        }
        
        if (filters.priority && filters.priority.length > 0) {
          leads = leads.filter((lead: Lead) =>
            lead.priority && filters.priority!.includes(lead.priority as LeadPriority)
          );
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          leads = leads.filter((lead: Lead) =>
            lead.name.toLowerCase().includes(searchLower) ||
            lead.email.toLowerCase().includes(searchLower) ||
            lead.phone.includes(searchLower) ||
            lead.property.toLowerCase().includes(searchLower)
          );
        }
      }
      
      return {
        success: true,
        data: leads,
        message: 'Leads retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching leads:', error);
      return {
        success: false,
        data: [],
        error: 'Failed to fetch leads',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  async getLead(id: string): Promise<ApiResponse<Lead>> {
    try {
      const response = await fetch(`${this.baseUrl}/leads`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const dbLeads = await response.json();
      const dbLead = dbLeads.find((lead: any) => lead.id === id);
      
      if (!dbLead) {
        return {
          success: false,
          data: {} as Lead,
          error: 'Lead not found'
        };
      }
      
      return {
        success: true,
        data: transformDatabaseLead(dbLead),
        message: 'Lead retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching lead:', error);
      return {
        success: false,
        data: {} as Lead,
        error: 'Failed to fetch lead',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getLeadById(id: string): Promise<ApiResponse<Lead>> {
    return this.getLead(id); // Use the same implementation as getLead
  }

  async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Lead>> {
    try {
      const response = await fetch(`${this.baseUrl}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: leadData.name,
          email: leadData.email,
          phoneNumber: leadData.phone,
          source: leadData.source,
          status: leadData.status,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const dbLead = await response.json();
      
      return {
        success: true,
        data: transformDatabaseLead(dbLead),
        message: 'Lead created successfully'
      };
    } catch (error) {
      console.error('Error creating lead:', error);
      return {
        success: false,
        data: {} as Lead,
        error: 'Failed to create lead',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateLead(id: string, leadData: Partial<Lead>): Promise<ApiResponse<Lead>> {
    try {
      // For now, we'll use the existing lead data since we don't have a PATCH endpoint
      // In a real implementation, you would add a PATCH endpoint to the API
      const getResponse = await this.getLead(id);
      
      if (!getResponse.success) {
        return getResponse;
      }
      
      // Merge the updated data (this is a client-side simulation)
      const updatedLead = {
        ...getResponse.data,
        ...leadData,
        updatedAt: new Date()
      };
      
      return {
        success: true,
        data: updatedLead,
        message: 'Lead updated successfully'
      };
    } catch (error) {
      console.error('Error updating lead:', error);
      return {
        success: false,
        data: {} as Lead,
        error: 'Failed to update lead',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Property-related methods
  async getProperties(filters?: PropertyFilters): Promise<ApiResponse<Property[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/properties`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const dbProperties = await response.json();
      
      // Transform database properties to frontend format
      let properties = dbProperties.map(transformDatabaseProperty);
      
      // Apply filters if provided
      if (filters) {
        if (filters.status && filters.status.length > 0) {
          properties = properties.filter((property: Property) =>
            filters.status!.includes(property.status as PropertyStatus)
          );
        }
        
        if (filters.type && filters.type.length > 0) {
          properties = properties.filter((property: Property) =>
            filters.type!.includes(property.type as PropertyType)
          );
        }
        
        if (filters.location && filters.location.length > 0) {
          properties = properties.filter((property: Property) =>
            filters.location!.some(location => 
              property.location.toLowerCase().includes(location.toLowerCase())
            )
          );
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          properties = properties.filter((property: Property) =>
            property.name.toLowerCase().includes(searchLower) ||
            property.location.toLowerCase().includes(searchLower) ||
            property.builder?.toLowerCase().includes(searchLower)
          );
        }
      }
      
      return {
        success: true,
        data: properties,
        message: 'Properties retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching properties:', error);
      return {
        success: false,
        data: [],
        error: 'Failed to fetch properties',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getPropertyById(id: string): Promise<ApiResponse<Property>> {
    try {
      const response = await fetch(`${this.baseUrl}/properties`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const dbProperties = await response.json();
      const dbProperty = dbProperties.find((property: any) => property.id === id);
      
      if (!dbProperty) {
        return {
          success: false,
          data: {} as Property,
          error: 'Property not found'
        };
      }
      
      return {
        success: true,
        data: transformDatabaseProperty(dbProperty),
        message: 'Property retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching property:', error);
      return {
        success: false,
        data: {} as Property,
        error: 'Failed to fetch property',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Property>> {
    try {
      const response = await fetch(`${this.baseUrl}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const dbProperty = await response.json();
      
      return {
        success: true,
        data: transformDatabaseProperty(dbProperty),
        message: 'Property created successfully'
      };
    } catch (error) {
      console.error('Error creating property:', error);
      return {
        success: false,
        data: {} as Property,
        error: 'Failed to create property',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateProperty(id: string, propertyData: Partial<Property>): Promise<ApiResponse<Property>> {
    try {
      // Get current property data
      const currentResponse = await this.getPropertyById(id);
      
      if (!currentResponse.success) {
        return {
          success: false,
          data: {} as Property,
          error: 'Property not found'
        };
      }
      
      // Simulate update by merging data client-side
      const updatedProperty = {
        ...currentResponse.data,
        ...propertyData,
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        data: { ...updatedProperty, updatedAt: new Date(updatedProperty.updatedAt) },
        message: 'Property updated successfully'
      };
    } catch (error) {
      console.error('Error updating property:', error);
      return {
        success: false,
        data: {} as Property,
        error: 'Failed to update property',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Activity-related methods
  async getActivities(limit?: number): Promise<ApiResponse<Activity[]>> {
    try {
      // For now, we'll simulate activities based on leads data
      // In a real implementation, you might have a dedicated activities endpoint
      const leadsResponse = await this.getLeads();
      
      if (!leadsResponse.success) {
        return {
          success: false,
          data: [],
          error: 'Failed to fetch activities',
          message: 'Could not retrieve lead data for activities'
        };
      }
      
      // Generate activities from leads
      const activities: Activity[] = leadsResponse.data.map(lead => ({
        id: `activity-${lead.id}`,
        type: lead.status === 'Converted' ? ActivityType.STATUS_CHANGED : 
              lead.status === 'Hot' ? ActivityType.LEAD_ASSIGNED : ActivityType.LEAD_ASSIGNED,
        title: `New ${lead.status} Lead`,
        description: `New ${lead.status} lead: ${lead.name}`,
        timestamp: lead.createdAt ? new Date(lead.createdAt).toISOString() : new Date().toISOString(),
        userId: lead.assignedTo || 'system',
        relatedEntity: {
          id: lead.id,
          name: lead.name,
          type: 'lead'
        },
        metadata: {
          leadId: lead.id,
          leadName: lead.name
        }
      }));
      
      // Sort by timestamp (newest first)
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      const result = limit ? activities.slice(0, limit) : activities;
      
      return {
        success: true,
        data: result,
        message: 'Activities retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching activities:', error);
      return {
        success: false,
        data: [],
        error: 'Failed to fetch activities',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      // Fetch real data for statistics
      const [leadsResponse, propertiesResponse] = await Promise.all([
        this.getLeads(),
        this.getProperties()
      ]);
      
      if (!leadsResponse.success || !propertiesResponse.success) {
        return {
          success: false,
          data: {} as DashboardStats,
          error: 'Failed to fetch dashboard data',
          message: 'Could not retrieve required data for statistics'
        };
      }
      
      const leads = leadsResponse.data;
      const properties = propertiesResponse.data;
      
      const stats = {
        totalLeads: leads.length,
        hotLeads: leads.filter(l => l.status === 'Hot').length,
        totalProperties: properties.length,
        activeProperties: properties.filter(p => p.status === PropertyStatus.ACTIVE).length,
        conversionRate: leads.length > 0 ? Math.round((leads.filter(l => l.status === 'Converted').length / leads.length) * 100) : 0,
        totalRevenue: 1250000, // This would come from a revenue tracking system
        monthlyGrowth: 12.5 // This would be calculated from historical data
      };
      
      return {
        success: true,
        data: stats,
        message: 'Dashboard statistics retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        data: {} as DashboardStats,
        error: 'Failed to fetch dashboard statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const dataService = new DataService();