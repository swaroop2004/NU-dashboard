'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dataService } from "@/services/dataService";
import { Property, PropertyStatus, PropertyType } from '@/types';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlideIn } from "@/components/ui/slide-in";
import { Filter, Plus, ChevronLeft, ChevronRight, MapPin, Home, Tag } from 'lucide-react';

export default function PropertyListingPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await dataService.getProperties();
        if (response.success) {
          setProperties(response.data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleViewProperty = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  const filteredProperties = properties.filter(property => {
    return searchTerm === '' || 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-200';
      case PropertyStatus.PRE_LAUNCH:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case PropertyStatus.UNDER_CONSTRUCTION:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case PropertyStatus.READY_TO_MOVE:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case PropertyStatus.SOLD_OUT:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case PropertyStatus.ON_HOLD:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Property Listings</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <SlideIn key={property.id} direction="up">
                <Card 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-l-4"
                  style={{ borderLeftColor: property.status === PropertyStatus.ACTIVE ? '#10b981' : 
                                          property.status === PropertyStatus.PRE_LAUNCH ? '#3b82f6' : '#d1d5db' }}
                  onClick={() => handleViewProperty(property.id.toString())}
                >
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute top-2 right-2">
                      <Badge className={getStatusColor(property.status as PropertyStatus)}>
                        {property.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{property.name}</h3>
                    <div className="flex items-center text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500 mb-2">
                      <Home className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.type}</span>
                    </div>
                    <div className="flex items-center text-blue-600 font-semibold">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>{property.price}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-4 flex justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{property.leads}</span> Leads
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{property.siteVisits}</span> Visits
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </SlideIn>
            ))}
          </div>
        )}

        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {!loading && filteredProperties.length > 0 && (
          <div className="flex items-center justify-end space-x-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}